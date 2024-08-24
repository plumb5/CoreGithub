using Microsoft.AspNetCore.Mvc;
using Plumb5.Controllers;

namespace Plumb5.Areas.UCP.Controllers
{
    [Area("UCP")]
    public class UsersJourneyController : BaseController
    {
        public UsersJourneyController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("UsersJourney");
        }

    }
}
