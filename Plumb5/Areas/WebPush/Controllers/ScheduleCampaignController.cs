using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.WebPush.Dto;
using Plumb5.Areas.WebPush.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Globalization;
using System.Text;

namespace Plumb5.Areas.WebPush.Controllers
{
    [Area("WebPush")]
    public class ScheduleCampaignController : BaseController
    {
        public ScheduleCampaignController(IConfiguration _configuration) : base(_configuration)
        { }
        static int PushCampaignResult = 1;
        static string PushCampaignResultMsg = "";
        public IActionResult Index()
        {
            return View("ScheduleCampaign");
        }
        [HttpPost]
        public async Task<JsonResult> GetCampaignList()
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            using (var objDL = DLCampaignIdentifier.GetDLCampaignIdentifier(domainDetails.AdsId, SQLProvider))
            {
                return Json(await objDL.GetList(new CampaignIdentifier(), 0, 0));
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetGroupList()
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            using (var objDL = DLGroups.GetDLGroups(domainDetails.AdsId, SQLProvider))
            {
                return Json(await objDL.GetGroupList(new Groups()));
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetTemplateList()
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            using (var objDL = DLWebPushTemplate.GetDLWebPushTemplate(domainDetails.AdsId, SQLProvider))
            {
                return Json(await objDL.GetAllTemplates(new WebPushTemplate()));
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetUniqueMachineId([FromBody] ScheduleCampaign_GetUniqueMachineIdDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            using (var objDL = DLWebPushGroupMembers.GetDLWebPushGroupMembers(domainDetails.AdsId, SQLProvider))
            {
                return Json(await objDL.GetUniqueMachineId(details.ListOfGroupId));
            }
        }
        [HttpPost]
        public async Task<JsonResult> CheckIdentifierUniqueness([FromBody] ScheduleCampaign_CheckIdentifierUniquenessDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            using (var objDL = DLWebPushSendingSetting.GetDLWebPushSendingSetting(domainDetails.AdsId, SQLProvider))
            {
                return Json(await objDL.CheckIdentifier(details.IdentifierName));
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> GroupCreateAndMergeMachineId([FromBody] ScheduleCampaign_GroupCreateAndMergeMachineIdDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            bool Result = false;
            string Message;
            using (var objDL = DLGroups.GetDLGroups(domainDetails.AdsId, SQLProvider))
            {
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                details.groupDetails.UserInfoUserId = user.UserId;
                details.groupDetails.Id = await objDL.Save(details.groupDetails);
            }

            if (details.groupDetails.Id > 0)
            {
                using (var objDL = DLWebPushGroupMembers.GetDLWebPushGroupMembers(domainDetails.AdsId, SQLProvider))
                {
                    Result = await objDL.MergeDistinctMachineIdIntoGroup(details.ListOfGroupId, details.groupDetails.Id, details.groupDetails.UserInfoUserId);
                }

                if (Result)
                    Message = "Group with '" + details.groupDetails.Name + "' has been created and all contacts inserted into this group.";
                else
                    Message = "Unable to merge contacts into the '" + details.groupDetails.Name + "' group, Please try again after sometime.";
            }
            else
            {
                Message = "Group with '" + details.groupDetails.Name + "' name already exists, please try with another name.";
            }

            return Json(new { Result, Message, details.groupDetails });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveOrUpdateSendingSetting([FromBody] ScheduleCampaign_SaveOrUpdateSendingSettingDto details)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            details.webpushSendingSetting.UserInfoUserId = user.UserId;
            details.webpushSendingSetting.UserGroupId = 0;
            details.webpushSendingSetting.ScheduledStatus = 1;

            //#region Logs  
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, SQLProvider, user.UserId, user.UserName, user.EmailId, "Template", "webpushSendingSetting", "SaveOrUpdateTemplate", Helper.GetIP(), JsonConvert.SerializeObject(new { webpushSendingSetting = webpushSendingSetting }));
            //#endregion

            try
            {
                WebPushValidation webObj = new WebPushValidation();
                if (webObj.WebPushSendingSettingValidation(details.webpushSendingSetting))
                {
                    using (var objDL = DLWebPushSendingSetting.GetDLWebPushSendingSetting(details.AccountId, SQLProvider))
                    {
                        if (details.webpushSendingSetting.Id <= 0)
                        {
                            details.webpushSendingSetting.Id = await objDL.Save(details.webpushSendingSetting);
                            //if (webpushSendingSetting.Id > 0)
                            //    LogMessage = "The Push notification template '" + webpushSendingSetting.Name + "' has been created";
                            //else
                            //    LogMessage = "Unable to created the Push notification template '" + webpushSendingSetting.Name + "'";
                        }

                        else if (details.webpushSendingSetting.Id > 0)
                        {
                            bool result = await objDL.Update(details.webpushSendingSetting);
                            //if (result)
                            //    LogMessage = "The Push notification template '" + webpushSendingSetting.Name + "' has been updated";
                            //else
                            //    LogMessage = "Unable to update the Push notification template '" + webpushSendingSetting.Name + "'";
                        }
                    }

                }
            }
            catch (Exception ex)
            {
                return Json(new { Status = false, Error = ex.Message });
            }

            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { webpushSendingSetting = webpushSendingSetting }), LogMessage);
            return Json(new { Status = true, Result = details.webpushSendingSetting });
        }
        [HttpPost]
        public async Task<IActionResult> GetMaxCount([FromBody] ScheduleCampaign_GetMaxCountDto details)
        {
            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            int returnVal;
            using (var objDL = DLWebPushSent.GetDLWebPushSent(domainDetails.AdsId, SQLProvider))
            {
                returnVal = await objDL.GetWebPushTestCampaignMaxCount(FromDateTime, ToDateTime);
            }
            return Json(new
            {
                returnVal
            });
        }
        [HttpPost]
        public async Task<JsonResult> GetCampaignResponses([FromBody] ScheduleCampaign_GetCampaignResponsesDto details)
        {
            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            List<WebPushSent> webpushResponses = null;
            using (var objDL = DLWebPushSent.GetDLWebPushSent(domainDetails.AdsId, SQLProvider))
            {
                webpushResponses = await objDL.GetWebPushTestCampaign(details.OffSet, details.FetchNext, FromDateTime, ToDateTime);
            }
            return Json(webpushResponses);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SendIndividualTest([FromBody] ScheduleCampaign_SendIndividualTestDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            WebPushSettings webpushSettings = new WebPushSettings();
            using (var objBLwebpush = DLWebPushSettings.GetDLWebPushSettings(domainDetails.AdsId, SQLProvider))
            {
                webpushSettings = await objBLwebpush.GetWebPushSettings();
            }


            string MessageContent = "";
            bool SentStatus = false;
            string Message = "";
            if (webpushSettings != null && webpushSettings.Id > 0)
            {
                WebPushUser machineDetails = new WebPushUser();
                using (var objBL = DLWebPushUser.GetDLWebPushUser(domainDetails.AdsId, SQLProvider))
                {
                    machineDetails = await objBL.GetWebPushInfo(new WebPushUser() { MachineId = details.MachineId });
                }
                if (machineDetails != null)
                {
                    PushCampaignResult = 1; PushCampaignResultMsg = "";
                    WebPushTemplate webpushTemplate;
                    using (var objBL = DLWebPushTemplate.GetDLWebPushTemplate(domainDetails.AdsId, SQLProvider))
                    {
                        WebPushTemplate objTemp = new WebPushTemplate() { Id = details.WebpushTemplateId };
                        webpushTemplate = await objBL.GetDetails(objTemp);
                    }

                    if (webpushTemplate != null)
                    {
                        var title = webpushTemplate.Title;
                        var msgcontent = webpushTemplate.MessageContent;
                        var button1_redirect = webpushTemplate.Button1_Redirect;
                        var button2_redirect = webpushTemplate.Button2_Redirect;
                        var onclickredirect = webpushTemplate.OnClickRedirect;
                        var bannerimage = webpushTemplate.BannerImage;

                        if ((machineDetails.ContactId > 0 || !String.IsNullOrEmpty(details.MachineId))
                           && (
                             !String.IsNullOrEmpty(title) && title.IndexOf("[{") > -1
                                || !String.IsNullOrEmpty(msgcontent) && msgcontent.IndexOf("[{") > -1
                                || !String.IsNullOrEmpty(button1_redirect) && button1_redirect.IndexOf("[{") > -1
                                || !String.IsNullOrEmpty(button2_redirect) && button2_redirect.IndexOf("[{") > -1
                                || !String.IsNullOrEmpty(onclickredirect) && onclickredirect.IndexOf("[{") > -1
                                || !String.IsNullOrEmpty(bannerimage) && bannerimage.IndexOf("[{") > -1
                                || !String.IsNullOrEmpty(title) && title.IndexOf("{{*") > -1
                                || !String.IsNullOrEmpty(msgcontent) && msgcontent.IndexOf("{{*") > -1
                                || !String.IsNullOrEmpty(button1_redirect) && button1_redirect.IndexOf("{{*") > -1
                                || !String.IsNullOrEmpty(button2_redirect) && button2_redirect.IndexOf("{{*") > -1
                                || !String.IsNullOrEmpty(onclickredirect) && onclickredirect.IndexOf("{{*") > -1
                                || !String.IsNullOrEmpty(bannerimage) && bannerimage.IndexOf("{{*") > -1
                            ))
                        {
                            Contact contact = null;
                            using (var objblcontact = DLContact.GetContactDetails(domainDetails.AdsId, SQLProvider))
                            {
                                contact = await objblcontact.GetContactDetails(new Contact { ContactId = machineDetails.ContactId });
                            }

                            if (contact != null || !String.IsNullOrEmpty(details.MachineId))
                            {
                                if (title.IndexOf("[{") > -1 || title.IndexOf("{{*") > -1)
                                {
                                    title = ReplaceCustomField(domainDetails.AdsId, contact, title, details.MachineId);
                                }
                                if (msgcontent.IndexOf("[{") > -1 || msgcontent.IndexOf("{{*") > -1)
                                {
                                    msgcontent = ReplaceCustomField(domainDetails.AdsId, contact, msgcontent, details.MachineId);
                                }
                                if (!String.IsNullOrEmpty(button1_redirect) && (button1_redirect.IndexOf("[{") > -1 || button1_redirect.IndexOf("{{*") > -1))
                                {
                                    button1_redirect = ReplaceCustomField(domainDetails.AdsId, contact, button1_redirect, details.MachineId);
                                }
                                if (!String.IsNullOrEmpty(button2_redirect) && (button2_redirect.IndexOf("[{") > -1 || button2_redirect.IndexOf("{{*") > -1))
                                {
                                    button2_redirect = ReplaceCustomField(domainDetails.AdsId, contact, button2_redirect, details.MachineId);
                                }
                                if (!String.IsNullOrEmpty(onclickredirect) && (onclickredirect.IndexOf("[{") > -1 || onclickredirect.IndexOf("{{*") > -1))
                                {
                                    onclickredirect = ReplaceCustomField(domainDetails.AdsId, contact, onclickredirect, details.MachineId);
                                }
                                if (!String.IsNullOrEmpty(bannerimage) && (bannerimage.IndexOf("[{") > -1 || bannerimage.IndexOf("{{*") > -1))
                                {
                                    bannerimage = ReplaceCustomField(domainDetails.AdsId, contact, bannerimage, details.MachineId);
                                }
                            }
                        }


                        if (
                            !String.IsNullOrEmpty(title) && title.IndexOf("[{") > -1
                            || !String.IsNullOrEmpty(msgcontent) && msgcontent.IndexOf("[{") > -1
                            || !String.IsNullOrEmpty(button1_redirect) && button1_redirect.IndexOf("[{") > -1
                            || !String.IsNullOrEmpty(button2_redirect) && button2_redirect.IndexOf("[{") > -1
                            || !String.IsNullOrEmpty(onclickredirect) && onclickredirect.IndexOf("[{") > -1
                            || !String.IsNullOrEmpty(bannerimage) && bannerimage.IndexOf("[{") > -1
                            || !String.IsNullOrEmpty(title) && title.IndexOf("{{*") > -1
                            || !String.IsNullOrEmpty(msgcontent) && msgcontent.IndexOf("{{*") > -1
                            || !String.IsNullOrEmpty(button1_redirect) && button1_redirect.IndexOf("{{*") > -1
                            || !String.IsNullOrEmpty(button2_redirect) && button2_redirect.IndexOf("{{*") > -1
                            || !String.IsNullOrEmpty(onclickredirect) && onclickredirect.IndexOf("{{*") > -1
                            || !String.IsNullOrEmpty(bannerimage) && bannerimage.IndexOf("{{*") > -1
                            )
                        {
                            SentStatus = false;
                            Message = "Dynamic feild not replaced";
                        }
                        else
                        {
                            WebPushSent senderDetails = new WebPushSent();
                            senderDetails.P5UniqueId = DateTime.Now.ToString("ddMMyyyyHHmmssfff");
                            senderDetails.MachineId = machineDetails.MachineId;
                            senderDetails.MessageTitle = title;
                            senderDetails.MessageContent = msgcontent;
                            senderDetails.Button1_Redirect = button1_redirect;
                            senderDetails.Button2_Redirect = button2_redirect;
                            senderDetails.OnClickRedirect = onclickredirect;
                            senderDetails.BannerImage = bannerimage;
                            senderDetails.VapidAuthkey = machineDetails.VapidAuthKey;
                            senderDetails.VapidEndpointUrl = machineDetails.VapidEndPointUrl;
                            senderDetails.VapidTokenkey = machineDetails.VapidTokenKey;
                            senderDetails.WorkFlowId = 0;
                            senderDetails.WorkFlowDataId = 0;
                            SendWebPushThroughVapid(webpushSettings, webpushTemplate, senderDetails);


                            SentStatus = PushCampaignResult == 0 ? false : true;
                            if (PushCampaignResult == 0) { Message = "Machineid unsubscribed"; }

                            SendWebPushResponses(details.WebpushTemplateId, machineDetails, SentStatus, senderDetails.P5UniqueId, senderDetails);

                            SentStatus = true;
                            Message = "Sent successfully";
                        }
                    }
                    else
                    {
                        SentStatus = false;
                        Message = "Template not found";
                    }
                }
                else
                {
                    SentStatus = false;
                    Message = "MachineId not found";
                }
            }

            else
            {
                SentStatus = false;
                Message = "You have not configured for webpush";
            }
            return Json(new { SentStatus, Message, MessageContent });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SendGroupTest([FromBody] ScheduleCampaign_SendGroupTestDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));


            WebPushSettings webpushSettings = new WebPushSettings();
            using (var objBLwebpush = DLWebPushSettings.GetDLWebPushSettings(domainDetails.AdsId, SQLProvider))
            {
                webpushSettings = await objBLwebpush.GetWebPushSettings();
            }


            string MessageContent = "";
            bool SentStatus = false;
            string Message = "";
            if (webpushSettings != null && webpushSettings.Id > 0)
            {
                List<WebPushUser> GroupMemberList;
                using (var objDL = DLWebPushGroupMembers.GetDLWebPushGroupMembers(domainDetails.AdsId, SQLProvider))
                {
                    GroupMemberList = await objDL.GetGroupWebPushInfoList(details.webpushSendingSetting.GroupId);
                }
                if (GroupMemberList != null && GroupMemberList.Count > 0)
                {
                    if (GroupMemberList != null && GroupMemberList.Count > 0 && GroupMemberList.Count <= 30)
                    {
                        WebPushTemplate webpushTemplate;
                        using (var objBL = DLWebPushTemplate.GetDLWebPushTemplate(domainDetails.AdsId, SQLProvider))
                        {
                            WebPushTemplate objTemp = new WebPushTemplate() { Id = details.webpushSendingSetting.WebPushTemplateId };
                            webpushTemplate = await objBL.GetDetails(objTemp);
                        }

                        if (webpushTemplate != null)
                        {
                            foreach (var machineDetails in GroupMemberList)
                            {
                                PushCampaignResult = 1; PushCampaignResultMsg = "";
                                var title = webpushTemplate.Title;
                                var msgcontent = webpushTemplate.MessageContent;
                                var button1_redirect = webpushTemplate.Button1_Redirect;
                                var button2_redirect = webpushTemplate.Button2_Redirect;
                                var onclickredirect = webpushTemplate.OnClickRedirect;
                                var bannerimage = webpushTemplate.BannerImage;

                                if ((machineDetails.ContactId > 0 || !String.IsNullOrEmpty(machineDetails.MachineId)) &&
                                    (
                                        !String.IsNullOrEmpty(title) && title.IndexOf("[{") > -1
                                        || !String.IsNullOrEmpty(msgcontent) && msgcontent.IndexOf("[{") > -1
                                        || !String.IsNullOrEmpty(button1_redirect) && button1_redirect.IndexOf("[{") > -1
                                        || !String.IsNullOrEmpty(button2_redirect) && button2_redirect.IndexOf("[{") > -1
                                        || !String.IsNullOrEmpty(onclickredirect) && onclickredirect.IndexOf("[{") > -1
                                        || !String.IsNullOrEmpty(bannerimage) && bannerimage.IndexOf("[{") > -1
                                        || !String.IsNullOrEmpty(title) && title.IndexOf("{{*") > -1
                                        || !String.IsNullOrEmpty(msgcontent) && msgcontent.IndexOf("{{*") > -1
                                        || !String.IsNullOrEmpty(button1_redirect) && button1_redirect.IndexOf("{{*") > -1
                                        || !String.IsNullOrEmpty(button2_redirect) && button2_redirect.IndexOf("{{*") > -1
                                        || !String.IsNullOrEmpty(onclickredirect) && onclickredirect.IndexOf("{{*") > -1
                                        || !String.IsNullOrEmpty(bannerimage) && bannerimage.IndexOf("{{*") > -1
                                    ))
                                {


                                    Contact contact = null;
                                    if (machineDetails.ContactId > 0)
                                    {
                                        using (var objblcontact = DLContact.GetContactDetails(domainDetails.AdsId, SQLProvider))
                                        {
                                            contact = await objblcontact.GetContactDetails(new Contact { ContactId = machineDetails.ContactId });
                                        }
                                    }

                                    if (title.IndexOf("[{") > -1 || title.IndexOf("{{*") > -1)
                                    {
                                        title = ReplaceCustomField(domainDetails.AdsId, contact, title, machineDetails.MachineId);
                                    }
                                    if (msgcontent.IndexOf("[{") > -1 || msgcontent.IndexOf("{{*") > -1)
                                    {
                                        msgcontent = ReplaceCustomField(domainDetails.AdsId, contact, msgcontent, machineDetails.MachineId);
                                    }
                                    if (!String.IsNullOrEmpty(button1_redirect) && (button1_redirect.IndexOf("[{") > -1 || button1_redirect.IndexOf("{{*") > -1))
                                    {
                                        button1_redirect = ReplaceCustomField(domainDetails.AdsId, contact, button1_redirect, machineDetails.MachineId);
                                    }
                                    if (!String.IsNullOrEmpty(button2_redirect) && (button2_redirect.IndexOf("[{") > -1 || button2_redirect.IndexOf("{{*") > -1))
                                    {
                                        button2_redirect = ReplaceCustomField(domainDetails.AdsId, contact, button2_redirect, machineDetails.MachineId);
                                    }
                                    if (!String.IsNullOrEmpty(onclickredirect) && (onclickredirect.IndexOf("[{") > -1 || onclickredirect.IndexOf("{{*") > -1))
                                    {
                                        onclickredirect = ReplaceCustomField(domainDetails.AdsId, contact, onclickredirect, machineDetails.MachineId);
                                    }
                                    if (!String.IsNullOrEmpty(bannerimage) && (bannerimage.IndexOf("[{") > -1 || bannerimage.IndexOf("{{*") > -1))
                                    {
                                        bannerimage = ReplaceCustomField(domainDetails.AdsId, contact, bannerimage, machineDetails.MachineId);
                                    }
                                }

                                WebPushSent senderDetails = new WebPushSent();
                                senderDetails.P5UniqueId = DateTime.Now.ToString("ddMMyyyyHHmmssfff");
                                senderDetails.MachineId = machineDetails.MachineId;
                                senderDetails.MessageTitle = title;
                                senderDetails.MessageContent = msgcontent;
                                senderDetails.VapidAuthkey = machineDetails.VapidAuthKey;
                                senderDetails.VapidEndpointUrl = machineDetails.VapidEndPointUrl;
                                senderDetails.VapidTokenkey = machineDetails.VapidTokenKey;
                                senderDetails.Button1_Redirect = button1_redirect;
                                senderDetails.Button2_Redirect = button2_redirect;
                                senderDetails.OnClickRedirect = onclickredirect;
                                senderDetails.BannerImage = bannerimage;
                                SendWebPushThroughVapid(webpushSettings, webpushTemplate, senderDetails);


                                SentStatus = PushCampaignResult == 0 ? false : true;

                                SendWebPushResponses(details.webpushSendingSetting.WebPushTemplateId, machineDetails, SentStatus, senderDetails.P5UniqueId, senderDetails);
                            }
                        }
                        else
                        {
                            SentStatus = false;
                            Message = "Template not found";
                        }
                    }
                    else
                    {
                        Message = "Total contact in the test group should be less than 30";
                    }
                }
                else
                {
                    Message = "There are no contacts in the selected group to send Push notification.";
                }
            }

            else
            {
                SentStatus = false;
                Message = "You have not configured for webpush";
            }
            return Json(new { SentStatus, Message, MessageContent });
        }



        public async void SendWebPushResponses(int WebpushTemplateId, WebPushUser machineDetails, string title, string MessageContent, bool SentStatus, string P5UniqueId)
        {
            WebPushSent pushSent = new WebPushSent();
            pushSent.WebPushSendingSettingId = 0;
            pushSent.WebPushTemplateId = WebpushTemplateId;
            pushSent.MachineId = machineDetails.MachineId;
            //pushSent.title = title;
            pushSent.MessageContent = MessageContent;
            pushSent.SentDate = DateTime.Now;
            pushSent.IsSent = Convert.ToByte(SentStatus == true ? 1 : 0);
            pushSent.IsClicked = 0;
            pushSent.IsViewed = 0;
            pushSent.IsClosed = 0;
            pushSent.SendStatus = 1;
            pushSent.IsUnsubscribed = Convert.ToByte(SentStatus == false ? 1 : 0);
            pushSent.ErrorMessage = "";
            pushSent.WorkFlowId = 0;
            pushSent.WorkFlowDataId = 0;
            pushSent.CampaignJobName = "campaign";
            pushSent.VapidAuthkey = machineDetails.VapidAuthKey;
            pushSent.VapidEndpointUrl = machineDetails.VapidEndPointUrl;
            pushSent.VapidTokenkey = machineDetails.VapidTokenKey;
            pushSent.P5UniqueId = P5UniqueId;
            pushSent.ErrorMessage = PushCampaignResultMsg;

            if (SentStatus == false) { pushSent.UnsubscribedDate = DateTime.Now; };

            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            using (var objDL = DLWebPushSent.GetDLWebPushSent(domainDetails.AdsId, SQLProvider))
            {
                await objDL.Save(pushSent);
            }
        }


        private string SendWebPushThroughVapid(WebPushSettings PushSettings, WebPushTemplate webpushtemplate, WebPushSent senderDetails)
        {
            try
            {
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                string callbackAssembly = "Plumb5";
                string callbackClass = "Plumb5.Areas.WebPush.Controllers.ScheduleCampaignController";
                string callbackMethod = "updateBrowserResponses";
                var extraparam = "{\"AdsId\":" + domainDetails.AdsId + ",\"P5UniqueId\":\"" + senderDetails.P5UniqueId + "\"}";

                using (SendWebPushVapidApiCall objVapid = new SendWebPushVapidApiCall(domainDetails.AdsId, false, callbackAssembly, callbackClass, callbackMethod, extraparam))
                {
                    objVapid.SendNotification(PushSettings, webpushtemplate, senderDetails);
                    return "sucess";
                }

            }
            catch (Exception ex)
            {
                return ex.Message.ToString();

            }
        }

        public static void updateBrowserResponses(string param)
        {
            try
            {
                PushCampaignResult = 0;
                var extraData = JsonConvert.DeserializeObject<MLWebPushUpdateResponsesDetails>(param);
                PushCampaignResultMsg = extraData.StatusMessage;

                //using (DLWebPushSent objDLsms = new DLWebPushSent(extraData.AdsId))
                //{
                //    objDLsms.UpdateWebPushCampaignResponsesFromBulkCampaign(extraData);
                //}
            }
            catch (AggregateException ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("P5WorkFlowWebPushScheduler"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "P5WorkFlowWebPushScheduler->SendWebPushVendor", param.ToString());
                }
            }


        }
        [HttpPost]
        public async Task<JsonResult> GetWebPushSendingSettingDetails([FromBody] ScheduleCampaign_GetWebPushSendingSettingDetailsDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            WebPushSendingSetting webpush = null;
            using (var objDL = DLWebPushSendingSetting.GetDLWebPushSendingSetting(domainDetails.AdsId, SQLProvider))
            {
                webpush = await objDL.GetDetail(details.Id);
            }
            return Json(webpush);
        }

        public string ReplaceCustomField(int AdsId, Contact contact, string MessageContent, string MachineId)
        {
            if (contact != null || !String.IsNullOrEmpty(MachineId))
            {
                StringBuilder Bodydata = new StringBuilder();
                Bodydata.Clear().Append(MessageContent);
                HelperForSMS HelpSMS = new HelperForSMS(AdsId, SQLProvider);
                HelpSMS.ReplaceContactDetails(Bodydata, contact, AdsId, MachineId, channeltype: "webpush");
                return Bodydata.ToString();
            }
            else
            {
                return MessageContent;
            }
        }

        [HttpPost]
        public async Task<IActionResult> CheckCredits([FromBody] ScheduleCampaign_CheckCreditsDto details)
        {
            var result = false; long getCredits = 0;
            var UserInfoUserId = 0;
            using (var objDL = DLAccount.GetDLAccount(SQLProvider))
            {
                UserInfoUserId = objDL.GetAccountDetails(details.accountId).Result.UserInfoUserId;
            }

            if (UserInfoUserId != 0)
            {
                using (var objDL = DLPurchase.GetDLPurchase(SQLProvider))
                {
                    var PurchaseData = await objDL.GetDailyConsumptionedDetails(details.accountId, UserInfoUserId);
                    getCredits = PurchaseData.TotalWebPushRemaining;
                    result = getCredits >= details.TotalContacts ? true : false;
                }
            }
            return Json(new { Status = result, Credits = getCredits });
        }

        public async void SendWebPushResponses(int WebpushTemplateId, WebPushUser machineDetails, bool SentStatus, string P5UniqueId, WebPushSent senderDetails)
        {
            WebPushSent pushSent = new WebPushSent();
            pushSent.WebPushSendingSettingId = 0;
            pushSent.WebPushTemplateId = WebpushTemplateId;
            pushSent.MachineId = machineDetails.MachineId;
            pushSent.MessageTitle = senderDetails.MessageTitle;
            pushSent.MessageContent = senderDetails.MessageContent;
            pushSent.SentDate = DateTime.Now;
            pushSent.IsSent = Convert.ToByte(SentStatus == true ? 1 : 0);
            pushSent.IsClicked = 0;
            pushSent.IsViewed = 0;
            pushSent.IsClosed = 0;
            pushSent.SendStatus = 1;
            pushSent.IsUnsubscribed = Convert.ToByte(SentStatus == false ? 1 : 0);
            pushSent.ErrorMessage = "";
            pushSent.WorkFlowId = 0;
            pushSent.WorkFlowDataId = 0;
            pushSent.CampaignJobName = "campaign";
            pushSent.VapidAuthkey = machineDetails.VapidAuthKey;
            pushSent.VapidEndpointUrl = machineDetails.VapidEndPointUrl;
            pushSent.VapidTokenkey = machineDetails.VapidTokenKey;
            pushSent.P5UniqueId = P5UniqueId;
            pushSent.ErrorMessage = PushCampaignResultMsg;
            pushSent.Button1_Redirect = senderDetails.Button1_Redirect;
            pushSent.Button2_Redirect = senderDetails.Button2_Redirect;
            pushSent.OnClickRedirect = senderDetails.OnClickRedirect;
            pushSent.BannerImage = senderDetails.BannerImage;

            if (SentStatus == false) { pushSent.UnsubscribedDate = DateTime.Now; };

            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            using (var objBL = DLWebPushSent.GetDLWebPushSent(domainDetails.AdsId, SQLProvider))
            {
                await objBL.Save(pushSent);
            }
        }
    }
}
