using Microsoft.AspNetCore.Mvc;
using P5GenralML;
using P5GenralDL;
using Plumb5.Controllers;
using System.Globalization;
using System.Data;
using System.Collections;
using Microsoft.DotNet.Scaffolding.Shared.CodeModifier.CodeChange;
using Newtonsoft.Json;
using Plumb5GenralFunction;

namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class SplitTestController : BaseController
    {
        public SplitTestController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            DomainInfo? _accountInfo = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            ViewBag.AdsId = _accountInfo.AdsId;
            return View("SplitTest");
        }
    }
}
