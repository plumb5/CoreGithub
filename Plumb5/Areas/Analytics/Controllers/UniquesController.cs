using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Analytics.Dto;
using Plumb5.Controllers;
using System.Data;
using System.Web; 
using Plumb5GenralFunction;
using Microsoft.Identity.Client;
using Microsoft.AspNetCore.OutputCaching;
using NPOI.SS.Formula.Functions;
using System.Collections;
using System.Text.RegularExpressions;

namespace Plumb5.Areas.Analytics.Controllers
{
    [Area("Analytics")]
    public class UniquesController : BaseController
    {
        public UniquesController(IConfiguration _configuration) : base(_configuration)
        { }

        public IActionResult UniqueVisits()
        {
            return View();
        }
        [HttpPost]
        [OutputCache(Duration = 300)]
        public async Task<ActionResult> UniqueVisitsReportMaxCount([FromBody] Uniques_UniqueVisitsReportMaxCountDto UniuesDto)
        {
            try
            { 
                ArrayList exportdata = new ArrayList() { UniuesDto.action, UniuesDto.type, UniuesDto.parameter };
                HttpContext.Session.SetString("ExportData", JsonConvert.SerializeObject(exportdata));
                using (var objDL = DLUniqueVisitors.Get_Plumb5DLUniqueVisitors("", SQLProvider, UniuesDto.accountId))
                {
                    var ds = await objDL.Select_UniqueVisitsMaxCount(new _Plumb5MLUniqueVisits
                    {
                        AccountId = UniuesDto.accountId,
                        Start = UniuesDto.start,
                        End = UniuesDto.end,
                        FromDate = UniuesDto.fromdate,
                        ToDate = UniuesDto.todate,
                        Key = UniuesDto.action,
                        Data = UniuesDto.type,
                        Data2 = UniuesDto.parameter
                    });
                    var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                    return Content(getdata.ToString(), "application/json");
                }

                    
            }
            catch
            {
                return null;
            }
        }
        [HttpPost]
        [OutputCache(Duration = 300)]
        public async Task<ActionResult> UniqueVisitsReport([FromBody] Uniques_UniqueVisitsReportDto UniuesDto)
        {
            try
            {
                ArrayList exportdata = new ArrayList() { UniuesDto.action, UniuesDto.type, UniuesDto.parameter };
                HttpContext.Session.SetString("ExportData", JsonConvert.SerializeObject(exportdata));
                HttpContext.Session.SetString("DeviceExportData", JsonConvert.SerializeObject(null));
                using (var objDl= DLUniqueVisitors.Get_Plumb5DLUniqueVisitors("", SQLProvider, UniuesDto.accountId))
                {
                    var ds = await objDl.Select_UniqueVisits(new _Plumb5MLUniqueVisits
                    { 
                        AccountId = UniuesDto.accountId,
                        Start = UniuesDto.start,
                        End = UniuesDto.end,
                        FromDate = UniuesDto.fromdate,
                        ToDate = UniuesDto.todate,
                        Key = UniuesDto.action,
                        Data = UniuesDto.type,
                        Data2 = UniuesDto.parameter
                    });
                    var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                    return Content(getdata.ToString(), "application/json");
                }
                    
            }
            catch
            {
                return null;
            }
        }
        [HttpPost]
        public async Task<JsonResult> UniqueVisitsReportExport([FromBody] Uniques_UniqueVisitsReportExportDto UniuesDto)
        {
            DataSet dataset = new DataSet();
            string action = "", type = "", parameter = "", Deviceexport = "", DeviceId = "";
            if (HttpContext.Session.GetString("ExportData") != null && HttpContext.Session.GetString("ExportData") != "null")
            {
                ArrayList? exportdata = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("ExportData")); 
                action = (string?)exportdata[0];
                type = (string?)exportdata[1];
                parameter = (string?)exportdata[2];  
            }
            if (HttpContext.Session.GetString("DeviceExportData") != null&& HttpContext.Session.GetString("DeviceExportData") != "null")
            {
                ArrayList? DeviceExportData = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("DeviceExportData"));
                Deviceexport = (string?)DeviceExportData[0];  
                DeviceId = (string?)DeviceExportData[1];   
            }
            string FileName = "", MainPath = "";
            DataTable resultDataTable = new DataTable();
            DataSet resultDataSet = new DataSet();
          
