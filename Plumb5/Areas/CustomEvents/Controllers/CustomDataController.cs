using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.CustomEvents.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Data;

namespace Plumb5.Areas.CustomEvents.Controllers
{
    [Area("CustomEvents")]
    public class CustomDataController : BaseController
    {
        public CustomDataController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /CustomEvents/CustomData/

        public ActionResult Index()
        {
            return View("CustomData");
        }

        [HttpPost]
        public async Task<IActionResult> GetMaxCount([FromBody] CustomEvents_GetMaxCount commonDetails)
        {
            CustomEventImportOverview customEventImportOverview = new CustomEventImportOverview() { ImportedFileName = commonDetails.SearchName };

            int returnVal;
            using (var objBL = DLCustomEventImportOverview.GetDLCustomEventImportOverview(commonDetails.accountId, SQLProvider))
            {
                returnVal = await objBL.MaxCount(customEventImportOverview);
            }
            return Json(new { returnVal });
        }

        [HttpPost]
        public async Task<IActionResult> GetAllDetails([FromBody] CustomEvents_GetAllDetails commonDetails)
        {
            List<CustomEventImportOverview> customEventImportOverviewList = null;

            ArrayList data = new ArrayList() { commonDetails.SearchName };

            HttpContext.Session.SetString("CustomData", JsonConvert.SerializeObject(data));

            CustomEventImportOverview customEventImportOverview = new CustomEventImportOverview() { ImportedFileName = commonDetails.SearchName };
            using (var objBL = DLCustomEventImportOverview.GetDLCustomEventImportOverview(commonDetails.accountId, SQLProvider))
            {
                customEventImportOverviewList = (await objBL.GetReportData(customEventImportOverview, commonDetails.OffSet, commonDetails.FetchNext)).ToList();
            }

            var getdata = JsonConvert.SerializeObject(customEventImportOverviewList, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> RejectFileExport(int AccountId, int ImportId, string FileType)
        {
            DataSet contactSampleDataSet = new DataSet();
            List<CustomEventImportError> ImporErrorDetails = null;

            using (var objBL = DLCustomEventImportError.GetDLCustomEventImportError(AccountId, SQLProvider))
            {
                ImporErrorDetails = await objBL.GetList(ImportId);
            }
            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(AccountId, SQLProvider);
            var NewListData = ImporErrorDetails.Select(x => new
            {
                x.RejectReason,
                x.EmailId,
                x.PhoneNumber,
                CreatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.CreatedDate.ToString())).ToString(),
            }).CopyToDataTableExport();

            contactSampleDataSet.Tables.Add(NewListData);
            string FileName = "P5CustomDataRejectFile_" + Convert.ToString(AccountId) + "_" + Convert.ToString(ImportId) + "_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(contactSampleDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(contactSampleDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> CustomDataExport([FromBody] CustomEvents_CustomDataExport commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");
                List<CustomEventImportOverview> customEventImportOverviewList = null;
                string SearchName = String.Empty;


                if (HttpContext.Session.GetString("CustomData") != null)
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("CustomData"));
                    SearchName = data[0].ToString();
                }

                using (var objBL = DLCustomEventImportOverview.GetDLCustomEventImportOverview(commonDetails.AccountId, SQLProvider))
                {
                    customEventImportOverviewList = (await objBL.GetReportData(new CustomEventImportOverview() { ImportedFileName = SearchName }, commonDetails.OffSet, commonDetails.FetchNext)).ToList();
                }

                string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(commonDetails.AccountId, SQLProvider);
                var NewListData = customEventImportOverviewList.Select(x => new
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

                string FileName = "CustomData_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;

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
