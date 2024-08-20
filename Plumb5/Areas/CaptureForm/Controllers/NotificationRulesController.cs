using Microsoft.AspNetCore.Mvc;
using Plumb5.Controllers;

namespace Plumb5.Areas.CaptureForm.Controllers
{
    [Area("CaptureForm")]
    public class NotificationRulesController : BaseController
    {
        public NotificationRulesController(IConfiguration _configuration) : base(_configuration)
        { }
        // GET: /CaptureForm/NotificationRules/

        public IActionResult Index()
        {
            return View("NotificationRules");
        }
    }
}
