using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using RestSharp.Extensions;
using System.Net;
using System.Text.RegularExpressions;
using System.Text;
using Newtonsoft.Json;
using System.Drawing;
using Plumb5.Areas.Mail.Dto;

namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class DesignTemplateWithP5EditorController : BaseController
    {
        public DesignTemplateWithP5EditorController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("DesignTemplateWithP5Editor");
        }
        [HttpPost]
        public async Task<object> GetJsonContent([FromBody] DesignTemplateWithP5Editor_GetJsonContentDto objDto)
        {
            string JsonContent = null;
            MailTemplateFile templateFile = null;

            using (var objBL = DLMailTemplateFile.GetDLMailTemplateFile(objDto.accountId, SQLProvider))
            {
                templateFile = await objBL.GetSingleFileType(new MailTemplateFile() { TemplateId = objDto.TemplateId, TemplateFileType = ".HTML" });
            }

            if (templateFile != null && templateFile.TemplateFileContent != null)
            {
                JsonContent = Encoding.UTF8.GetString(templateFile.TemplateFileContent);
                JsonContent = JsonContent.Trim().Replace("\t", "").Replace("\r\n", "");
                return Json(new
                {
                    Data = JsonContent,
                    MaxJsonLength = Int32.MaxValue
                });
            }
            return Json(new
            {
                Data = JsonContent,
                MaxJsonLength = Int32.MaxValue
            });
        }
        [HttpPost]
        public async Task<JsonResult> GetContactCustomField([FromBody] DesignTemplateWithP5Editor_GetContactCustomFieldDto objDto)
        {
            using (var objBL = DLContactExtraField.GetDLContactExtraField(objDto.accountId, SQLProvider))
            {
                return Json(await objBL.GetList());
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> UpdateTemplateContent([FromBody] DesignTemplateWithP5Editor_UpdateTemplateContentDto objDto)
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

                    using (var objBL = DLMailTemplateFile.GetDLMailTemplateFile(objDto.accountId, SQLProvider))
                    {
                        await objBL.Delete(objDto.TemplateId);
                    }

                    string Body = await ChangePathAndSaveBEEHTMLImage(objDto.accountId, objDto.TemplateId, objDto.HtmlContent);

                    SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(objDto.accountId, objDto.TemplateId);

                    templateFile.TemplateFileContent = Helper.ConvertHtmlStringToBytesFromPhysical(HtmlContent: Body);
                    templateFile.TemplateFileName = HtmlFileName;
                    templateFile.TemplateFileType = ".html";

                    SaveMailTemplateFile(objDto.accountId, templateFile);

                    awsUpload.UploadFileContent(HtmlFileName, Body);

                    //json content ignored

                    //JsonContent = JsonContent.Replace("editor_images/", "");

                    //templateFile.TemplateFileContent = Helper.ConvertHtmlStringToBytesFromPhysical(HtmlContent: JsonContent);
                    //templateFile.TemplateFileName = JsonFileName;
                    //templateFile.TemplateFileType = ".json";

                    //SaveMailTemplateFile(accountId, templateFile);

                    //awsUpload.UploadFileContent(JsonFileName, JsonContent);

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

                                Stream fileStream = await awsUpload.GetFileContentStream(imageName, BucketPath);

                                MailTemplateFile templateFile = new MailTemplateFile() { TemplateId = templateId };
                                templateFile.TemplateFileContent = fileStream.ReadAsBytes();
                                templateFile.TemplateFileName = imageName;
                                templateFile.TemplateFileType = getImg.Substring(getImg.LastIndexOf('.'));
                                SaveMailTemplateFile(accountId, templateFile);

                                Stream uploadfileStream = await awsUpload.GetFileContentStream(imageName, BucketPath);

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

        private async Task SaveMailTemplateFile(int accountId, MailTemplateFile TemplateFile)
        {
            using (var objBL = DLMailTemplateFile.GetDLMailTemplateFile(accountId, SQLProvider))
            {
                await objBL.Save(TemplateFile);
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetTemplateImagesFiles([FromBody] DesignTemplateWithP5Editor_GetTemplateImagesFilesDto objDto)
        {
            List<MailTemplateImages> images = null;
            using (var objimage = DLMailTemplateImages.GetDLMailTemplateImages(objDto.accountId, SQLProvider))
                images = await objimage.GetTemplateImagesFiles();


            return Json(new { Data = images, MaxJsonLength = Int32.MaxValue });
        }

        [HttpPost]
        public async Task<JsonResult> SaveImage()
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            var httpPostedFile = Request.Form.Files;
            if (httpPostedFile != null && httpPostedFile.Count > 0)
            {
                try
                {
                    List<MailTemplateImages> images = new List<MailTemplateImages>();
                    for (int i = 0; i < httpPostedFile.Count; i++)
                    {
                        var FileName = Path.GetFileNameWithoutExtension(httpPostedFile[i].FileName);
                        string fileExtension = Path.GetExtension(httpPostedFile[i].FileName).ToLower();

                        SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(domainDetails.AdsId, "ClientImages");
                        Tuple<string, string> awsUploadTuple = await awsUpload.UploadClientFiles(FileName, httpPostedFile[i].OpenReadStream());


                        int wSize = 250;
                        int hSize = 350;
                        try
                        {
                            byte[] imageData = new WebClient().DownloadData(awsUploadTuple.Item2);
                            MemoryStream imgStream = new MemoryStream(imageData);
                            Image img = Image.FromStream(imgStream);
                            wSize = img.Width;
                            hSize = img.Height;
                        }
                        catch { }

                        MailTemplateImages mailTemplateImages = new MailTemplateImages { Name = FileName, ImageUrl = awsUploadTuple.Item2, Height = hSize, Width = wSize };

                        using (var objimage = DLMailTemplateImages.GetDLMailTemplateImages(domainDetails.AdsId, SQLProvider))
                            await objimage.Save(mailTemplateImages);

                        images.Add(mailTemplateImages);

                    }
                    return Json(new { Data = images, MaxJsonLength = Int32.MaxValue });

                }
                catch (Exception ex)
                {
                    // Handle any errors that occur during the upload process
                    return Json(ex.Message);
                }
            }
            // Return an error message if no file was uploaded
            return Json("No image found");
        }
    }
}
