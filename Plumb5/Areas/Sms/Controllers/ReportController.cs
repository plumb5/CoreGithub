using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Sms.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.Sms.Controllers
{
    [Area("Sms")]
    public class ReportController : BaseController
    {
        public ReportController(IConfiguration _configuration) : base(_configuration)
        { }

        public IActionResult Index()
        {
            return View("Report");
        }

        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] ReportDto_GetMaxCount commonDetails)
        {
            DateTime FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            int returnVal;
            using (var objDL = DLSmsReport.GetDLSmsReport(commonDetails.accountId, SQLProvider))
            {
                returnVal = await objDL.MaxCount(FromDateTime, ToDateTime, commonDetails.CampaignName, commonDetails.TemplateName);
            }
            return Json(new
            {
                returnVal
            });
        }

        [HttpPost]
        public async Task<JsonResult> GetReportData([FromBody] ReportDto_GetReportData commonDetails)
        {
            List<MLSmsReport> smsDashboardDetails = null;
            DateTime FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            ArrayList data = new ArrayList() { commonDetails.CampaignName, commonDetails.TemplateName };
            HttpContext.Session.SetString("SmsDashBoard", JsonConvert.SerializeObject(data));

            using (var objDL = DLSmsReport.GetDLSmsReport(commonDetails.accountId, SQLProvider))
            {
                smsDashboardDetails = await objDL.GetReportData(FromDateTime, ToDateTime, commonDetails.OffSet, commonDetails.FetchNext, commonDetails.CampaignName, commonDetails.TemplateName);
            }

            return Json(smsDashboardDetails);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> GetCampaignResponseData([FromBody] ReportDto_GetCampaignResponseData commonDetails)
        {
            System.Data.DataSet dataSet = new System.Data.DataSet("General");
            List<MLSmsCampaign> SmsCampaign = new List<MLSmsCampaign>();
            using (var obj = DLSmsSent.GetDLSmsSent(commonDetails.AdsId, SQLProvider))
            {
                SmsCampaign = (await obj.GetSMSCampaignResponseData(commonDetails.SendingSettingId)).ToList();
            }

            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(commonDetails.AdsId, SQLProvider);

            var NewListData = SmsCampaign.Select(x => new
            {
                CampaignName = !string.IsNullOrEmpty(x.CampaignName) ? x.CampaignName : "NA",
                TemplateName = !string.IsNullOrEmpty(x.TemplateName) ? x.TemplateName : "NA",
                x.PhoneNumber,
                Sent = x.IsSent == 0 ? false : true,
                Delivered = x.IsDelivered == 0 ? false : true,
                Clicked = x.IsClicked == 0 ? false : true,
                Bounced = x.IsBounced == 0 ? false : true,
                OptOut = x.IsUnsubscribed,
                SentDate = x.SentDate != null ? Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.SentDate)).ToString() : "NA",
                DeliveredDate = x.DeliveryTime != null ? Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.DeliveryTime)).ToString() : "NA",
                ClickedDate = x.ClickedDate != null ? Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.ClickedDate)).ToString() : "NA",
                BouncedDate = x.BouncedDate != null ? Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.BouncedDate)).ToString() : "NA",
                OptOutDate = x.UnSubScribedDate != null ? Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.UnSubScribedDate)).ToString() : "NA",
                ReasonForNotDelivery = !string.IsNullOrEmpty(x.ReasonForNotDelivery) ? x.ReasonForNotDelivery : "NA",
                ResponseId = !string.IsNullOrEmpty(x.ResponseId) ? x.ResponseId : "NA"
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTable();
            dataSet.Tables.Add(dtt);

            string FileName = "SmsCampaignResponse_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;

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
        public async Task<IActionResult> ExportSmsCampaignReport([FromBody] ReportDto_ExportSmsCampaignReport commonDetails)
        {
            System.Data.DataSet dataSet = new System.Data.DataSet("General");

            List<MLSmsReport> smsDashboardDetails = null;
            string CampaignName = null;
            string TemplateName = null;

            if (HttpContext.Session.GetString("SmsDashBoard") != null)
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("SmsDashBoard"));
                CampaignName = Convert.ToString(data[0]);
                TemplateName = Convert.ToString(data[1]);
            }

            DateTime FromDateTimes = DateTime.ParseExact(commonDetails.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var objDL = DLSmsReport.GetDLSmsReport(commonDetails.AccountId, SQLProvider))
            {
                smsDashboardDetails = await objDL.GetReportData(FromDateTimes, ToDateTime, commonDetails.OffSet, commonDetails.FetchNext, CampaignName, TemplateName);
            }

            var NewListData = smsDashboardDetails.Select(x => new
            {
                CampaignIdentifier = x.Name,
                x.CampaignName,
                x.TemplateName,
                GroupName = x.SentTo,
                CampaignType = x.IsPromotionalOrTransactionalType == true ? "Transactional" : "Promotional",
                x.ScheduledDate,
                x.TotalSent,
                x.TotalDelivered,
                TotalPending = x.TotalSent - x.TotalDelivered - x.TotalNotDeliverStatus,
                x.TotalClick,
                TotalBounced = x.TotalNotDeliverStatus,
                Error = x.TotalNotSent,
                x.MessageContent,
                x.ConfigurationName,
                TemplateWithVairable = !string.IsNullOrEmpty(Convert.ToString(x.MessageContent)) ? x.MessageContent.ToString().Contains("[{*") || x.MessageContent.ToString().Contains("{{*") ? "True" : "False" : "False",
                CountWithoutVairable = !string.IsNullOrEmpty(Convert.ToString(x.MessageContent)) ? x.MessageContent.ToString().Contains("[{*") || x.MessageContent.ToString().Contains("{{*") ? x.MessageContent.ToString().Length : x.MessageContent.ToString().Length : x.MessageContent.ToString().Length,
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTable();
            dataSet.Tables.Add(dtt);

            string FileName = "SmsCampaignResponses_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
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
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            List<GroupMember> contactColumn = new List<GroupMember>();
            List<int> Groups = new List<int> { commonDetails.GroupId };
            List<long> TotalContactAdded = new List<long>();
            if (commonDetails.SmsSendingSettingIdList != null && commonDetails.SmsSendingSettingIdList.Count() > 0 && commonDetails.CampaignResponseValue != null && commonDetails.CampaignResponseValue.Count() > 0)
            {
                using (var smsSent = DLSmsSent.GetDLSmsSent(domainDetails.AdsId, SQLProvider))
                {
                    contactColumn = (await smsSent.GetContactIdList(commonDetails.SmsSendingSettingIdList, commonDetails.CampaignResponseValue)).ToList();
                }

                if (contactColumn != null && contactColumn.Count > 0)
                {
                    var ContactIds = contactColumn.Select(x => x.ContactId).ToArray();
                    int UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
                    using (GeneralAddToGroups generalAddToGroups = new GeneralAddToGroups(domainDetails.AdsId, SQLProvider))
                    {
                        Tuple<List<long>, List<long>, List<long>> tuple = await generalAddToGroups.AddToGroupMemberAndRespectiveModule(user.UserId, UserGroupId, Groups.ToArray(), ContactIds);
                        TotalContactAdded = tuple.Item1.Where(x => x > 0).ToList();
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
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs            
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "Report", "Sms", "RemoveCampaignFromGroup", Helper.GetIP(), JsonConvert.SerializeObject(new { SmsSendingSettingIdList = SmsSendingSettingIdList, GroupId = GroupId, CampaignResponseValue = CampaignResponseValue }));
            //#endregion           

            if (commonDetails.GroupId > 0 && commonDetails.SmsSendingSettingIdList != null && commonDetails.SmsSendingSettingIdList.Count() > 0 && commonDetails.CampaignResponseValue != null && commonDetails.CampaignResponseValue.Count() > 0)
            {
                using (var bLGroupMember = DLGroupMember.GetDLGroupMember(domainDetails.AdsId, SQLProvider))
                {
                    result = await bLGroupMember.RemoveFromCampaigndGroupsForSms(commonDetails.GroupId, commonDetails.SmsSendingSettingIdList, commonDetails.CampaignResponseValue);
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
            //if (SmsSendingSettingIdList != null && SmsSendingSettingIdList.Count() > 0 && CampaignResponseValue != null && CampaignResponseValue.Count() > 0)
            //{
            //    using (DLSmsSent smsSent = new DLSmsSent(domainDetails.AdsId))
            //    {
            //        contactColumn = smsSent.GetContactIdList(SmsSendingSettingIdList, CampaignResponseValue);
            //    }

            //    if (contactColumn != null && contactColumn.Count > 0)
            //    {
            //        int[] ContactIds = contactColumn.Select(x => x.ContactId).ToArray();
            //        using (DLContact objGroupMember = new DLContact(domainDetails.AdsId))
            //        {
            //            result = objGroupMember.RemoveFromGroup(ContactIds, GroupId);
            //        }

            //        string[] machineIds = contactColumn.Select(x => x.MachineId).ToArray();
            //        using (DLWebPushGroupMembers objWebPushGroupMember = new DLWebPushGroupMembers(domainDetails.AdsId))
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
    }
}
