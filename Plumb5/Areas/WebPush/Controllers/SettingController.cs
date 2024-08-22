using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using Microsoft.Web.Administration;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.WebPush.Dto;
using Plumb5.Areas.WebPush.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Globalization;
using System.Text;

namespace Plumb5.Areas.WebPush.Controllers
{
    [Area("WebPush")]
    public class SettingController : BaseController
    {
        public SettingController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("Setting");
        }
        [HttpPost]
        public async Task<JsonResult> GetAccountDetails([FromBody] Setting_GetAccountDetailsDto details)
        {
            using (var objDL = DLAccount.GetDLAccount(SQLProvider))
            {
                return Json(await objDL.GetAccountDetails(details.accountId));
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetSettingDetails([FromBody] Setting_GetSettingDetailsDto details)
        {
            using (var objDL = DLWebPushSubscriptionSetting.GetDLWebPushSubscriptionSetting(details.accountId, SQLProvider))
            {
                return Json(await objDL.Get());
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveWebPushSetting([FromBody] Setting_SaveWebPushSettingDto details)
        {
            bool Status = false;
            string Message = "Something went wrong. Please try again.";

            if (!details.IsDomainPresent && details.subscriptionSetting.WebPushStep.ToUpper() == "STEP2" && details.subscriptionSetting.HttpOrHttpsPush.ToUpper() == "HTTP")
            {
                string PushMainDomain = Convert.ToString(AllConfigURLDetails.KeyValueForConfig["PUSH_MAIN_DOMAIN"]);
                string PushSubDomain = details.subscriptionSetting.Step2ConfigurationSubDomain;
                string PushFolder = Convert.ToString(AllConfigURLDetails.KeyValueForConfig["PUSH_MAIN_DOMAIN_PATH"]);
                string PushMainDomainSiteName = Convert.ToString(AllConfigURLDetails.KeyValueForConfig["PUSH_MAIN_DOMAIN_SITENAME"]);

                string FullDomainName = PushSubDomain + "." + PushMainDomain;

                bool DomainCheck = true;
                using (var objDL = DLAccount.GetDLAccount(SQLProvider))
                {
                    DomainCheck = await objDL.CheckWebPushSubDomain(FullDomainName);
                }

                if (DomainCheck)
                {
                    Status = false;
                    Message = "Given SubDomain is already taken";
                    return Json(new { Status, Message, details.subscriptionSetting });
                }
                else
                {
                    DomainCheck = CheckAndCreateSubDomain(details.accountId, PushMainDomainSiteName, FullDomainName, PushMainDomain, PushFolder);
                }

                if (!DomainCheck)
                {
                    Status = false;
                    Message = "Given SubDomain is not able to create";
                    return Json(new { Status, Message, details.subscriptionSetting });
                }
            }

            if (details.subscriptionSetting.Id <= 0)
            {
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                details.subscriptionSetting.UserInfoUserId = user.UserId;
                details.subscriptionSetting.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;

                using (var objDL = DLWebPushSubscriptionSetting.GetDLWebPushSubscriptionSetting(details.accountId, SQLProvider))
                {
                    details.subscriptionSetting.Id = await objDL.Save(details.subscriptionSetting);
                }

                if (details.subscriptionSetting.Id > 0)
                {
                    Status = true;
                }
                else
                {
                    Status = false;
                    Message = "Not able to save setting";
                }
            }
            else
            {
                using (var objDL = DLWebPushSubscriptionSetting.GetDLWebPushSubscriptionSetting(details.accountId, SQLProvider))
                {
                    Status = await objDL.Update(details.subscriptionSetting);
                }
                if (!Status)
                {
                    Message = "Not able to save setting";
                }
            }

            if (Status == true)
            {
                WebPushSettings webpushSettings = new WebPushSettings()
                {
                    ProviderName = "vapid",
                    Status = 1,
                    VapidPublicKey = AllConfigURLDetails.KeyValueForConfig["VAPID_PUBLIC_KEY"].ToString(),
                    VapidPrivateKey = AllConfigURLDetails.KeyValueForConfig["VAPID_PRIVATE_KEY"].ToString(),
                    VapidSubject = AllConfigURLDetails.KeyValueForConfig["VAPID_SUBJECT"].ToString()
                };
                using (var objDL = DLWebPushSettings.GetDLWebPushSettings(details.accountId, SQLProvider))
                {
                    objDL.Save(webpushSettings);
                }
            }

            return Json(new { Status, Message, details.subscriptionSetting });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Delete([FromBody] Setting_DeleteDto details)
        {
            using (var objDL = DLWebPushSubscriptionSetting.GetDLWebPushSubscriptionSetting(details.accountId, SQLProvider))
            {
                return Json(await objDL.Delete(details.subscriptionSettingId));
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> UploadSettingIcons(int accountId)
        {
            bool FileStatus = false;
            string Message = "";
            string UploadedFileName = "";
            string SavedFileName = "";
            try
            {

                var httpPostedFile = Request.Form.Files;
                if (httpPostedFile.Count > 0 && httpPostedFile != null)
                {
                    //HttpFileCollectionBase uploadedfiles = HttpContext.Request.Files;

                    var FileName = Path.GetFileNameWithoutExtension(httpPostedFile[0].FileName);
                    var fileExtension = Path.GetExtension(httpPostedFile[0].FileName);
                    List<string> fileExtensionList = new List<string>() { ".jpeg", ".jpg", ".png" };

                    if (fileExtensionList.Contains(fileExtension))
                    {

                        SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(accountId, "ClientImages");
                        Tuple<string, string> tuple = await awsUpload.UploadClientFiles(fileExtension, httpPostedFile[0].OpenReadStream());

                        string IconImageName = "";
                        if (tuple != null && !String.IsNullOrEmpty(tuple.Item2))
                        {
                            IconImageName = tuple.Item2;
                        }

                        //string PhyPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString() + "\\images\\ClientImages\\";
                        //string IconImageName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "_" + uploadedfiles[0].FileName;
                        //uploadedfiles[0].SaveAs(PhyPath + IconImageName);
                        FileStatus = true;
                        SavedFileName = IconImageName;
                        UploadedFileName = httpPostedFile[0].FileName;

                    }
                    else
                    {
                        FileStatus = false;
                        Message = "Invalid file format found";
                    }
                }
                else
                {
                    FileStatus = false;
                    Message = "Invalid file format found";
                }
            }
            catch (Exception ex)
            {
                FileStatus = false;
                Message = ex.Message;
            }

            return Json(new { FileStatus, Message, SavedFileName, UploadedFileName });
        }

        public bool CheckAndCreateSubDomain(int accountId, string MainSitename, string SubDomainUrl, string MainDomainName, string MainFolderPath)
        {
            try
            {
                ServerManager serverMgr = new ServerManager();
                Site mySite = serverMgr.Sites[MainSitename];
                mySite.Bindings.Add("*:80:" + SubDomainUrl, "https");
                mySite.ServerAutoStart = true;
                serverMgr.CommitChanges();

                using (var objDL = DLAccount.GetDLAccount(SQLProvider))
                {
                    objDL.AddWebPushSubDomain(accountId, SubDomainUrl);
                }

                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
