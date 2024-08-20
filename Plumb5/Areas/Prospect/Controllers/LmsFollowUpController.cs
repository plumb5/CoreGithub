using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Prospect.Dto;
using Plumb5.Areas.Prospect.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Data;
using System.Globalization;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class LmsFollowUpController : BaseController
    {
        public LmsFollowUpController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("LmsFollowUp");
        }
        [HttpPost]
        public async Task<JsonResult> GetUsers([FromBody] LmsFollowUp_GetUsersDto objDto)
        {
            //LoginInfo user = (LoginInfo)Session["UserInfo"];
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchy = await objUserHierarchy.GetHisUsers(objDto.UserId, objDto.AdsId);
                userHierarchy.Add(await objUserHierarchy.GetHisDetails(objDto.UserId));
            }
            userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();
            return Json(userHierarchy);
        }
        [HttpPost]
        public async Task<ActionResult> GetMaxCount([FromBody] LmsFollowUp_GetMaxCountDto objDto)
        {
            HttpContext.Session.SetString("LmsUserId", JsonConvert.SerializeObject(objDto.UserId));
            DateTime fromDateTime = DateTime.ParseExact(objDto.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime toDateTime = DateTime.ParseExact(objDto.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            List<LmsCampaingReport> finalcampaignreportdetails = new List<LmsCampaingReport>();
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            int userHierarchyUserId = 0;
            int Followupcount = 0;
            if (objDto.UserId == 0)
            {
                userHierarchyUserId = user.UserId;
                using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                {
                    userHierarchy = await objUserHierarchy.GetHisUsers(userHierarchyUserId, objDto.AccountId);
                    userHierarchy.Add(await objUserHierarchy.GetHisDetails(userHierarchyUserId));
                }
                userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();
            }
            else
            {
                userHierarchyUserId = objDto.UserId;
                using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                {
                    userHierarchy.Add(await objUserHierarchy.GetHisDetails(userHierarchyUserId));
                }
                userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();
            }
            List<int> usersId = new List<int>();
            string UserIdList = "";
            if (objDto.UserinfoName != null && objDto.UserinfoName != "")
                usersId = userHierarchy.Where(x => x.FirstName.ToLower().Contains("" + objDto.UserinfoName + "")).Select(x => x.UserInfoUserId).Distinct().ToList();
            else
                usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();
            UserIdList = string.Join(",", usersId.ToArray());
            if (UserIdList != "")
            {
                using (var objBL = DLLmsFollowUpReport.GetDLLmsFollowUpReport(objDto.AccountId,SQLProvider))
                {
                    return Json(await objBL.GetMaxCount(UserIdList, fromDateTime, toDateTime));
                }
            }
            return Json(Followupcount);
        }
        [HttpPost]
        public async Task<ActionResult> GetReport([FromBody] LmsFollowUp_GetReportDto objDto)
        {
            HttpContext.Session.SetString("LmsUserinfoName", JsonConvert.SerializeObject(objDto.UserinfoName));
            DateTime fromDateTime = DateTime.ParseExact(objDto.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime toDateTime = DateTime.ParseExact(objDto.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            LmsExport GetLMSFollowUpReport = new LmsExport();
            List<LmsFollowUpReport> LmsFollowUpReport =await GetLMSFollowUpReport.GetLmsFollowUpDetails(user, objDto.AccountId, objDto.UserId, fromDateTime, toDateTime, objDto.OffSet, objDto.FetchNext, objDto.UserinfoName,SQLProvider);

            return Json(LmsFollowUpReport);

        }
        [HttpPost]
        public async Task<JsonResult> ExportLmsFallowUpReport([FromBody] LmsFollowUp_ExportLmsFallowUpReportDto objDto)
        {
            int UserId = 0;
            DateTime fromDateTime = DateTime.ParseExact(objDto.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime toDateTime = DateTime.ParseExact(objDto.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            string UserinfoName = "";
            if (HttpContext.Session.GetString("LmsUserId") != null)
            {
                UserId = Convert.ToInt32(HttpContext.Session.GetString("LmsUserId"));

            }
            if (HttpContext.Session.GetString("LmsUserinfoName") != null)
            {
                UserinfoName = JsonConvert.DeserializeObject<string>(HttpContext.Session.GetString("LmsUserinfoName"));
            }
            LmsExport GetLMSFollowUpReport = new LmsExport();
            List<LmsFollowUpReport> LmsFollowUpReport =await GetLMSFollowUpReport.GetLmsFollowUpDetails(user, objDto.AccountId, UserId, fromDateTime, toDateTime, objDto.OffSet, objDto.FetchNext, UserinfoName,SQLProvider);

            var NewListData = LmsFollowUpReport.Select(x => new
            {
                Username = x.UserinfoName,
                PlannedCount = x.PlannedCount,
                MissedCount = x.MissedCount,
                CompleteCount = x.CompleteCount
            });
            DataSet dataSet = new DataSet();
            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTable();
            dataSet.Tables.Add(dtt);

            string FileName = "LmsFollowUpCountReport" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + objDto.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (objDto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }
    }
}
