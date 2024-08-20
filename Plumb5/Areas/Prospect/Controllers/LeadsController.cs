using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralML;
using Plumb5.Controllers;
using P5GenralDL;
using System.Collections;
using System.Reflection;
using Plumb5GenralFunction;
using System.Globalization;
using System.Text;
using IP5GenralDL;
using Microsoft.Identity.Client;
using Plumb5.Areas.Prospect.Models;
using Mono.TextTemplating;
using Plumb5.Areas.Prospect.Dto;
using Plumb5.Areas.Sms.Models;
using static Plumb5.Areas.Prospect.Controllers.LeadsController;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class LeadsController : BaseController
    {
        
        public LeadsController(IConfiguration _configuration) : base(_configuration)
        {
              
        } 
        //
        // GET: /Prospect/Leads/

        public IActionResult Index()
        {
            return View("Leads");
        }

        public async Task<JsonResult> GetMaxCount([FromBody]Leads_GetMaxCountDto LeadsDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            int LmsCount = 0;
            if (user != null)
            {
                int userHierarchyUserId = 0;
                int SenioruserHierarchyUserId = 0;
                List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
                List<UserHierarchy> userHierarchygroup = new List<UserHierarchy>();
                if (LeadsDto.filterLead.UserInfoUserId == 0)
                {
                    userHierarchyUserId = user.UserId;
                    SenioruserHierarchyUserId = user.UserId;
                    using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                    {
                        userHierarchy = await objUserHierarchy.GetHisUsers(userHierarchyUserId);
                        userHierarchy.Add(await objUserHierarchy.GetHisDetails(userHierarchyUserId));
                        userHierarchygroup = await objUserHierarchy.GetPermissionUsers(userHierarchyUserId);

                        if (userHierarchygroup != null && userHierarchygroup.Count > 0)
                            for (int i = 0; i < userHierarchygroup.Count; i++)
                            {
                                userHierarchy.Add(await objUserHierarchy.GetHisDetails(userHierarchygroup[i].UserInfoUserId));
                            }


                    }
                    userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();
                }

                else
                {
                    userHierarchyUserId = LeadsDto.filterLead.UserInfoUserId;
                    if (userHierarchyUserId > 0)
                    {
                        using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                        {
                            userHierarchy.Add(await objUserHierarchy.GetHisDetails(userHierarchyUserId));
                        }

                        if (userHierarchy.Count > 0)
                            userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();
                    }

                }


                List<int> usersId = new List<int>();
                usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();

                if ((LeadsDto.filterLead.OrderBy > -2 && LeadsDto.filterLead.OrderBy < 4) || LeadsDto.filterLead.OrderBy == 7 || LeadsDto.filterLead.OrderBy == 9 || LeadsDto.filterLead.OrderBy == 10)
                    LeadsDto.filterLead.UserIdList = string.Join(",", usersId.ToArray());
                else
                {
                    if (LeadsDto.filterLead.FollowUpUserIdList != null && LeadsDto.filterLead.FollowUpUserIdList != "")
                        LeadsDto.filterLead.FollowUpUserIdList = string.Join(",", usersId.ToArray());
                    else
                        LeadsDto.filterLead.UserIdList = string.Join(",", usersId.ToArray());
                }

                if (userHierarchy.Count > 0)
                {
                    using (var objDL = DLLmsCustomReport.GetDLLmsCustomReport(LeadsDto.AccountId, SQLProvider))
                    {
                        LmsCount = await objDL.GetMaxCount(LeadsDto.filterLead);
                    }
                }
            }
            return Json(LmsCount);
        }

        public async Task<JsonResult> GetReport([FromBody] Leads_GetReportDto LeadsDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            List<UserHierarchy> userHierarchygroup = new List<UserHierarchy>();
            int userHierarchyUserId = 0;
            int SenioruserHierarchyUserId = 0;
            if (LeadsDto.filterLead.UserInfoUserId == 0)
            {
                userHierarchyUserId = user.UserId;
                SenioruserHierarchyUserId = user.UserId;
                using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                {
                    userHierarchygroup = await objUserHierarchy.GetPermissionUsers(userHierarchyUserId);
                    userHierarchy = await objUserHierarchy.GetHisUsers(userHierarchyUserId);
                    userHierarchy.Add(await objUserHierarchy.GetHisDetails(userHierarchyUserId));
                    if (userHierarchygroup != null && userHierarchygroup.Count > 0)
                    {
                        for (int i = 0; i < userHierarchygroup.Count; i++)
                        {
                            userHierarchy.Add(await objUserHierarchy.GetHisDetails(userHierarchygroup[i].UserInfoUserId));
                        }
                    }
                }
                userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();
            }
            else
            {
                userHierarchyUserId = LeadsDto.filterLead.UserInfoUserId;
                using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                {
                    userHierarchy.Add(await objUserHierarchy.GetHisDetails(userHierarchyUserId));
                }
                userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();
            }

            List<int> usersId = new List<int>();
            usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();

            if ((LeadsDto.filterLead.OrderBy > -2 && LeadsDto.filterLead.OrderBy < 4) || LeadsDto.filterLead.OrderBy == 7 || LeadsDto.filterLead.OrderBy == 9 || LeadsDto.filterLead.OrderBy == 10)
                LeadsDto.filterLead.UserIdList = string.Join(",", usersId.ToArray());
            else
            {
                if (LeadsDto.filterLead.FollowUpUserIdList != null && LeadsDto.filterLead.FollowUpUserIdList != "")
                    LeadsDto.filterLead.FollowUpUserIdList = string.Join(",", usersId.ToArray());
                else LeadsDto.filterLead.UserIdList = string.Join(",", usersId.ToArray());
            }


            ArrayList exportdata = new ArrayList() { LeadsDto.filterLead, userHierarchy };
            HttpContext.Session.SetString("LmsData", JsonConvert.SerializeObject(exportdata));
            List<MLLeadsDetails> customReports = new List<MLLeadsDetails>();
            using (var objDL = DLLmsCustomReport.GetDLLmsCustomReport(LeadsDto.AccountId, SQLProvider))
            {
                customReports = (await objDL.GetLeadsWithContact(LeadsDto.filterLead, LeadsDto.OffSet, LeadsDto.FetchNext)).ToList();
            }



            for (int i = 0; i < customReports.Count; i++)
            {

                PropertyInfo name = customReports[i].GetType().GetProperty("Name");
                PropertyInfo emailid = customReports[i].GetType().GetProperty("EmailId");
                PropertyInfo phonenumber = customReports[i].GetType().GetProperty("PhoneNumber");

                name.SetValue(customReports[i], !String.IsNullOrEmpty(customReports[i].Name) ? Helper.MaskName(customReports[i].Name) : customReports[i].Name, null);
                emailid.SetValue(customReports[i], !String.IsNullOrEmpty(customReports[i].EmailId) ? Helper.MaskEmailAddress(customReports[i].EmailId) : customReports[i].EmailId, null);
                phonenumber.SetValue(customReports[i], !String.IsNullOrEmpty(customReports[i].PhoneNumber) ? Helper.MaskPhoneNumber(customReports[i].PhoneNumber) : customReports[i].PhoneNumber, null);
            }
            return Json(new
            {
                Data = new
                {
                    Notice = userHierarchygroup,
                    Data = customReports
                },
                MaxJsonLength = Int32.MaxValue
            });

            //return Json(customReports);
        }

        public async Task<JsonResult> GetStageScore([FromBody] Leads_GetStageScoreDto LeadsDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            List<LmsStage> AllStageList = new List<LmsStage>();
            List<LmsStage> newLmsStageList = new List<LmsStage>();

            using (var objStage = DLLmsStage.GetDLLmsStage(LeadsDto.accountId, SQLProvider))
            {
                AllStageList = (await objStage.GetAllList()).ToList();
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

        public async Task<JsonResult> LmsGroupsList([FromBody] Leads_LmsGroupsListDto LeadsDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            List<MLUserHierarchy> userHierarchy = null;

            using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchy = (await objUserHierarchy.GetHisUsers(user.UserId, LeadsDto.accountId)).ToList();
            }

            List<int> usersId = new List<int>();
            if (userHierarchy != null)
                usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();

            usersId.Add(user.UserId);

            string userId = string.Join(",", usersId.ToArray());

            if (String.IsNullOrEmpty(userId))
            {
                userId = user.UserId.ToString();
            }

            using (var objGroup = DLLmsGroup.GetDLLmsGroup(LeadsDto.accountId, SQLProvider))
            {
                return Json(await objGroup.GetListLmsGroup(0, 0, userId));
            }
        }

        public async Task<JsonResult> GetUser([FromBody] Leads_GetUserDto LeadsDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            List<MLUserHierarchy> userHierarchyList = new List<MLUserHierarchy>();
            List<UserHierarchy> userHierarchyListgroup = new List<UserHierarchy>();
            int SenioruserHierarchyUserId = user.UserId;
            using (var objUser = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                if (LeadsDto.Getallusers == 0)
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
                    userHierarchyList = await objUser.GetHisUsers(user.UserId, LeadsDto.accountId, LeadsDto.Getallusers);
                }


            }

            userHierarchyList = userHierarchyList.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

            return Json(userHierarchyList);
        }

        [Log]
        public async Task<JsonResult> Delete([FromBody] Leads_DeleteDto LeadsDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(accountId, user.UserId, user.UserName, user.EmailId, "Prospect", "Leads", "Delete", Helper.GetIP(), JsonConvert.SerializeObject(new { ContactId = ContactId }));
            //#endregion

            using (var objDL = DLContact.GetContactDetails(LeadsDto.accountId, SQLProvider))
            {
                bool result;
                result = await objDL.DeleteLead(LeadsDto.ContactId);

                //if (result == true)
                //    LogMessage = "Contact Details has been deleted successfully";
                //else
                //    LogMessage = "Unable to delete the contact details";

                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
                return Json(result);
            }
        }

        [Log]
        public async Task<JsonResult> DeleteSelectedLeads([FromBody] Leads_DeleteSelectedLeadsDto LeadsDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            bool Status = false;

            using (var objDL = DLContact.GetContactDetails(LeadsDto.accountId, SQLProvider))
            {
                foreach (var item in LeadsDto.LmsGroupMemberID)
                {
                    //#region Logs 
                    //string LogMessage = string.Empty;
                    //Int64 LogId = TrackLogs.SaveLog(accountId, user.UserId, user.UserName, user.EmailId, "Prospect", "Leads", "DeleteSelectedLeads", Helper.GetIP(), JsonConvert.SerializeObject(new { ContactId = item }));
                    //#endregion

                    Status = await objDL.DeleteLead(item);

                    //if (Status == true)
                    //    LogMessage = "Contact Details has been deleted successfully";
                    //else
                    //    LogMessage = "Unable to delete the contact details";

                    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = Status }), LogMessage);
                }
            }
            return Json(new { Status = Status, leads = LeadsDto.LmsGroupMemberID });
        }

        [Log]
        public async Task<JsonResult> UpdateNotes([FromBody] Leads_UpdateNotesDto LeadsDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(accountId, user.UserId, user.UserName, user.EmailId, "Prospect", "Leads", "UpdateNotes", Helper.GetIP(), JsonConvert.SerializeObject(new { Notes = notes }));
            //#endregion

            using (var objDLNotes = DLNotes.GetDLNotes(LeadsDto.accountId, SQLProvider))
            {
                return Json(await objDLNotes.Save(LeadsDto.notes));
            }
        }

        public async Task<JsonResult> GetNoteList([FromBody] Leads_GetNoteListDto LeadsDto)
        {
            List<Notes> notes = new List<Notes>();
            using (var objDLNotes = DLNotes.GetDLNotes(LeadsDto.accountId, SQLProvider))
            {
                notes = (await objDLNotes.GetList(LeadsDto.contactId)).ToList();
            }
            return Json(notes);
        }

        [Log]
        public async Task<JsonResult> SaveFollowUps([FromBody] Leads_SaveFollowUpsDto LeadsDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            bool Status = false, SetRemainderStatus = false;
            DateTime FollowDate = DateTime.ParseExact(LeadsDto.FollowUpdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            byte SuccessCount = 0;

            if (LeadsDto.LmsGroupmembersIds.Length > 0 && LeadsDto.LmsGroupIds.Length > 0)
            {
                List<ContactExtraField> contactExtraFields = new List<ContactExtraField>();
                using (var objContactFields = DLContactExtraField.GetDLContactExtraField(LeadsDto.accountId, SQLProvider))
                {
                    contactExtraFields = (await objContactFields.GetList()).ToList();
                }


                for (int i = 0; i < LeadsDto.LmsGroupmembersIds.Length; i++)
                {
                    using (var objDL = DLContact.GetContactDetails(LeadsDto.accountId, SQLProvider))
                    {
                        Status = await objDL.UpdateFollowUpByContactId(LeadsDto.LmsGroupmembersIds[i], LeadsDto.FollowUpContent, LeadsDto.FollowUpStatus, FollowDate, LeadsDto.FollowUpUserId, LeadsDto.LmsGroupIds[i]);
                    }

                    using (var objLms = DLLmsGroupMembers.GetDLLmsGroupMembers(LeadsDto.accountId, SQLProvider))
                    {
                        await objLms.UpdateFollowUp(LeadsDto.LmsGroupmembersIds[i], LeadsDto.LmsGroupIds[i], LeadsDto.FollowUpContent, LeadsDto.FollowUpStatus, FollowDate, LeadsDto.FollowUpUserId);
                    }

                    if (LeadsDto.SetRemainder != null && (!String.IsNullOrEmpty(LeadsDto.SetRemainder.ToReminderEmailId) || !String.IsNullOrEmpty(LeadsDto.SetRemainder.ToReminderPhoneNumber) || !String.IsNullOrEmpty(LeadsDto.ToReminderWhatsAppPhoneNumber)))
                    {
                        LeadsDto.SetRemainder.ContactId = LeadsDto.ContactIds[i];
                        LeadsDto.SetRemainder.UserInfoUserId = user.UserId;
                        LeadsDto.SetRemainder.LmsGroupId = LeadsDto.LmsGroupIds[i];
                        using (var objDL = DLContact.GetContactDetails(LeadsDto.accountId, SQLProvider))
                        {
                            SetRemainderStatus = await objDL.UpdateLmsRemainder(LeadsDto.SetRemainder, LeadsDto.LmsGroupmembersIds[i], LeadsDto.ToReminderWhatsAppPhoneNumber);
                        }
                    }

                    if (Status)
                    {
                        SuccessCount++;
                    }
                }
            }
            return Json(new { SuccessCount, SetRemainderStatus });
        }

        //[Log]
        public async Task<JsonResult> UpdateStage([FromBody] Leads_UpdateStageDto LeadsDto)
        {
            bool Status = false;
            bool StageChangePermissionBasedOnSettings = false;
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            LmsUpdateStageNotification lmsStageNotification = new LmsUpdateStageNotification();
            if (LeadsDto.ClouserDate != null && LeadsDto.ClouserDate != "")
            {
                DateTime ClouserDates = DateTime.ParseExact(LeadsDto.ClouserDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                LeadsDto.mLContact.ClouserDate = ClouserDates;
            }
            Status = await lmsStageNotification.UpdateStageNotification(LeadsDto.mLContact, LeadsDto.stages, LeadsDto.leadEmailId, LeadsDto.UserInfoUserId, LeadsDto.accountId, user.UserId,SQLProvider, LeadsDto.LmsGroupName);
            StageChangePermissionBasedOnSettings = true;

            return Json(new { Status = Status, AssignedUserInfoUserId = lmsStageNotification.AssignedUserInfoUserId, UserAssigned = lmsStageNotification.UserAssigned, StageChangePermissionBasedOnSettings = StageChangePermissionBasedOnSettings });
        }

        [Log]
        public async Task<JsonResult> BulkStageUpdate([FromBody] Leads_BulkStageUpdateDto LeadsDto)
        {
            bool Status = false;
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            LmsUpdateStageNotification lmsStageNotification = new LmsUpdateStageNotification(true);

            foreach (var item in LeadsDto.mlContacts)
            {
                Status = await lmsStageNotification.UpdateStageNotification(item, null, null, 0, LeadsDto.accountId, user.UserId, SQLProvider);
            }

            if (lmsStageNotification.BulkUserInfoUserIds.Count > 0)
            {
                lmsStageNotification.BulkAssignMailandSmsNotification(lmsStageNotification.BulkUserInfoUserIds, LeadsDto.accountId);
            }

            return Json(new { Status = Status, BulkUserInfoUserIds = lmsStageNotification.BulkUserInfoUserIds, BulkUserInfoUserName = lmsStageNotification.BulkUserInfoUserName, LeadDetails = LeadsDto.mlContacts });
        }


        [Log]
        [Notifications(Heading = "Lead Management", ActionDetails = "Lead has been assigned to salesperson", SqlProvider = "npgsql")]
        public async Task<JsonResult> BulkAssignSalesPerson([FromBody] Leads_BulkAssignSalesPersonDto LeadsDto)
        {
            LeadAssignmentAgentNotification leadAssignmentAgentNotification = null;
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            bool SentStatus = false;
            int totalAssignmentDone = 0;
            UserInfo userInfo = null;
            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(LeadsDto.accountId, SQLProvider);
            using (var objDL = DLLeadAssignmentAgentNotification.GetDLLeadAssignmentAgentNotification(LeadsDto.accountId, SQLProvider))
                leadAssignmentAgentNotification = await objDL.GetLeadAssignmentAgentNotification();

            MLContact mLContact = new MLContact();

            try
            {
                List<ContactExtraField> contactExtraFields = new List<ContactExtraField>();
                using (var objContactFields = DLContactExtraField.GetDLContactExtraField(LeadsDto.accountId, SQLProvider))
                {
                    contactExtraFields = await objContactFields.GetList();
                }

                bool IsBulkAssignment = false;
                MailConfiguration mailconfiguration = new MailConfiguration();
                SmsConfiguration smsConfiguration = new SmsConfiguration();

                if (LeadsDto.LmsGroupMemberId.Length > 5)
                    IsBulkAssignment = true;

                string FromEmailId = "";
                string FromName = AllConfigURLDetails.KeyValueForConfig["FROM_NAME_EMAIL"].ToString();
                using (var objDL = DLMailConfigForSending.GetDLMailConfigForSending(LeadsDto.accountId, SQLProvider))
                {
                    MailConfigForSending mailConfig = await objDL.GetActiveFromEmailId();
                    if (mailConfig != null && !string.IsNullOrWhiteSpace(mailConfig.FromEmailId))
                        FromEmailId = mailConfig.FromEmailId;
                }

                if (!IsBulkAssignment)
                {
                    //here we are using transactions mail for sending mail
                    using (var objDLConfig = DLMailConfiguration.GetDLMailConfiguration(LeadsDto.accountId, SQLProvider))
                    {
                        mailconfiguration = await objDLConfig.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);
                    }

                    using (var objDLSMSConfig = DLSmsConfiguration.GetDLSmsConfiguration(LeadsDto.accountId, SQLProvider))
                    {
                        smsConfiguration = await objDLSMSConfig.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);
                    }
                }

                foreach (var LmsGroupMembersId in LeadsDto.LmsGroupMemberId)
                {
                    //#region Logs 
                    //string LogMessage = string.Empty;
                    //Int64 LogId = TrackLogs.SaveLog(accountId, user.UserId, user.UserName, user.EmailId, "Prospect", "Leads", "BulkAssignSalesPerson", Helper.GetIP(), JsonConvert.SerializeObject(new { ContactId = ContactId, UserInfoUserId = UserInfoUserId }));
                    //#endregion

                    //#region Logs 
                    //string MailLogMessage = string.Empty;
                    //Int64 MailLogId = TrackLogs.SaveLog(accountId, user.UserId, user.UserName, user.EmailId, "Prospect", "Leads", "BulkAssignSalesPerson_ForMailSending", Helper.GetIP(), JsonConvert.SerializeObject(new { ContactId = ContactId, UserInfoUserId = UserInfoUserId }));
                    //#endregion

                    //#region Logs 
                    //string SMSLogMessage = string.Empty;
                    //Int64 SMSLogId = TrackLogs.SaveLog(accountId, user.UserId, user.UserName, user.EmailId, "Prospect", "Leads", "BulkAssignSalesPerson_ForSMSSending", Helper.GetIP(), JsonConvert.SerializeObject(new { ContactId = ContactId, UserInfoUserId = UserInfoUserId }));
                    //#endregion

                    using (var objDL = DLContact.GetContactDetails(LeadsDto.accountId, SQLProvider))
                    {
                        bool UpdatedStatus = await objDL.AssignSalesPerson(0, LeadsDto.UserInfoUserId, LmsGroupMembersId);
                        if (UpdatedStatus)
                        {
                            //LogMessage = "Lead has been assigned successfully";
                            totalAssignmentDone++;
                            if (!IsBulkAssignment)
                            {
                                using (var objUserInfo = DLUserInfo.GetDLUserInfo(SQLProvider))
                                {
                                    userInfo = await objUserInfo.GetDetail(LeadsDto.UserInfoUserId);
                                }
                                using (var objDLContact = DLContact.GetContactDetails(LeadsDto.accountId, SQLProvider))
                                {
                                    mLContact = await objDLContact.GetLeadsByContactId(LmsGroupMembersId);
                                }

                                if ((mailconfiguration != null && mailconfiguration.Id > 0) && (leadAssignmentAgentNotification != null && leadAssignmentAgentNotification.Mail) && !string.IsNullOrWhiteSpace(FromEmailId))
                                {
                                    try
                                    {
                                        string filePath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString() + "\\Template\\PlumbAlert.htm";
                                        string MailBody = "";
                                        if (System.IO.File.Exists(filePath))
                                        {


                                            using (StreamReader rd = new StreamReader(filePath))
                                            {
                                                MailBody = rd.ReadToEnd();
                                                rd.Close();
                                            }



                                            StringBuilder ContactDetails = new StringBuilder("Lead Contact details are <br /> ");

                                            if (mLContact != null && mLContact.ContactId > 0)
                                            {
                                                if (!String.IsNullOrEmpty(mLContact.Name) && mLContact.Name != "")
                                                    ContactDetails.Append("<br /> Name : " + mLContact.Name + "");

                                                if (!String.IsNullOrEmpty(mLContact.EmailId) && mLContact.EmailId != "")
                                                    ContactDetails.Append("<br /> EmailId : " + mLContact.EmailId + "");

                                                if (!String.IsNullOrEmpty(mLContact.PhoneNumber) && mLContact.PhoneNumber != "")
                                                    ContactDetails.Append("<br /> PhoneNumber : " + mLContact.PhoneNumber + "");

                                                int k = 1;
                                                foreach (PropertyInfo pi in mLContact.GetType().GetProperties())
                                                {
                                                    if (pi.Name != "Id" && pi.Name != "UserInfoUserId" && pi.Name != "ContactId" && pi.Name != "UserGroupId" && pi.Name != "LmsGroupId" && pi.Name != "ReminderDate" && pi.Name != "ToReminderPhoneNumber" && pi.Name != "ToReminderEmailId" && pi.Name != "Score" && pi.Name != "LastModifyByUserId" && pi.Name != "LmsGroupName" && pi.Name != "IsAdSenseOrAdWord" && pi.Name != "AccountId" && pi.Name != "Notes" && pi.Name != "Name" && pi.Name != "EmailId" && pi.Name != "PhoneNumber" && pi.Name != "MailTemplateId" && pi.Name != "SMSTemplateId" && pi.Name != "SmsAlertScheduleDate" && pi.Name != "IsNewLead" && pi.Name != "FollowUpContent" && pi.Name != "FollowUpStatus" && pi.Name != "FollowUpDate" && pi.Name != "FollowUpUserId" && pi.Name != "FollowUpUpdatedDate" && pi.Name != "CreatedUserInfoUserId" && pi.Name != "LmsGroupmemberId")
                                                    {
                                                        if (pi.Name == "Field" + k && contactExtraFields != null && contactExtraFields.Count > 0)
                                                        {
                                                            if (pi.GetValue(mLContact) != null)
                                                            {
                                                                ContactDetails.Append("<br />" + contactExtraFields[k - 1].FieldName + " : " + pi.GetValue(mLContact, null).ToString());
                                                            }
                                                            k++;
                                                        }
                                                        else
                                                        {
                                                            if (pi.GetValue(mLContact) != null)
                                                            {
                                                                if (pi.Name == "CreatedDate" || pi.Name == "UpdatedDate" || pi.Name == "ScoreUpdatedDate" || pi.Name == "LeadLabelUpdatedDate" || pi.Name == "HandledByUpdatedDate")
                                                                    ContactDetails.Append("<br />" + pi.Name + " : " + Convert.ToString(Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(Convert.ToString(pi.GetValue(mLContact, null), null).ToString()))));
                                                                else
                                                                    ContactDetails.Append("<br />" + pi.Name + " : " + pi.GetValue(mLContact, null).ToString());
                                                            }
                                                        }
                                                    }
                                                }

                                                MailBody = MailBody.Replace("<!--$$$$$1-->", ContactDetails.ToString()).Replace("<!--CLIENTLOGO_ONLINEURL-->", AllConfigURLDetails.KeyValueForConfig["CLIENTLOGO_ONLINEURL"].ToString());

                                                MailSetting mailSetting = new MailSetting()
                                                {
                                                    Forward = false,
                                                    FromEmailId = FromEmailId,
                                                    FromName = FromName,
                                                    MailTemplateId = 0,
                                                    ReplyTo = FromEmailId,
                                                    Subject = "Lead has been assigned to you",
                                                    Subscribe = true,
                                                    MessageBodyText = MailBody,
                                                    IsTransaction = false
                                                };

                                                MLMailSent mailSent = new MLMailSent()
                                                {
                                                    MailCampaignId = 0,
                                                    MailSendingSettingId = 0,
                                                    GroupId = 0,
                                                    ContactId = 0,
                                                    EmailId = userInfo.EmailId,
                                                    P5MailUniqueID = Guid.NewGuid().ToString()
                                                };

                                                MailSentSavingDetials mailSentSavingDetials = new MailSentSavingDetials()
                                                {
                                                    ConfigurationId = 0,
                                                    GroupId = 0
                                                };

                                                IBulkMailSending MailGeneralBaseFactory = Plumb5GenralFunction.MailGeneralBaseFactory.GetMailVendor(LeadsDto.accountId, mailSetting, mailSentSavingDetials, mailconfiguration, "MailTrack", "LMS");
                                                SentStatus = MailGeneralBaseFactory.SendSingleMail(mailSent);

                                                if (SentStatus)
                                                {
                                                    MailSent getmailSent = new MailSent()
                                                    {
                                                        FromEmailId = mailSetting.FromEmailId,
                                                        FromName = mailSetting.FromName,
                                                        MailTemplateId = 0,
                                                        Subject = mailSetting.Subject,
                                                        MailCampaignId = 0,
                                                        MailSendingSettingId = 0,
                                                        GroupId = 0,
                                                        ContactId = MailGeneralBaseFactory.VendorResponses[0].ContactId,
                                                        EmailId = MailGeneralBaseFactory.VendorResponses[0].EmailId,
                                                        P5MailUniqueID = MailGeneralBaseFactory.VendorResponses[0].P5MailUniqueID,
                                                        CampaignJobName = MailGeneralBaseFactory.VendorResponses[0].CampaignJobName,
                                                        ErrorMessage = "",
                                                        ProductIds = MailGeneralBaseFactory.VendorResponses[0].ProductIds,
                                                        ResponseId = MailGeneralBaseFactory.VendorResponses[0].ResponseId,
                                                        SendStatus = (byte)MailGeneralBaseFactory.VendorResponses[0].SendStatus,
                                                        WorkFlowDataId = MailGeneralBaseFactory.VendorResponses[0].WorkFlowDataId,
                                                        WorkFlowId = MailGeneralBaseFactory.VendorResponses[0].WorkFlowId,
                                                        SentDate = DateTime.Now,
                                                        ReplayToEmailId = mailSetting.ReplyTo,
                                                        MailConfigurationNameId = mailconfiguration.MailConfigurationNameId
                                                    };

                                                    using (var objDLMailSent = DLMailSent.GetDLMailSent(LeadsDto.accountId, SQLProvider))
                                                    {
                                                        await objDLMailSent.Send(getmailSent);
                                                    }

                                                    //TrackLogs.UpdateLogs(MailLogId, JsonConvert.SerializeObject(new { Status = true, Message = "Lead Assignment mail has been sent" }), "Lead Assignment mail has been sent");
                                                }
                                                else
                                                {
                                                    MailSent getmailSent = new MailSent()
                                                    {
                                                        FromEmailId = mailSetting.FromEmailId,
                                                        FromName = mailSetting.FromName,
                                                        MailTemplateId = 0,
                                                        Subject = mailSetting.Subject,
                                                        MailCampaignId = 0,
                                                        MailSendingSettingId = 0,
                                                        GroupId = 0,
                                                        ContactId = MailGeneralBaseFactory.VendorResponses[0].ContactId,
                                                        EmailId = MailGeneralBaseFactory.VendorResponses[0].EmailId,
                                                        P5MailUniqueID = MailGeneralBaseFactory.VendorResponses[0].P5MailUniqueID,
                                                        CampaignJobName = MailGeneralBaseFactory.VendorResponses[0].CampaignJobName,
                                                        ErrorMessage = MailGeneralBaseFactory.VendorResponses[0].ErrorMessage,
                                                        ProductIds = MailGeneralBaseFactory.VendorResponses[0].ProductIds,
                                                        ResponseId = MailGeneralBaseFactory.VendorResponses[0].ResponseId,
                                                        SendStatus = 0,
                                                        WorkFlowDataId = 0,
                                                        WorkFlowId = 0,
                                                        SentDate = DateTime.Now,
                                                        ReplayToEmailId = mailSetting.ReplyTo,
                                                        MailConfigurationNameId = mailconfiguration.MailConfigurationNameId
                                                    };

                                                    using (var objDLMailSent = DLMailSent.GetDLMailSent(LeadsDto.accountId, SQLProvider))
                                                    {
                                                        await objDLMailSent.Send(getmailSent);
                                                    }

                                                    //TrackLogs.UpdateLogs(MailLogId, JsonConvert.SerializeObject(new { Status = false, Message = MailGeneralBaseFactory.VendorResponses[0].ErrorMessage }), "Unable to send a lead assignment mail");
                                                }
                                            }
                                        }
                                    }
                                    catch (Exception ex)
                                    {
                                    }
                                }
                                //else
                                //{
                                //   TrackLogs.UpdateLogs(MailLogId, JsonConvert.SerializeObject(new { Status = false, Message = "Please check Mail Configuration Settings" }), "Unable to send lead assignment mail as mail configuration settings is not done");
                                //}
                                #region DLT Notification SMS
                                SmsNotificationTemplate smsNotificationTemplate;
                                using (var obj = DLSmsNotificationTemplate.GetDLSmsNotificationTemplate(LeadsDto.accountId, SQLProvider))
                                {

                                    smsNotificationTemplate = await obj.GetByIdentifier("lmsleadassign");
                                }
                                #endregion DLT Notification SMS
                                if ((smsConfiguration != null && smsConfiguration.Id > 0) && (leadAssignmentAgentNotification != null && leadAssignmentAgentNotification.Sms) && smsNotificationTemplate.IsSmsNotificationEnabled)
                                {
                                    try
                                    {
                                        SentResponses sentResponses = new SentResponses();
                                        if (userInfo != null && !String.IsNullOrEmpty(userInfo.MobilePhone))
                                        {
                                            if (mLContact != null && mLContact.ContactId > 0)
                                            {
                                                //StringBuilder ContactDetailsForSMS = new StringBuilder("Lead Assignment Details ");

                                                //if (!String.IsNullOrEmpty(mLContact.Name) && mLContact.Name != "")
                                                //    ContactDetailsForSMS.Append("\n Name : " + mLContact.Name + "");

                                                //if (!String.IsNullOrEmpty(mLContact.EmailId) && mLContact.EmailId != "")
                                                //    ContactDetailsForSMS.Append("\n EmailId : " + mLContact.EmailId + "");

                                                //if (!String.IsNullOrEmpty(mLContact.PhoneNumber) && mLContact.PhoneNumber != "")
                                                //    ContactDetailsForSMS.Append("\n PhoneNumber : " + mLContact.PhoneNumber + "");

                                                string LeadAssignMessageContent = smsNotificationTemplate.MessageContent.Replace("[{*Name*}]", mLContact.Name == null || mLContact.Name == "" ? "NA" : mLContact.Name)
                                                                         .Replace("[{*EmailId*}]", mLContact.EmailId == null || mLContact.EmailId == "" ? "NA" : mLContact.EmailId)
                                                                         .Replace("[{*PhoneNumber*}]", mLContact.PhoneNumber == null || mLContact.PhoneNumber == "" ? "NA" : mLContact.PhoneNumber);

                                                string MessageContent = System.Web.HttpUtility.HtmlDecode(LeadAssignMessageContent);

                                                SmsSent smsSent = new SmsSent()
                                                {
                                                    CampaignJobName = "LMS",
                                                    ContactId = 0,
                                                    GroupId = 0,
                                                    MessageContent = MessageContent,
                                                    PhoneNumber = userInfo.MobilePhone,
                                                    SmsSendingSettingId = 0,
                                                    SmsTemplateId = 0,
                                                    VendorName = smsConfiguration.ProviderName,
                                                    IsUnicodeMessage = false,
                                                    VendorTemplateId = smsNotificationTemplate.VendorTemplateId
                                                };

                                                IBulkSmsSending SmsGeneralBaseFactory = Plumb5GenralFunction.SmsGeneralBaseFactory.GetSMSVendor(LeadsDto.accountId, smsConfiguration, "LMS",SQLProvider);
                                                bool SmsSentStatus = SmsGeneralBaseFactory.SendSingleSms(smsSent);
                                                string SmsErrorMessage = SmsGeneralBaseFactory.ErrorMessage;

                                                Helper.Copy(SmsGeneralBaseFactory.VendorResponses[0], smsSent);

                                                if (SmsSentStatus)
                                                {
                                                    sentResponses.ResponseId = SmsGeneralBaseFactory.VendorResponses[0].ResponseId;
                                                    smsSent.SentDate = DateTime.Now;
                                                    smsSent.IsDelivered = 0;
                                                    smsSent.IsClicked = 0;
                                                    smsSent.Operator = null;
                                                    smsSent.Circle = null;
                                                    smsSent.DeliveryTime = null;
                                                    smsSent.SmsConfigurationNameId = smsConfiguration.SmsConfigurationNameId;
                                                    using (var objDLSMS = DLSmsSent.GetDLSmsSent(LeadsDto.accountId, SQLProvider))
                                                    {
                                                        await objDLSMS.Save(smsSent);
                                                    }

                                                    //TrackLogs.UpdateLogs(SMSLogId, JsonConvert.SerializeObject(new { Status = true, Message = "Lead Assignment SMS has been sent" }), "Lead Assignment SMS has been sent");
                                                }
                                                else
                                                {
                                                    smsSent.SentDate = DateTime.Now;
                                                    smsSent.IsDelivered = 0;
                                                    smsSent.IsClicked = 0;
                                                    smsSent.Operator = null;
                                                    smsSent.Circle = null;
                                                    smsSent.DeliveryTime = null;
                                                    smsSent.ReasonForNotDelivery = SmsErrorMessage;
                                                    smsSent.SmsConfigurationNameId = smsConfiguration.SmsConfigurationNameId;
                                                    using (var objDLSMS = DLSmsSent.GetDLSmsSent(LeadsDto.accountId, SQLProvider))
                                                    {
                                                        await objDLSMS.Save(smsSent);
                                                    }

                                                    //TrackLogs.UpdateLogs(SMSLogId, JsonConvert.SerializeObject(new { Status = false, Message = SmsErrorMessage }), "Unable to send lead assignment sms");
                                                }
                                            }
                                        }
                                        //else
                                        //{
                                        //    TrackLogs.UpdateLogs(SMSLogId, JsonConvert.SerializeObject(new { Status = false, Message = "Unable to send lead assignment sms as the assignee phone number is empty" }), "Unable to send lead assignment sms as the assignee phone number is empty");
                                        //}
                                    }
                                    catch (Exception ex)
                                    {
                                    }
                                }

                                #region Whats App
                                if (leadAssignmentAgentNotification != null && leadAssignmentAgentNotification.WhatsApp)
                                {
                                    if (leadAssignmentAgentNotification.WhatsApp && !string.IsNullOrEmpty(userInfo.MobilePhone))
                                    {
                                        List<LmsGroup> LmsGroupList = new List<LmsGroup>();
                                        using (var objGroup = DLLmsGroup.GetDLLmsGroup(LeadsDto.accountId, SQLProvider))
                                        {
                                            LmsGroupList = (await objGroup.GetLMSGroup(LmsGroupMembersId)).ToList();
                                        }
                                        string lmsgroupname = "";
                                        if (LmsGroupList.Count > 0)
                                            lmsgroupname = LmsGroupList[0].Name;
                                        //bool SentStatus = false;
                                        string UserAttributeMessageDetails = "";
                                        string UserButtonOneDynamicURLDetails = "";
                                        string UserButtonTwoDynamicURLDetails = "";
                                        string MediaURLDetails = "";
                                        string langcode = "";
                                        WhatsappSent watsAppSent = new WhatsappSent();

                                        string PhoneNumber = userInfo.MobilePhone;
                                        bool isValidPhoneNumber = Helper.IsValidPhoneNumber(ref PhoneNumber);

                                        if (isValidPhoneNumber)
                                        {
                                            WhatsAppConfiguration whatsappConfiguration = new WhatsAppConfiguration();

                                            using (var objBL = DLWhatsAppConfiguration.GetDLWhatsAppConfiguration(LeadsDto.accountId, SQLProvider))
                                            {
                                                whatsappConfiguration = await objBL.GetConfigurationDetailsForSending(IsDefaultProvider: true);
                                            }

                                            #region Notification WhatsApp
                                            WhatsAppNotificationTemplate whatsappNotificationTemplate;
                                            using (var obj =   DLWhatsAppNotificationTemplate.GetDLWhatsAppNotificationTemplate(LeadsDto.accountId,SQLProvider))
                                            {
                                                whatsappNotificationTemplate = await obj.GetByIdentifier("lmsleadassign");
                                            }
                                            #endregion Notification WhatsApp

                                            if (whatsappConfiguration != null && whatsappConfiguration.Id > 0 && whatsappNotificationTemplate != null && whatsappNotificationTemplate.IsWhatsAppNotificationEnabled)
                                            {
                                                string UserName = "";
                                                string UserPhone = "";
                                                string AccountName = "";
                                                string ContactName = "";

                                                if (mLContact != null && !string.IsNullOrEmpty(mLContact.Name))
                                                    ContactName = mLContact.Name;



                                                HelperForSMS HelpSMS = new HelperForSMS(LeadsDto.accountId, SQLProvider);
                                                StringBuilder UserButtonOneBodydata = new StringBuilder();
                                                StringBuilder UserButtonTwoBodydata = new StringBuilder();
                                                StringBuilder MediaUrlBodyData = new StringBuilder();
                                                if (!string.IsNullOrEmpty(whatsappNotificationTemplate.UserAttributes))
                                                {
                                                    UserAttributeMessageDetails = whatsappNotificationTemplate.UserAttributes.Replace("[{*Name*}]", mLContact.Name == "" ? "NA" : mLContact.Name)
                                                                                 .Replace("[{*EmailId*}]", mLContact.EmailId == "" ? "NA" : mLContact.EmailId)
                                                                                 .Replace("[{*PhoneNumber*}]", mLContact.PhoneNumber == "" ? "NA" : mLContact.PhoneNumber)
                                                                                 .Replace("[{*LmsGroupName*}]", lmsgroupname);

                                                    whatsappNotificationTemplate.TemplateContent = whatsappNotificationTemplate.TemplateContent.Replace("[{*Name*}]", mLContact.Name == "" ? "NA" : mLContact.Name)
                                                                                 .Replace("[{*EmailId*}]", mLContact.EmailId == "" ? "NA" : mLContact.EmailId)
                                                                                 .Replace("[{*PhoneNumber*}]", mLContact.PhoneNumber == "" ? "NA" : mLContact.PhoneNumber)
                                                                                 .Replace("[{*LmsGroupName*}]", lmsgroupname);

                                                    if (!string.IsNullOrEmpty(UserAttributeMessageDetails))
                                                        UserAttributeMessageDetails = UserAttributeMessageDetails.Replace(",", "$@$");
                                                }
                                                //if (!string.IsNullOrEmpty(whatsappNotificationTemplate.UserAttributes))
                                                //{
                                                //    UserAttributeMessageDetails = whatsappNotificationTemplate.UserAttributes.Replace("[{*CustomerName*}]", string.IsNullOrEmpty(ContactName) ? "NA" : ContactName)
                                                //                                 .Replace("[{*UserName*}]", string.IsNullOrEmpty(UserName) ? "[{*UserName*}]" : ci.TextInfo.ToTitleCase(UserName))
                                                //                                 .Replace("[{*UserPhone*}]", string.IsNullOrEmpty(UserPhone) ? "[{*UserPhone*}]" : UserPhone)
                                                //                                 .Replace("[{*AccountName*}]", string.IsNullOrEmpty(AccountName) ? "NA" : AccountName);

                                                //    whatsappNotificationTemplate.TemplateContent = whatsappNotificationTemplate.TemplateContent.Replace("[{*CustomerName*}]", string.IsNullOrEmpty(ContactName) ? "NA" : ContactName)
                                                //                                 .Replace("[{*UserName*}]", string.IsNullOrEmpty(UserName) ? "[{*UserName*}]" : ci.TextInfo.ToTitleCase(UserName))
                                                //                                 .Replace("[{*UserPhone*}]", string.IsNullOrEmpty(UserPhone) ? "[{*UserPhone*}]" : UserPhone)
                                                //                                 .Replace("[{*AccountName*}]", string.IsNullOrEmpty(AccountName) ? "NA" : AccountName);
                                                //}

                                                //if (!string.IsNullOrEmpty(whatsappNotificationTemplate.ButtonOneDynamicURLSuffix))
                                                //{
                                                //    UserButtonOneBodydata.Append(whatsappNotificationTemplate.ButtonOneDynamicURLSuffix);
                                                //    HelpSMS.ReplaceContactDetails(UserButtonOneBodydata, mLContact);
                                                //    UserButtonOneDynamicURLDetails = UserButtonOneBodydata.ToString();
                                                //}

                                                //if (!string.IsNullOrEmpty(whatsappNotificationTemplate.ButtonTwoDynamicURLSuffix))
                                                //{
                                                //    UserButtonTwoBodydata.Append(whatsappNotificationTemplate.ButtonTwoDynamicURLSuffix);
                                                //    HelpSMS.ReplaceContactDetails(UserButtonTwoBodydata, contactDetails);
                                                //    UserButtonTwoDynamicURLDetails = UserButtonTwoBodydata.ToString();
                                                //}

                                                //if (!string.IsNullOrEmpty(whatsappNotificationTemplate.MediaFileURL))
                                                //{
                                                //    MediaUrlBodyData.Append(whatsappNotificationTemplate.MediaFileURL);
                                                //    HelpSMS.ReplaceContactDetails(MediaUrlBodyData, contactDetails);
                                                //    MediaURLDetails = MediaUrlBodyData.ToString();
                                                //}

                                                if (!string.IsNullOrEmpty(whatsappNotificationTemplate.TemplateLanguage))
                                                {
                                                    if (whatsappNotificationTemplate.TemplateLanguage == "English")
                                                        langcode = "en";
                                                }

                                                if (UserAttributeMessageDetails.Contains("[{*") && UserAttributeMessageDetails.Contains("*}]"))
                                                {
                                                    WhatsappSent watsappsent = new WhatsappSent()
                                                    {
                                                        MediaFileURL = MediaURLDetails,
                                                        PhoneNumber = PhoneNumber,
                                                        UserAttributes = UserAttributeMessageDetails,
                                                        ButtonOneDynamicURLSuffix = UserButtonOneDynamicURLDetails,
                                                        ButtonTwoDynamicURLSuffix = UserButtonTwoDynamicURLDetails,
                                                        CampaignJobName = "LMS",
                                                        ContactId = 0,
                                                        GroupId = 0,
                                                        MessageContent = whatsappNotificationTemplate.TemplateContent,
                                                        WhatsappSendingSettingId = 0,
                                                        WhatsappTemplateId = 0,
                                                        VendorName = whatsappConfiguration.ProviderName,
                                                        SentDate = DateTime.Now,
                                                        IsDelivered = 0,
                                                        IsClicked = 0,
                                                        ErrorMessage = "User Attributes dynamic content not replaced",
                                                        SendStatus = 0,
                                                        WorkFlowDataId = 0,
                                                        WorkFlowId = 0,
                                                        IsFailed = 1
                                                    };

                                                    using (var objBL = DLWhatsAppSent.GetDLWhatsAppSent(LeadsDto.accountId, SQLProvider))
                                                    {
                                                        await objBL.Save(watsappsent);
                                                    }
                                                }
                                                else if (UserButtonOneDynamicURLDetails.Contains("[{*") && UserButtonOneDynamicURLDetails.Contains("*}]"))
                                                {
                                                    WhatsappSent watsappsent = new WhatsappSent()
                                                    {
                                                        MediaFileURL = MediaURLDetails,
                                                        PhoneNumber = PhoneNumber,
                                                        UserAttributes = UserAttributeMessageDetails,
                                                        ButtonOneDynamicURLSuffix = UserButtonOneDynamicURLDetails,
                                                        ButtonTwoDynamicURLSuffix = UserButtonTwoDynamicURLDetails,
                                                        CampaignJobName = "LMS",
                                                        ContactId = 0,
                                                        GroupId = 0,
                                                        MessageContent = whatsappNotificationTemplate.TemplateContent,
                                                        WhatsappSendingSettingId = 0,
                                                        WhatsappTemplateId = 0,
                                                        VendorName = whatsappConfiguration.ProviderName,
                                                        SentDate = DateTime.Now,
                                                        IsDelivered = 0,
                                                        IsClicked = 0,
                                                        ErrorMessage = "Template button one dynamic url content not replaced",
                                                        SendStatus = 0,
                                                        WorkFlowDataId = 0,
                                                        WorkFlowId = 0,
                                                        IsFailed = 1
                                                    };

                                                    using (var objBL = DLWhatsAppSent.GetDLWhatsAppSent(LeadsDto.accountId, SQLProvider))
                                                    {
                                                        await objBL.Save(watsappsent);
                                                    }
                                                }
                                                else if (UserButtonTwoDynamicURLDetails.Contains("[{*") && UserButtonTwoDynamicURLDetails.Contains("*}]"))
                                                {
                                                    WhatsappSent watsappsent = new WhatsappSent()
                                                    {
                                                        MediaFileURL = MediaURLDetails,
                                                        PhoneNumber = PhoneNumber,
                                                        UserAttributes = UserAttributeMessageDetails,
                                                        ButtonOneDynamicURLSuffix = UserButtonOneDynamicURLDetails,
                                                        ButtonTwoDynamicURLSuffix = UserButtonTwoDynamicURLDetails,
                                                        CampaignJobName = "LMS",
                                                        ContactId = 0,
                                                        GroupId = 0,
                                                        MessageContent = whatsappNotificationTemplate.TemplateContent,
                                                        WhatsappSendingSettingId = 0,
                                                        WhatsappTemplateId = 0,
                                                        VendorName = whatsappConfiguration.ProviderName,
                                                        SentDate = DateTime.Now,
                                                        IsDelivered = 0,
                                                        IsClicked = 0,
                                                        ErrorMessage = "Template button two dynamic url content not replaced",
                                                        SendStatus = 0,
                                                        WorkFlowDataId = 0,
                                                        WorkFlowId = 0,
                                                        IsFailed = 1
                                                    };

                                                    using (var objBL = DLWhatsAppSent.GetDLWhatsAppSent(LeadsDto.accountId, SQLProvider))
                                                    {
                                                        await objBL.Save(watsappsent);
                                                    }
                                                }
                                                else
                                                {
                                                    List<MLWhatsappSent> whatsappSentList = new List<MLWhatsappSent>();

                                                    MLWhatsappSent mlwatsappsent = new MLWhatsappSent()
                                                    {
                                                        MediaFileURL = MediaURLDetails,
                                                        CountryCode = whatsappConfiguration.CountryCode,
                                                        PhoneNumber = PhoneNumber,
                                                        WhiteListedTemplateName = whatsappNotificationTemplate.WhiteListedTemplateName,
                                                        LanguageCode = langcode,
                                                        UserAttributes = UserAttributeMessageDetails,
                                                        ButtonOneText = whatsappNotificationTemplate.ButtonOneText,
                                                        ButtonTwoText = whatsappNotificationTemplate.ButtonTwoText,
                                                        ButtonOneDynamicURLSuffix = UserButtonOneDynamicURLDetails,
                                                        ButtonTwoDynamicURLSuffix = UserButtonTwoDynamicURLDetails,
                                                        CampaignJobName = "campaign",
                                                        ContactId = mLContact.ContactId,
                                                        GroupId = 0,
                                                        MessageContent = whatsappNotificationTemplate.TemplateContent,
                                                        WhatsappSendingSettingId = 0,
                                                        WhatsappTemplateId = 0,
                                                        VendorName = whatsappConfiguration.ProviderName
                                                    };
                                                    whatsappSentList.Add(mlwatsappsent);

                                                    IBulkWhatsAppSending WhatsAppGeneralBaseFactory = Plumb5GenralFunction.WhatsAppGeneralBaseFactory.GetWhatsAppVendor(LeadsDto.accountId, whatsappConfiguration, "campaign");
                                                    SentStatus = WhatsAppGeneralBaseFactory.SendWhatsApp(whatsappSentList);
                                                    string ErrorMessage = WhatsAppGeneralBaseFactory.ErrorMessage;

                                                    if (SentStatus && WhatsAppGeneralBaseFactory.VendorResponses != null && WhatsAppGeneralBaseFactory.VendorResponses.Count > 0)
                                                    {
                                                        Helper.Copy(WhatsAppGeneralBaseFactory.VendorResponses[0], watsAppSent);

                                                        using (var objBL = DLWhatsAppSent.GetDLWhatsAppSent(LeadsDto.accountId, SQLProvider))
                                                        {
                                                            await objBL.Save(watsAppSent);
                                                        }
                                                    }
                                                    else if (!SentStatus && !string.IsNullOrEmpty(ErrorMessage))
                                                    {
                                                        Helper.Copy(WhatsAppGeneralBaseFactory.VendorResponses[0], watsAppSent);

                                                        using (var objBL = DLWhatsAppSent.GetDLWhatsAppSent(LeadsDto.accountId, SQLProvider))
                                                        {
                                                            await objBL.Save(watsAppSent);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                #endregion
                            }

                        }
                    }
                }
            }
            catch (Exception ex)
            {
            }
            return Json(new { Status = true, TotalAssignmentDone = totalAssignmentDone });
        }

        [Log]
        public async Task<JsonResult> UpdateLeadLabel([FromBody] Leads_UpdateLeadLabelDto LeadsDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            bool Status = false;

            using (var objDL = DLContact.GetContactDetails(LeadsDto.accountId, SQLProvider))
            {
                foreach (var item in LeadsDto.LeadLmsGroupMemberList)
                {
                    //#region Logs 
                    //string LogMessage = string.Empty;
                    //Int64 LogId = TrackLogs.SaveLog(accountId, user.UserId, user.UserName, user.EmailId, "Prospect", "Leads", "UpdateLeadLabel", Helper.GetIP(), JsonConvert.SerializeObject(new { ContactId = item, LabelValue = LabelValue }));
                    //#endregion

                    Status = await objDL.UpdateLeadLabel(item, LeadsDto.LabelValue, LeadsDto.LmsGroupId);

                    //if (Status == true)
                    //    LogMessage = "Lead Label has been updated successfully";
                    //else
                    //    LogMessage = "Unable to update the Lead Label";

                    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = Status }), LogMessage);
                }
            }
            return Json(new { Status = Status, leads = LeadsDto.LeadLmsGroupMemberList });
        }

        [Log]
        public async Task<JsonResult> UpdateFollowUpCompleted([FromBody] Leads_UpdateFollowUpCompletedDto LeadsDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            bool Status = false;

            using (var objDL = DLContact.GetContactDetails(LeadsDto.accountId, SQLProvider))
            {
                foreach (var item in LeadsDto.LmsGroupmemberIds)
                {
                    //#region Logs 
                    //string LogMessage = string.Empty;
                    //Int64 LogId = TrackLogs.SaveLog(accountId, user.UserId, user.UserName, user.EmailId, "Prospect", "Leads", "UpdateFollowUpCompleted", Helper.GetIP(), JsonConvert.SerializeObject(new { ContactId = item }));
                    //#endregion

                    Status = await objDL.UpdateFollowUpCompleted(item);

                    //if (Status == true)
                    //    LogMessage = "Follow up has been updated successfully";
                    //else
                    //    LogMessage = "Unable to update the Follow Up";

                    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = Status }), LogMessage);
                }
            }
            return Json(new { Status = true, leads = LeadsDto.LmsGroupmemberIds });
        }

        public async Task<JsonResult> GetLeadFollowUpData([FromBody] Leads_GetLeadFollowUpDataDto LeadsDto)
        {
            bool Status = false;

            MLContact contactfollowUpsDetails = new MLContact();

            using (var objDLMyFollowUps = DLContact.GetContactDetails(LeadsDto.accountId, SQLProvider))
            {
                contactfollowUpsDetails = await objDLMyFollowUps.GetLeadFollowUpData(LeadsDto.LmsGroupmemberId);

                if (contactfollowUpsDetails != null && contactfollowUpsDetails.FollowUpStatus > 0)
                    Status = true;
            }

            return Json(new { Status = Status, contactfollowUpsDetails = contactfollowUpsDetails });
        }

        [Log]
        public async Task<JsonResult> UpdateLeadSeen([FromBody] Leads_UpdateLeadSeenDto LeadsDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(AdsId, user.UserId, user.UserName, user.EmailId, "Leads", "Prospect", "UpdateLeadSeen", Helper.GetIP(), JsonConvert.SerializeObject(new { ContactId = ContactId }));
            //#endregion

            using (var objDLMyFollowUps = DLContact.GetContactDetails(LeadsDto.AdsId, SQLProvider))
            {
                bool result = await objDLMyFollowUps.UpdateLeadSeen(LeadsDto.ContactId);
                //if (result)
                //    LogMessage = "Lead seen updated successfully";
                //else
                //    LogMessage = "Lead seen not updated successfully";
                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> LeadsExport([FromBody] Leads_LeadsExportDto LeadsDto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                List<MLLeadsDetails> customReports = new List<MLLeadsDetails>();
                LmsCustomReport filterLead = new LmsCustomReport();
                List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
                if (HttpContext.Session.GetString("LmsData") != null)
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("LmsData"));
                    filterLead = JsonConvert.DeserializeObject<LmsCustomReport>(data[0].ToString());
                    userHierarchy = JsonConvert.DeserializeObject<List<MLUserHierarchy>>(data[1].ToString()); 
                }

                using (var objDL = DLLmsCustomReport.GetDLLmsCustomReport(LeadsDto.AccountId, SQLProvider))
                {
                    customReports = await objDL.GetLeadsWithContact(filterLead, LeadsDto.OffSet, LeadsDto.FetchNext);
                }

                for (var i = 0; i < customReports.Count; i++)
                {
                    customReports[i].Name = !String.IsNullOrEmpty(customReports[i].Name) ? Helper.MaskName(customReports[i].Name) : customReports[i].Name;
                    customReports[i].EmailId = !String.IsNullOrEmpty(customReports[i].EmailId) ? Helper.MaskEmailAddress(customReports[i].EmailId) : customReports[i].EmailId;
                    customReports[i].PhoneNumber = !String.IsNullOrEmpty(customReports[i].PhoneNumber) ? Helper.MaskPhoneNumber(customReports[i].PhoneNumber) : customReports[i].PhoneNumber;
                }

                LmsExport exporttoexceldetails = new LmsExport();
                await exporttoexceldetails.Export(LeadsDto.AccountId, customReports, userHierarchy, LeadsDto.FileType, SQLProvider);

                return Json(new { Status = true, exporttoexceldetails.MainPath });
            }
            else
            {
                return Json(new { Status = false });
            }
        }

        public async Task<JsonResult> GetPropertySetting([FromBody] Leads_GetPropertySettingDto LeadsDto)
        {
            List<MLContactFieldEditSetting> ContactFieldSettingList;
            using (var objBL = DLContactFieldEditSetting.GetDLContactFieldEditSetting(LeadsDto.AccountId, SQLProvider))
            {
                ContactFieldSettingList = await objBL.GetFullList();
            }

            return Json(ContactFieldSettingList);
        }

        public async Task<JsonResult> GetLMSHeaderFlag([FromBody] Leads_GetLMSHeaderFlagDto LeadsDto)
        {
            using (var objLmsLeads = DLLmsCustomReport.GetDLLmsCustomReport(LeadsDto.AccountId, SQLProvider))
            {
                return Json(await objLmsLeads.Getheaderflag());
            }
        }

        public async Task<JsonResult> GetIsSearchbyColumn([FromBody] Leads_GetIsSearchbyColumnDto LeadsDto)
        {
            List<MLContactFieldEditSetting> IsSearchbyColumns = new List<MLContactFieldEditSetting>();
            using (var objBL = DLContactFieldEditSetting.GetDLContactFieldEditSetting(LeadsDto.AccountId, SQLProvider))
            {
                var SearchbyColumns = await objBL.GetMLIsSearchbyColumn();
                if (SearchbyColumns != null)
                    IsSearchbyColumns.AddRange(SearchbyColumns);
            }

            using (var objDL = DLLmsCustomFields.GetDLLmsCustomFields(LeadsDto.AccountId, SQLProvider))
            {
                var lmsSearhbyColumns = await objDL.GetMLIsSearchbyColumn();
                if (lmsSearhbyColumns != null)
                    IsSearchbyColumns.AddRange(lmsSearhbyColumns);
            }

            return Json(IsSearchbyColumns);
        }
        public async Task<JsonResult> GetPermissionlevelUsers([FromBody] Leads_GetPermissionlevelUsersDto LeadsDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<UserHierarchy> userHierarchy = new List<UserHierarchy>();
            using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchy = await objUserHierarchy.GetPermissionUsers(user.UserId);

            }
            return Json(userHierarchy);
        }
        public async Task<JsonResult> GetLMSCustomFields([FromBody] Leads_GetLMSCustomFieldsDto LeadsDto)
        {
            using (var objLmsLeads = DLLmsCustomFields.GetDLLmsCustomFields(LeadsDto.AccountId, SQLProvider))
            {
                return Json(await objLmsLeads.GetDetails());
            }
        }
        public async Task<JsonResult> GetUsersList([FromBody] Leads_GetUsersListDto LeadsDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<MLUserHierarchy> userHierarchyList = new List<MLUserHierarchy>();
            List<UserHierarchy> userHierarchyListgroup = new List<UserHierarchy>();
            int SenioruserHierarchyUserId = user.UserId;
            using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                {
                    //if (Getallusers == 0)
                    //{
                    userHierarchyList = await objUserHierarchy.GetHisUsers(user.UserId);
                    userHierarchyList.Add(await objUserHierarchy.GetHisDetails(user.UserId));
                    if (userHierarchyListgroup != null && userHierarchyListgroup.Count > 0)
                    {
                        for (int i = 0; i < userHierarchyListgroup.Count; i++)
                        {
                            userHierarchyList.Add(await objUserHierarchy.GetHisDetails(userHierarchyListgroup[i].UserInfoUserId));
                        }
                    }


                }

                userHierarchyList = userHierarchyList.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

                return Json(userHierarchyList);
            }
        }
    }
}
