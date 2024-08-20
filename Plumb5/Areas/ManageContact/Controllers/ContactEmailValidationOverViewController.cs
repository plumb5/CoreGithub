using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.ManageContact.Dto;
using Plumb5.Areas.ManageContact.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Globalization;

namespace Plumb5.Areas.ManageContact.Controllers
{
    [Area("ManageContact")]
    public class ContactEmailValidationOverViewController : BaseController
    {
        public ContactEmailValidationOverViewController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("ContactEmailValidationOverView");
        }

        public ActionResult FileStatus()
        {
            return View("EmailVerificationStatus");
        }

        [HttpPost]
        public async Task<IActionResult> GetMaxCount([FromBody] ContactEmailValidationOverView_GetMaxCountDto details)
        {
            int returnVal;
            using (var objDL = DLContactEmailValidationOverView.GetDLContactEmailValidationOverView(details.accountId, SQLProvider))
            {
                returnVal = await objDL.GetMaxCount(details.GroupId, null, null, "");
            }
            return Json(new { returnVal });
        }
        [HttpPost]
        public async Task<IActionResult> BindContactEmailValidationOverView([FromBody] ContactEmailValidationOverView_BindContactEmailValidationOverViewDto details)
        {
            List<MLGroupEmailValidationOverView> ContactEmailValidationOverViewList = null;

            using (var objDL = DLContactEmailValidationOverView.GetDLContactEmailValidationOverView(details.accountId, SQLProvider))
            {
                ContactEmailValidationOverViewList = (await objDL.GetReportDetails(details.GroupId, details.OffSet, details.FetchNext, null, null, "")).ToList();
            }
            return Json(ContactEmailValidationOverViewList);
        }
        [HttpPost]
        public async Task<IActionResult> CheckCredits([FromBody] ContactEmailValidationOverView_CheckCreditsDto details)
        {
            var result = false; long getCredits = 0;
            var UserInfoUserId = 0;
            int Unverifiedcontactcount = 0;

            using (var objDL = DLAccount.GetDLAccount(SQLProvider))
            {
                UserInfoUserId = objDL.GetAccountDetails(details.accountId).Result.UserInfoUserId;
            }

            if (UserInfoUserId != 0)
            {
                List<MLContacts> contacts = null;

                using (var objBAL = DLContact.GetContactDetails(details.accountId, SQLProvider))
                {
                    contacts = (await objBAL.GetContactForVerification(details.GroupId)).ToList();
                }

                if (contacts != null && contacts.Count > 0)
                    Unverifiedcontactcount = contacts.Count();

                using (var objDL = DLPurchase.GetDLPurchase(SQLProvider))
                {
                    var PurchaseData = objDL.GetDailyConsumptionedDetails(details.accountId, UserInfoUserId);
                    getCredits = PurchaseData.Result.TotalEmailVerifiedRemaining;
                    result = getCredits >= Unverifiedcontactcount ? true : false;
                }
            }
            return Json(new { Status = result, Credits = getCredits }, "application/json");
        }
        [HttpPost]
        public async Task<IActionResult> GetFileDetails([FromBody] ContactEmailValidationOverView_GetFileDetailsDto details)
        {
            List<ContactEmailValidationOverViewBatchWiseDetails> ContactEmailValidationOverViewList = null;
            using (var objDL = DLContactEmailValidationOverViewBatchWiseDetails.GetDLContactEmailValidationOverViewBatchWiseDetails(details.accountId, SQLProvider))
            {
                ContactEmailValidationOverViewList = (await objDL.GetFileDetails(details.ContactEmailValidationOverViewId)).ToList();
            }
            return Json(ContactEmailValidationOverViewList);
        }

