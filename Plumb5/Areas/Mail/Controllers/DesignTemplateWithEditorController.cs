using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using RestSharp.Extensions;
using System.Text.RegularExpressions;
using System.Text;
using Plumb5.Areas.Mail.Dto;

namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class DesignTemplateWithEditorController : BaseController
    {
        public DesignTemplateWithEditorController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index(int TemplateId)
        {
            return View("DesignTemplateWithEditor");
        }
        [HttpPost]
        public async Task<JsonResult> GetContactCustomField([FromBody] DesignTemplateWithEditor_GetContactCustomFieldDto objDto)
        {
            using (var objDL =DLContactExtraField.GetDLContactExtraField(objDto.accountId, SQLProvider))
            {
                return Json(await objDL.GetList());
            }
        }
        [HttpPost]
        public async Task<object> GetJsonContent([FromBody] DesignTemplateWithEditor_GetJsonContentDto objDto)
        {
            string JsonContent = null;
            MailTemplateFile templateFile = null;

            using (var objDL = DLMailTemplateFile.GetDLMailTemplateFile(objDto.accountId,SQLProvider))
            {
                templateFile =await objDL.GetSingleFileType(new MailTemplateFile() { TemplateId = objDto.TemplateId, TemplateFileType = ".JSON" });
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
        public async Task<JsonResult> UpdateTemplateContent([FromBody] DesignTemplateWithEditor_UpdateTemplateContentDto objDto)
        {
            try
            {
                if (objDto.TemplateId > 0)
                {
                    string HtmlFileName = "TemplateContent.html";
                    string JsonFileName = "TemplateContent.json";
                    string PhyPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString();
                    string CampaignFolder = PhyPath + "\\TempFiles\\Campaign-" + objDto.accountId + "-" + objDto.TemplateId + "\\";
                    MailTemplateFile templateFile = new MailTemplateFile() { TemplateId = objDto.TemplateId };

                    using (var objDL = DLMailTemplateFile.GetDLMailTemplateFile(objDto.accountId,SQLProvider))
                    {
                       await objDL.Delete(objDto.TemplateId);
                    }

                    string Body =await ChangePathAndSaveBEEHTMLImage(objDto.accountId, objDto.TemplateId, objDto.HtmlContent);

                    SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(objDto.accountId, objDto.TemplateId);

                    templateFile.TemplateFileContent = Helper.ConvertHtmlStringToBytesFromPhysical(HtmlContent: Body);
                    templateFile.TemplateFileName = HtmlFileName;
                    templateFile.TemplateFileType = ".html";

                    SaveMailTemplateFile(objDto.accountId, templateFile);

                    awsUpload.UploadFileContent(HtmlFileName, Body);

                    var getJsonContent = objDto.JsonContent.Replace("editor_images/", "");

                    templateFile.TemplateFileContent = Helper.ConvertHtmlStringToBytesFromPhysical(HtmlContent: getJsonContent);
                    templateFile.TemplateFileName = JsonFileName;
                    templateFile.TemplateFileType = ".json";

                    SaveMailTemplateFile(objDto.accountId, templateFile);

                    awsUpload.UploadFileContent(JsonFileName, getJsonContent);

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

        private async Task SaveMailTemplateFile(int accountId, MailTemplateFile TemplateFile)
        {
            using (var objDL = DLMailTemplateFile.GetDLMailTemplateFile(accountId,SQLProvider))
            {
               await objDL.Save(TemplateFile);
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

                                Stream fileStream = awsUpload.GetFileContentStream(imageName, BucketPath);

                                MailTemplateFile templateFile = new MailTemplateFile() { TemplateId = templateId };
                                templateFile.TemplateFileContent = fileStream.ReadAsBytes();
                                templateFile.TemplateFileName = imageName;
                                templateFile.TemplateFileType = getImg.Substring(getImg.LastIndexOf('.'));
                                SaveMailTemplateFile(accountId, templateFile);

                                Stream uploadfileStream = awsUpload.GetFileContentStream(imageName, BucketPath);

                                MemoryStream fileMemoryStream = new MemoryStream();
                                uploadfileStream.CopyTo(fileMemoryStream);
                                awsUpload.UploadFileStream(imageName, fileMemoryStream);
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
