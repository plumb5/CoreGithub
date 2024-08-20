using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Prospect.Dto;
using Plumb5.Areas.Prospect.Models;
using Plumb5.Controllers;
using System.Data;
using System.Globalization;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class DashboardController : BaseController
    {
        public DashboardController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("Dashboard");
        }

        public async Task<JsonResult> GetUsers([FromBody] Dashboard_GetUsersDto details)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchy = await objUserHierarchy.GetHisUsers(user.UserId, details.AdsId);
                userHierarchy.Add(await objUserHierarchy.GetHisDetails(user.UserId));
            }
            userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();
            return Json(userHierarchy);
        }

        public async Task<IActionResult> GetSummary([FromBody] Dashboard_GetSummaryDto details)
        {
            #region  variable
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DataSet data = new DataSet();
            string usergrplist = "";
            #endregion

            usergrplist = details.userGroupslist != null ? string.Join(",", details.userGroupslist) : "";

            DateTime FromDate = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(details.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var objBL = DLLmsDashboard.GetDLLmsDashboard(details.AdsId, SQLProvider))
                data = await objBL.GetSummaryDetails(details.UserIds, usergrplist, FromDate, ToDate, details.OrderBy);

            var getdata = JsonConvert.SerializeObject(data, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }

        public async Task<IActionResult> GetFollowUpsData([FromBody] Dashboard_GetFollowUpsDataDto details)
        {
            #region variable
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DataSet data = new DataSet();
            string userId = String.Empty;
            int userInfoUserId = 0;
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            List<int> userGroups = new List<int>();
            #endregion

            if (details.UserId > 0)
            {
                userInfoUserId = details.UserId;
                List<Groups> Groups = new List<Groups>();
                using (var objDLUserInfo = DLUserInfo.GetDLUserInfo(SQLProvider))
                {
                    Groups = await objDLUserInfo.Groups(userInfoUserId);
                }
                userGroups = Groups.Select(x => x.UserGroupId).ToList();
            }
            else
            {
                userInfoUserId = user.UserId;
                userGroups = user.UserGroupIdList;
            }

            using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchy = await objUserHierarchy.GetHisUsers(userInfoUserId, details.AdsId);
                userHierarchy.Add(await objUserHierarchy.GetHisDetails(userInfoUserId));
            }
            userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

            List<int> usersId = new List<int>();
            if (userHierarchy != null)
                usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();

            userId = string.Join(",", usersId.ToArray());

            if (String.IsNullOrEmpty(userId))
                userId = userInfoUserId.ToString();

            using (var objDL = DLLmsDashboard.GetDLLmsDashboard(details.AdsId, SQLProvider))
            {
                data = await objDL.GetFollowUpsData(userId, userGroups);
            }
            var getdata = JsonConvert.SerializeObject(data, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }

        public async Task<JsonResult> LeadWonLostReport([FromBody] Dashboard_LeadWonLostReportDto details)
        {
            #region  variable
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DataSet dtwin = new DataSet();
            DataSet dtlost = new DataSet();
            List<int> TotalWin = new List<int>();
            List<int> TotalLost = new List<int>();
            int value = 0;
            #endregion

            string usergrplist = details.userGroupslist != null ? string.Join(",", details.userGroupslist) : "";

            DateTime FromDate = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(details.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var objBL = DLLmsDashboard.GetDLLmsDashboard(details.AdsId, SQLProvider))
            {
                dtwin = await objBL.LeadWonLeadLost(details.Duration, details.UserIds, usergrplist, FromDate, ToDate, "Closed Won", details.OrderBy);
                dtlost = await objBL.LeadWonLeadLost(details.Duration, details.UserIds, usergrplist, FromDate, ToDate, "Closed Lost", details.OrderBy);
            }

            for (int i = 0; i < dtwin.Tables[0].Rows.Count; i++)
            {
                value = Convert.ToInt32(dtwin.Tables[0].Rows[i]["Total"]);
                TotalWin.Add(value);
            }

            for (int i = 0; i < dtlost.Tables[0].Rows.Count; i++)
            {
                value = Convert.ToInt32(dtlost.Tables[0].Rows[i]["Total"]);
                TotalLost.Add(value);
            }

            return Json(new { TotalWin, TotalLost });
        }

        public async Task<IActionResult> GetTopSources([FromBody] Dashboard_GetTopSourcesDto details)
        {
            #region  variable
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DataSet data = new DataSet();
            string userId = String.Empty;
            int userInfoUserId = 0;
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            List<int> userGroups = new List<int>();
            #endregion

            DateTime FromDate = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(details.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (details.UserId > 0)
            {
                userInfoUserId = details.UserId;
                List<Groups> Groups = new List<Groups>();
                using (var objDLUserInfo = DLUserInfo.GetDLUserInfo(SQLProvider))
                {
                    Groups = await objDLUserInfo.Groups(userInfoUserId);
                }
                userGroups = Groups.Select(x => x.UserGroupId).ToList();
            }
            else
            {
                userInfoUserId = user.UserId;
                userGroups = user.UserGroupIdList;
            }

            using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchy = await objUserHierarchy.GetHisUsers(userInfoUserId, details.AdsId);
                userHierarchy.Add(await objUserHierarchy.GetHisDetails(userInfoUserId));
            }
            userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

            List<int> usersId = new List<int>();
            if (userHierarchy != null)
                usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();

            userId = string.Join(",", usersId.ToArray());

            if (String.IsNullOrEmpty(userId))
                userId = userInfoUserId.ToString();

            using (var objDL = DLLmsDashboard.GetDLLmsDashboard(details.AdsId, SQLProvider))
            {
                data = await objDL.TopSources(userId, userGroups, FromDate, ToDate);
            }
            var getdata = JsonConvert.SerializeObject(data, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }

        public async Task<IActionResult> GetTopStages([FromBody] Dashboard_GetTopStagesDto details)
        {
            #region  variable
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DataSet data = new DataSet();
            string userId = String.Empty;
            int userInfoUserId = 0;
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            List<int> userGroups = new List<int>();
            #endregion

            DateTime FromDate = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(details.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (details.UserId > 0)
            {
                userInfoUserId = details.UserId;
                List<Groups> Groups = new List<Groups>();
                using (var objDLUserInfo = DLUserInfo.GetDLUserInfo(SQLProvider))
                {
                    Groups = await objDLUserInfo.Groups(userInfoUserId);
                }
                userGroups = Groups.Select(x => x.UserGroupId).ToList();
            }
            else
            {
                userInfoUserId = user.UserId;
                userGroups = user.UserGroupIdList;
            }

            using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchy = await objUserHierarchy.GetHisUsers(userInfoUserId, details.AdsId);
                userHierarchy.Add(await objUserHierarchy.GetHisDetails(userInfoUserId));
            }
            userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

            List<int> usersId = new List<int>();
            if (userHierarchy != null)
                usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();

            userId = string.Join(",", usersId.ToArray());

            if (String.IsNullOrEmpty(userId))
                userId = userInfoUserId.ToString();

            using (var objDL = DLLmsDashboard.GetDLLmsDashboard(details.AdsId, SQLProvider))
            {
                data = await objDL.TopStages(userId, userGroups, FromDate, ToDate);
            }
            var getdata = JsonConvert.SerializeObject(data, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }

        public async Task<IActionResult> GetLabelWiseLeadsCount([FromBody] Dashboard_GetLabelWiseLeadsCountDto details)
        {
            #region  variable
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DataSet data = new DataSet();
            #endregion

            DateTime FromDate = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(details.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            string usergrplist = details.userGroupslist != null ? string.Join(",", details.userGroupslist) : "";

            using (var objDL = DLLmsDashboard.GetDLLmsDashboard(details.AdsId, SQLProvider))
                data = await objDL.LableWiseLeadsCount(details.UserIds, usergrplist, FromDate, ToDate, details.OrderBy);

            var getdata = JsonConvert.SerializeObject(data, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }

        public async Task<JsonResult> GetAllStageWiseLeadsCount([FromBody] Dashboard_GetAllStageWiseLeadsCountDto details)
        {
            #region  variable
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            #endregion

            DateTime FromDate = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(details.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            string usergrplist = details.userGroupslist != null ? string.Join(",", details.userGroupslist) : "";

            List<LmsStageEachUserDetails> finaldata = new List<LmsStageEachUserDetails>();

            LmsStageEachUserDetails lmsatgedetails = new LmsStageEachUserDetails(details.AdsId,SQLProvider);
            finaldata = await lmsatgedetails.GetLmsStageEachUserDetails(details.UserIds, usergrplist, FromDate, ToDate, details.userHierarchy, details.OrderBy);

            return Json(finaldata);
        }

        public async Task<JsonResult> GetAllSourceWiseLeadsCount([FromBody] Dashboard_GetAllSourceWiseLeadsCountDto details)
        {
            #region  variable
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            #endregion

            DateTime FromDate = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(details.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            string usergrplist = details.userGroupslist != null ? string.Join(",", details.userGroupslist) : "";

            List<LmsSourceEachUserDetails> finaldata = new List<LmsSourceEachUserDetails>();

            LmsSourceEachUserDetails lmsatgedetails = new LmsSourceEachUserDetails(details.AdsId,SQLProvider);
            finaldata = await lmsatgedetails.GetLmsSourceEachUserDetails(details.UserIds, usergrplist, FromDate, ToDate, details.userHierarchy, details.OrderBy);

            return Json(finaldata);
        }

        public async Task<IActionResult> GetFollowUpLeadsCount([FromBody] Dashboard_GetFollowUpLeadsCountDto details)
        {
            #region  variable
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DataSet data = new DataSet();
            #endregion

            DateTime FromDate = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(details.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            string usergrplist = details.userGroupslist != null ? string.Join(",", details.userGroupslist) : "";

            using (var objBL = DLLmsDashboard.GetDLLmsDashboard(details.AdsId, SQLProvider))
                data = await objBL.GetFollowUpLeadsCount(details.UserIds, usergrplist, FromDate, ToDate, details.OrderBy);

            var getdata = JsonConvert.SerializeObject(data, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }

        public async Task<JsonResult> GetLeadLabelByUserPerformance([FromBody] Dashboard_GetLeadLabelByUserPerformanceDto details)
        {
            #region  variable
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            #endregion

            DateTime FromDate = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(details.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            string usergrplist = details.userGroupslist != null ? string.Join(",", details.userGroupslist) : "";

            List<LeadLabelEachUserDetails> finaldata = new List<LeadLabelEachUserDetails>();
            LeadLabelEachUserDetails lmsatgedetails = new LeadLabelEachUserDetails(details.AdsId, SQLProvider);
            finaldata = await lmsatgedetails.GetLeadLabelEachUserDetails(details.UserIds, usergrplist, FromDate, ToDate, details.userHierarchy, details.OrderBy);
            return Json(finaldata);
        }

        public async Task<IActionResult> GetCampaignDetails([FromBody] Dashboard_GetCampaignDetailsDto details)
        {
            #region  variable
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DataSet data = new DataSet();
            #endregion

            DateTime FromDate = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(details.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            string usergrplist = details.userGroupslist != null ? string.Join(",", details.userGroupslist) : "";

            using (var objBL = DLLmsDashboard.GetDLLmsDashboard(details.AdsId, SQLProvider))
                data = await objBL.GetLeadCampaignDetails(details.UserIds, usergrplist, FromDate, ToDate, details.OrderBy);

            var getdata = JsonConvert.SerializeObject(data, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }

        public async Task<JsonResult> GetStageWiseVsLabel([FromBody] Dashboard_GetStageWiseVsLabelDto details)
        {
            #region  variable
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            #endregion

            DateTime FromDate = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(details.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            string usergrplist = details.userGroupslist != null ? string.Join(",", details.userGroupslist) : "";

            List<LeadStageWiseVsLabelWiseDetails> finaldata = new List<LeadStageWiseVsLabelWiseDetails>();

            LeadStageWiseVsLabelWiseDetails lmsatgedetails = new LeadStageWiseVsLabelWiseDetails(details.AdsId, SQLProvider);
            finaldata = await lmsatgedetails.GetLeadStageWiseVsLabelWiseDetails(details.UserIds, usergrplist, FromDate, ToDate, details.AllStageList, details.OrderBy);

            return Json(finaldata);
        }

        public async Task<JsonResult> GetSourceWiseVsLabel([FromBody] Dashboard_GetSourceWiseVsLabelDto details)
        {
            #region  variable
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            #endregion

            DateTime FromDate = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(details.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            string usergrplist = details.userGroupslist != null ? string.Join(",", details.userGroupslist) : "";

            List<LeadSourceWiseVsLabelWiseDetails> finaldata = new List<LeadSourceWiseVsLabelWiseDetails>();

            LeadSourceWiseVsLabelWiseDetails lmsatgedetails = new LeadSourceWiseVsLabelWiseDetails(details.AdsId, SQLProvider);
            finaldata = await lmsatgedetails.GetLeadSourceWiseVsLabelWiseDetails(details.UserIds, usergrplist, FromDate, ToDate, details.lmsgrplist, details.OrderBy);

            return Json(finaldata);
        }

        public async Task<JsonResult> GetStageWiseVsSourceWise([FromBody] Dashboard_GetStageWiseVsSourceWiseDto details)
        {
            #region  variable
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            #endregion

            DateTime FromDate = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(details.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            string usergrplist = details.userGroupslist != null ? string.Join(",", details.userGroupslist) : "";

            List<LeadStageVsSourceWiseDetails> finaldata = new List<LeadStageVsSourceWiseDetails>();
            LeadStageVsSourceWiseDetails lmsatgedetails = new LeadStageVsSourceWiseDetails(details.AdsId, SQLProvider);
            finaldata = await lmsatgedetails.GetLeadStageVsSourceWiseDetails(details.UserIds, usergrplist, FromDate, ToDate, details.AllStageList, details.OrderBy);

            return Json(finaldata);
        }

        public async Task<IActionResult> GetRevenueDetails([FromBody] Dashboard_GetRevenueDetailsDto details)
        {
            #region  variable
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DataSet data = new DataSet();
            #endregion

            DateTime FromDate = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(details.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            string usergrplist = details.userGroupslist != null ? string.Join(",", details.userGroupslist) : "";

            using (var objBL = DLLmsDashboard.GetDLLmsDashboard(details.AdsId, SQLProvider))
                data = await objBL.GetRevenueDetails(details.UserIds, usergrplist, FromDate, ToDate, details.OrderBy);

            var getdata = JsonConvert.SerializeObject(data, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }

        public async Task<IActionResult> GetUserHierarchy([FromBody] Dashboard_GetUserHierarchyDto details)
        {
            #region  variable
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            string userId = String.Empty;
            int userInfoUserId = 0;
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            List<int> userGroups = new List<int>();

            #endregion

            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                if (details.UserId > 0)
                {
                    userInfoUserId = details.UserId;
                    List<Groups> Groups = new List<Groups>();
                    using (var objBLUserInfo = DLUserInfo.GetDLUserInfo(SQLProvider))
                    {
                        Groups = await objBLUserInfo.Groups(userInfoUserId);
                    }
                    userGroups = Groups.Select(x => x.UserGroupId).ToList();
                }
                else
                {
                    userInfoUserId = user.UserId;
                    //userGroups = user.UserGroupIdList;
                }

                using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                {
                    userHierarchy = await objUserHierarchy.GetHisUsers(userInfoUserId);
                    userHierarchy.Add(await objUserHierarchy.GetHisDetails(userInfoUserId));
                }
                userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

                List<int> usersId = new List<int>();
                if (userHierarchy != null)
                    usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();

                userId = string.Join(",", usersId.ToArray());

                if (String.IsNullOrEmpty(userId))
                    userId = userInfoUserId.ToString();
            }
            return Json(new { UserIds = userId, UserGrpList = userGroups, UserHierarchy = userHierarchy });
        }
    }
}
