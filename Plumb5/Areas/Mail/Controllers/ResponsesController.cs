using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Mail.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class ResponsesController : BaseController
    {
        public ResponsesController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            ViewBag.AdsId = domainDetails.AdsId;
            return View("Responses");
        }

        public async Task<JsonResult> MaxCount([FromBody] Responses_MaxCountDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            int returnVal;
            using (var objDL = DLMailCampaignResponses.GetDLMailCampaignResponses(domainDetails.AdsId, SQLProvider))
            {
                returnVal = await objDL.MaxCount(FromDateTime, ToDateTime, details.mailCampaignId, details.mailTemplateId);
            }
            return Json(new
            {
                returnVal
            });
        }

        public async Task<JsonResult> GetResponseData([FromBody] Responses_GetResponseDataDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            List<MLMailCampaignResponses> responsedetails = null;

            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            ArrayList data = new ArrayList() { details.mailCampaignId, details.mailTemplateId };
            HttpContext.Session.SetString("MailResponses", JsonConvert.SerializeObject(data));

            using (var objDL = DLMailCampaignResponses.GetDLMailCampaignResponses(domainDetails.AdsId, SQLProvider))
            {
                responsedetails = await objDL.GetResponseData(FromDateTime, ToDateTime, details.OffSet, details.FetchNext, details.mailCampaignId, details.mailTemplateId);
            }

            return Json(responsedetails);
        }

        public async Task<JsonResult> GetSplitData([FromBody] Responses_GetSplitDataDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            List<MLMailDripForMails> objMLMailDrips = new List<MLMailDripForMails>();
            using (var objDrips = DLMailDripForMails.GetDLMailDripForMails(domainDetails.AdsId, SQLProvider))
            {
                objMLMailDrips = await objDrips.GetReport(details.MailSendingSettingId);
            }

            return Json(objMLMailDrips);
        }

        public async Task<JsonResult> GetMailSentDetails([FromBody] Responses_GetMailSentDetailsDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            using (var objDrips = DLMailSendingSetting.GetDLMailSendingSetting(domainDetails.AdsId, SQLProvider))
            {
                return Json(await objDrips.GetDetail(details.MailSendingSettingId));
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> GetCampaignResponseData([FromBody] Responses_GetCampaignResponseDataDto details)
        {
            System.Data.DataSet dataSet = new System.Data.DataSet("General");
            List<MLMailCampaign> MailCampaign = new List<MLMailCampaign>();
            using (var obj = DLMailSent.GetDLMailSent(details.AdsId, SQLProvider))
            {
                MailCampaign = await obj.GetCampaignResponseData(details.SendingSettingId);
            }

            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(details.AdsId, SQLProvider);

            var NewListData = MailCampaign.Select(x => new
            {
                x.EmailId,
                Sent = x.IsSent == 0 ? false : true,
                Opened = x.IsOpened == 0 ? false : true,
                Clicked = x.IsClicked == 0 ? false : true,
                TotalUniqueClick = x.MultipleClickCount,
                OptOut = x.IsUnsubscribed,
                UnsubscribedDate = x.UnsubscribedDate != null ? Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.UnsubscribedDate)).ToString() : "NA",
                Bounced = x.IsBounced == 1 ? true : false,
                Error = x.ErrorMessage != null ? x.ErrorMessage : "NA",
                SentDate = x.SentDate != null ? Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.SentDate)).ToString() : "NA",
                OpenedDate = x.OpenedDate != null ? Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.OpenedDate)).ToString() : "NA",
                ClickedDate = x.ClickedDate != null ? Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.ClickedDate)).ToString() : "NA",
                OptOutDate = x.UnsubscribedDate != null ? Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.UnsubscribedDate)).ToString() : "NA",
                BouncedDate = x.ClickedDate != null ? Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.UnsubscribedDate)).ToString() : "NA",
                ReasonForNotDelivery = !string.IsNullOrEmpty(x.ErrorMessage) ? x.ErrorMessage : "NA",
                ResponseId = x.ResponseId != null ? x.ResponseId : "NA",
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTable();
            dataSet.Tables.Add(dtt);

            string FileName = "MailCampaignResponse_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;

            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (details.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }

        [Log]
        public async Task<JsonResult> AddCampaignToGroups([FromBody] Responses_AddCampaignToGroupsDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "Responses", "Mail", "AddCampaignToGroups", Helper.GetIP(), JsonConvert.SerializeObject(new { MailSendingSettingId = MailSendingSettingId, GroupId = GroupId, CampaignResponseValue = CampaignResponseValue }));
            //#endregion

            List<GroupMember> contactColumn = new List<GroupMember>();
            List<int> Groups = new List<int> { details.GroupId };
            List<Int64> TotalContactAdded = new List<Int64>();
            if (details.MailSendingSettingId != null && details.MailSendingSettingId.Count() > 0 && details.CampaignResponseValue != null && details.CampaignResponseValue.Count() > 0)
            {
                using (var mailSent = DLMailSent.GetDLMailSent(domainDetails.AdsId, SQLProvider))
                {
                    contactColumn = await mailSent.GetContactIdList(details.MailSendingSettingId, details.CampaignResponseValue);
                }

                if (contactColumn != null && contactColumn.Count > 0)
                {
                    var ContactIds = contactColumn.Select(x => x.ContactId).ToArray();
                    int UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;

                    using (GeneralAddToGroups generalAddToGroups = new GeneralAddToGroups(domainDetails.AdsId, SQLProvider))
                    {
                        Tuple<List<Int64>, List<Int64>, List<Int64>> tuple = await generalAddToGroups.AddToGroupMemberAndRespectiveModule(user.UserId, UserGroupId, Groups.ToArray(), ContactIds);
                        TotalContactAdded = tuple.Item1.Where(x => x > 0).ToList();
                    }

                    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Result = "The total contacts as been added into the group is " + TotalContactAdded.Count }), "The total contacts as been added into the group is " + TotalContactAdded.Count);
                    return Json("The total contacts as been added into the group is " + TotalContactAdded.Count);

                }
                else
                {
                    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Result = "The total contacts as been added into the group is 0" }), "Unable to add contacts to the group");
                    return Json("The total contacts as been added into the group is 0");
                }
            }
            else
            {
                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Result = "Please select atleast one campaign to add in group/Please check the option to add to group." }), "Unable to add contacts to the group");
                return Json("Please select atleast one campaign to add in group/Please check the option to add to group.");
            }
        }

        [Log]
        public async Task<JsonResult> RemoveCampaignFromGroup([FromBody] Responses_RemoveCampaignFromGroupDto details)
        {
            bool result;
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "Responses", "Mail", "RemoveCampaignFromGroup", Helper.GetIP(), JsonConvert.SerializeObject(new { MailSendingSettingId = MailSendingSettingId, GroupId = GroupId, CampaignResponseValue = CampaignResponseValue }));
            //#endregion

            if (details.GroupId > 0 && details.MailSendingSettingId != null && details.MailSendingSettingId.Count() > 0 && details.CampaignResponseValue != null && details.CampaignResponseValue.Count() > 0)
            {
                using (var bLGroupMember = DLGroupMember.GetDLGroupMember(domainDetails.AdsId, SQLProvider))
                {
                    result = await bLGroupMember.RemoveFromCampaigndGroupsForMail(details.GroupId, details.MailSendingSettingId, details.CampaignResponseValue);
                }

                if (result == true)
                {
                    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Result = "Contact(s) removed successfully." }), "The contacts has been removed from the group");
                    return Json("Contact(s) removed successfully");
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
            //if (MailSendingSettingId != null && MailSendingSettingId.Count() > 0 && CampaignResponseValue != null && CampaignResponseValue.Count() > 0)
            //{
            //    using (DLMailSent mailSent = new DLMailSent(domainDetails.AdsId))
            //    {
            //        contactColumn = mailSent.GetContactIdList(MailSendingSettingId, CampaignResponseValue);
            //    }

            //    if (contactColumn != null && contactColumn.Count > 0)
            //    {
            //        int[] ContactIds = contactColumn.Select(x => x.ContactId).ToArray();
            //        using (DLContact objGroupMember = new DLContact(domainDetails.AdsId))
            //        {
            //            result = objGroupMember.RemoveFromGroup(ContactIds, GroupId);
            //        }

            //        string[] machineIds = contactColumn.Select(x => x.MachineId).Where(y=>y !=null).ToArray();
            //            using (DLWebPushGroupMembers objWebPushGroupMember = new DLWebPushGroupMembers(domainDetails.AdsId))
            //            {
            //                result = objWebPushGroupMember.RemoveFromGroup(machineIds, GroupId);
            //            }

            //        // Remove above lines
            //        //Add your new dl and bl

            //        if (result == true)
            //        {
            //            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Result = "Contact(s) removed successfully." }), "The contacts has been removed from the group");
            //            return Json("Contact(s) removed successfully.", JsonRequestBehavior.AllowGet);
            //        }
            //        else
            //        {
            //            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Result = "Action Remove was unsuccessful, Contact(s) not present in the group." }), "Unable to remove contact from the group");
            //            return Json("Action Remove was unsuccessful, Contact(s) not present in the group.", JsonRequestBehavior.AllowGet);
            //        }
            //    }
            //    else
            //    {
            //        //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Result = "No contact(s) was found for Remove action." }), "Unable to remove contact from the group");
            //        return Json("No contact(s) was found for Remove action.", JsonRequestBehavior.AllowGet);
            //    }
            //}
            //else
            //{
            //    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Result = "Please select atleast one campaign to remove from group/Please check the option to remove from group." }), "Unable to remove contact from the group");
            //    return Json("Please select atleast one campaign to remove from group/Please check the option to remove from group.", JsonRequestBehavior.AllowGet);
            //}
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Export([FromBody] Responses_ExportDto details)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");

                List<MLMailCampaignResponses> responsedetails = null;

                int mailCampaignId = 0;
                int mailTemplateId = 0;
                DateTime fromDateTime = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime toDateTime = DateTime.ParseExact(details.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);


                if (HttpContext.Session.GetString("MailResponses") != null)
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("MailResponses"));

                    mailCampaignId = Convert.ToInt32(data[0]);
                    mailTemplateId = Convert.ToInt32(data[1]);
                }

                using (var objDL = DLMailCampaignResponses.GetDLMailCampaignResponses(details.AccountId, SQLProvider))
                {
                    responsedetails = await objDL.GetResponseData(fromDateTime, toDateTime, details.OffSet, details.FetchNext, mailCampaignId, mailTemplateId);
                }
                string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(details.AccountId, SQLProvider);
                var NewListData = responsedetails.Select(x => new
                {
                    x.TemplateName,
                    x.CampaignIdentifier,
                    x.CampaignName,
                    x.GroupName,
                    x.Subject,
                    CreatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.CreatedDate)).ToString(),
                    UpdatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.UpdatedDate)).ToString(),
                    ScheduledDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.ScheduledDate)).ToString(),
                    x.TotalSent,
                    x.TotalDelivered,
                    x.TotalOpen,
                    x.TotalClick,
                    x.TotalForward,
                    x.TotalUnsubscribe,
                    x.TotalBounced,
                    Error = x.TotalNotSent,
                    x.UniqueClick,
                    x.URL,
                    OpenRate = x.TotalSent > 0 ? Math.Round((Decimal)((x.TotalOpen * 100) / x.TotalSent)) + "%" : "0%",
                    ClickRate = x.TotalSent > 0 ? Math.Round((Decimal)((x.TotalClick * 100) / x.TotalSent)) + "%" : "0%",
                    x.ConfigurationName
                });

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTable();
                dataSet.Tables.Add(dtt);

                string FileName = "MailCampaignResponse_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (details.FileType.ToLower() == "csv")
                    Helper.SaveDataSetToCSV(dataSet, MainPath);
                else
                    Helper.SaveDataSetToExcel(dataSet, MainPath);

                MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

                return Json(new { Status = true, MainPath });
            }
            else
            {
                return Json(new { Status = false });
            }
        }
    }
}
