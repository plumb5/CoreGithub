using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralML;
using Plumb5.Areas.Preference.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;

namespace Plumb5.Areas.Preference.Controllers
{
    [Area("Preference")]
    public class IntegrationStatusController : BaseController
    {
        public IntegrationStatusController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /Preference/IntegrationStatus/

        public IActionResult Index()
        {
            return View("IntegrationStatus");
        }
        [HttpPost]
        public async Task<JsonResult> GetWebTracking([FromBody] IntegrationStatus_GetWebTrackingDto IntegrationStatusDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            IntegrationStatus objStatus = new IntegrationStatus(IntegrationStatusDto.AccountId, SQLProvider);
            var result =await objStatus.GetIntegrationStatus(IntegrationStatusDto.AccountId);
            return Json(result );
        }
    }
}
