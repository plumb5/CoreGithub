using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Prospect.Dto;
using Plumb5.Controllers;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class AdvancedSettingsController : BaseController
    {
        public AdvancedSettingsController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /Prospect/AdvancedSettings/

        public IActionResult Index()
        {
            return View("AdvancedSettings");
        }

        [HttpPost]
        public async Task<JsonResult> SaveOrUpdate([FromBody] AdvancedSettingsDto_SaveOrUpdate commonDetails)
        {
            var result = 0;
            using (var objDL = DLLmsAdvancedSettings.GetLmsAdvancedSettings(commonDetails.AccountId, SQLProvider))
            {
                result = await objDL.saveupdate(commonDetails.advancedsettings);
            }
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> GetLmAdvacedSettings([FromBody] AdvancedSettingsDto_GetLmAdvacedSettings commonDetails)
        {
            List<MLLmsAdvancedSettings> advancedsettingsdetails = null;
            using (var objBL = DLLmsAdvancedSettings.GetLmsAdvancedSettings(commonDetails.accountId, SQLProvider))
            {
                advancedsettingsdetails = await objBL.GetDetailsAdvancedSettings(commonDetails.key);
            }
            return Json(advancedsettingsdetails);
        }
    }
}
