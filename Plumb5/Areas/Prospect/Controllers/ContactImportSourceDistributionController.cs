using Microsoft.AspNetCore.Mvc;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class ContactImportSourceDistributionController : Controller
    {
        public IActionResult Index()
        {
            return View("ContactImportSourceDistribution");
        }
    }
}
