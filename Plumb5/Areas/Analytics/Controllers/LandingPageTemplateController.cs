using Bdev.Net.Dns.Helpers;
using Bdev.Net.Dns.Records;
using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using RestSharp.Extensions;
using System.Text.RegularExpressions;
using System.Text;
using Plumb5.Areas.Analytics.Models;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;
using Plumb5.Areas.Analytics.Dto;

namespace Plumb5.Areas.Analytics.Controllers
{
    [Area("LandingPage")]
    public class LandingPageTemplateController : BaseController
    {
        public LandingPageTemplateController(IConfiguration _configuration) : base(_configuration)
        { }

        public ActionResult Index()
        {
            return View("LandingPageTemplate");
        }
        [HttpPost]
        public async Task<JsonResult> GetLandingPageConfiguration([FromBody] LandingPageTemplate_GetLandingPageConfigurationDto objDto)
        {
            using (var objBL = DLLandingPageConfiguration.GetDLLandingPageConfiguration(objDto.AdsId, SQLProvider))
            {
                return Json(objBL.GetLandingPageConfiguration());
            }
        }
        [HttpPost]
        public async Task<JsonResult> SaveStaticFiles([FromBody] LandingPageTemplate_SaveStaticFilesDto objDto)
        {
            string DtateTime = DateTime.Now.ToString("ddMMyyyyHHmmssfff");
            string PhyPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString();

            string templateSource = PhyPath + "\\TempFiles\\Template" + objDto.GalleryTemplateId + "";
            SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(objDto.accountId, objDto.LandingPageId);

            string[] filesInDirectpry = Directory.GetFiles(templateSource);

            string HtmlFileName = "TemplateContent.html";
            string JsonFileName = "TemplateContent.json";

            foreach (string file in filesInDirectpry)
            {
                LandingPageTemplateFile TemplateFile = new LandingPageTemplateFile() { LandingPageId = objDto.LandingPageId };

                FileInfo fileInfo = new FileInfo(file);
                TemplateFile.TemplateFileContent = Helper.ConvertHtmlStringToBytesFromPhysical(FileFullPath: fileInfo.FullName);
                TemplateFile.TemplateFileType = fileInfo.Extension;
                if (fileInfo.Name == "Template" + objDto.GalleryTemplateId + ".html")
                {
                    TemplateFile.TemplateFileName = HtmlFileName;
                    SaveLandingPageFile(objDto.accountId, TemplateFile);
                    awsUpload.UploadFiles(HtmlFileName, fileInfo.FullName);
                }
                else if (fileInfo.Name == "Template" + objDto.GalleryTemplateId + ".json")
                {
                    TemplateFile.TemplateFileName = JsonFileName;
                    SaveLandingPageFile(objDto.accountId, TemplateFile);
                    awsUpload.UploadFiles(JsonFileName, fileInfo.FullName);
                }
                else
                {
                    TemplateFile.TemplateFileName = fileInfo.Name;
                    SaveLandingPageFile(objDto.accountId, TemplateFile);
                    awsUpload.UploadFiles(fileInfo.Name, fileInfo.FullName);
                }
            }

            return Json(new { Status = true });
        }

