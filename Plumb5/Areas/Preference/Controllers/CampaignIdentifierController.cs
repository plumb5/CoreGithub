using Microsoft.AspNetCore.Mvc;
using Plumb5.Controllers;

namespace Plumb5.Areas.Preference.Controllers
{
    [Area("Preference")]
    public class CampaignIdentifierController : BaseController
    {
        public CampaignIdentifierController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /Preference/CampaignIdentifier/

        public IActionResult Index()
        {
            return View("CampaignIdentifier");
        }

    }
}
