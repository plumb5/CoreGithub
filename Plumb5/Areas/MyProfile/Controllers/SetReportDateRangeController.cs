using Microsoft.AspNetCore.Mvc;

namespace Plumb5.Areas.MyProfile.Controllers
{
    [Area("MyProfile")]
    public class SetReportDateRangeController : Controller
    {
        public IActionResult Index()
        {
            return View("SetReportDateRange");
        }
    }
}
