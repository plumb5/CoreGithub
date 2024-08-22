using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Preference.Dto;
using Plumb5.Controllers;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.Preference.Controllers
{
    [Area("Preference")]
    public class ChannelCreditsController : BaseController
    {
        public ChannelCreditsController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /Preference/ChannelCredits/

        public IActionResult Index()
        {
            return View("ChannelCredits");
        }
        [HttpPost]
        public async Task<JsonResult> GetChannelCreditDetails([FromBody] ChannelCredits_GetChannelCreditDetailsDto ChannelCreditsDto)
        {
            MLPurchaseConsumption purchaseConsumption = null;
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            int MainUserInfoUserId = 0;

            if (user.IsSuperAdmin == 0)
            {
                using (var objDL =   DLUserInfo.GetDLUserInfo(SQLProvider))
                {
                    MainUserInfoUserId = await objDL.MainUserId(user.UserId);
                }
            }
            else
            {
                MainUserInfoUserId = user.UserId;
            }

            if (MainUserInfoUserId > 0)
            {
                using (var objDL =   DLPurchase.GetDLPurchase(SQLProvider))
                {
                    purchaseConsumption = await objDL.GetDailyConsumptionedDetails(ChannelCreditsDto.accountId, MainUserInfoUserId);
                }
            }

            return Json(purchaseConsumption);
        }
   
        

    }
}