        private void SaveLandingPageFile(int accountId, LandingPageTemplateFile TemplateFile)
        {
            using (var objBL = DLLandingPageTemplateFile.GetDLLandingPageTemplateFile(accountId,SQLProvider))
            {
                objBL.Save(TemplateFile);
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
                    Stream fileStream = httpPostedFile[0].OpenReadStream();
                    List<string> presentExtensionList = Helper.GetFileExtensionFromFileStream(fileStream);
                    if (presentExtensionList != null && fileExtensionList.Any(presentExtensionList.Contains))
                    {
                        string fileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + Path.GetExtension(httpPostedFile[0].FileName);
                        string fileSavePath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString()+ "~/TempFiles/"+ fileName;//Path.Combine(HttpContext.Server.MapPath("~/TempFiles/"), fileName);
                       // httpPostedFile[0].SaveAs(fileSavePath);

                        string TemplatePath = fileSavePath; StringBuilder MainContentOftheMail = new StringBuilder(); string Body = string.Empty;
                        if (System.IO.File.Exists(TemplatePath))
                        {
                            using (StreamReader rd = System.IO.File.OpenText(TemplatePath))
                            {
                                Body = MainContentOftheMail.Append(rd.ReadToEnd()).ToString();
                                rd.Close();
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

                                            if (!(Regex.IsMatch(matchString, @"^(http|https)://.*$", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace)))
                                            {
                                                if (!(Regex.IsMatch(matchString, " ^ images/", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace)))
                                                    return Json(false);
                                            }
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

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveUploadedTemplate([FromBody] LandingPageTemplate_SaveUploadedTemplateDto objDto)
        {
           
            bool Status = false;
            string Message = "Something went wrong. Please try again.";
            int LandingPageId = 0;

            LandingPage var_landingPage = JsonConvert.DeserializeObject<LandingPage>(HttpContext.Request.Query["LandingPage"].ToString().Replace("$@", "&").Replace("@$@", "#"));
            

            var uploadedfiles = Request.Form.Files;
            bool isValidFile = true;

            for (int i = 0; i < uploadedfiles.Count; i++)
            {
                string fileExtension = Path.GetExtension(uploadedfiles[i].FileName).ToLower();
                List<string> fileExtensionList = new List<string>() { ".html", ".htm", ".jpeg", ".jpg", ".gif", ".bmp", ".png" };

                if (fileExtensionList.Contains(fileExtension))
                {
                    Stream fileStream = uploadedfiles[i].OpenReadStream();
                    List<string> presentExtensionList = Helper.GetFileExtensionFromFileStream(fileStream);

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

                objDto.landingPage.UserInfoUserId = user.UserId;
                objDto.landingPage.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;

              
                LandingPageConfiguration landingPageConfiguration = new LandingPageConfiguration();
                using (var objBL = DLLandingPageConfiguration.GetDLLandingPageConfiguration(objDto.accountId, SQLProvider))
                    landingPageConfiguration = await objBL.GetLandingPageConfiguration();

                objDto.landingPage.LandingPageConfigurationId = landingPageConfiguration.Id;

                using (var objBAL = DLLandingPage.GetDLLandingPage(account.AdsId,SQLProvider))
                {
                    objDto.landingPage.Id = await objBAL.Save(objDto.landingPage);
                }

                if (objDto.landingPage.Id > 0)
                {
                    SaveLandingPageToAWS awsUploadOne = new SaveLandingPageToAWS(objDto.accountId, objDto.landingPage.Id, objDto.landingPage.PageName, landingPageConfiguration.LandingPageName);
                    for (int i = 0; i < uploadedfiles.Count; i++)
                    {
                        string fileExtension = Path.GetExtension(uploadedfiles[i].FileName).ToLower();
                        string fileName = uploadedfiles[i].FileName;
                        LandingPageTemplateFile TemplateFile = new LandingPageTemplateFile() { LandingPageId = objDto.landingPage.Id };

                        var fileStream = uploadedfiles[i].OpenReadStream();
                        
                        TemplateFile.TemplateFileType = fileExtension;

                        if (fileExtension == ".html" || fileExtension == ".htm")
                        {
                            string HtmlFileName = "Index.html";
                            StreamReader reader = new StreamReader(fileStream);
                            string Body = reader.ReadToEnd();
                            Body = ChangeImageToLocalPath(Body);

                            TemplateFile.TemplateFileContent = Helper.ConvertHtmlStringToBytesFromPhysical(HtmlContent: Body);
                            TemplateFile.TemplateFileName = HtmlFileName;
                            SaveLandingPageFile(objDto.accountId, TemplateFile);
                            awsUploadOne.UploadFileContent(HtmlFileName, Body);
                        }
                        else
                        {
                            //TemplateFile.TemplateFileContent = fileStream.ReadAsBytes();
                            TemplateFile.TemplateFileName = fileName;
                            SaveLandingPageFile(objDto.accountId, TemplateFile);
                            awsUploadOne.UploadFileStream(fileName, fileStream);
                        }
                    }

                    LandingPageId = objDto.landingPage.Id;
                    Status = true;
                    Message = "Template created successfully";
                }
                else
                {
                    Status = false;
                    Message = "With this name already template exists";
                }
            }

            return Json(new { Status, Message, LandingPageId });
        }

        public string ChangeImageToLocalPath(string Body)
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
        public async Task<ActionResult> SaveOrUpdateLandingPage([FromBody] LandingPageTemplate_SaveOrUpdateLandingPageDto objDto)
        {
            LandingPageConfiguration landingPageConfiguration = new LandingPageConfiguration();
            using (var objBL = DLLandingPageConfiguration.GetDLLandingPageConfiguration(objDto.AdsId, SQLProvider))
                landingPageConfiguration =await objBL.GetLandingPageConfiguration();
            objDto.landingPage.LandingPageConfigurationId = landingPageConfiguration.Id;

            if (objDto.landingPage.Id > 0)
            {
                using (var objBL = DLLandingPage.GetDLLandingPage(objDto.AdsId, SQLProvider))
                {
                    return Json(await objBL.Update(objDto.landingPage));
                }
            }
            else
            {
                using (var objBL = DLLandingPage.GetDLLandingPage(objDto.AdsId, SQLProvider))
                {
                    return Json(await objBL.Save(objDto.landingPage));
                }
            }
        }
        [HttpPost]
        public async Task<ActionResult> VerifyLandingPage([FromBody] LandingPageTemplate_VerifyLandingPageDto objDto)
        {
            bool isVerified = false;
            try
            {
                var ddd = DnsServers.Resolve<CNameRecord>(objDto.LPNAME.ToString()).FirstOrDefault().Value;
                if (ddd == objDto.CNAME)
                    isVerified = true;
            }
            catch (Exception ex)
            {
                isVerified = false;
            }
            return Json(isVerified);
        }
        [HttpPost]
        public async Task<JsonResult> GetStaticTemplates()
        {
            string rootFolder = "/TempFiles";
            string rootPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString()+ rootFolder;
            //string rootPath = Server.MapPath("~" + rootFolder);
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

            return Json(new { BasicTemplateDetailsList, PremiumTemplateDetailsList });
        }
    }
}
