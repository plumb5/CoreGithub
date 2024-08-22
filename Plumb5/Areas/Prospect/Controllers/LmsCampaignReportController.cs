using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
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
    public class LmsCampaignReportController : BaseController
    {
        public LmsCampaignReportController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("LmsCampaignReport");
        }
        [HttpPost]
        public async Task<JsonResult> GetUsers([FromBody] LmsCampaignReport_GetUsersDto objDto)
        {
            //LoginInfo user = (LoginInfo)Session["UserInfo"];
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchy =await objUserHierarchy.GetHisUsers(objDto.UserId, objDto.AdsId);
                userHierarchy.Add(await objUserHierarchy.GetHisDetails(objDto.UserId));
            }
            userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();
            return Json(userHierarchy);
        }
        [HttpPost]
        public async Task<ActionResult> GetMaxCount([FromBody] LmsCampaignReport_GetMaxCountDto objDto)
        {
            HttpContext.Session.SetString("LmsUserId", JsonConvert.SerializeObject(objDto.UserId));
            HttpContext.Session.SetString("OrderbyVal", JsonConvert.SerializeObject(objDto.OrderbyVal));
            
            DateTime fromDateTime = DateTime.ParseExact(objDto.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime toDateTime = DateTime.ParseExact(objDto.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            List<LmsCampaingReport> finalcampaignreportdetails = new List<LmsCampaingReport>();
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            int userHierarchyUserId = 0;
            int Campaigncount = 0;
            if (objDto.UserId == 0)
            {
                userHierarchyUserId = user.UserId;
                using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                {
                    userHierarchy =await objUserHierarchy.GetHisUsers(userHierarchyUserId, objDto.AccountId);
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
                using (var objBL = DLLmsCampaignReport.GetDLLmsCampaignReport(objDto.AccountId,SQLProvider))
                {
                    Campaigncount =await objBL.GetMaxCount(UserIdList, fromDateTime, toDateTime, objDto.OrderbyVal, objDto.filterLead);
                }

            }

            return Json(Campaigncount);
        }
        [HttpPost]
        public async Task<JsonResult> GetReport([FromBody] LmsCampaignReport_GetReportDto objDto)
        {
            HttpContext.Session.SetString("LmsUserinfoName", JsonConvert.SerializeObject(objDto.UserinfoName));
            DateTime fromDateTime = DateTime.ParseExact(objDto.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime toDateTime = DateTime.ParseExact(objDto.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            LmsExport GetLMSCampaignReport = new LmsExport();
            ArrayList exportdata = new ArrayList() { objDto.filterLead };
            HttpContext.Session.SetString("LmsData", JsonConvert.SerializeObject(exportdata));
            List<LmsCampaingReport> LmsCampaignReport =await GetLMSCampaignReport.GetLmsCampaignDetails(user, objDto.AccountId, objDto.UserId, fromDateTime, toDateTime, objDto.OffSet, objDto.FetchNext, objDto.UserinfoName, objDto.OrderbyVal, objDto.filterLead, SQLProvider);

            return Json(LmsCampaignReport);
        }
        [HttpPost]
        public async Task<JsonResult> ExportLmsCampaignReport([FromBody] LmsCampaignReport_ExportLmsCampaignReportDto objDto)
        {
            int UserId = 0;
            DateTime fromDateTime = DateTime.ParseExact(objDto.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime toDateTime = DateTime.ParseExact(objDto.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            LmsExport GetLMSCampaignReport = new LmsExport();
            string UserinfoName = "";
            int OrderbyVal = 0;
            if (HttpContext.Session.GetString("LmsUserId") != null)
            {
                UserId = JsonConvert.DeserializeObject<int>(HttpContext.Session.GetString("LmsUserId"));
            }
            if (HttpContext.Session.GetString("LmsUserinfoName") != null)
            {
                UserinfoName = JsonConvert.DeserializeObject<string>(HttpContext.Session.GetString("LmsUserinfoName"));  
            }
            if (HttpContext.Session.GetString("OrderbyVal") != null)
            {
                OrderbyVal = JsonConvert.DeserializeObject<int>(HttpContext.Session.GetString("OrderbyVal"))  ;
            }
            LmsCustomReport filterLead = new LmsCustomReport();
            if (HttpContext.Session.GetString("LmsData") != null)
            {
                ArrayList data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("LmsData"));
                filterLead = JsonConvert.DeserializeObject<LmsCustomReport>(data[0].ToString());
            }
            List<LmsCampaingReport> LmsCampaignReport = await GetLMSCampaignReport.GetLmsCampaignDetails(user, objDto.AccountId, UserId, fromDateTime, toDateTime, objDto.OffSet, objDto.FetchNext, UserinfoName, OrderbyVal, filterLead, SQLProvider);

            var NewListData = LmsCampaignReport.Select(x => new
            {
                Username = x.UserinfoName,
                LmsMailCount = x.LMSMailcount,
                LmsSmsCount = x.LMSSmscount,
                LMSWhatsAppCount = x.LMSWhatsAppCount,
                TotalInBound = x.InBound,
                TotalOutBound = x.OutBound
            });
            DataSet dataSet = new DataSet();
            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTable();
            dataSet.Tables.Add(dtt);

            string FileName = "LmsCampaigncountReport" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + objDto.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (objDto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }
        [HttpPost]
        public async Task<ActionResult> LmsPhoneCallResponseDetails([FromBody] LmsCampaignReport_LmsPhoneCallResponseDetailsDto objDto)
        {

            DateTime fromDateTime = DateTime.ParseExact(objDto.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime toDateTime = DateTime.ParseExact(objDto.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DataSet dataSet = new DataSet();

            using (var objDL = DLLmsCampaignReport.GetDLLmsCampaignReport(objDto.AccountId,SQLProvider))
            {
                dataSet = await objDL.GetLmsPhoneCallResponseDetails(objDto.UserInfoUserId, fromDateTime, toDateTime, objDto.OrderbyVal, objDto.CalledNumber, objDto.filterLead, objDto.CallEvents);
            }
            var getdata = JsonConvert.SerializeObject(dataSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
    }
}
