using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Globalization;
using System.Data;
using System.IO.Compression;
using Plumb5.Areas.ManageContact.Dto;
namespace Plumb5.Areas.ManageContact.Controllers
{
    [Area("ManageContact")]
    public class ContactImportOverViewsController : BaseController
    { //
      // GET: /ManageContact/ContactImportOverViews/
        public ContactImportOverViewsController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("ContactImportOverViews");
        }
        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] ContactImportOverViews_GetMaxCountDto ContactImportOverViewsdto)
        {
            DateTime FromDateTime = DateTime.ParseExact(ContactImportOverViewsdto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(ContactImportOverViewsdto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            LoginInfo? UserDetails = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo")); 

            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            using (var objUserHierarchy =   DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchy = (await objUserHierarchy.GetHisUsers(UserDetails.UserId, ContactImportOverViewsdto.accountId)).ToList();
            }
            userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

            List<int> usersId = new List<int>();
            if (userHierarchy != null)
                usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();
            usersId.Add(UserDetails.UserId);

            string UserIdList = string.Join(",", usersId.ToArray());

            using (var objDL =   DLContactImportOverview.GetDLContactImportOverview(ContactImportOverViewsdto.accountId,SQLProvider))
            {
                return Json(await objDL.GetAllDetailsMaxCount(FromDateTime, ToDateTime, UserIdList) );
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetAllDetails([FromBody] ContactImportOverViews_GetAllDetailsDto ContactImportOverViewsdto)
        {
            DateTime FromDateTime = DateTime.ParseExact(ContactImportOverViewsdto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(ContactImportOverViewsdto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            LoginInfo? UserDetails = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchy =(await objUserHierarchy.GetHisUsers(UserDetails.UserId, ContactImportOverViewsdto.accountId)).ToList();
            }
            userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

            List<int> usersId = new List<int>();
            if (userHierarchy != null)
                usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();
            usersId.Add(UserDetails.UserId);

            string UserIdList = string.Join(",", usersId.ToArray());

            List<ContactImportOverview> contactImportDetails = null;

            using (var objDL =   DLContactImportOverview.GetDLContactImportOverview(ContactImportOverViewsdto.accountId,SQLProvider))
            {
                contactImportDetails = (await objDL.GetAllDetails(ContactImportOverViewsdto.OffSet, ContactImportOverViewsdto.FetchNext, FromDateTime, ToDateTime, UserIdList)).ToList();
            }

            if (contactImportDetails != null && contactImportDetails.Count > 0)
            {
                for (int i = 0; i < contactImportDetails.Count; i++)
                {
                    if (!string.IsNullOrEmpty(contactImportDetails[i].ContactFileName))
                        contactImportDetails[i].ContactFileName = "";
                }
            }

            return Json(contactImportDetails);
        }
        [HttpPost]
        public async Task<JsonResult> GetContactImportOverViewDetails([FromBody] ContactImportOverViews_GetContactImportOverViewDetailsDto ContactImportOverViewsdto)
        {
            using (var objDL =   DLContactImportOverview.GetDLContactImportOverview(ContactImportOverViewsdto.accountId,SQLProvider))
            {
                return Json(objDL.Get(new ContactImportOverview() { Id = ContactImportOverViewsdto.ContactImportOverviewId }));
            }
        }
        [HttpPost]
     
        public async Task<JsonResult> SampleContactFileForImport([FromBody] ContactImportOverViews_SampleContactFileForImportDto ContactImportOverViewsdto)
        {
            DataSet contactSampleDataSet = new DataSet();
            DataTable contactSampleDataTable = new DataTable();

            for (int i = 0; i < ContactImportOverViewsdto.Columns.Count; i++)
            {
                contactSampleDataTable.Columns.Add(ContactImportOverViewsdto.Columns[i]);
            }

            if (ContactImportOverViewsdto.IsExtraFieldNeed)
            {
                List<ContactExtraField> ContactExtraFieldList;

                using (var objDL =   DLContactExtraField.GetDLContactExtraField(ContactImportOverViewsdto.AccountId,SQLProvider))
                    ContactExtraFieldList = (await objDL.GetList()).ToList();

                if (ContactExtraFieldList != null && ContactExtraFieldList.Count > 0)
                {
                    for (int i = 0; i < ContactExtraFieldList.Count; i++)
                        contactSampleDataTable.Columns.Add(ContactExtraFieldList[i].FieldName);
                }

                List<LmsCustomFields> lmsContactExtraFieldList;

                using (var objDL = DLLmsCustomFields.GetDLLmsCustomFields(ContactImportOverViewsdto.AccountId,SQLProvider))
                    lmsContactExtraFieldList = (await objDL.GetDetails()).ToList();

                if (lmsContactExtraFieldList != null && lmsContactExtraFieldList.Count > 0)
                {
                    for (int i = 0; i < lmsContactExtraFieldList.Count; i++)
                        contactSampleDataTable.Columns.Add(lmsContactExtraFieldList[i].FieldName);
                }
            }

            contactSampleDataSet.Tables.Add(contactSampleDataTable);

            string FileNameFormat = "P5ContactSampleFile_" + ContactImportOverViewsdto.AccountId.ToString() + "_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff");
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileNameFormat;

            if (!(Directory.Exists(MainPath)))
            {
                Directory.CreateDirectory(MainPath);
            }

            //Create CSV File
            Helper.SaveDataSetToCSV(contactSampleDataSet, MainPath + "\\" + FileNameFormat + ".csv", ",");
            //Create XLS File
            Helper.SaveDataSetToExcel(contactSampleDataSet, MainPath + "\\" + FileNameFormat + ".xls");
            //Create XLSX File
            Helper.SaveDataSetToExcel_XLSX(contactSampleDataSet, MainPath + "\\" + FileNameFormat + ".xlsx");
            //Put ReadMe file in folder
            System.IO.File.Copy(AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\Template\\ContactSample_ReadMe.txt", MainPath + "\\ReadMe.txt");
            //Create ZIP File
            ZipFile.CreateFromDirectory(MainPath, MainPath + ".zip");
            //Delete the folder
            Directory.Delete(MainPath, true);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileNameFormat + ".zip";
            return Json(new { Status = true, MainPath });
        }
        [HttpPost]
   
        public async Task<JsonResult> ContactRejectFileExport([FromBody] ContactImportOverViews_ContactRejectFileExportDto ContactImportOverViewsdto)
        {
            DataSet contactSampleDataSet = new DataSet();
            List<ContactImportError> contactImporErrorDetails = null;

            using (var objDL = DLContactImportError.GetDLContactImportError(ContactImportOverViewsdto.AccountId,SQLProvider))
            {
                contactImporErrorDetails = (await objDL.GetList(ContactImportOverViewsdto.ImportId)).ToList();
            }
            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(ContactImportOverViewsdto.AccountId,SQLProvider);
            var NewListData = contactImporErrorDetails.Select(x => new
            {
                x.RejectReason,
                x.EmailId,
                x.PhoneNumber,
                CreatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.CreatedDate.ToString())).ToString(),
            }).CopyToDataTableExport();

            contactSampleDataSet.Tables.Add(NewListData);
            string FileName = "P5ContactRejectFile_" + Convert.ToString(ContactImportOverViewsdto.AccountId) + "_" + Convert.ToString(ContactImportOverViewsdto.ImportId) + "_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + ContactImportOverViewsdto.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (ContactImportOverViewsdto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(contactSampleDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(contactSampleDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }
        [HttpPost]
      
        public async Task<JsonResult> ContactMergeFileExport([FromBody] ContactImportOverViews_ContactMergeFileExportDto ContactImportOverViewsdto)
        {
            DataSet contactSampleDataSet = new DataSet();
            List<ContactImportMerge> contactImporMergeDetails = null;

            using (var objDL =   DLContactImportMerge.GetDLContactImportMerge(ContactImportOverViewsdto.AccountId,SQLProvider))
            {
                contactImporMergeDetails = (await objDL.GetList(ContactImportOverViewsdto.ImportId)).ToList();
            }
            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(ContactImportOverViewsdto.AccountId,SQLProvider);
            var NewListData = contactImporMergeDetails.Select(x => new
            {
                x.UniqueTag,
                FileRowNumber = x.ImportFileRowNumber,
                x.ImportEmail,
                x.ImportPhoneNumber,
                MergedEmails = x.MergedEmails.Contains(',') && x.MergedEmails.Length == 1 ? "" : x.MergedEmails,
                MergedPhoneNumbers = x.MergedPhoneNumbers.Contains(',') && x.MergedPhoneNumbers.Length == 1 ? "" : x.MergedPhoneNumbers,
                MergedAlternateEmailIds = x.MergedAlternateEmailIds.Contains(',') && x.MergedAlternateEmailIds.Length == 1 ? "" : x.MergedAlternateEmailIds,
                MergedAlternatePhoneNumbers = x.MergedAlternatePhoneNumbers.Contains(',') && x.MergedAlternatePhoneNumbers.Length == 1 ? "" : x.MergedAlternatePhoneNumbers,
                x.RetainEmail,
                x.RetainPhoneNumber,
                x.RetainAlternateEmailIds,
                x.RetainAlternatePhoneNumbers,
                CreatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.CreatedDate.ToString())).ToString(),
            }).CopyToDataTableExport();

            contactSampleDataSet.Tables.Add(NewListData);
            string FileName = "P5ContactMergeFile_" + Convert.ToString(ContactImportOverViewsdto.AccountId) + "_" + Convert.ToString(ContactImportOverViewsdto.ImportId) + "_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + ContactImportOverViewsdto.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (ContactImportOverViewsdto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(contactSampleDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(contactSampleDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }
        [HttpPost]
        public async Task<JsonResult> CheckContactSetting([FromBody] ContactImportOverViews_CheckContactSettingDto ContactImportOverViewsdto)
        {
            bool Status = false;
            ContactMergeConfiguration mergeConfiguration;
            using (var objDL =   DLContactMergeConfiguration.GetDLContactMergeConfiguration(ContactImportOverViewsdto.AccountId,SQLProvider))
            {
                mergeConfiguration = (await objDL.GetSettingDetails());
                if (mergeConfiguration != null && mergeConfiguration.Id > 0)
                {
                    Status = true;
                }
            }

            return Json(new { Status });
        }
 
        [HttpPost]
        public async Task<JsonResult> ContactImportOverViewsExport([FromBody] ContactImportOverViews_ContactImportOverViewsExportDto ContactImportOverViewsdto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null) 
            {
                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");

                List<ContactImportOverview> contactImportDetails = null;

                DateTime fromDateTime = DateTime.ParseExact(ContactImportOverViewsdto.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime toDateTime = DateTime.ParseExact(ContactImportOverViewsdto.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                LoginInfo? UserDetails = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo")); 
                List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
                using (var objUserHierarchy =   DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                {
                    userHierarchy = (await objUserHierarchy.GetHisUsers(UserDetails.UserId, ContactImportOverViewsdto.AccountId)).ToList();
                }
                userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

                List<int> usersId = new List<int>();
                if (userHierarchy != null)
                    usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();
                usersId.Add(UserDetails.UserId);

                string UserIdList = string.Join(",", usersId.ToArray());

                using (var objDL =   DLContactImportOverview.GetDLContactImportOverview(ContactImportOverViewsdto.AccountId,SQLProvider))
                {
                    contactImportDetails = (await objDL.GetAllDetails(ContactImportOverViewsdto.OffSet, ContactImportOverViewsdto.FetchNext, fromDateTime, toDateTime, UserIdList)).ToList();
                }

                string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(ContactImportOverViewsdto.AccountId,SQLProvider);
                var NewListData = contactImportDetails.Select(x => new
                {
                    FileName = x.ImportedFileName,
                    Total = x.TotalInputRow,
                    Completed = x.TotalCompletedRow,
                    Success = x.SuccessCount,
                    Merge = x.MergeCount,
                    Rejected = x.RejectedCount,
                    UpdatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.UpdatedDate)).ToString(),
                    Status = x.IsCompleted == 0 ? "Queued" : x.IsCompleted == 1 ? "Completed" : x.IsCompleted == 2 ? "In-Progress" : x.ErrorMessage
                });

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTableExport();
                dataSet.Tables.Add(dtt);

                string FileName = "ContactImportOverView_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + ContactImportOverViewsdto.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (ContactImportOverViewsdto.FileType.ToLower() == "csv")
                    Helper.SaveDataSetToCSV(dataSet, MainPath);
                else
                    Helper.SaveDataSetToExcel(dataSet, MainPath);

                MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

                return Json(new { Status = true, MainPath } );
            }
            else
            {
                return Json(new { Status = false } );
            }
        }
    }
}
