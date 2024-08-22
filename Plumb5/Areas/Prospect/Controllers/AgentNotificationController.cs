using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Prospect.Dto;
using Plumb5.Controllers;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class AgentNotificationController : BaseController
    {
        public AgentNotificationController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /Prospect/AgentNotification/

        public IActionResult Index()
        {
            return View("AgentNotification");
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveLeadAssign([FromBody] AgentNotificationDto_SaveLeadAssign commonDetails)
        {
            Int32 Id = 0;
            using (var objDL = DLLeadNotification.GetDLLeadNotification(commonDetails.AccountId, SQLProvider))
                Id = await objDL.SaveNotificationForLead(commonDetails.leadNotification);
            return Json(Id);
        }

        [HttpPost]
        public async Task<JsonResult> GetNotificationForLead([FromBody] AgentNotificationDto_GetNotificationForLead commonDetails)
        {
            LeadNotification? leadNotification = null;
            using (var objDL = DLLeadNotification.GetDLLeadNotification(commonDetails.AccountId, SQLProvider))
            {
                leadNotification = await objDL.GetNotificationForLead();
            }

            return Json(leadNotification);
        }
    }
}
