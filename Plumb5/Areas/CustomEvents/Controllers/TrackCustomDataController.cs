using Microsoft.AspNetCore.Mvc;

namespace Plumb5.Areas.CustomEvents.Controllers
{
    [Area("CustomEvents")]
    public class TrackCustomDataController : Controller
    {
        public IActionResult Index()
        {
            return View("TrackCustomData");
        }
    }
}
