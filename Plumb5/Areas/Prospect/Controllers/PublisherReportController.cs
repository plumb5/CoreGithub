using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Prospect.Dto;
using Plumb5.Areas.Prospect.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Globalization;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class PublisherReportController : BaseController
    {
        public PublisherReportController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /Prospect/PublisherReport/

        public IActionResult  Index()
        {
            return View("PublisherReport");
        }

        [HttpPost]
        public async Task<JsonResult> GetUser([FromBody] PublisherReportDto_GetUser commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            List<MLUserHierarchy> userHierarchyList = new List<MLUserHierarchy>();
            List<UserHierarchy> userHierarchyListgroup = new List<UserHierarchy>();
            int SenioruserHierarchyUserId = user.UserId;
            using (var objUser = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                if (commonDetails.Getallusers == 0)
                {
                    userHierarchyList = await objUser.GetHisUsers(user.UserId);
                    userHierarchyList.Add(await objUser.GetHisDetails(user.UserId));
                    userHierarchyListgroup = await objUser.GetPermissionUsers(user.UserId);
                    if (userHierarchyListgroup != null && userHierarchyListgroup.Count > 0)
                    {
                        for (int i = 0; i < userHierarchyListgroup.Count; i++)
                        {
                            userHierarchyList.Add(await objUser.GetHisDetails(userHierarchyListgroup[i].UserInfoUserId));
                        }
                    }
                }
                else
                {
                    userHierarchyList = await objUser.GetHisUsers(user.UserId, commonDetails.accountId, commonDetails.Getallusers);
                }
            }

            userHierarchyList = userHierarchyList.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

            return Json(userHierarchyList);
        }

        [HttpPost]
        public async Task<IActionResult> GetMaxCount([FromBody] PublisherReportDto_GetMaxCount commonDetails)
        {
            HttpContext.Session.SetInt32("LmsUserId", commonDetails.UserId);
            HttpContext.Session.SetInt32("OrderbyVal", commonDetails.OrderbyVal);

            DateTime fromDateTime = DateTime.ParseExact(commonDetails.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime toDateTime = DateTime.ParseExact(commonDetails.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            List<LmsCampaingReport> finalcampaignreportdetails = new List<LmsCampaingReport>();
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            int userHierarchyUserId = 0;
            int Campaigncount = 0;
            if (commonDetails.UserId == 0)
            {
                userHierarchyUserId = user.UserId;
                using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                {
                    userHierarchy = await objUserHierarchy.GetHisUsers(userHierarchyUserId, commonDetails.AccountId);
                    userHierarchy.Add(await objUserHierarchy.GetHisDetails(userHierarchyUserId));
                }
                userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();
            }
            else
            {
                userHierarchyUserId = commonDetails.UserId;
                using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                {
                    userHierarchy.Add(await objUserHierarchy.GetHisDetails(userHierarchyUserId));
                }
                userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();
            }
            List<int> usersId = new List<int>();
            string UserIdList = "";
            if (commonDetails.UserinfoName != null && commonDetails.UserinfoName != "")
                usersId = userHierarchy.Where(x => x.FirstName.ToLower().Contains("" + commonDetails.UserinfoName + "")).Select(x => x.UserInfoUserId).Distinct().ToList();
            else
                usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();
            UserIdList = string.Join(",", usersId.ToArray());
            if (UserIdList != "")
            {
                using (var objBL = DLLmsPublisherReport.GetDLLmsPublisherReport(commonDetails.AccountId, SQLProvider))
                {
                    Campaigncount = await objBL.GetLmsPublisherMaxCount(UserIdList, fromDateTime, toDateTime, commonDetails.OrderbyVal, commonDetails.filterLead, commonDetails.Stagename);
                }
            }
            return Json(Campaigncount);
        }

        [HttpPost]
        public async Task<IActionResult> GetReport([FromBody] PublisherReportDto_GetReport commonDetails)
        {
            HttpContext.Session.SetString("LmsUserinfoName", commonDetails.UserinfoName);
            DateTime fromDateTime = DateTime.ParseExact(commonDetails.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime toDateTime = DateTime.ParseExact(commonDetails.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();


            List<LmsCampaingReport> finalcampaignreportdetails = new List<LmsCampaingReport>();
            int userHierarchyUserId = 0;
            if (commonDetails.UserId == 0)
            {
                userHierarchyUserId = user.UserId;
                using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                {
                    userHierarchy = await objUserHierarchy.GetHisUsers(userHierarchyUserId, commonDetails.AccountId);
                    userHierarchy.Add(await objUserHierarchy.GetHisDetails(userHierarchyUserId));
                }
                userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();
            }
            else
            {
                userHierarchyUserId = commonDetails.UserId;
                using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                {
                    userHierarchy.Add(await objUserHierarchy.GetHisDetails(userHierarchyUserId));
                }
                userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();
            }
            List<int> usersId = new List<int>();
            string UserIdList = "";
            if (commonDetails.UserinfoName != null && commonDetails.UserinfoName != "")
                usersId = userHierarchy.Where(x => x.FirstName.ToLower().Contains("" + commonDetails.UserinfoName + "")).Select(x => x.UserInfoUserId).Distinct().ToList();
            else
                usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();
            UserIdList = string.Join(",", usersId.ToArray());
            DataSet dataSet = new DataSet();
            ArrayList exportdata = new ArrayList() { commonDetails.filterLead, UserIdList, commonDetails.OrderbyVal, userHierarchy, commonDetails.Stagename };
            HttpContext.Session.SetString("PublisherData", JsonConvert.SerializeObject(exportdata));
            if (UserIdList != "")
            {
                using (var objDL = DLLmsPublisherReport.GetDLLmsPublisherReport(commonDetails.AccountId, SQLProvider))
                {
                    dataSet = await objDL.GetLmsPublisherReport(UserIdList, fromDateTime, toDateTime, commonDetails.OffSet, commonDetails.FetchNext, commonDetails.OrderbyVal, commonDetails.filterLead, commonDetails.Stagename);
                }
            }
            var getdata = JsonConvert.SerializeObject(dataSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        //public ActionResult GetSourceMaxcount(int AccountId, int UserId, LmsCustomReport filterLead, string FromDateTime, string ToDateTime,  string UserinfoName, int OrderbyVal)
        //{

        //    Session["LmsUserinfoName"] = UserinfoName;
        //    DateTime fromDateTime = DateTime.ParseExact(FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
        //    DateTime toDateTime = DateTime.ParseExact(ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
        //    LoginInfo user = (LoginInfo)Session["UserInfo"];
        //    List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
        //    LmsExport GetLMSCampaignReport = new LmsExport();
        //    ArrayList exportdata = new ArrayList() { filterLead };
        //    Session["LmsData"] = exportdata;
        //    List<LmsCampaingReport> finalcampaignreportdetails = new List<LmsCampaingReport>();
        //    int userHierarchyUserId = 0;
        //    if (UserId == 0)
        //    {
        //        userHierarchyUserId = user.UserId;
        //        using (DLUserHierarchy objUserHierarchy = new DLUserHierarchy())
        //        {
        //            userHierarchy = objUserHierarchy.GetHisUsers(userHierarchyUserId, AccountId);
        //            userHierarchy.Add(objUserHierarchy.GetHisDetails(userHierarchyUserId));
        //        }
        //        userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();
        //    }
        //    else
        //    {
        //        userHierarchyUserId = UserId;
        //        using (DLUserHierarchy objUserHierarchy = new DLUserHierarchy())
        //        {
        //            userHierarchy.Add(objUserHierarchy.GetHisDetails(userHierarchyUserId));
        //        }
        //        userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();
        //    }
        //    List<int> usersId = new List<int>();
        //    string UserIdList = "";
        //    if (UserinfoName != null && UserinfoName != "")
        //        usersId = userHierarchy.Where(x => x.FirstName.ToLower().Contains("" + UserinfoName + "")).Select(x => x.UserInfoUserId).Distinct().ToList();
        //    else
        //        usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();
        //    UserIdList = string.Join(",", usersId.ToArray());
        //    DataSet dataSet = new DataSet();
        //    if (UserIdList != "")
        //    {
        //        using (DLLmsPublisherReport objDL = new DLLmsPublisherReport(AccountId))
        //        {
        //            dataSet = objDL.GetLmsPublisherSourceMaxcount(UserIdList, fromDateTime, toDateTime, OrderbyVal, filterLead);
        //        }
        //    }
        //    var getdata = JsonConvert.SerializeObject(dataSet, Formatting.Indented);
        //    return Content(getdata.ToString(), "application/json");
        //}

        [HttpPost]
        public async Task<IActionResult> GetSourceReport([FromBody] PublisherReportDto_GetSourceReport commonDetails)
        {
            DateTime fromDateTime = DateTime.ParseExact(commonDetails.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime toDateTime = DateTime.ParseExact(commonDetails.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            DataSet dataSet = new DataSet();

            using (var objDL = DLLmsPublisherReport.GetDLLmsPublisherReport(commonDetails.AccountId, SQLProvider))
            {
                dataSet = await objDL.GetLmsPublisherSourceReport(commonDetails.UserId.ToString(), fromDateTime, toDateTime, commonDetails.OffSet, commonDetails.FetchNext, commonDetails.OrderbyVal, commonDetails.filterLead);
            }

            ArrayList exportdata = new ArrayList() { commonDetails.filterLead, commonDetails.UserId.ToString(), commonDetails.OrderbyVal };
            HttpContext.Session.SetString("PublisherSourceData", JsonConvert.SerializeObject(exportdata));
            var getdata = JsonConvert.SerializeObject(dataSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }

        [HttpPost]
        public async Task<JsonResult> GetStageScore([FromBody] PublisherReportDto_GetStageScore commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            List<LmsStage> AllStageList = new List<LmsStage>();
            List<LmsStage> newLmsStageList = new List<LmsStage>();

            using (var objStage = DLLmsStage.GetDLLmsStage(commonDetails.accountId, SQLProvider))
            {
                AllStageList = await objStage.GetAllList();
            }

            if (user.IsSuperAdmin != 1)
            {
                newLmsStageList = AllStageList.Where(x => x.UserGroupId == "0").ToList();

                foreach (int GroupId in user.UserGroupIdList)
                {
                    if (AllStageList.Any(x => x.UserGroupId == GroupId.ToString()))
                    {
                        newLmsStageList = newLmsStageList.Union(AllStageList.Where(x => x.UserGroupId == GroupId.ToString())).ToList();
                    }
                }
            }
            else
            {
                newLmsStageList = AllStageList;
            }

            return Json(new { AllStages = AllStageList, StagesList = newLmsStageList });
        }

        [HttpPost]
        public async Task<JsonResult> GetPublisherList([FromBody] PublisherReportDto_GetStageScore commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            List<Publisher> AllPublisherList = new List<Publisher>();

            using (var objStage = DLLmsPublisherReport.GetDLLmsPublisherReport(commonDetails.accountId, SQLProvider))
            {
                AllPublisherList = await objStage.GetPublisherList();
            }
            return Json(AllPublisherList);
        }

        [HttpPost]
        public async Task<IActionResult> PublisherReportExport([FromBody] PublisherReportDto_PublisherReportExport commonDetails)
        {
            DateTime FromDateTimes = DateTime.ParseExact(commonDetails.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            LmsCustomReport filterLead = new LmsCustomReport();
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            string UserIdList = "";
            string Stagename = "";
            int OrderbyVal = 0;
            if (HttpContext.Session.GetString("PublisherData") != null)
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("PublisherData"));
                filterLead = JsonConvert.DeserializeObject<LmsCustomReport>(data[0].ToString());
                UserIdList = (string)data[1];
                OrderbyVal =  Convert.ToInt32(data[2]);
                userHierarchy = JsonConvert.DeserializeObject<List<MLUserHierarchy>>(data[3].ToString()); 
                Stagename = (string)data[4];
            }
            DataSet dataSet = new DataSet();
            using (var objDL = DLLmsPublisherReport.GetDLLmsPublisherReport(commonDetails.AccountId, SQLProvider))
            {
                dataSet = await objDL.GetLmsPublisherReport(UserIdList, FromDateTimes, ToDateTime, commonDetails.OffSet, commonDetails.FetchNext, OrderbyVal, filterLead, Stagename);
            }
            dataSet.Tables[0].Columns.Add("UserName", typeof(string));

            dataSet.Tables[0].Columns.Add("ConversionRate", typeof(string));
            //dataSet.Tables[0].Columns.Add("StageName", typeof(string));
            for (int intCount = 0; intCount < dataSet.Tables[0].Rows.Count; intCount++)
            {
                dataSet.Tables[0].Rows[intCount][8] = userHierarchy.Where(x => x.UserInfoUserId == dataSet.Tables[0].Rows[intCount].Field<Int32>("UserInfoUserId")).Select(x => x).ToList()[0].FirstName;

                dataSet.Tables[0].Rows[intCount][9] = String.IsNullOrEmpty((dataSet.Tables[0].Rows[intCount].Field<Int32>("TotalLeads") > 0 ? Math.Round((Decimal)dataSet.Tables[0].Rows[intCount].Field<Int32>("StageCount") / dataSet.Tables[0].Rows[intCount].Field<Int32>("TotalLeads"), 2) * 100 : 0).ToString()) ? "0%" : (dataSet.Tables[0].Rows[intCount].Field<Int32>("TotalLeads") > 0 ? Math.Round((Decimal)dataSet.Tables[0].Rows[intCount].Field<Int32>("StageCount") / dataSet.Tables[0].Rows[intCount].Field<Int32>("TotalLeads"), 2) * 100 : 0).ToString() + " %";
            }
            dataSet.Tables[0].Columns.Remove("UserInfoUserId");
            dataSet.Tables[0].AcceptChanges();
            string FileName = "PublisherReportData_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            //string MainPath = "E:/" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }

        [HttpPost]
        public async Task<IActionResult> ExportSourceReport([FromBody] PublisherReportDto_ExportSourceReport commonDetails)
        {
            DateTime FromDateTimes = DateTime.ParseExact(commonDetails.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            LmsCustomReport filterLead = new LmsCustomReport();
            string UserIdList = "";
            int OrderbyVal = 0;
            if (HttpContext.Session.GetString("PublisherSourceData") != null)
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("PublisherSourceData"));
                filterLead = JsonConvert.DeserializeObject<LmsCustomReport>(data[0].ToString()); 
                UserIdList = (string)data[1];
                OrderbyVal = Convert.ToInt32(data[2]);
            }
            DataSet dataSet = new DataSet();
            using (var objDL = DLLmsPublisherReport.GetDLLmsPublisherReport(commonDetails.AccountId, SQLProvider))
            {
                dataSet = await objDL.GetLmsPublisherSourceReport(UserIdList, FromDateTimes, ToDateTime, commonDetails.OffSet, commonDetails.FetchNext, OrderbyVal, filterLead);
            }
            string FileName = "PublisherSourceReportData_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            if (filterLead.Score > -1)
                FileName = "PublisherStageSourceReportData_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            //string MainPath = "E:/" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }
    }
}
