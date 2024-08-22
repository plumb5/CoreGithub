using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.WhatsApp.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.WhatsApp.Controllers
{
    [Area("WhatsApp")]
    public class ReportController : BaseController
    {
        public ReportController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /WhatsApp/Report/

        public IActionResult Index()
        {
            return View("Report");
        }

        public async Task<JsonResult> GetMaxCount([FromBody] Report_GetMaxCountDto ReportDto)
        {
            DateTime? FromDateTime = null, ToDateTime = null;
            if (!string.IsNullOrEmpty(ReportDto.fromDateTime) && !string.IsNullOrEmpty(ReportDto.toDateTime))
            {
                FromDateTime = DateTime.ParseExact(ReportDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                ToDateTime = DateTime.ParseExact(ReportDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            }

            int returnVal;
            using (var objBL =   DLWhatsAppReport.GetDLWhatsAppReport(ReportDto.accountId,SQLProvider))
            {
                returnVal = await objBL.MaxCount(FromDateTime, ToDateTime, ReportDto.CampaignName, ReportDto.TemplateName, ReportDto.WhatsAppSendingSettingId);
            }
            return Json(new
            {
                returnVal
            });
        }

        public async Task<JsonResult> GetReportData([FromBody] Report_GetReportDataDto ReportDto)
        {
            List<MLWhatsAppReport> whatsappDashboardDetails = null;
            DateTime? FromDateTime = null, ToDateTime = null;
            if (!string.IsNullOrEmpty(ReportDto.fromDateTime) && !string.IsNullOrEmpty(ReportDto.toDateTime))
            {
                FromDateTime = DateTime.ParseExact(ReportDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                ToDateTime = DateTime.ParseExact(ReportDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            }
            ArrayList data = new ArrayList() { ReportDto.CampaignName, ReportDto.TemplateName, ReportDto.WhatsAppSendingSettingId }; 
            HttpContext.Session.SetString("WhatsAppDashBoard", JsonConvert.SerializeObject(data));
            using (var objBL =   DLWhatsAppReport.GetDLWhatsAppReport(ReportDto.accountId,SQLProvider))
            {
                whatsappDashboardDetails = await objBL.GetReportData(FromDateTime, ToDateTime, ReportDto.OffSet, ReportDto.FetchNext, ReportDto.CampaignName, ReportDto.TemplateName, ReportDto.WhatsAppSendingSettingId);
            }

            return Json(whatsappDashboardDetails);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> GetCampaignResponseData([FromBody] Report_GetCampaignResponseDataDto ReportDto)
        {
            System.Data.DataSet dataSet = new System.Data.DataSet("General");
            List<MLWhatsaAppCampaign> whatsappcampaign = new List<MLWhatsaAppCampaign>();
            using (var obj =   DLWhatsAppSent.GetDLWhatsAppSent(ReportDto.AdsId,SQLProvider))
            {
                whatsappcampaign = await obj.GetWhatsAppCampaignResponseData(ReportDto.SendingSettingId);
            }

            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(ReportDto.AdsId,SQLProvider);

            var NewListData = whatsappcampaign.Select(x => new
            {
                CampaignName = !string.IsNullOrEmpty(x.CampaignName) ? x.CampaignName : "NA",
                TemplateName = !string.IsNullOrEmpty(x.TemplateName) ? x.TemplateName : "NA",
                x.PhoneNumber,
                Sent = x.IsSent == 0 ? false : true,
                Delivered = x.IsDelivered == 0 ? false : true,
                Clicked = x.IsClicked == 0 ? false : true,
                Read = x.IsRead == 0 || x.IsRead == null ? false : true,
                Failed = x.IsFailed == 0 ? false : true,
                OptOut = x.IsUnsubscribed,
                SentDate = x.SentDate != null ? Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.SentDate)).ToString() : "NA",
                DeliveredDate = x.DeliveredDate != null ? Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.DeliveredDate)).ToString() : "NA",
                ClickedDate = x.ClickedDate != null ? Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.ClickedDate)).ToString() : "NA",
                ReadDate = x.ReadDate != null ? Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.ReadDate)).ToString() : "NA",
                OptOutDate = x.UnsubscribedDate != null ? Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.UnsubscribedDate)).ToString() : "NA",
                ReasonForNotDelivery = !string.IsNullOrEmpty(x.ErrorMessage) ? x.ErrorMessage : "NA",
                ResponseId = x.ResponseId != null ? x.ResponseId : "NA",
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTable();
            dataSet.Tables.Add(dtt);

            string FileName = "whatsappCampaignResponse_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + ReportDto.FileType;

            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (ReportDto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath } );
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ExportWhatsAppCampaignReport([FromBody] Report_ExportWhatsAppCampaignReportDto ReportDto)
        {
            System.Data.DataSet dataSet = new System.Data.DataSet("General");

            List<MLWhatsAppReport> whatsappDashboardDetails = null;
            string CampaignName = null;
            string TemplateName = null;
            int WhatsAppSendingSettingId = 0;

            if (HttpContext.Session.GetString("whatsappDashboard") != null )
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("whatsappDashboard")); 
                CampaignName = (string?)data[0];
                TemplateName = (string?)data[1];
                WhatsAppSendingSettingId =  Convert.ToInt32(data[2]);
            }

            DateTime FromDateTimes = DateTime.ParseExact(ReportDto.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(ReportDto.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var objBL =   DLWhatsAppReport.GetDLWhatsAppReport(ReportDto.AccountId,SQLProvider))
            {
                whatsappDashboardDetails =await  objBL.GetReportData(FromDateTimes, ToDateTime, ReportDto.OffSet, ReportDto.FetchNext, CampaignName, TemplateName, WhatsAppSendingSettingId);
            }

            var NewListData = whatsappDashboardDetails.Select(x => new
            {
                CampaignIdentifier = x.Name,
                x.CampaignName,
                x.TemplateName,
                GroupName = x.SentTo,
                ScheduledDate = x.ScheduledDate,
                x.TotalSent,
                x.TotalDelivered,
                x.TotalRead,
                x.TotalClick,
                TotalFailed = x.TotalFailed,
                TotalOutput = x.TotalUnsubscribed,
                TotalPending = (x.TotalSent - x.TotalDelivered - x.TotalFailed),
                TemplateContent = x.TemplateContent,
                x.TotalNotSent,
                DeliveryRate = (x.TotalDelivered != 0 ? Math.Round((Decimal)((x.TotalDelivered * 100) / x.TotalSent)) : 0) + "%",
                ReadRate = (x.TotalRead != 0 ? Math.Round((Decimal)((x.TotalRead * 100) / x.TotalSent)) : 0) + "%",
                x.ConfigurationName
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTable();
            dataSet.Tables.Add(dtt);

            string FileName = "WhatsAppCampaignResponses_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + ReportDto.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (ReportDto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath } );
        }

        [Log]
        public async Task<JsonResult> AddCampaignToGroups([FromBody] Report_AddCampaignToGroupsDto ReportDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            List<GroupMember> contactColumn = new List<GroupMember>();
            List<int> Groups = new List<int> { ReportDto.GroupId };
            List<Int64> TotalContactAdded = new List<Int64>();
            if (ReportDto.WhatsAppSendingSettingIdList != null && ReportDto.WhatsAppSendingSettingIdList.Count() > 0 && ReportDto.CampaignResponseValue != null && ReportDto.CampaignResponseValue.Count() > 0)
            {
                using (var whatsappsent =   DLWhatsAppSent.GetDLWhatsAppSent(domainDetails.AdsId,SQLProvider))
                {
                    contactColumn = await whatsappsent.GetContactIdList(ReportDto.WhatsAppSendingSettingIdList, ReportDto.CampaignResponseValue);
                }

                if (contactColumn != null && contactColumn.Count > 0)
                {
                    var ContactIds = contactColumn.Select(x => x.ContactId).ToArray();
                    int UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
                    using (GeneralAddToGroups generalAddToGroups = new GeneralAddToGroups(domainDetails.AdsId,SQLProvider))
                    {
                        Tuple<List<Int64>, List<Int64>, List<Int64>> tuple = await generalAddToGroups.AddToGroupMemberAndRespectiveModule(user.UserId, UserGroupId, Groups.ToArray(), ContactIds);
                        TotalContactAdded = tuple.Item1.Where(x => x > 0).ToList();
                    }

                    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = "The total contacts as been added into the group is " }), "The total contacts as been added into the group is " + TotalContactAdded.Count);
                    return Json("The total contacts as been added into the group is " + TotalContactAdded.Count );

                }
                else
                {
                    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = "The total contacts as been added into the group is 0" }), "The total contacts as been added into the group is 0");
                    return Json("The total contacts as been added into the group is 0" );
                }
            }
            else
            {
                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = "Please select at least one campaign to add in the group / Please check the option to add to group" }), "Please select at least one campaign to add in the group / Please check the option to add to group");
                return Json("Please select at least one campaign to add in the group / Please check the option to add to group" );
            }
        }

        [Log]
        public async Task<JsonResult> RemoveCampaignFromGroup([FromBody] Report_RemoveCampaignFromGroupDto ReportDto)
        {
            bool result;
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));


            if (ReportDto.GroupId > 0 && ReportDto.WhatsAppSendingSettingIdList != null && ReportDto.WhatsAppSendingSettingIdList.Count() > 0 && ReportDto.CampaignResponseValue != null && ReportDto.CampaignResponseValue.Count() > 0)
            {
                using (var dLGroupMember =   DLGroupMember.GetDLGroupMember(domainDetails.AdsId,SQLProvider))
                {
                    result = await dLGroupMember.RemoveFromCampaigndGroupsForWhatsApp(ReportDto.GroupId, ReportDto.WhatsAppSendingSettingIdList, ReportDto.CampaignResponseValue);
                }

                if (result == true)
                {
                    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Result = "Contact(s) removed successfully." }), "The contacts has been removed from the group");
                    return Json("Contact(s) removed successfully." );
                }
                else
                {
                    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Result = "Action Remove was unsuccessful, Contact(s) not present in the group." }), "Unable to remove contact from the group");
                    return Json("Action Remove was unsuccessful" );
                }
            }
            else
            {
                return Json("Please select atleast one campaign to remove from group/Please check the option to remove from group." );
            }

            //List<GroupMember> contactColumn = new List<GroupMember>();
            //if (WhatsAppSendingSettingIdList != null && WhatsAppSendingSettingIdList.Count() > 0 && CampaignResponseValue != null && CampaignResponseValue.Count() > 0)
            //{
            //using (DLWhatsAppSent whatsappsent = new DLWhatsAppSent(domainDetails.AdsId))
            //{
            //    contactColumn = whatsappsent.GetContactIdList(WhatsAppSendingSettingIdList, CampaignResponseValue);
            //}

            //    if (contactColumn != null && contactColumn.Count > 0)
            //    {
            //        int[] ContactIds = contactColumn.Select(x => x.ContactId).ToArray();
            //        using (BLContact objGroupMember = new BLContact(domainDetails.AdsId))
            //        {
            //            result = objGroupMember.RemoveFromGroup(ContactIds, GroupId);
            //        }

            //        string[] machineIds = contactColumn.Select(x => x.MachineId).ToArray();
            //        using (BLWebPushGroupMembers objWebPushGroupMember = new BLWebPushGroupMembers(domainDetails.AdsId))
            //        {
            //            result = objWebPushGroupMember.RemoveFromGroup(machineIds, GroupId);
            //        }

            //        if (result == true)
            //        {
            //            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = "Contact(s) removed successfully." }), "Contact(s) removed successfully from the selected campaign");
            //            return Json("Contact(s) removed successfully.", JsonRequestBehavior.AllowGet);
            //        }
            //        else
            //        {
            //            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = "Action Remove was unsuccessful, Contact(s) not present in the group." }), "Unable to remove contact(s) from the selected campaign");
            //            return Json("Action Remove was unsuccessful, Contact(s) not present in the group.", JsonRequestBehavior.AllowGet);
            //        }
            //    }
            //    else
            //    {
            //        //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = "No contact(s) was found for Remove action." }), "No contact(s) was found for Remove action.");
            //        return Json("No contact(s) was found for Remove action.", JsonRequestBehavior.AllowGet);
            //    }
            //}
            //else
            //{
            //    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = "Please select atleast one campaign to remove from group/Please check the option to remove from group." }), "Unable to remove contact(s) fom the selected campaign");
            //    return Json("Please select atleast one campaign to remove from group/Please check the option to remove from group.", JsonRequestBehavior.AllowGet);
            //}
        }

    }
}

