using Amazon.CloudFront.Model;
using Amazon.CloudFront;
using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Plumb5.Areas.Analytics.Dto;

namespace Plumb5.Areas.Analytics.Controllers
{
    [Area("LandingPage")]
    public class LandingPageUploadDesignController : BaseController
    {
        public LandingPageUploadDesignController(IConfiguration _configuration) : base(_configuration)
        { }

        public ActionResult Index()
        {
            return View("LandingPageUploadDesign");
        }
        [HttpPost]
        public async Task<JsonResult> GetTemplateDetails([FromBody] GetTemplateDetails objDto)
        {
            bool Status = false;
            LandingPage landingPage;
            using (var objDL = DLLandingPage.GetDLLandingPage(objDto.accountId, SQLProvider))
            {
                landingPage =await objDL.GetSingle(new LandingPage()
                {
                    Id = objDto.LandingPageId
                });
            }

            if (landingPage != null)
            {
                LandingPageTemplateFile TemplateFile;
                using (var objDL = DLLandingPageTemplateFile.GetDLLandingPageTemplateFile(objDto.accountId, SQLProvider))
                {
                    TemplateFile = await objDL.GetSingleFileType(new LandingPageTemplateFile() { LandingPageId = objDto.LandingPageId, TemplateFileType = ".HTML" });
                }

                if (TemplateFile != null)
                {
                    LandingPageConfiguration landingPageConfiguration = new LandingPageConfiguration();
                    using (var objDL = DLLandingPageConfiguration.GetDLLandingPageConfiguration(objDto.accountId, SQLProvider))
                        landingPageConfiguration =await objDL.GetLandingPageConfiguration();

                    SaveLandingPageToAWS awsUpload = new SaveLandingPageToAWS(objDto.accountId, objDto.LandingPageId, landingPage.PageName, landingPageConfiguration.LandingPageName);
                    string HtmlContent = awsUpload.GetFileContentString(TemplateFile.TemplateFileName, awsUpload.bucketname);
                    if (HtmlContent != null && HtmlContent != string.Empty)
                    {
                        Status = true;
                        return Json(new { Status, landingPage, HtmlContent });
                    }
                }
            }

            return Json(new { Status });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> UpdateEditContent([FromBody] UpdateEditContent objDto)
        {
            DomainInfo? domainInfo = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            bool Status = false;
            string Message = "Something went wrong. Please try again.";
            string ExpectionMessage = string.Empty;
            int MailTemplateId = 0;
            string HtmlFileName = "Index.html";
            try
            {
                LandingPageTemplateFile TemplateFile = new LandingPageTemplateFile() { LandingPageId = objDto.LandingPageId, TemplateFileType = ".HTML" };
                using (var objMail = DLLandingPageTemplateFile.GetDLLandingPageTemplateFile(objDto.accountId, SQLProvider))
                {
                    TemplateFile =await objMail.GetSingleFileType(TemplateFile);
                }

                if (TemplateFile != null)
                {
                    LandingPageConfiguration landingPageConfiguration = new LandingPageConfiguration();
                    using (var objDL = DLLandingPageConfiguration.GetDLLandingPageConfiguration(objDto.accountId,SQLProvider))
                        landingPageConfiguration =await objDL.GetLandingPageConfiguration();

                    SaveLandingPageToAWS awsUpload = new SaveLandingPageToAWS(objDto.accountId, objDto.LandingPageId, objDto.PageName, landingPageConfiguration.LandingPageName);

                    TemplateFile.TemplateFileContent = Helper.ConvertHtmlStringToBytesFromPhysical(HtmlContent: objDto.HtmlContent);
                    using (var objDL = DLLandingPageTemplateFile.GetDLLandingPageTemplateFile(objDto.accountId,SQLProvider))
                        objDL.Update(TemplateFile);

                    LandingPage landingPage = new LandingPage() { Id = objDto.LandingPageId, IsTemplateSaved = true };
                    using (var objDL = DLLandingPage.GetDLLandingPage(objDto.accountId,SQLProvider))
                    {
                        objDL.UpdateIsTemplateSaved(landingPage);
                    }

                    ClearCloudFrontCache(landingPageConfiguration.CloudFrontUrl, objDto.PageName);

                    awsUpload.UploadFileContent(HtmlFileName, objDto.HtmlContent);
                    MailTemplateId = objDto.LandingPageId;
                    Status = true;
                    Message = "Template updated successfully";
                }
                else
                {
                    MailTemplateId = objDto.LandingPageId;
                    Status = true;
                    Message = "Unable to update a template, please try again";
                }
            }
            catch (Exception ex)
            {
                MailTemplateId = objDto.LandingPageId;
                Status = true;
                ExpectionMessage = ex.Message;
            }
            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { MailTemplateId = TemplateId, LogMessage = LogMessage, Result = Status, Message = Message }), LogMessage);
            return Json(new { Status, Message, ExpectionMessage, MailTemplateId });
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
    }
}
