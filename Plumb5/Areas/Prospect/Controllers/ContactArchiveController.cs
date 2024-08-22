using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Prospect.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Data;
using System.Globalization;
using System.IO.Compression;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class ContactArchiveController : BaseController
    {
        public ContactArchiveController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /Prospect/ContactArchive/

        public ActionResult Index()
        {
            return View("ContactArchive");
        }

        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] ContactArchiveDto_GetMaxCount commonDetails)
        {
            DateTime FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            int returnVal;
            using (var objDL = DLLmsContactRemoveOverview.GetDLLmsContactRemoveOverview(commonDetails.accountId, SQLProvider))
            {
                returnVal = await objDL.GetAllDetailsMaxCount(FromDateTime, ToDateTime, await GetAllUsersByUserId(commonDetails.UserId, commonDetails.accountId));
            }
            return Json(new
            {
                returnVal
            });

        }

        [HttpPost]
        public async Task<JsonResult> GetReportData([FromBody] ContactArchiveDto_GetReportData commonDetails)
        {
            List<LmsContactRemoveOverview> lmscontactRemoveDetails = null;
            DateTime FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            HttpContext.Session.SetInt32("UserId", commonDetails.UserId);
         
            using (var objDL = DLLmsContactRemoveOverview.GetDLLmsContactRemoveOverview(commonDetails.accountId, SQLProvider))
            {
                lmscontactRemoveDetails = await objDL.GetAllDetails(FromDateTime, ToDateTime, commonDetails.OffSet, commonDetails.FetchNext, await GetAllUsersByUserId(commonDetails.UserId, commonDetails.accountId));

            }

            return Json(lmscontactRemoveDetails);
        }

        public async Task<string> GetAllUsersByUserId(int UserId, int AccountId)
        {
            string userId = "";
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchy = await objUserHierarchy.GetHisUsers(UserId, AccountId);
                userHierarchy.Add(await objUserHierarchy.GetHisDetails(UserId));
            }
            userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

            List<int> usersId = new List<int>();
            if (userHierarchy != null)
                usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();

            userId = string.Join(",", usersId.ToArray());

            if (String.IsNullOrEmpty(userId))
                userId = UserId.ToString();
            return userId;
        }

        [HttpPost]
        public async Task<JsonResult> GetContactImportOverViewDetails([FromBody] ContactArchiveDto_GetContactImportOverViewDetails commonDetails)
        {
            LmsContactRemoveOverview? lmsContactRemoveOverview = null;

            using (var objDL = DLLmsContactRemoveOverview.GetDLLmsContactRemoveOverview(commonDetails.accountId, SQLProvider))
            {
                lmsContactRemoveOverview = await objDL.Get(new LmsContactRemoveOverview() { Id = commonDetails.LmsContactRemoveOverviewId });
            }

            return Json(lmsContactRemoveOverview);
        }

        [Log]
        [HttpPost]
        public JsonResult SampleCSVFileForImport([FromBody] ContactArchiveDto_SampleCSVFileForImport commonDetails)
        {
            DataSet contactSampleDataSet = new DataSet();
            DataTable dataTable = new DataTable();
            for (int i = 0; i < commonDetails.Columns.Count; i++)
            {
                dataTable.Columns.Add(commonDetails.Columns[i]);
            }

            contactSampleDataSet.Tables.Add(dataTable);

            string FileNameFormat = "P5LMSContactArchiveSampleFile_" + commonDetails.AdsId.ToString() + "_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff");
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
        public async Task<JsonResult> GetContactImportRejectDetailsCount([FromBody] ContactArchiveDto_GetContactImportRejectDetailsCount commonDetails)
        {
            using (var objDL = DLLmsContactArchiveRejectedDetails.GetDLLmsContactArchiveRejectedDetails(commonDetails.AdsId, SQLProvider))
            {
                return Json(await objDL.GetMaxCount(commonDetails.LmsContactRemoveOverViewId));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetContactImportRejectDetails([FromBody] ContactArchiveDto_GetContactImportRejectDetails commonDetails)
        {
            List<LmsContactArchiveRejectedDetails> contactRemoveErrorDetails = null;

            using (var objDL = DLLmsContactArchiveRejectedDetails.GetDLLmsContactArchiveRejectedDetails(commonDetails.AdsId, SQLProvider))
            {
                contactRemoveErrorDetails = await objDL.GetList(commonDetails.LmsContactRemoveOverViewId, commonDetails.OffSet, commonDetails.FetchNext);
            }

            return Json(contactRemoveErrorDetails);

        }

        [Log]
        [HttpPost]
        public async Task<ActionResult> ImportFile()
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            string Message = ""; bool Status = false;
            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "Save", "ContactArchive", "SaveFile", Helper.GetIP(), "");
            //#endregion
            try
            {
                var upload = this.Request.Form.Files[0];
                var fileName = Request.Form.Files[0] != null ? Request.Form.Files[0].FileName : "";
                var fileExtension = System.IO.Path.GetExtension(Request.Form.Files[0] != null ? Request.Form.Files[0].FileName : "").ToLower();
                if (fileExtension == ".csv" || fileExtension == ".xls" || fileExtension == ".xlsx")
                {
                    var fullPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + fileName;

                    using (var fileStream = new FileStream(fullPath, FileMode.Create))
                    {
                        await upload.CopyToAsync(fileStream);
                    }

                    //upload?.CopyToAsync(Request.Form.Files[0].OpenReadStream());

                    LmsContactRemoveOverview lmscontact = new LmsContactRemoveOverview();
                    DataSet dsExcelFields = Helper.ExcelOrCsvConnReadDs(fullPath);
                    if (dsExcelFields != null && dsExcelFields.Tables.Count > 0 && dsExcelFields.Tables[0].Columns.Count > 0)
                    {
                        if (dsExcelFields.Tables[0].Rows.Count <= 100000)
                        {
                            try
                            {
                                using (var objDL = DLLmsContactRemoveOverview.GetDLLmsContactRemoveOverview(domainDetails.AdsId, SQLProvider))
                                {
                                    FileStream stream = System.IO.File.OpenRead(fullPath);
                                    byte[] fileBytes = new byte[stream.Length];

                                    stream.Read(fileBytes, 0, fileBytes.Length);
                                    stream.Close();

                                    lmscontact.UserInfoUserId = user.UserId;
                                    lmscontact.UserGroupId = 0;
                                    lmscontact.ContactFileName = "";
                                    lmscontact.ImportedFileName = fileName;
                                    lmscontact.IsCompleted = 0;
                                    lmscontact.TotalInputRow = 0;
                                    lmscontact.TotalCompletedRow = 0;
                                    lmscontact.FileContent = fileBytes;
                                    lmscontact.Id = await objDL.Save(lmscontact);
                                }

                                if (lmscontact.Id > 0)
                                {
                                    System.IO.File.Delete(fullPath);

                                    Message = "Remove process has started!You can see the Remove process in sometime!!";
                                    Status = true;
                                }
                                else
                                {
                                    Message = "No record found or format is wrong";
                                    Status = false;
                                }
                            }
                            catch (Exception ex)
                            {
                                Message = "No record found or format is wrong";
                                Status = false;
                            }
                        }
                        else
                        {
                            Message = "Contacts are fine but it contains more than one lakh rows.Please import one lakh contacts to remove at a time.";
                        }
                    }
                    else
                    {
                        Message = "No record found or format is wrong";
                        Status = false;
                    }


                    return Json(new { Status = Status, Message = Message });
                }
                else
                {
                    return Json(new { Status = Status, Message = "File is not in correct format. Please upload only xls, xlsx and csv." });
                }
            }

            catch (Exception ex)
            {
                //TrackLogs.UpdateLogs(LogId, "Unable to save file " + ex.ToString(), LogMessage);
                return Json(new { Status = false, Message = Message });
            }
        }

        [Log]
        [HttpPost]
        public async Task<ActionResult> DownloadArchive([FromBody] ContactArchiveDto_DownloadArchive commonDetails)
        {
            LmsContactRemoveOverview? lmsContactRemoveOverview = null;

            using (var objDL = DLLmsContactRemoveOverview.GetDLLmsContactRemoveOverview(commonDetails.accountId, SQLProvider))
            {
                lmsContactRemoveOverview = await objDL.Get(new LmsContactRemoveOverview() { Id = commonDetails.LmsContactRemoveOverviewId });
            }

            string fullPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + commonDetails.ImportedFileName;

            var fileBytes = lmsContactRemoveOverview.FileContent;

            using (Stream file = System.IO.File.OpenWrite(fullPath))
            {
                file.Write(fileBytes, 0, fileBytes.Length);
            }

            var MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "/TempFiles/" + commonDetails.ImportedFileName;

            return Json(new { Status = true, File = MainPath });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ContactArchiveExport([FromBody] ContactArchiveDto_ContactArchiveExport commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");
                int UserId = 0;
                List<LmsContactRemoveOverview> lmscontactRemoveDetails = null;

                DateTime fromDateTime = DateTime.ParseExact(commonDetails.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime toDateTime = DateTime.ParseExact(commonDetails.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                if (HttpContext.Session.GetString("UserId") != null)
                { 
                    UserId = Convert.ToInt32(HttpContext.Session.GetInt32("UserId"));   
                }
                using (var objDL = DLLmsContactRemoveOverview.GetDLLmsContactRemoveOverview(commonDetails.AccountId, SQLProvider))
                {
                    lmscontactRemoveDetails = await objDL.GetAllDetails(fromDateTime, toDateTime, commonDetails.OffSet, commonDetails.FetchNext, await GetAllUsersByUserId(UserId, commonDetails.AccountId));

                }
                string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(commonDetails.AccountId, SQLProvider);
                var NewListData = lmscontactRemoveDetails.Select(x => new
                {
                    FileName = x.ImportedFileName,
                    Total = x.TotalInputRow,
                    Completed = x.TotalCompletedRow,
                    Success = x.SuccessCount,
                    Rejected = x.RejectedCount,
                    UpdatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.UpdatedDate)).ToString(),
                    Status = x.IsCompleted == 0 ? "Queued" : x.IsCompleted == 1 ? "Completed" : x.IsCompleted == 2 ? "In-Progress" : x.ErrorMessage
                });

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTableExport();
                dataSet.Tables.Add(dtt);

                string FileName = "ContactArchive_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (commonDetails.FileType.ToLower() == "csv")
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
