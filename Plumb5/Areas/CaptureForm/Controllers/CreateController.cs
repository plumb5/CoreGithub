using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.CaptureForm.Dto;
using Plumb5.Areas.CaptureForm.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;

namespace Plumb5.Areas.CaptureForm.Controllers
{
    [Area("CaptureForm")]
    public class CreateController : BaseController
    {
        public CreateController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /CaptureForm/Create/

        public ActionResult Index()
        {
            return View("Create");
        }

        public ActionResult EmbeddedForm()
        {
            return View("EmbeddedForm");
        }

        public ActionResult PopUpForm()
        {
            return View("PopUpForm");
        }

        public ActionResult ConfigureTaggedForm()
        {
            return View("ConfigureTaggedForm");
        }

        public ActionResult TaggedForm()
        {
            return View("TaggedForm");
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveFormBannerHtmlDetails([FromBody] CreateDto_SaveFormBannerHtmlDetails commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            commonDetails.formdetails.UserInfoUserId = user.UserId;
            commonDetails.formdetails.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(AccountId, user.UserId, user.UserName, user.EmailId, "ManageEmbedForm", "CaptureForm", "SaveFormDetails", Helper.GetIP(), JsonConvert.SerializeObject(new { formdetails = formdetails, rulesData = rulesData, bannerDetails = bannerDetails, responseSettings = responseSettings, mailSettings = mailSettings }));
            //#endregion
            FormRules formRules = new FormRules();
            GenralFormDetails saveForm = new GenralFormDetails(commonDetails.AccountId, user.UserId, SQLProvider);
            Helper.CopyWithDateTimeWhenString(commonDetails.rulesData, formRules);
            List<FormBanner> bannerList = new List<FormBanner>() { commonDetails.bannerDetails };

            if (user != null)
            {
                await saveForm.SaveAllDetailsOfForm(commonDetails.formdetails, formRules, bannerList, commonDetails.responseSettings, commonDetails.mailSettings, commonDetails.WebHookData, commonDetails.DeletedWebhookId, commonDetails.RuleChecking);
                //LogMessage = "Form Details saved successfully";
            }
            else
            {
                saveForm.Status = false;
                saveForm.ErrorMessage = "Session Expired";
                //LogMessage = "Unable to save Form Details";
            }
            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { saveForm = saveForm }), LogMessage);
            return Json(saveForm);
        }

        [HttpPost]
        public async Task<JsonResult> GetFormDetails([FromBody] CreateDto_GetFormDetails commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            GenralFormDetails saveForm = new GenralFormDetails(commonDetails.AccountId, user.UserId, SQLProvider);

            if (user != null)
            {
                await saveForm.GetFormDetailsRules(commonDetails.FormId);
                await saveForm.GetBannerDetails(commonDetails.FormId);
            }
            else
            {
                saveForm.Status = false;
                saveForm.ErrorMessage = "Session Expired";
            }

            return Json(saveForm);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> UploadFile()
        {
            string filePath = "";
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(account.AdsId, user.UserId, user.UserName, user.EmailId, "CommonDetailsForForms", "CaptureForm", "SaveOrUpdateFormFields", Helper.GetIP(), Request.Url.AbsoluteUri.ToString());
            //#endregion

            if (Request.Form.Files.Any())
            {
                // Get the uploaded image from the Files collection
                var httpPostedFile = Request.Form.Files["UploadedImage"];

                if (httpPostedFile != null)
                {
                    string fileExtension = Path.GetExtension(httpPostedFile.FileName).ToLower();
                    List<string> fileExtensionList = new List<string>() { ".jpeg", ".jpg", ".gif", ".bmp", ".png", ".pdf", ".xls", ".xlsx", ".doc", ".docx", ".ppt", ".pptx", ".txt", ".csv", ".jpe", ".webp" };
                    if (fileExtensionList.Contains(fileExtension))
                    {
                        List<string> presentExtensionList = Helper.GetFileExtensionFromFileStream(httpPostedFile.OpenReadStream());
                        if (presentExtensionList != null && fileExtensionList.Any(presentExtensionList.Contains))
                        {
                            SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(account.AdsId, "ClientImages");
                            string fileName = httpPostedFile.FileName;
                            Tuple<string, string> tuple = await awsUpload.UploadClientFiles(fileName, httpPostedFile.OpenReadStream());

                            if (tuple != null && !String.IsNullOrEmpty(tuple.Item2))
                            {
                                filePath = tuple.Item2;
                            }

                            //if (filePath.Length > 0)
                            //    LogMessage = "File uploaded successfully";
                            //else
                            //    LogMessage = "Unable to upload the file";
                        }
                    }
                }
            }

            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { filePath = filePath }), LogMessage);
            return Json(new
            {
                filePath
            });
        }
    }
}
