using Microsoft.AspNetCore.Mvc;
using Plumb5.Controllers;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class ContactImportOverViewsController : BaseController
    {
        public ContactImportOverViewsController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("ContactImportOverViews");
        }
    }
}