            string TimeZone = (await Helper.GetAccountTimeZoneFromCachedMemory(UniuesDto.AccountId, SQLProvider)).ToString();
            if (Deviceexport == "")
            {
                using (var objDl=DLUniqueVisitors.Get_Plumb5DLUniqueVisitors("", SQLProvider, UniuesDto.AccountId))
                {
                   dataset=await objDl.Select_UniqueVisits(new _Plumb5MLUniqueVisits()
                    {
                        AccountId = UniuesDto.AccountId,
                        FromDate = UniuesDto.FromDateTime,
                        ToDate = UniuesDto.TodateTime,
                        Start = UniuesDto.OffSet,
                        End = UniuesDto.FetchNext,
                        Key = action,
                        Data = type,
                        Data2 = parameter
                    });

                }
                 
                int RowNo = 1;
                resultDataTable = (from dataRow in dataset.Tables[0].Select()
                                   select new
                                   {
                                       SLNo = RowNo++,
                                       Visitor = Convert.ToString(dataRow["Visitor"]),
                                       City = Convert.ToString(dataRow["City"]),
                                       Session = Convert.ToString(dataRow["Session"]),
                                       Recency = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(dataRow["Recency"])).Value.Date,
                                       AverageTime = Helper.AverageTime(Convert.ToDecimal(String.IsNullOrEmpty(dataRow["AvgTime"].ToString()) ? "0" : dataRow["AvgTime"]))
                                   }).CopyToDataTableExport();

                resultDataSet.Tables.Add(resultDataTable);
                action = action == "Others" ? "" : action;