        [HttpPost]
        #region OverallOverview
        public async Task<JsonResult> GetOverAllMaxCount([FromBody] ContactEmailValidationOverView_GetOverAllMaxCountDto details)
        {
            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            int returnVal;
            using (var objDL = DLContactEmailValidationOverView.GetDLContactEmailValidationOverView(details.accountId, SQLProvider))
            {
                returnVal = await objDL.GetMaxCount(0, FromDateTime, ToDateTime, details.GroupName);
            }

            return Json(returnVal);
        }
        [HttpPost]
        public async Task<JsonResult> GetOverAllReportDetails([FromBody] ContactEmailValidationOverView_GetOverAllReportDetailsDto details)
        {
            if (!string.IsNullOrEmpty(details.GroupName))
                HttpContext.Session.SetString("GroupName", details.GroupName);

            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            List<MLGroupEmailValidationOverView> ContactEmailValidationOverViewList = null;
            using (var objDL = DLContactEmailValidationOverView.GetDLContactEmailValidationOverView(details.accountId, SQLProvider))
            {
                ContactEmailValidationOverViewList = (await objDL.GetReportDetails(0, details.OffSet, details.FetchNext, FromDateTime, ToDateTime, details.GroupName)).ToList();
            }

            return Json(ContactEmailValidationOverViewList);
        }
        [HttpPost]
        public async Task<JsonResult> GetAllGroupDetails([FromBody] ContactEmailValidationOverView_GetAllGroupDetailsDto details)
        {
            List<Groups> GroupList;
            using (var objDL = DLGroups.GetDLGroups(details.accountId, SQLProvider))
            {
                GroupList = await objDL.GetGroupList(new Groups());
            }

            return Json(GroupList);
        }
        [HttpPost]
        public async Task<JsonResult> SaveValidateGroup([FromBody] ContactEmailValidationOverView_SaveValidateGroupDto details)
        {
            int TotalSuccessCount = 0;
            string ErrorMessage = "";
            try
            {
                if (details.GroupIds != null && details.GroupIds.Length > 0)
                {
                    DateTime CreateDate = DateTime.Now;
                    ContactEmailValidationOverView validationOverView = new ContactEmailValidationOverView()
                    {
                        CreatedDate = CreateDate,
                        UpdatedDate = CreateDate,
                        Updated_At = CreateDate,
                        Status = "In Queue"
                    };

                    using (var objDL = DLContactEmailValidationOverView.GetDLContactEmailValidationOverView(details.accountId, SQLProvider))
                    {
                        for (int i = 0; i < details.GroupIds.Length; i++)
                        {
                            validationOverView.GroupId = details.GroupIds[i];
                            int SavedId = await objDL.Save(validationOverView);
                            if (SavedId > 0)
                            {
                                TotalSuccessCount++;
                            }
                        }
                    }
                }
                else
                {
                    ErrorMessage = "No group to validate";
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
            }

            return Json(new { TotalSuccessCount, ErrorMessage });
        }

        #endregion OverallOverview

        [Log]
        [HttpPost]
        public async Task<JsonResult> EmailValidationExport([FromBody] ContactEmailValidationOverView_EmailValidationExportDto details)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");

                List<MLGroupEmailValidationOverView> ContactEmailValidationList = null;

                string GroupName = "";
                DateTime fromDateTime = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime toDateTime = DateTime.ParseExact(details.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

                if (HttpContext.Session.GetString("GroupName") != null)
                {
                    GroupName = HttpContext.Session.GetString("GroupName");
                }

                using (var objDL = DLContactEmailValidationOverView.GetDLContactEmailValidationOverView(details.AccountId, SQLProvider))
                {
                    ContactEmailValidationList = (await objDL.GetReportDetails(0, details.OffSet, details.FetchNext, fromDateTime, toDateTime, GroupName)).ToList();
                }
                string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(details.AccountId, SQLProvider);
                var NewListData = ContactEmailValidationList.Select(x => new
                {
                    GroupName = x.Name,
                    CreatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.CreatedDate)).ToString(),
                    UpdatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.UpdatedDate)).ToString(),
                    UniqueEmails = x.Unique_emails,
                    TimeTaken = (x.UpdatedDate - x.CreatedDate).TotalSeconds,
                    x.Status,

                }); ;

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTableExport();
                dataSet.Tables.Add(dtt);

                string FileName = "GroupValidation_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (details.FileType.ToLower() == "csv")
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
        [HttpPost]
        public async Task<IActionResult> GetFileStatusDetails([FromBody] ContactEmailValidationOverView_GetFileStatusDetailsDto details)
        {
            EmailVerifyProviderSetting _emailVerifyProviderSetting = new EmailVerifyProviderSetting();

            using (var objEmVPS = DLEmailVerifyProviderSetting.GetDLEmailVerifyProviderSetting(details.AccountId, SQLProvider))
            {
                _emailVerifyProviderSetting = await objEmVPS.GetActiveprovider();
            }

            MillionverifierAPI hubucoAPI = new MillionverifierAPI(_emailVerifyProviderSetting);
            string status = hubucoAPI.CheckStatuByFileId(details.File_Id);
            //var OnlineReport = onlinePath + "/Dashboard/DashboardMailAlert?FromDate=" + from_getdate + "&ToDate=" + to_date + "&Domain=" + AccountName + "&Duration=" + duration + "&Guid=" + getGuid;

            return Json(hubucoAPI);
        }
    }
}
