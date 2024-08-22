using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Prospect.Dto;
using Plumb5.Controllers;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class LeadAssignNotificationSettingController : BaseController
    {
        public LeadAssignNotificationSettingController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /Prospect/LeadAssignNotificationSetting/

        public IActionResult Index()
        {
            return View("LeadAssignNotificationSetting");
        }

        [Log]
        public async Task<JsonResult> SaveLeadAssignmentAgentNotification([FromBody] LeadAssignNotificationSetting_SaveLeadAssignmentAgentNotificationDto LeadAssignNotificationSettingDto)
        {
            Int32 Id = 0;

            using (var objDL =   DLLeadAssignmentAgentNotification.GetDLLeadAssignmentAgentNotification(LeadAssignNotificationSettingDto.AccountId, SQLProvider))
                Id = await objDL.SaveLeadAssignmentAgentNotification(LeadAssignNotificationSettingDto.leadAssignmentAgentNotification);

            return Json(Id );
        }

        public async Task<JsonResult> GetLeadAssignmentAgentNotification([FromBody] LeadAssignNotificationSetting_GetLeadAssignmentAgentNotificationDto LeadAssignNotificationSettingDto)
        {
            LeadAssignmentAgentNotification leadAssignmentAgentNotification = null;

            using (var objDL =   DLLeadAssignmentAgentNotification.GetDLLeadAssignmentAgentNotification(LeadAssignNotificationSettingDto.AccountId, SQLProvider))
                leadAssignmentAgentNotification = await objDL.GetLeadAssignmentAgentNotification();

            return Json(leadAssignmentAgentNotification );
        }

    }
}

