using Microsoft.AspNetCore.Mvc;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class ContactImportGroupDistributionController : Controller
    {
        public IActionResult Index()
        {
            return View("ContactImportGroupDistribution");
        }
    }
}
