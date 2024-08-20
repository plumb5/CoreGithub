using Microsoft.AspNetCore.Mvc;
using Plumb5.Controllers;

namespace Plumb5.Areas.CaptureForm.Controllers
{
    [Area("CaptureForm")]
    public class LeadAssignNotificationSettingController : BaseController
    {
        public LeadAssignNotificationSettingController(IConfiguration _configuration) : base(_configuration)
        { }

        public ActionResult Index()
        {
            return View("LeadAssignNotificationSetting");
        }
    }
}
