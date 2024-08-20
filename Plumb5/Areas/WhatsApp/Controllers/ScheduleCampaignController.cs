using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.WhatsApp.Dto;
using Plumb5.Controllers;
using Plumb5.Dto;
using Plumb5GenralFunction;
using System.Data;

namespace Plumb5.Areas.WhatsApp.Controllers
{
    [Area("WhatsApp")]
    public class ScheduleCampaignController : BaseController
    {
        public ScheduleCampaignController(IConfiguration _configuration) : base(_configuration)
        { }
        public async Task<ActionResult> Index()
        {
            return View("ScheduleCampaign");
        }
        [HttpPost]
        public async Task<JsonResult> GetWhatsAppSendingSettingDetails([FromBody] ScheduleCampaign_GetWhatsAppSendingSettingDetailsDto objDto)
        {
            using (var objBL = DLWhatsAppSendingSetting.GetDLWhatsAppSendingSetting(objDto.accountId, SQLProvider))
            {
                return Json(await objBL.Get(objDto.WhatsAppSendingSettingId));
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetCampaignList([FromBody] ScheduleCampaign_GetCampaignListDto objDto)
        {
            using (var objBL = DLCampaignIdentifier.GetDLCampaignIdentifier(objDto.accountId,SQLProvider))
            {
                return Json(await objBL.GetList(new CampaignIdentifier(), 0, 0));
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetGroupList([FromBody] ScheduleCampaign_GetGroupListDto objDto)
        {
            using (var objBL = DLGroups.GetDLGroups(objDto.accountId,SQLProvider))
            {
                return Json(await objBL.GetGroupList(new Groups()));
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetTemplateList([FromBody] ScheduleCampaign_GetTemplateListDto objDto)
        {

            using (var objBL = DLWhatsAppTemplates.GetDLWhatsAppTemplates(objDto.accountId,SQLProvider))
            {
                return Json(await objBL.GetTemplateDetails(new WhatsAppTemplates()));
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetUniquePhoneContact([FromBody] ScheduleCampaign_GetUniquePhoneContactDto objDto)
        {
            using (var objBL = DLGroupMember.GetDLGroupMember(objDto.accountId,SQLProvider))
            {
                return Json(await objBL.GetUniquePhoneContact(objDto.ListOfGroupId));
            }
        }
        [HttpPost]
        public async Task<JsonResult> CheckIdentifierUniqueness([FromBody] ScheduleCampaign_CheckIdentifierUniquenessDto objDto)
        {
            using (var objBL = DLWhatsAppSendingSetting.GetDLWhatsAppSendingSetting(objDto.accountId,SQLProvider))
            {
                return Json(await objBL.CheckIdentifier(objDto.IdentifierName));
            }
        }
        [HttpPost]
        public async Task<ActionResult> GetGroupAnalysisDetails([FromBody] ScheduleCampaign_GetGroupAnalysisDetailsDto objDto)
        {
            try
            {
                DataSet ds;
                using (var objBL = DLWhatsAppMessageSent.GetDLWhatsAppMessageSent(objDto.accountId,SQLProvider))
                {
                    ds =await objBL.GetOpenAndClickedRate(objDto.GroupIds);
                }

                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> GroupCreateAndMergeContact([FromBody] ScheduleCampaign_GroupCreateAndMergeContactDto objDto)
        {
            Groups groupDetails = objDto.groupDetailsData;
            bool Result = false;
            string Message;
            using (var objBL = DLGroups.GetDLGroups(objDto.accountId,SQLProvider))
            {
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                groupDetails.UserInfoUserId = user.UserId;
                groupDetails.Id =await objBL.Save(groupDetails);
            }

            if (groupDetails.Id > 0)
            {
                using (var objBL = DLGroupMember.GetDLGroupMember(objDto.accountId,SQLProvider))
                {
                    Result =await objBL.MergeDistinctContactIntoGroupByPhoneNumber(objDto.ListOfGroupId, groupDetails.Id, groupDetails.UserInfoUserId);
                }

                if (Result)
                    Message = "Group with '" + groupDetails.Name + "' has been created and all contacts inserted into this group.";
                else
                    Message = "Unable to merge contacts into the '" + groupDetails.Name + "' group, Please try again after sometime.";
            }
            else
            {
                Message = "Group with '" + groupDetails.Name + "' name already exists, please try with another name.";
            }

            return Json(new { Result, Message, groupDetails });
        }



        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveSingleScheduleWhatsApp([FromBody] ScheduleCampaign_SaveSingleScheduleWhatsAppDto objDto)
        {
            WhatsAppSendingSetting whatsappSendingSetting = new WhatsAppSendingSetting();
            Helper.CopyWithDateTimeWhenString(objDto.whatsappSendingSettingData, whatsappSendingSetting);

            //WhatsAppSendingSetting whatsappSendingSetting = objDto.whatsappSendingSettingData;
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            whatsappSendingSetting.UserInfoUserId = user.UserId;
            whatsappSendingSetting.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
            bool result = false;
            //#region Logs  
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "Schedule Campaign ", "Sms", "SaveSingleScheduleSMS", Helper.GetIP(), JsonConvert.SerializeObject(new { smsSendingSetting = smsSendingSetting, EditCopyAction = EditCopyAction }));
            //#endregion

            using (var objBL = DLWhatsAppSendingSetting.GetDLWhatsAppSendingSetting(objDto.accountId,SQLProvider))
            {
                if (objDto.EditCopyAction != null && objDto.EditCopyAction != string.Empty && objDto.EditCopyAction.ToLower() == "edit" && whatsappSendingSetting.Id > 0)
                {

                    result =await objBL.UpdateScheduledCampaign(whatsappSendingSetting);
                    //LogMessage = "Updated successfully";
                }
                else
                {
                    whatsappSendingSetting.Id =await objBL.Save(whatsappSendingSetting);
                    if (whatsappSendingSetting.Id > 0)
                        result = true;
                    else
                        result = false;
                    //if (smsSendingSetting.Id > 0)
                    //    LogMessage = "Saved successfully";
                    //else
                    //    LogMessage = "Unable to save";
                }
            }

            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Id = smsSendingSetting.Id }), LogMessage);
            return Json(new { whatsappSendingSetting, result });
        }


        [Log]
        [HttpPost]
        public async Task<JsonResult> DeleteCampaign([FromBody] ScheduleCampaign_DeleteCampaignDto objDto)
        {
            using (var objBL = DLWhatsAppSendingSetting.GetDLWhatsAppSendingSetting(objDto.accountId,SQLProvider))
            {
                return Json(await objBL.Delete(objDto.WhatsAppSendingSettingId));
            }
        }
        [HttpPost]
        public async Task<ActionResult> CheckCredits([FromBody] ScheduleCampaign_CheckCreditsDto objDto)
        {
            var result = false; long getCredits = 0;
            var UserInfoUserId = 0;
            using (var objBL = DLAccount.GetDLAccount(SQLProvider))
            {
                var act_details = await objBL.GetAccountDetails(objDto.accountId);
                UserInfoUserId = act_details.UserInfoUserId;
            }

            if (UserInfoUserId != 0)
            {
                using (var objBL = DLPurchase.GetDLPurchase(SQLProvider))
                {
                    var PurchaseData =await objBL.GetDailyConsumptionedDetails(objDto.accountId, UserInfoUserId);
                    getCredits = PurchaseData.TotalWhatsAppRemaining;
                    result = getCredits >= objDto.TotalContacts ? true : false;
                }
            }
            return Json(new { Status = result, Credits = getCredits });
        }
    }
}
