using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5GenralFunction;
using System.Text;
using Bdev.Net.Dns.Helpers;
using Bdev.Net.Dns.Records;
using System.Runtime.Intrinsics.Arm;
using Plumb5.Controllers;
using Microsoft.AspNetCore.Http;
using Plumb5.Areas.Mail.Dto;
using Plumb5.Areas.Analytics.Dto;
using NPOI.SS.Formula.Functions;

namespace Plumb5.Areas.Analytics.Controllers
{
    [Area("LandingPage")]
    public class LandingPageController : BaseController
    {
        public LandingPageController(IConfiguration _configuration) : base(_configuration)
        { }

        public IActionResult Index()
        {
            return View("LandingPage");
        }
        [HttpPost]
        public async Task<ActionResult> GetMaxCount([FromBody] LandingPage_GetMaxCountDto LandingPageDto)
        {
            LandingPage landingPage = new LandingPage();

            if (LandingPageDto.PageName != null && (LandingPageDto.PageName != String.Empty))
                landingPage = new LandingPage() { PageName = LandingPageDto.PageName };
           
            using (var objBL =  DLLandingPage.GetDLLandingPage(LandingPageDto.AdsId, SQLProvider))
            {
                return Json(await objBL.MaxCount(landingPage));
            }
        }
        [HttpPost]
        public async Task<ActionResult> GetDetails([FromBody] LandingPage_GetDetails LandingPageDto)
        {
            MLLandingPage landingPage = new MLLandingPage();

            if (LandingPageDto.PageName != null && LandingPageDto.PageName != String.Empty)
                landingPage = new MLLandingPage() { PageName = LandingPageDto.PageName };

            HttpContext.Session.SetString("LandingPage", JsonConvert.SerializeObject(landingPage));
            using (var objBL = DLLandingPage.GetDLLandingPage(LandingPageDto.AdsId, SQLProvider))
            {
                return Json(await objBL.GetDetails(landingPage, LandingPageDto.FetchNext, LandingPageDto.OffSet));
            }
        }
        [HttpPost]
        public async Task<ActionResult> DeleteLandingPage([FromBody] LandingPage_DeleteLandingPage LandingPageDto)
        {
            using (var objBL = DLLandingPage.GetDLLandingPage(LandingPageDto.AdsId, SQLProvider))
            {
                return Json(await objBL.Delete(LandingPageDto.Id));
            }
        }
        [HttpPost]
        public async Task<ActionResult> GetLandingPageConfiguration([FromBody] LandingPage_GetLandingPageConfiguration LandingPageDto)
        {
            using (var objBL = DLLandingPageConfiguration.GetDLLandingPageConfiguration(LandingPageDto.AdsId, SQLProvider))            
            {
                var status = false;
                var data = await objBL.GetLandingPageConfiguration();
                if (data != null) { status = true; }
                return Json(new { Status = status, data = data });

            }
        }
        [HttpPost]
        public async Task<ActionResult> SaveOrUpdateLandingPage([FromBody] LandingPage_SaveOrUpdateLandingPage LandingPageDto,LandingPage landingPage)
        {
            LandingPageConfiguration landingPageConfiguration = new LandingPageConfiguration();
            using (var objBL = DLLandingPageConfiguration.GetDLLandingPageConfiguration(LandingPageDto.AdsId, SQLProvider))
                landingPageConfiguration = await objBL.GetLandingPageConfiguration();
            landingPage.LandingPageConfigurationId = landingPageConfiguration.Id;

            if (landingPage.Id > 0)
            {
                using (var objBL = DLLandingPage.GetDLLandingPage(LandingPageDto.AdsId, SQLProvider))
                {
                    return Json(await objBL.Update(landingPage));
                }
            }
            else
            {
                using (var objBL = DLLandingPage.GetDLLandingPage(LandingPageDto.AdsId, SQLProvider))
                {
                    return Json(await objBL.Save(landingPage));
                }
            }
        }
        [HttpPost]
        public async Task<ActionResult> VerifyLandingPage([FromBody] LandingPage_VerifyLandingPage LandingPageDto)
        {
            bool isVerified = false;
            var message = "";
            try
            {
                var ddd = DnsServers.Resolve<CNameRecord>(LandingPageDto.LPNAME.ToString()).FirstOrDefault().Value;
                if (ddd == LandingPageDto.CNAME)
                    isVerified = true;
            }
            catch (Exception ex)
            {
                isVerified = false;
                message = ex.Message;
            }
            return Json(new { Message = message, Status = isVerified });
        }
        [HttpPost]
        public async void DownloadLandingPage([FromBody] LandingPage_DownloadLandingPage LandingPageDto)
        {
            try
            {
                LandingPage landingPage;
                using (var objMailTemplate = DLLandingPage.GetDLLandingPage(LandingPageDto.AdsId, SQLProvider))
                {
                    landingPage =await objMailTemplate.GetSingle(new LandingPage() { Id = LandingPageDto.LandingPageId });
                }

                if (landingPage != null && landingPage.Id > 0)
                {
                    LandingPageTemplateFile landingPageTemplateFile;
                    using (var objBL = DLLandingPageTemplateFile.GetDLLandingPageTemplateFile(LandingPageDto.AdsId, SQLProvider))
                    {
                        landingPageTemplateFile =await objBL.GetSingleFileType(new LandingPageTemplateFile() { LandingPageId = LandingPageDto.LandingPageId, TemplateFileType = ".HTML" });
                    }

                    string HtmlContent;
                    if (landingPageTemplateFile != null && landingPageTemplateFile.TemplateFileContent != null)
                    {
                        HtmlContent = Encoding.UTF8.GetString(landingPageTemplateFile.TemplateFileContent);

                        LandingPageConfiguration landingPageConfiguration = new LandingPageConfiguration();
                        using (var objBL =  DLLandingPageConfiguration.GetDLLandingPageConfiguration(LandingPageDto.AdsId, SQLProvider))
                            landingPageConfiguration =await objBL.GetLandingPageConfiguration();

                        string PhyPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString() + "\\TempFiles\\" + "LandingPage-" + LandingPageDto.AdsId + "-" + LandingPageDto.LandingPageId;
                        string foldername = "Campaign-" + LandingPageDto.AdsId + "-" + LandingPageDto.LandingPageId;
                        SaveLandingPageToAWS awsUpload = new SaveLandingPageToAWS(LandingPageDto.AdsId, LandingPageDto.LandingPageId, landingPage.PageName, landingPageConfiguration.LandingPageName);
                        bool result = awsUpload.ListingContentAndDownloadFiles(foldername, PhyPath, awsUpload.bucketname);
                        string ZipedFolderName = string.Empty;
                        string disCampaignFolder = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString() + "\\TempFiles\\";
                        if (result)
                        {
                            string SourceFolderName = disCampaignFolder + "LandingPage-" + LandingPageDto.AdsId + "-" + LandingPageDto.LandingPageId;
                            ZipedFolderName = Helper.Zip(SourceFolderName, disCampaignFolder);
                        }

                        if (String.IsNullOrEmpty(ZipedFolderName))
                        {
                            ZipedFolderName = "LandingPage_" + LandingPageDto.AdsId + "_" + LandingPageDto.LandingPageId + "_" + landingPageTemplateFile.TemplateFileName;
                            using (StreamWriter sw = new StreamWriter(disCampaignFolder + ZipedFolderName))
                            {
                                sw.Write(HtmlContent);
                                sw.Close();
                            }
                        }

                        string filename = (disCampaignFolder + ZipedFolderName);
                        FileInfo fileInfo = new FileInfo(filename);
                        if (fileInfo.Exists)
                        {
                            long sz = fileInfo.Length;
                           
                            Response.Clear();
                            Response.ContentType = "application/octet-stream";
                            Response.Headers.Add("Content-Disposition", string.Format("attachment; filename = {0}", Path.GetFileName(filename)));
                            Response.Headers.Add("Content-Length", sz.ToString("F0"));
                            //Response.TransmitFile(filename);
                            //Response.End();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        [HttpPost]
        [Log]
        public async Task<ActionResult> DuplicateLandingPage([FromBody] LandingPage_DuplicateLandingPage LandingPageDto, LandingPage landingPage)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
           
            landingPage.UserInfoUserId = user.UserId;
            landingPage.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;

            LandingPageConfiguration landingPageConfiguration = new LandingPageConfiguration();
            using (var objBL = DLLandingPageConfiguration.GetDLLandingPageConfiguration(LandingPageDto.AdsId, SQLProvider))
                landingPageConfiguration =await objBL.GetLandingPageConfiguration();
            landingPage.LandingPageConfigurationId = landingPageConfiguration.Id;

            using (var objBL = DLLandingPage.GetDLLandingPage(LandingPageDto.AdsId, SQLProvider))
            {
                landingPage.Id =await objBL.Save(landingPage);
            }

            if (landingPage.Id > 0)
            {
                List<LandingPageTemplateFile> TemplateFileList;

                using (var objBL = DLLandingPageTemplateFile.GetDLLandingPageTemplateFile(LandingPageDto.AdsId, SQLProvider))
                {
                    TemplateFileList =await objBL.GetTemplateFiles(new LandingPageTemplateFile() { LandingPageId = LandingPageDto.SourceLPId });
                }

                if (TemplateFileList != null && TemplateFileList.Count > 0)
                {
                    SaveLandingPageToAWS awsUpload = new SaveLandingPageToAWS(LandingPageDto.AdsId, landingPage.Id, landingPage.PageName, landingPageConfiguration.LandingPageName);
                    for (int i = 0; i < TemplateFileList.Count; i++)
                    {
                        LandingPageTemplateFile eachFile = TemplateFileList[i];

                        LandingPageTemplateFile TemplateFile = new LandingPageTemplateFile()
                        {
                            LandingPageId = landingPage.Id,
                            TemplateFileType = eachFile.TemplateFileType,
                            TemplateFileName = eachFile.TemplateFileName,
                            TemplateFileContent = eachFile.TemplateFileContent
                        };

                        Stream stream = new MemoryStream(eachFile.TemplateFileContent);

                        SaveLandingPageFile(LandingPageDto.AdsId, TemplateFile);
                        awsUpload.UploadFileStream(eachFile.TemplateFileName, stream);
                    }
                }
            }
            return Json(landingPage);
        }
        [HttpPost]
        private async Task SaveLandingPageFile(int AdsId, LandingPageTemplateFile TemplateFile)
        {
            using (var objBL =  DLLandingPageTemplateFile.GetDLLandingPageTemplateFile(AdsId, SQLProvider))
            {
                await objBL.Save(TemplateFile);
            }
        }

     
        [HttpPost]
        public async Task<ActionResult> LandingPageExport([FromBody] LandingPage_LandingPageExport LandingPageDto)
        {
            
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                System.Data.DataSet dataSet = new System.Data.DataSet("General");
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

                MLLandingPage landingPage = null;
                List<MLLandingPage> landingPageList;

                if (HttpContext.Session.GetString("LandingPage") != null)
                {
                    landingPage = JsonConvert.DeserializeObject<MLLandingPage>(HttpContext.Session.GetString("LandingPage"));
                }

                using (var objBL = DLLandingPage.GetDLLandingPage(LandingPageDto.AccountId, SQLProvider))
                {
                    landingPageList =await objBL.GetDetails(landingPage, LandingPageDto.OffSet, LandingPageDto.FetchNext);
                }

                string TimeZone =await Helper.GetAccountTimeZoneFromCachedMemory(domainDetails.AdsId,SQLProvider);
                var NewListData = landingPageList.Select(x => new
                {
                    PageName = x.PageName,
                    PageDescription = x.PageDescription,
                    BucketUrl = x.BucketUrl,
                    CloudFrontUrl = x.CloudFrontUrl,
                    CreatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.CreatedDate)).ToString()
                });

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTableExport();
                dataSet.Tables.Add(dtt);

                string FileName = "LandingPage_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + LandingPageDto.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (LandingPageDto.FileType.ToLower() == "csv")
                    Helper.SaveDataSetToCSV(dataSet, MainPath);
                else
                    Helper.SaveDataSetToExcel(dataSet, MainPath);

                MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

                return Json(new { Status = true, MainPath });
            }
            else
            {
                return Json(new { Status = false });
            }
        }
    }
}

