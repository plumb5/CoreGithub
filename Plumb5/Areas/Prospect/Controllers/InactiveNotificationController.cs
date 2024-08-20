using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5.Areas.Prospect.Models;
using Plumb5.Areas.Prospect.Dto;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class InactiveNotificationController : BaseController
    {
        public InactiveNotificationController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /Prospect/InactiveNotification/

        public IActionResult Index()
        {
            return View("InactiveNotification");
        }

        public async Task<JsonResult> GetInactiveNotification([FromBody] InactiveNotification_GetInactiveNotificationDto InactiveNotificationDto)
        {
            ContactInactiveNotification lmsNotification = null;
            using (var obj =   DLContactInactiveNotification.GetDLDLContactInactiveNotification(InactiveNotificationDto.AdsId, SQLProvider))
            {
                lmsNotification = await obj.GetDetails();
            }

            return Json(lmsNotification );
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> StoreInactiveNotification([FromBody] InactiveNotification_StoreInactiveNotificationDto InactiveNotificationDto)
        {
            int Id = 0;

            try
            {
                InActiveNotificationValidation objinactivedetails = new InActiveNotificationValidation();

                if (objinactivedetails.ValidateInActivateNotificationDetails(InactiveNotificationDto.lmsNotification))
                {
                    using (var obj =   DLContactInactiveNotification.GetDLDLContactInactiveNotification(InactiveNotificationDto.AdsId, SQLProvider))
                    {
                        Id = await obj.Save(InactiveNotificationDto.lmsNotification);
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { Id = Id, error = ex.Message } );
            }

            return Json(new { Id = Id, error = "" } );
        }
    }
}
