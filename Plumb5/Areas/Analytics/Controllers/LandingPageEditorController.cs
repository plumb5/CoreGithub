using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5.Models;
using Plumb5GenralFunction;
using System.Text.RegularExpressions;
using System.Text;
using Amazon.CloudFront;
using Amazon.CloudFront.Model;
using System.IO;
using RestSharp.Extensions;
using Plumb5.Areas.Analytics.Dto;

namespace Plumb5.Areas.Analytics.Controllers
{
    [Area("LandingPage")]
    public class LandingPageEditorController : BaseController
    {
        public LandingPageEditorController(IConfiguration _configuration) : base(_configuration)
        { }

        public ActionResult Index()
        {
            return View("LandingPageEditor");
        }
        [HttpPost]
        public async Task<object> GetJsonContent([FromBody] LandingPageEditor_GetJsonContentDto objDto)
        {
            string JsonContent = null;
            LandingPageTemplateFile templateFile = null;

            using (var objBL = DLLandingPageTemplateFile.GetDLLandingPageTemplateFile(objDto.AccountId, SQLProvider))
            {
                templateFile = await objBL.GetSingleFileType(new LandingPageTemplateFile() { LandingPageId = objDto.TemplateId, TemplateFileType = ".JSON" });
            }

            if (templateFile != null && templateFile.TemplateFileContent != null)
            {
                JsonContent = Encoding.UTF8.GetString(templateFile.TemplateFileContent);
                JsonContent = JsonContent.Trim().Replace("\t", "").Replace("\r\n", "");
                return JsonContent;
            }
            return Json(JsonContent);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> UpdateTemplateContent([FromBody] LandingPageEditor_UpdateTemplateContentDto objDto)
        {
            try
            {
                if (objDto.TemplateId > 0)
                {
                    string HtmlFileName = "Index.html";
                    string JsonFileName = "TemplateContent.json";
                    string PhyPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString();
                    string CampaignFolder = PhyPath + "\\TempFiles\\LandingPage-" + objDto.AccountId + "-" + objDto.TemplateId + "\\";

                    LandingPageTemplateFile templateFile = new LandingPageTemplateFile() { LandingPageId = objDto.TemplateId };
                    using (var objBL = DLLandingPageTemplateFile.GetDLLandingPageTemplateFile(objDto.AccountId, SQLProvider))
                    {
                        await objBL.Delete(objDto.TemplateId);
                    }

                    MyAccountsDetails myAccount = new MyAccountsDetails(SQLProvider);
                    await myAccount.GetInformationForHome(objDto.UserId);

                    string jsScript = String.Empty;

                    for (int i = 0; i < myAccount.accounts.Count; i++)
                    {
                        if (myAccount.accounts[i].AccountId == objDto.AccountId)
                            jsScript = myAccount.accounts[i].Script;
                    }

                    string Script = "<script type='text/javascript'>(function() {var p5 = document.createElement('script');p5.type = 'text/javascript';p5.src = '" + AllConfigURLDetails.KeyValueForConfig["TRACKING_SCRIPT_PATH"] + "" + jsScript + "';var p5s = document.getElementsByTagName('script')[0];p5s.parentNode.insertBefore(p5, p5s);})();</script>";

                    string TaggedFormScript = "<script type='text/javascript'>if(document.getElementsByName('p5form_submit').length>0){ if(document.getElementsByName('p5form_email').length>0 || document.getElementsByName('p5form_mobile').length>0) { var p5submitId=document.getElementsByName('p5form_submit')[0].id;document.getElementById(p5submitId).setAttribute('onclick','alert(\"" + objDto.ThankYouMessage + "\"); this.form.reset();');}}</script>";



                    var var_HtmlContent = "";
                    if (!objDto.HtmlContent.Contains("jsScript"))
                    {
                        if (objDto.HtmlContent.Contains("</head>"))
                            var_HtmlContent = objDto.HtmlContent.Replace("</head>", Script + TaggedFormScript + "</head>");
                    }

                    string Body = await ChangePathAndSaveBEEHTMLImage(objDto.AccountId, objDto.TemplateId, var_HtmlContent);

                    LandingPageConfiguration landingPageConfiguration = new LandingPageConfiguration();
                    using (var objBL = DLLandingPageConfiguration.GetDLLandingPageConfiguration(objDto.AccountId, SQLProvider))
                        landingPageConfiguration = await objBL.GetLandingPageConfiguration();

                    SaveLandingPageToAWS awsUploadOne = new SaveLandingPageToAWS(objDto.AccountId, objDto.TemplateId, objDto.pageName, landingPageConfiguration.LandingPageName);

                    templateFile.TemplateFileContent = Helper.ConvertHtmlStringToBytesFromPhysical(HtmlContent: Body);
                    templateFile.TemplateFileName = HtmlFileName;
                    templateFile.TemplateFileType = ".html";
                    SaveLandingPageFile(objDto.AccountId, templateFile);
                    await awsUploadOne.UploadFileContent(HtmlFileName, Body);

                    var var_JsonContent = "";
                    var_JsonContent = objDto.JsonContent.Replace("editor_images/", "");
                    templateFile.TemplateFileContent = Helper.ConvertHtmlStringToBytesFromPhysical(HtmlContent: var_JsonContent);
                    templateFile.TemplateFileName = JsonFileName;
                    templateFile.TemplateFileType = ".json";
                    SaveLandingPageFile(objDto.AccountId, templateFile);
                    await awsUploadOne.UploadFileContent(JsonFileName, var_JsonContent);

                    ClearCloudFrontCache(landingPageConfiguration.CloudFrontUrl, objDto.pageName);

                    LandingPage landingPage = new LandingPage() { Id = objDto.TemplateId, IsTemplateSaved = true };
                    using (var objBL = DLLandingPage.GetDLLandingPage(objDto.AccountId, SQLProvider))
                    {
                        await objBL.UpdateIsTemplateSaved(landingPage);
                    }

                    return Json(new { Status = true });
                }
                else
                {
                    return Json(new { Status = false, Message = "Template not exists." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Status = false, Message = ex.Message.ToString() });
            }
        }

        private void ClearCloudFrontCache(string DomainName, string foldername)
        {
            string awsAccessKeyId = AllConfigURLDetails.KeyValueForConfig["AWSACCESSKEYID"].ToString(), awsSecretAccessKey = AllConfigURLDetails.KeyValueForConfig["AWSSECRETACCESSKEY"].ToString();

            #region Creating CloudFront Client
            AmazonCloudFrontClient amazonCloudFrontClient = new AmazonCloudFrontClient(awsAccessKeyId, awsSecretAccessKey, Amazon.RegionEndpoint.APSouth1);

            #endregion

            #region Checking cloudfront already exists
            ListDistributionsResponse listDistributionsResponse = amazonCloudFrontClient.ListDistributions();
            var CloudId = listDistributionsResponse.DistributionList.Items.Where(m => m.DomainName.Contains(DomainName)).FirstOrDefault().Id;
            #endregion

            var distributionId = CloudId;//"EJCDLYDTUKDBE";
                                         // var client = new AmazonCloudFrontClient();

            foldername = "/" + foldername + "/*";
            string[] arrayofpaths = foldername.Split();
            CreateInvalidationRequest oRequest = new CreateInvalidationRequest();
            oRequest.DistributionId = distributionId;
            oRequest.InvalidationBatch = new InvalidationBatch
            {
                CallerReference = DateTime.Now.Ticks.ToString(),
                Paths = new Paths
                {
                    Items = arrayofpaths.ToList<string>(),
                    Quantity = 1
                }
            };

            CreateInvalidationResponse oResponse = amazonCloudFrontClient.CreateInvalidation(oRequest);
            amazonCloudFrontClient.Dispose();
        }

        private async void SaveLandingPageFile(int accountId, LandingPageTemplateFile TemplateFile)
        {
            using (var objBL = DLLandingPageTemplateFile.GetDLLandingPageTemplateFile(accountId, SQLProvider))
            {
                await objBL.Save(TemplateFile);
            }
        }

        public async Task<string> ChangePathAndSaveBEEHTMLImage(int accountId, int templateId, string Body)
        {
            SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(accountId, templateId);
            foreach (Match m in Regex.Matches(Body, "<img.*?src=[\"'](.+?)[\"'].*?>", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace))
            {
                try
                {
                    string getImg = Regex.Match(m.Value, "<img.*?src=[\"'](.+?)[\"'].*?>", RegexOptions.IgnoreCase).Groups[1].Value;
                    if (Regex.IsMatch(getImg, "\\b" + AllConfigURLDetails.KeyValueForConfig["BUCKETPATH"] + "\\b", RegexOptions.IgnoreCase))
                    {
                        if (getImg.Contains(".jpg") == true || getImg.Contains(".gif") == true || getImg.Contains(".JPG") == true || getImg.Contains(".GIF") == true || getImg.Contains(".png") == true || getImg.Contains(".PNG") == true || getImg.Contains(".bmp") == true || getImg.Contains(".BMP") == true || getImg.Contains(".jpeg") || getImg.Contains(".JPEG"))
                        {
                            if (getImg.LastIndexOf('/') > -1)
                            {
                                var AwsImgPath = getImg;
                                string imageName = getImg.Substring(getImg.LastIndexOf('/') + 1);
                                Body = Body.Replace(getImg, imageName);

                                AwsImgPath = AwsImgPath.Replace("https://" + AllConfigURLDetails.KeyValueForConfig["BUCKETPATH"].ToString() + "", AllConfigURLDetails.KeyValueForConfig["BUCKETNAME"].ToString());
                                string BucketPath = AwsImgPath.Substring(0, AwsImgPath.LastIndexOf('/'));

                                Stream fileStream = awsUpload.GetFileContentStream(imageName, BucketPath).ConfigureAwait(false).GetAwaiter().GetResult();

                                LandingPageTemplateFile templateFile = new LandingPageTemplateFile() { LandingPageId = templateId };
                                //templateFile.TemplateFileContent = fileStream.ReadAsBytes();
                                templateFile.TemplateFileName = imageName;
                                templateFile.TemplateFileType = getImg.Substring(getImg.LastIndexOf('.'));
                                SaveLandingPageFile(accountId, templateFile);

                                Stream uploadfileStream = awsUpload.GetFileContentStream(imageName, BucketPath).ConfigureAwait(false).GetAwaiter().GetResult(); ;

                                MemoryStream fileMemoryStream = new MemoryStream();
                                uploadfileStream.CopyTo(fileMemoryStream);
                                await awsUpload.UploadFileStream(imageName, fileMemoryStream);
                                fileMemoryStream.Close();
                            }
                        }
                    }
                }
                catch (Exception ex)
                {

                }
            }
            return Body;
        }
    }
}