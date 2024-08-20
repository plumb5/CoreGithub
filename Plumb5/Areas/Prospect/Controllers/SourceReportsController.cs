using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Prospect.Dto;
using Plumb5.Areas.Prospect.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Data;
using System.Globalization;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class SourceReportsController : BaseController
    {
        public SourceReportsController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /Prospect/SourceReports/

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] SourceReportsDto_GetMaxCount commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            DateTime FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            int returnVal = 0;

            List<MLUserHierarchy> mlUserInfoHierarchy = null;
            List<int> UseridList = new List<int>();

            if (commonDetails.UserInfoUserId > 0)
            {
                UseridList.Add(commonDetails.UserInfoUserId);
            }
            else
            {
                using (var objBL = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                    mlUserInfoHierarchy = await objBL.GetUsersBySeniorIdForTree(user.UserId);

                if (mlUserInfoHierarchy != null && mlUserInfoHierarchy.Count > 0)
                {
                    UseridList = mlUserInfoHierarchy.AsEnumerable()
                            .Select(x => x.UserInfoUserId)
                            .ToList();
                }
                else
                    UseridList.Add(user.UserId);
            }



            using (var objBL = DLSourceReports.GetDLSourceReports(commonDetails.accountId, SQLProvider))
            {
                returnVal = await objBL.GetMaxCount(FromDateTime, ToDateTime, UseridList, commonDetails.IsCreatedDate);
            }

            return Json(new
            {
                returnVal
            });
        }

        [HttpPost]
        public async Task<ActionResult> GetReport([FromBody] SourceReportsDto_GetReport commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            DateTime FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            ArrayList data = new ArrayList() { commonDetails.UserInfoUserId, commonDetails.IsCreatedDate };
            HttpContext.Session.SetString("SourceReports", JsonConvert.SerializeObject(data));

            List<MLUserHierarchy> mlUserInfoHierarchy = null;
            List<int> UseridList = new List<int>();

            if (commonDetails.UserInfoUserId > 0)
            {
                UseridList.Add(commonDetails.UserInfoUserId);
            }
            else
            {
                using (var objBL = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                    mlUserInfoHierarchy = await objBL.GetUsersBySeniorIdForTree(user.UserId);

                if (mlUserInfoHierarchy != null && mlUserInfoHierarchy.Count > 0)
                {
                    UseridList = mlUserInfoHierarchy.AsEnumerable()
                            .Select(x => x.UserInfoUserId)
                            .ToList();
                }
                else
                    UseridList.Add(user.UserId);
            }


            DataSet sourceReport = null;
            using (SourceStageReportModel sourceStagemodel = new SourceStageReportModel(SQLProvider))
                sourceReport = await sourceStagemodel.GetSourceReport(commonDetails.accountId, FromDateTime, ToDateTime, commonDetails.Offset, commonDetails.FetchNext, UseridList, commonDetails.IsCreatedDate);

            var getdata = JsonConvert.SerializeObject(sourceReport, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }

        [HttpPost]
        public async Task<ActionResult> ExportSourceReport([FromBody] SourceReportsDto_ExportSourceReport commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            System.Data.DataSet DataSet = new System.Data.DataSet("General");
            DateTime FromDateTimes = DateTime.ParseExact(commonDetails.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            int UserInfoUserId = 0;
            bool IsCreatedDate = true;

            if (HttpContext.Session.GetString("SourceReports") != null)
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("SourceReports"));
                UserInfoUserId = Convert.ToInt32(data[0]);
                IsCreatedDate = Convert.ToBoolean(data[1]);
            }

            List<MLUserHierarchy> mlUserInfoHierarchy = null;
            List<int> UseridList = new List<int>();

            if (UserInfoUserId > 0)
            {
                UseridList.Add(UserInfoUserId);
            }
            else
            {
                using (var objBL = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                    mlUserInfoHierarchy = await objBL.GetUsersBySeniorIdForTree(user.UserId);

                if (mlUserInfoHierarchy != null && mlUserInfoHierarchy.Count > 0)
                {
                    UseridList = mlUserInfoHierarchy.AsEnumerable()
                            .Select(x => x.UserInfoUserId)
                            .ToList();
                }
                else
                    UseridList.Add(user.UserId);
            }

            using (SourceStageReportModel sourceStagemodel = new SourceStageReportModel(SQLProvider))
                DataSet = await sourceStagemodel.GetSourceReport(commonDetails.AccountId, FromDateTimes, ToDateTime, commonDetails.OffSet, commonDetails.FetchNext, UseridList, IsCreatedDate);

            if (DataSet != null && DataSet.Tables.Count > 0)
            {
                DataSet.Tables[0].Columns.Remove("UserInfoUserId");
            }

            string FileName = "LMSSourceReport_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(DataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(DataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }
    }
}
