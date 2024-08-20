using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.WebPush.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.WebPush.Controllers
{
    [Area("WebPush")]
    public class ReportController : BaseController
    {
        public ReportController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /WebPush/Report/

        public IActionResult Index()
        {
            return View("Report");
        }

        [HttpPost]
        public async Task<JsonResult> GetCampaignIdentifier([FromBody] ReportDto_GetCampaignIdentifier commonDetails)
        {
            CampaignIdentifier Campaign = new CampaignIdentifier();
            using var objDLform = DLCampaignIdentifier.GetDLCampaignIdentifier(commonDetails.accountId, SQLProvider);
            List<CampaignIdentifier> CampaignDetails = await objDLform.GetList(Campaign, 0, 0);
            return Json(CampaignDetails);
        }

        [HttpPost]
        public async Task<JsonResult> GetGroupList([FromBody] ReportDto_GetGroupList commonDetails)
        {
            using (var objDL = DLGroups.GetDLGroups(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDL.GetGroupList(new Groups()));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] ReportDto_GetMaxCount commonDetails)
        {
            DateTime? FromDateTime = null;
            DateTime? ToDateTime = null;
            if (!string.IsNullOrEmpty(commonDetails.fromDateTime) && !string.IsNullOrEmpty(commonDetails.toDateTime))
            {
                FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            }

            int returnVal;
            using (var objDL = DLWebPushReport.GetDLWebPushReport(commonDetails.accountId, SQLProvider))
            {
                returnVal = await objDL.MaxCount(FromDateTime, ToDateTime, commonDetails.CampaignName);
            }
            return Json(new
            {
                returnVal
            });
        }

        [HttpPost]
        public async Task<JsonResult> GetReportData([FromBody] ReportDto_GetReportData commonDetails)
        {
            List<MLWebPushReport> webpushDashboardDetails = null;

            DateTime? FromDateTime = null;
            DateTime? ToDateTime = null;
            if (!string.IsNullOrEmpty(commonDetails.fromDateTime) && !string.IsNullOrEmpty(commonDetails.toDateTime))
            {
                FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            }

            ArrayList data = new ArrayList() { commonDetails.CampaignName };
            HttpContext.Session.SetString("WebPushDashBoard", JsonConvert.SerializeObject(data));

            using (var objDL = DLWebPushReport.GetDLWebPushReport(commonDetails.accountId, SQLProvider))
            {
                webpushDashboardDetails = await objDL.GetReportData(FromDateTime, ToDateTime, commonDetails.OffSet, commonDetails.FetchNext, commonDetails.CampaignName);
            }

            return Json(webpushDashboardDetails);
        }

        [Log]
        [HttpPost]
        public async Task<IActionResult> ExportWebPushCampaignReport([FromBody] ReportDto_ExportWebPushCampaignReport commonDetails)
        {
            System.Data.DataSet dataSet = new System.Data.DataSet("General");

            List<MLWebPushReport> webpushDashboardDetails = null;

            var CampaignName = "";

            if (HttpContext.Session.GetString("WebPushDashBoard") != null && HttpContext.Session.GetString("webpushTemplate") != "null")
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("WebPushDashBoard"));
                CampaignName = JsonConvert.DeserializeObject<string>(data[0].ToString()); 
            }

            DateTime FromDateTimes = DateTime.ParseExact(commonDetails.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var objDL = DLWebPushReport.GetDLWebPushReport(commonDetails.AccountId, SQLProvider))
            {
                webpushDashboardDetails = await objDL.GetReportData(FromDateTimes, ToDateTime, commonDetails.OffSet, commonDetails.FetchNext, CampaignName);
            }

            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(commonDetails.AccountId, SQLProvider);
            var NewListData = webpushDashboardDetails.Select(x => new
            {
                CampaignIdentifier = x.Name,
                x.CampaignName,
                x.TemplateName,
                x.Title,
                MessageContent = !string.IsNullOrEmpty(x.MessageContent) ? x.MessageContent : "NA",
                OnClickRedirect = !string.IsNullOrEmpty(x.OnClickRedirect) ? x.OnClickRedirect : "NA",
                Button1_Redirect = !string.IsNullOrEmpty(x.Button1_Redirect) ? x.Button1_Redirect : "NA",
                Button2_Redirect = !string.IsNullOrEmpty(x.Button2_Redirect) ? x.Button2_Redirect : "NA",
                GroupName = x.SentTo,
                ScheduledDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.ScheduledDate)).ToString(),
                x.TotalSent,
                x.TotalView,
                x.TotalClick,
                x.TotalClose,
                TotalBlock = x.TotalNotSent
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTable();
            dataSet.Tables.Add(dtt);

            string FileName = "WebPushCampaignResponses_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> AddCampaignToGroups([FromBody] ReportDto_AddCampaignToGroups commonDetails)
        {
            LoginInfo user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs            
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(accountId, user.UserId, user.UserName, user.EmailId, "Report", "webpush", "AddCampaignToGroups", Helper.GetIP(), JsonConvert.SerializeObject(new { WebPushSendingSettingIdList = WebPushSendingSettingIdList, GroupId = GroupId, CampaignResponseValue = CampaignResponseValue }));
            //#endregion
            List<GroupMember> contactColumn = new List<GroupMember>();
            List<int> Groups = new List<int> { commonDetails.GroupId };
            List<Int64> TotalContactAdded = new List<Int64>();
            if (commonDetails.WebPushSendingSettingIdList != null && commonDetails.WebPushSendingSettingIdList.Count() > 0 && commonDetails.CampaignResponseValue != null && commonDetails.CampaignResponseValue.Count() > 0)
            {
                using (var webpushSent = DLWebPushSent.GetDLWebPushSent(commonDetails.accountId, SQLProvider))
                {
                    contactColumn = await webpushSent.GetContactIdList(commonDetails.WebPushSendingSettingIdList, commonDetails.CampaignResponseValue);
                }

                if (contactColumn != null && contactColumn.Count > 0)
                {
                    var MachineIds = contactColumn.Select(x => x.MachineId).ToArray();
                    int UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;

                    using (GeneralAddToGroups generalAddToGroups = new GeneralAddToGroups(commonDetails.accountId, SQLProvider))
                    {
                        Tuple<List<Int64>, List<Int64>, List<Int64>> tuple = await generalAddToGroups.AddToGroupMemberAndRespectiveModule(user.UserId, UserGroupId, Groups.ToArray(), MachineIds: MachineIds);
                        TotalContactAdded = tuple.Item2.Where(x => x > 0).ToList();
                    }
                    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = "The total contacts as been added into the group is " }), "The total contacts as been added into the group is " + TotalContactAdded.Count);
                    return Json("The total contacts as been added into the group is " + TotalContactAdded.Count);

                }
                else
                {
                    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = "The total contacts as been added into the group is 0" }), "The total contacts as been added into the group is 0");
                    return Json("The total contacts as been added into the group is 0");
                }
            }
            else
            {
                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = "Please select at least one campaign to add in the group / Please check the option to add to group" }), "Please select at least one campaign to add in the group / Please check the option to add to group");
                return Json("Please select at least one campaign to add in the group / Please check the option to add to group");
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> RemoveCampaignFromGroup([FromBody] ReportDto_RemoveCampaignFromGroup commonDetails)
        {
            bool result;
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            if (commonDetails.GroupId > 0 && commonDetails.WebPushSendingSettingIdList != null && commonDetails.WebPushSendingSettingIdList.Count() > 0 && commonDetails.CampaignResponseValue != null && commonDetails.CampaignResponseValue.Count() > 0)
            {
                using (var bLGroupMember = DLGroupMember.GetDLGroupMember(commonDetails.accountId, SQLProvider))
                {
                    result = await bLGroupMember.RemoveFromCampaigndGroupsForWebPush(commonDetails.GroupId, commonDetails.WebPushSendingSettingIdList, commonDetails.CampaignResponseValue);
                }

                if (result == true)
                {
                    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Result = "Contact(s) removed successfully." }), "The contacts has been removed from the group");
                    return Json("Contact(s) removed successfully.");
                }
                else
                {
                    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Result = "Action Remove was unsuccessful, Contact(s) not present in the group." }), "Unable to remove contact from the group");
                    return Json("Action Remove was unsuccessful");
                }
            }
            else
            {
                return Json("Please select atleast one campaign to remove from group/Please check the option to remove from group.");
            }


            //List<GroupMember> contactColumn = new List<GroupMember>();
            //if (WebPushSendingSettingIdList != null && WebPushSendingSettingIdList.Count() > 0 && CampaignResponseValue != null && CampaignResponseValue.Count() > 0)
            //{
            //    using (DLWebPushSent webpushSent = new DLWebPushSent(accountId))
            //    {
            //        contactColumn = webpushSent.GetContactIdList(WebPushSendingSettingIdList, CampaignResponseValue);
            //    }

            //    if (contactColumn != null && contactColumn.Count > 0)
            //    {
            //        int[] ContactIds = contactColumn.Select(x => x.ContactId).ToArray();
            //        using (DLContact objGroupMember = new DLContact(accountId))
            //        {
            //            result = objGroupMember.RemoveFromGroup(ContactIds, GroupId);
            //        }

            //        string[] machineIds = contactColumn.Select(x => x.MachineId).ToArray();
            //        using (DLWebPushGroupMembers objWebPushGroupMember = new DLWebPushGroupMembers(accountId))
            //        {
            //            result = objWebPushGroupMember.RemoveFromGroup(machineIds, GroupId);
            //        }

            //        if (result == true)
            //        {
            //            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = "Contact(s) removed successfully." }), "Contact(s) removed successfully from the selected campaign");
            //            return Json("Contact(s) removed successfully.");
            //        }
            //        else
            //        {
            //            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = "Action Remove was unsuccessful, Contact(s) not present in the group." }), "Unable to remove contact(s) from the selected campaign");
            //            return Json("Action Remove was unsuccessful, Contact(s) not present in the group.");
            //        }
            //    }
            //    else
            //    {
            //        //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = "No contact(s) was found for Remove action." }), "No contact(s) was found for Remove action.");
            //        return Json("No contact(s) was found for Remove action.");
            //    }
            //}
            //else
            //{
            //    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = "Please select atleast one campaign to remove from group/Please check the option to remove from group." }), "Unable to remove contact(s) fom the selected campaign");
            //    return Json("Please select atleast one campaign to remove from group/Please check the option to remove from group.");
            //}
        }

        [HttpPost]
        public async Task<JsonResult> GetCampaignResponseData([FromBody] ReportDto_GetCampaignResponseData commonDetails)
        {
            System.Data.DataSet dataSet = new System.Data.DataSet("General");
            List<MLWebPushCampaign> webpush = new List<MLWebPushCampaign>();
            using (var obj = DLWebPushReport.GetDLWebPushReport(commonDetails.AdsId, SQLProvider))
            {
                webpush = await obj.GetWebPushCampaignResponseData(commonDetails.SendingSettingId);
            }
            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(commonDetails.AdsId, SQLProvider);
            var NewListData = webpush.Select(x => new
            {
                MachineId = !string.IsNullOrEmpty(x.MachineId) ? x.MachineId : "NA",
                CampaignName = !string.IsNullOrEmpty(x.CampaignName) ? x.CampaignName : "NA",
                TemplateName = !string.IsNullOrEmpty(x.TemplateName) ? x.TemplateName : "NA",
                IsSent = x.IsSent == 0 ? false : true,
                IsViewed = x.IsViewed == 0 ? false : true,
                IsClicked = x.IsClicked == 0 ? false : true,
                IsClosed = x.IsClosed == 0 ? false : true,
                IsUnSubScribed = x.IsUnSubScribed == 0 ? false : true,
                SentDate = x.SentDate != null ? Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.SentDate)).ToString() : "NA",
                ViewedDate = x.ViewedDate != null ? Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.ViewedDate)).ToString() : "NA",
                ClickedDate = x.ClickedDate != null ? Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.ClickedDate)).ToString() : "NA",
                ClosedDate = x.ClosedDate != null ? Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.ClosedDate)).ToString() : "NA",
                UnSubScribedDate = x.UnSubScribedDate != null ? Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.UnSubScribedDate)).ToString() : "NA",
                ResponseId = !string.IsNullOrEmpty(x.ResponseId) ? x.ResponseId : "NA",
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTable();
            dataSet.Tables.Add(dtt);

            string FileName = "WebPushCampaignResponse_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;

            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }
    }
}
