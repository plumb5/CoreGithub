using CoreGithub.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using P5GenralML;

namespace CoreGithub.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            //test gngfjfgj    safasfas testinvg new test eeee
            _logger = logger;
        }

        public IActionResult Index()
        {
            Account ac=new Account();
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
