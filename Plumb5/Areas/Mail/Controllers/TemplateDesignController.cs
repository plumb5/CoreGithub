using Microsoft.AspNetCore.Mvc; 
using P5GenralDL;
using P5GenralML;
using Plumb5GenralFunction;
using System.Text; 
using Plumb5.Controllers;
using Plumb5.Areas.Analytics.Models;  
using Newtonsoft.Json;
using System.IO;
using System.Text.RegularExpressions;
using RestSharp.Extensions;
using Plumb5.Areas.Mail.Dto;

namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class TemplateDesignController : BaseController
    {
        private readonly IWebHostEnvironment _env;

        public TemplateDesignController(IConfiguration _configuration, IWebHostEnvironment env) : base(_configuration)
        {
            _env = env;
        }
        //
        // GET: /Mail/TemplateDesign/

        public IActionResult Index()
        {
            return View("TemplateDesign");
        }
        [HttpPost]
        public async Task<JsonResult> GetMailCampaignList([FromBody] TemplateDesign_GetMailCampaignListDto TemplateDesignDto)
        {
            using (var objDLform =DLCampaignIdentifier.GetDLCampaignIdentifier(TemplateDesignDto.accountId, SQLProvider))
            {
                return Json(await objDLform.GetList(new CampaignIdentifier(), 0, 0) );
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetStaticTemplates()
        {
            string rootFolder = "/TempFiles";

            string rootPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString() + rootFolder; 
            List<MailStaticTemplate> TemplateDetailsList = new List<MailStaticTemplate>();

            foreach (var directoryInfo in Directory.GetDirectories(rootPath, "Template*"))
            {
                var dir = new DirectoryInfo(directoryInfo);
                MailStaticTemplate StaticTemplate = new MailStaticTemplate();
                StaticTemplate.TemplateDirectory = dir.Name;
                StaticTemplate.TemplateOrder = Convert.ToInt32(dir.Name.Replace("Template", ""));
                StaticTemplate.TemplateHtmlPath = rootFolder + "/" + dir.Name + "/" + dir.Name + ".html";
                StaticTemplate.TemplatePreviewImagePath = rootFolder + "/" + dir.Name + "/TempThumb.bmp";
                StaticTemplate.TemplatePreviewThumbImagePath = rootFolder + "/" + dir.Name + "/Template" + StaticTemplate.TemplateOrder + ".jpg";
                StaticTemplate.TemplateJsonPath = rootFolder + "/" + dir.Name + "/" + dir.Name + ".json";

                string[] names = StaticTemplate.GetTemplateHeading(dir.FullName + "\\" + dir.Name + ".json");

                if (!string.IsNullOrEmpty(names[0]))
                    StaticTemplate.TemplateHeading = names[0];

                if (!string.IsNullOrEmpty(names[1]))
                    StaticTemplate.IsBasicPremium = Convert.ToByte(names[1]);
                else
                    StaticTemplate.IsBasicPremium = 0;

                if (!string.IsNullOrEmpty(names[2]))
                    StaticTemplate.TemplateDescription = names[2];

                TemplateDetailsList.Add(StaticTemplate);
            }

            List<MailStaticTemplate> BasicTemplateDetailsList = TemplateDetailsList.Where(x => x.IsBasicPremium == 0).OrderByDescending(x => x.TemplateOrder).ToList();
            List<MailStaticTemplate> PremiumTemplateDetailsList = TemplateDetailsList.Where(x => x.IsBasicPremium == 1).OrderByDescending(x => x.TemplateOrder).ToList();

            BasicTemplateDetailsList = BasicTemplateDetailsList.Where(x => x.TemplateOrder % 2 == 0).ToList();
            PremiumTemplateDetailsList.Clear();

            return Json(new { BasicTemplateDetailsList, PremiumTemplateDetailsList } );
        }
        [HttpPost]
        [Log]
        public async Task<JsonResult> SaveStaticTemplate([FromBody] TemplateDesign_SaveStaticTemplateDto TemplateDesignDto)
        {
            
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            TemplateDesignDto.mailTemplate.UserInfoUserId = user.UserId;
            TemplateDesignDto.mailTemplate.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;

            using (var objDL =   DLMailTemplate.GetDLMailTemplate(TemplateDesignDto.accountId,SQLProvider))
            {
                TemplateDesignDto.mailTemplate.Id = await objDL.Save(TemplateDesignDto.mailTemplate);
            }

            if (TemplateDesignDto.mailTemplate.Id > 0)
            {
              saveStaticfiles(TemplateDesignDto.accountId, TemplateDesignDto.mailTemplate.Id, TemplateDesignDto.GalleryTemplateId);
            }

            return Json(TemplateDesignDto.mailTemplate );
        }
        [HttpPost]
        private async void saveStaticfiles(int accountId, int mailTemplateId, int GalleryTemplateId)
        {
            string DtateTime = DateTime.Now.ToString("ddMMyyyyHHmmssfff");
            string PhyPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString();

            string templateSource = PhyPath + "\\TempFiles\\Template" + GalleryTemplateId + "";
            SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(accountId, mailTemplateId);

            string[] filesInDirectpry = Directory.GetFiles(templateSource);

            string HtmlFileName = "TemplateContent.html";
            string JsonFileName = "TemplateContent.json";

            foreach (string file in filesInDirectpry)
            {
                MailTemplateFile TemplateFile = new MailTemplateFile() { TemplateId = mailTemplateId };

                FileInfo fileInfo = new FileInfo(file);
                TemplateFile.TemplateFileContent = Helper.ConvertHtmlStringToBytesFromPhysical(FileFullPath: fileInfo.FullName);
                TemplateFile.TemplateFileType = fileInfo.Extension;
                if (fileInfo.Name == "Template" + GalleryTemplateId + ".html")
                {
                    TemplateFile.TemplateFileName = HtmlFileName;
                    SaveMailTemplateFile(accountId, TemplateFile);
                    awsUpload.UploadFiles(HtmlFileName, fileInfo.FullName);
                }
                else if (fileInfo.Name == "Template" + GalleryTemplateId + ".json")
                {
                    TemplateFile.TemplateFileName = JsonFileName;
                    SaveMailTemplateFile(accountId, TemplateFile);
                    awsUpload.UploadFiles(JsonFileName, fileInfo.FullName);
                }
                else
                {
                    TemplateFile.TemplateFileName = fileInfo.Name;
                    SaveMailTemplateFile(accountId, TemplateFile);
                    awsUpload.UploadFiles(fileInfo.Name, fileInfo.FullName);
                }
            }
        }
        [HttpPost]
        public async Task<JsonResult> CheckHtmlImageTag()
        {
            var httpPostedFile = Request.Form.Files; 
            if (httpPostedFile != null)
            {
                string fileExtension = Path.GetExtension(httpPostedFile[0].FileName).ToLower();
                List<string> fileExtensionList = new List<string>() { ".html", ".htm" };
                if (fileExtensionList.Contains(fileExtension))
                {
                    // Get the path to the wwwroot folder
                    var webRootPath = _env.WebRootPath;
                    List<string> presentExtensionList = Helper.GetFileExtensionFromFileStream(httpPostedFile[0].OpenReadStream());
                    if (presentExtensionList != null && fileExtensionList.Any(presentExtensionList.Contains))
                    {
                         
                        string fileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + Path.GetExtension(httpPostedFile[0].FileName);
                        string fileSavePath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString() + "/TempFiles/" + fileName;//Path.Combine(HttpContext.Server.MapPath("~/TempFiles/"), fileName);
                        try
                        {
                            using var stream = new FileStream(fileSavePath, FileMode.Create);
                            await httpPostedFile[0].CopyToAsync(stream);
                        }
                        catch (Exception ex)
                        {

                        }
                       
                        string TemplatePath = fileSavePath; StringBuilder MainContentOftheMail = new StringBuilder(); string Body = string.Empty;
                        if (System.IO.File.Exists(TemplatePath))
                        {
                            try
                            {
                                using (StreamReader rd = System.IO.File.OpenText(TemplatePath))
                                {
                                    Body = MainContentOftheMail.Append(rd.ReadToEnd()).ToString();
                                    rd.Close();
                                }
                            }
                            catch(Exception ex)
                            {

                            }

                            if (!String.IsNullOrEmpty(Body))
                            {
                                foreach (Match m in Regex.Matches(Body, "(<img.*?src=[\"'])([^\"]*)(['\"].*?>)", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace))
                                {
                                    try
                                    {
                                        string str = m.Value;
                                        if (!string.IsNullOrEmpty(str) && Regex.Match(str, "<img.+?src=[\"'](.+?)[\"'].+?>", RegexOptions.IgnoreCase).Groups[1].Success)
                                        {
                                            string matchString = Regex.Match(str, "<img.+?src=[\"'](.+?)[\"'].+?>", RegexOptions.IgnoreCase).Groups[1].Value;

                                            //if (!(Regex.IsMatch(matchString, @"^(http|https)://.*$", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace)))
                                            //{
                                            //    if (!(Regex.IsMatch(matchString, " ^ images/", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace)))
                                            //        return Json(false, JsonRequestBehavior.AllowGet);
                                            //}
                                        }
                                    }
                                    catch
                                    { }
                                }
                            }
                            else
                            {
                                return Json(false);
                            }
                        }
                        else
                        {
                            return Json(false);
                        }
                    }
                    else
                    {
                        return Json(false);
                    }

                }
                else
                {
                    return Json(false);
                }
            }
            else
            {
                return Json(false);
            }

            return Json(true);
        }

        public async Task<JsonResult> SaveUploadedTemplate([FromBody] TemplateDesign_SaveUploadedTemplateDto TemplateDesignDto)
        {
            var uploadedfiles = Request.Form.Files;

            bool Status = false;
            string Message = "Something went wrong. Please try again.";
            int MailTemplateId = 0;
            MailTemplate mailTemplate = JsonConvert.DeserializeObject<MailTemplate>(HttpContext.Request.Query["MailTemplate"].ToString().Replace("$@", "&").Replace("@$@", "#"));
            try
            {
                
            
                bool isValidFile = true;

            for (int i = 0; i < uploadedfiles.Count; i++)
            {
                string fileExtension = Path.GetExtension(uploadedfiles[i].FileName).ToLower();
                List<string> fileExtensionList = new List<string>() { ".html", ".htm", ".jpeg", ".jpg", ".gif", ".bmp", ".png" };

                if (fileExtensionList.Contains(fileExtension))
                {
                    List<string> presentExtensionList = Helper.GetFileExtensionFromFileStream(uploadedfiles[i].OpenReadStream());

                    if (presentExtensionList != null && fileExtensionList.Any(presentExtensionList.Contains))
                    {
                        isValidFile = true;
                    }
                    else
                    {
                        isValidFile = false;
                        Status = false;
                        Message = "Invalid file format found";
                        break;
                    }
                }
                else
                {
                    isValidFile = false;
                    Status = false;
                    Message = "Invalid file format found";
                    break;
                }
            }

            if (isValidFile)
            {
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                TemplateDesignDto.mailTemplate.UserInfoUserId = user.UserId;
                TemplateDesignDto.mailTemplate.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;

                using (var objBAL =  DLMailTemplate.GetDLMailTemplate(account.AdsId,SQLProvider))
                {
                    TemplateDesignDto.mailTemplate.IsBeeTemplate = false;
                    TemplateDesignDto.mailTemplate.Id = await  objBAL.Save(TemplateDesignDto.mailTemplate);
                }

                if (TemplateDesignDto.mailTemplate.Id > 0)
                {
                    SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(TemplateDesignDto.accountId, TemplateDesignDto.mailTemplate.Id);
                    for (int i = 0; i < uploadedfiles.Count; i++)
                    {
                        string fileExtension = Path.GetExtension(uploadedfiles[i].FileName).ToLower();
                        string fileName = uploadedfiles[i].FileName;
                        MailTemplateFile TemplateFile = new MailTemplateFile() { TemplateId = TemplateDesignDto.mailTemplate.Id };

                        Stream fileStream = uploadedfiles[i].OpenReadStream();

                        TemplateFile.TemplateFileType = fileExtension;

                        if (fileExtension == ".html" || fileExtension == ".htm")
                        {
                            string HtmlFileName = "TemplateContent.html";
                            StreamReader reader = new StreamReader(fileStream);
                            string Body = reader.ReadToEnd();
                            Body = await ChangeImageToLocalPath(Body);

                            TemplateFile.TemplateFileContent = Helper.ConvertHtmlStringToBytesFromPhysical(HtmlContent: Body);
                            TemplateFile.TemplateFileName = HtmlFileName;
                            SaveMailTemplateFile(TemplateDesignDto.accountId, TemplateFile);
                            awsUpload.UploadFileContent(HtmlFileName, Body);
                        }
                        else
                        { 
                            TemplateFile.TemplateFileContent = fileStream.ReadAsBytes();
                            TemplateFile.TemplateFileName = fileName;
                            SaveMailTemplateFile(TemplateDesignDto.accountId, TemplateFile);
                            awsUpload.UploadFileStream(fileName, fileStream);
                        }
                    }

                    MailTemplateId = mailTemplate.Id;
                    Status = true;
                    Message = "Template created successfully";
                }
                else
                {
                    Status = false;
                    Message = "With this name already template exists";
                }
            }
            }

            catch (Exception ex)
            {

            }
            return Json(new { Status, Message, MailTemplateId } );
        }
        [HttpPost]
        [Log]
        public async Task<JsonResult> UpdateEditContent([FromBody] TemplateDesign_UpdateEditContentDto TemplateDesignDto)
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs    
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "Template", "Mail", "UpdateEditContent", Helper.GetIP(), JsonConvert.SerializeObject(new { TemplateId = TemplateId, HtmlContent = HtmlContent }));
            //#endregion
            bool Status = false;
            string Message = "Something went wrong. Please try again.";
            string ExpectionMessage = string.Empty;
            int MailTemplateId = 0;
            string HtmlFileName = "TemplateContent.html";
            try
            {
                MailTemplateFile TemplateFile = new MailTemplateFile() { TemplateId = TemplateDesignDto.TemplateId, TemplateFileType = ".HTML" };
                using (var objMail =   DLMailTemplateFile.GetDLMailTemplateFile(TemplateDesignDto.accountId, SQLProvider))
                {
                    TemplateFile = await objMail.GetSingleFileType(TemplateFile);
                }

                if (TemplateFile != null)
                {
                    SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(TemplateDesignDto.accountId, TemplateDesignDto.TemplateId);
                    TemplateFile.TemplateFileContent = Helper.ConvertHtmlStringToBytesFromPhysical(HtmlContent: TemplateDesignDto.HtmlContent);
                    using (var objDL =   DLMailTemplateFile.GetDLMailTemplateFile(TemplateDesignDto.accountId, SQLProvider))
                        await objDL.Update(TemplateFile);
                    awsUpload.UploadFileContent(HtmlFileName, TemplateDesignDto.HtmlContent);
                    MailTemplateId = TemplateDesignDto.TemplateId;
                    Status = true;
                    Message = "Template updated successfully";
                }
                else
                {
                    MailTemplateId = TemplateDesignDto.TemplateId;
                    Status = true;
                    Message = "Unable to update a template, please try again";
                }
            }
            catch (Exception ex)
            {
                MailTemplateId = TemplateDesignDto.TemplateId;
                Status = true;
                ExpectionMessage = ex.Message;
            }
            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { MailTemplateId = TemplateId, LogMessage = LogMessage, Result = Status, Message = Message }), LogMessage);
            return Json(new { Status, Message, ExpectionMessage, MailTemplateId } );
        }
        [HttpPost]
        public async Task<string> ChangeImageToLocalPath(string Body)
        {
            foreach (Match m in Regex.Matches(Body, "<img.*?src=[\"'](.+?)[\"'].*?>", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace))
            {
                try
                {
                    string getImg = Regex.Match(m.Value, "<img.*?src=[\"'](.+?)[\"'].*?>", RegexOptions.IgnoreCase).Groups[1].Value;
                    if (!getImg.Contains("http"))
                    {
                        if (getImg.Contains(".jpg") == true || getImg.Contains(".gif") == true || getImg.Contains(".JPG") == true || getImg.Contains(".GIF") == true || getImg.Contains(".png") == true || getImg.Contains(".PNG") == true || getImg.Contains(".bmp") == true || getImg.Contains(".BMP") == true)
                        {
                            if (getImg.LastIndexOf('/') > -1)
                            {
                                getImg = getImg.Substring(getImg.LastIndexOf('/') + 1);

                                Body = Body.Replace("images/" + getImg, getImg);
                            }
                        }
                    }
                }
                catch
                {
                    //
                }
            }
            return Body;
        }
        [HttpPost]
        private async void SaveMailTemplateFile(int accountId, MailTemplateFile TemplateFile)
        {
            using (var objDL =   DLMailTemplateFile.GetDLMailTemplateFile(accountId,SQLProvider))
            {
                await objDL.Save(TemplateFile);
            }
        }
    }
}
