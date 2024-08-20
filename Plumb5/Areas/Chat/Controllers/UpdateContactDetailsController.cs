using Microsoft.AspNetCore.Mvc;
using Plumb5.Controllers;

namespace Plumb5.Areas.Chat.Controllers
{
    [Area("Chat")]
    public class UpdateContactDetailsController : BaseController
    {
        public UpdateContactDetailsController(IConfiguration _configuration) : base(_configuration)
        { }

        public IActionResult Index()
        {
            return View("UpdateContactDetails");
        }
    }
}
