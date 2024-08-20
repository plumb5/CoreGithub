using Microsoft.AspNetCore.Mvc;
using P5GenralML;
using P5GenralDL;
using Plumb5.Controllers;
using System.Globalization;
using System.Data;
using System.Collections;
using Microsoft.DotNet.Scaffolding.Shared.CodeModifier.CodeChange;
using Newtonsoft.Json;
using Plumb5GenralFunction;
using Plumb5.Areas.Analytics.Dto;

namespace Plumb5.Areas.Analytics.Controllers
{
    [Area("Analytics")]
    public class AnalyticReportsController : BaseController
    {
        public AnalyticReportsController(IConfiguration _configuration) : base(_configuration)
        { }

        //Analytics/AnalyticReports
        public IActionResult Index()
        {
            return View("AnalyticReports");
        }

        [HttpPost]
        public async Task<JsonResult> GetSavedReports([FromBody] GetSavedReportsDto analyticReportsDto)
        {
            List<AnalyticReports> fieldDetails = null;

            using var objDL = DLAnalyticReports.GetDLAnalyticReports(analyticReportsDto.AccountId, SQLProvider);
            fieldDetails = await objDL.GetAnalyticsSaveReport(await GetAllUsersByUserId(analyticReportsDto.UserId, analyticReportsDto.AccountId));

            return Json(fieldDetails);
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
        public async Task<JsonResult> DeleteSavedSearch([FromBody] DeleteSavedSearchDto analyticReportsDto)
        {
            using (var objreports = DLAnalyticReports.GetDLAnalyticReports(analyticReportsDto.AccountId, SQLProvider))
            {
                return Json(await objreports.DeleteSavedSearch(analyticReportsDto.Id));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetFilterConditionDetails([FromBody] GetFilterConditionDetailsDto analyticReportsDto)
        {
            using (var objLmsLeads = DLAnalyticReports.GetDLAnalyticReports(analyticReportsDto.AccountId, SQLProvider))
            {
                return Json(await objLmsLeads.GetFilterConditionDetails(analyticReportsDto.FilterConditionId));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] GetMaxCountDto analyticReportsDto)
        {
            int maxCount = 0;
            DateTime fromDateTime = DateTime.ParseExact(analyticReportsDto.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime toDateTime = DateTime.ParseExact(analyticReportsDto.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            using (var objDL = DLAnalyticReports.GetDLAnalyticReports(analyticReportsDto.AccountId, SQLProvider))
            {
                maxCount = await objDL.GetMaxCount(analyticReportsDto.filterLead, analyticReportsDto.Groupby, fromDateTime, toDateTime);
            }

            return Json(maxCount);
        }

        [HttpPost]
        public async Task<ActionResult> GetAnalyticSaveReports([FromBody] GetAnalyticSaveReportsDto analyticReportsDto)
        {
            DateTime fromDateTime = DateTime.ParseExact(analyticReportsDto.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime toDateTime = DateTime.ParseExact(analyticReportsDto.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DataSet dataSet = new DataSet();
            using (var objDL = DLAnalyticReports.GetDLAnalyticReports(analyticReportsDto.AccountId, SQLProvider))
            {
                dataSet = await objDL.GetAnalyticReports(analyticReportsDto.filterDataJson, analyticReportsDto.Groupby, analyticReportsDto.OffSet, analyticReportsDto.FetchNext, fromDateTime, toDateTime);
            }

            ArrayList exportdata = new ArrayList() { analyticReportsDto.filterDataJson, analyticReportsDto.Groupby };

            HttpContext.Session.SetString("AnalyticData", JsonConvert.SerializeObject(exportdata));

            var getdata = JsonConvert.SerializeObject(dataSet);
            return Content(getdata.ToString(), "application/json");
        }

        [HttpPost]
        [Log]
        public async Task<JsonResult> SaveReport([FromBody] SaveReportDto analyticReports)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            analyticReports.analyticReports.UserInfoUserId = user.UserId;
            using (var objreports = DLAnalyticReports.GetDLAnalyticReports(analyticReports.accountId, SQLProvider))
            {
                if (analyticReports.analyticReports.Id > 0)
                {
                    int Id = await objreports.Update(analyticReports.analyticReports);
                    return Json(Id);
                }
                else
                {
                    int Id = await objreports.Save(analyticReports.analyticReports);
                    return Json(Id);
                }
            }
        }

        [HttpPost]
        public async Task<ActionResult> AnalyticsReportExport([FromBody] AnalyticsReportExport analyticReports)
        {
            DateTime FromDateTimes = DateTime.ParseExact(analyticReports.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(analyticReports.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            AnalyticCustomReports? filterLead = new AnalyticCustomReports();
            string? Groupby = "";
            DataSet dataSet = new DataSet();
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("AnalyticData"));

                filterLead = JsonConvert.DeserializeObject<AnalyticCustomReports>(data[0].ToString());
                Groupby = (string?)data[1];
            }
            using (var objDL = DLAnalyticReports.GetDLAnalyticReports(analyticReports.AccountId, SQLProvider))
            {
                dataSet = await objDL.GetAnalyticReports(filterLead, Groupby, analyticReports.OffSet, analyticReports.FetchNext, FromDateTimes, ToDateTime);
            }
            DataTable resultDataTable = (from dataRow in dataSet.Tables[0].Select()
                                         select new
                                         {
                                             ReportedBy = Convert.ToString(dataRow["Groupby"]),
                                             UniqueVisit = Convert.ToString(dataRow["UniqueVisit"]),
                                             TotalVisit = Convert.ToString(dataRow["TotalVisit"]),
                                             Session = Convert.ToString(dataRow["Session"]),
                                             AvgTime = Helper.AverageTime(Convert.ToDecimal(String.IsNullOrEmpty(dataRow["TotalTime"].ToString()) ? "0" : dataRow["TotalTime"]))
                                         }).CopyToDataTableExport();
            DataSet resultDataSet = new DataSet();
            resultDataSet.Tables.Add(resultDataTable);


            string FileName = "AnalyticReportData_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + analyticReports.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            //string MainPath = "E:/" + FileName;

            if (analyticReports.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(resultDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(resultDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }
    }
}