                FileName = "UniqueVisitsReport_" + action + "_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + UniuesDto.FileType;
                MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            }
            else if (Deviceexport == "DeviceExport")
            {
                string ConnectionStr = (await Plumb5.Models.AccountDetails.GetAccountConnection(UniuesDto.AccountId, SQLProvider)).ToString();

                //DataSet ReturnDataSet = new DataSet();
                DataSet ds;
                using (var objDl = DLUniqueVisitors.Get_Plumb5DLUniqueVisitors(ConnectionStr, SQLProvider))
                {
                    ds = await objDl.SelectDeviceUniqueVisits(new _Plumb5MLUniqueVisits
                    {
                        FromDate = UniuesDto.FromDateTime,
                        ToDate = UniuesDto.TodateTime,
                        Start = UniuesDto.OffSet,
                        End = UniuesDto.FetchNext,
                        Data = DeviceId
                    });

                }
                 
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    List<int> ListOfDeviceIds = ds.Tables[0].AsEnumerable().Select(x => Convert.ToInt32(x["DeviceId"])).ToList();
                    List<DeviceInfo> deviceInfoDataList;
                    using (var objDlInfo= DLDeviceInfo.GetDLDeviceInfo( SQLProvider))
                    {
                        deviceInfoDataList = await objDlInfo.GetDeviceInfoByDeviceId(ListOfDeviceIds); 
                    }
                     
                    if (deviceInfoDataList != null && deviceInfoDataList.Count > 0)
                        resultDataTable = (
                                           from dataRow in ds.Tables[0].AsEnumerable()
                                           join DeviceData in deviceInfoDataList on (int)dataRow["DeviceId"] equals DeviceData.DId
                                           where DeviceData.DId == Convert.ToInt32(DeviceId)
                                           select new
                                           {
                                               Visitor = Convert.ToString(dataRow["Visitor"]),
                                               MachineId = Convert.ToString(dataRow["MachineId"]),
                                               City = Convert.ToString(dataRow["City"]),
                                               Session = Convert.ToString(dataRow["Session"]),
                                               Recency = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(dataRow["Recency"])).Value.Date,
                                               AverageTime = Helper.AverageTime(Convert.ToDecimal(String.IsNullOrEmpty(dataRow["AvgTime"].ToString()) ? "0" : dataRow["AvgTime"]))
                                           }).CopyToDataTableExport();

                    resultDataSet.Tables.Add(resultDataTable);

                    FileName = "DeviceUniqueVisitsReport_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + UniuesDto.FileType;
                    MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                }
            }


            if (UniuesDto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);
            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });

        }
        [HttpPost]
        [OutputCache(Duration = 300)]
        public async Task<ActionResult> CachedUniqueVisitsGetMaxCount([FromBody] Uniques_CachedUniqueVisitsGetMaxCountDto UniuesDto )
        {
            string ConnectionStr = (await Plumb5.Models.AccountDetails.GetAccountConnection(UniuesDto.accountId, SQLProvider)).ToString();
            try
            {
                DataSet ds = null;
                using (var objDl = DLUniqueVisitors.Get_Plumb5DLUniqueVisitors(ConnectionStr, SQLProvider))
                {
                    ds = await objDl.GetCachedUniqueVisitsMaxCount(new _Plumb5MLUniqueVisits()
                    {
                        AccountId = UniuesDto.accountId,
                        FromDate = UniuesDto.fromdate,
                        ToDate = UniuesDto.todate,
                        Key = UniuesDto.type,
                        Data = UniuesDto.parameter
                    });

                }
                 
                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }
        [HttpPost]
        [OutputCache(Duration = 300)]
        public async Task<ActionResult> UniqueVisitsCachedReport([FromBody] Uniques_UniqueVisitsCachedReportDto UniuesDto)
        {
            string ConnectionStr = (await Plumb5.Models.AccountDetails.GetAccountConnection(UniuesDto.accountId, SQLProvider)).ToString();
            try
            {
                DataSet ds = null;
                using (var objDl = DLUniqueVisitors.Get_Plumb5DLUniqueVisitors(ConnectionStr, SQLProvider))
                {
                    ds = await objDl.GetCachedUniqueVisits(new _Plumb5MLUniqueVisits()
                    {
                        AccountId = UniuesDto.accountId,
                        FromDate = UniuesDto.fromdate,
                        ToDate = UniuesDto.todate,
                        Start = UniuesDto.OffSet,
                        End = UniuesDto.FetchNext,
                        Key = UniuesDto.type,
                        Data = UniuesDto.parameter
                    });

                }
                 
                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }
        [HttpPost]
        public async Task<ActionResult> DeviceUniqueVisitsReportMaxCount([FromBody] Uniques_DeviceUniqueVisitsReportMaxCountDto UniuesDto)
        {
            string ConnectionStr = (await Plumb5.Models.AccountDetails.GetAccountConnection(UniuesDto.accountId, SQLProvider)).ToString();
            try
            {

                DataSet ds;
                DataSet ReturnDataSet = new DataSet();
                var ReturnDataTable = new DataTable
                {
                    Columns = { { "TotalRows", typeof(int) } }
                };
                ReturnDataTable.Rows.Add(0);
                ReturnDataSet.Tables.Add(ReturnDataTable);
                using (var objDl = DLUniqueVisitors.Get_Plumb5DLUniqueVisitors(ConnectionStr, SQLProvider))
                {
                    ds = await objDl.SelectUnique_DeviceDetailsCount(new _Plumb5MLGetDevices
                    {
                        FromDate = Convert.ToDateTime(UniuesDto.fromdate),
                        ToDate = Convert.ToDateTime(UniuesDto.todate)
                    });

                } 
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    List<int> ListOfDeviceIds = ds.Tables[0].AsEnumerable().Select(x => Convert.ToInt32(x["DeviceId"])).ToList();
                    List<DeviceInfo> deviceInfoDataList;
                    
                    using (var objDlInfo = DLDeviceInfo.GetDLDeviceInfo(SQLProvider))
                    {
                        deviceInfoDataList = await objDlInfo.GetDeviceInfoByDeviceId(ListOfDeviceIds);
                    }
                    if (deviceInfoDataList != null && deviceInfoDataList.Count > 0)
                    {
                        var results = (from SessionData in ds.Tables[0].AsEnumerable()
                                       join DeviceData in deviceInfoDataList on (int)SessionData["DeviceId"] equals DeviceData.DId
                                       where DeviceData.DId == Convert.ToInt32(UniuesDto.DeviceId)
                                       select new
                                       {
                                           DeviceId = DeviceData.DId
                                       }).ToList();

                        if (results != null && results.Count > 0)
                        {
                            ReturnDataSet.Tables[0].Rows[0][0] = results.Count;
                        }
                    }
                }
                var getdata = JsonConvert.SerializeObject(ReturnDataSet, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }
        [HttpPost]
        public async Task<ActionResult> DeviceUniqueVisitsReport([FromBody] Uniques_DeviceUniqueVisitsReportDto UniuesDto)
        {
            string ConnectionStr = (await Plumb5.Models.AccountDetails.GetAccountConnection(UniuesDto.accountId, SQLProvider)).ToString();
            try
            {
                DataSet ReturnDataSet = new DataSet();
                DataSet ds;
                using (var objDl = DLUniqueVisitors.Get_Plumb5DLUniqueVisitors(ConnectionStr, SQLProvider))
                {
                    ds = await objDl.SelectDeviceUniqueVisits(new _Plumb5MLUniqueVisits
                    {
                        FromDate = UniuesDto.fromdate,
                        ToDate = UniuesDto.todate,
                        Start = UniuesDto.start,
                        End = UniuesDto.end,
                        Data = UniuesDto.DeviceId
                    });

                }
                 
               
                ArrayList DeviceExportData = new ArrayList() { "DeviceExport", UniuesDto.DeviceId };
                HttpContext.Session.SetString("DeviceExportData", JsonConvert.SerializeObject(DeviceExportData));
                HttpContext.Session.SetString("ExportData", JsonConvert.SerializeObject(null));
                 
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    List<int> ListOfDeviceIds = ds.Tables[0].AsEnumerable().Select(x => Convert.ToInt32(x["DeviceId"])).ToList();
                    List<DeviceInfo> deviceInfoDataList;
                    using (var objDlInfo = DLDeviceInfo.GetDLDeviceInfo(SQLProvider))
                    {
                        deviceInfoDataList = await objDlInfo.GetDeviceInfoByDeviceId(ListOfDeviceIds);
                    }
                    if (deviceInfoDataList != null && deviceInfoDataList.Count > 0)
                    {
                        var results = (from SessionData in ds.Tables[0].AsEnumerable()
                                       join DeviceData in deviceInfoDataList on (int)SessionData["DeviceId"] equals DeviceData.DId
                                       where DeviceData.DId == Convert.ToInt32(UniuesDto.DeviceId)
                                       select new MLDeviceUniqueVisits
                                       {
                                           Visitor = (string)SessionData["Visitor"],
                                           MachineId = (string)SessionData["MachineId"],
                                           City = (string)SessionData["City"],
                                           Session = (Int64)SessionData["Session"],
                                           Recency = (DateTime)SessionData["Recency"],
                                           AvgTime = (decimal)SessionData["AvgTime"]
                                       }).CopyToDataTable();

                        if (results != null && results.Rows.Count > 0)
                        {
                            ReturnDataSet.Tables.Add(results);
                        }
                    }
                }


                var getdata = JsonConvert.SerializeObject(ReturnDataSet, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }
    }
}
