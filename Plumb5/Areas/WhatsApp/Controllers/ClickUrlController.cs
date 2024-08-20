using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Sms.Dto;
using Plumb5.Areas.WhatsApp.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.WhatsApp.Controllers
{
    [Area("WhatsApp")]
    public class ClickUrlController : BaseController
    {
        public ClickUrlController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /WhatsApp/ClickUrl/


        public async Task<JsonResult> MaxCount([FromBody] WhatsaAppClickUrl_MaxCountDto ClickUrlDto)
        {
            ArrayList data = new ArrayList() { ClickUrlDto.WhatsAppSendingSettingId };
            HttpContext.Session.SetString("WhatsAppCampaignClickUrlReport", JsonConvert.SerializeObject(data));
            
            int returnVal;
            using (var objBL =   DLWhatsAppClickUrl.GetDLWhatsAppClickUrl(ClickUrlDto.accountId, SQLProvider))
            {
                returnVal = await objBL.MaxCount(ClickUrlDto.WhatsAppSendingSettingId);
            }
            return Json(new
            {
                returnVal
            });
        }

        public async Task<JsonResult> GetResponseData([FromBody] WhatsaAppClickUrl_GetResponseDataDto ClickUrlDto)
        {
            List<MLWhatsAppClickUrl> responsedetails = null;

            using (var objBL = DLWhatsAppClickUrl.GetDLWhatsAppClickUrl(ClickUrlDto.accountId, SQLProvider))
            {
                responsedetails = await objBL.GetResponseData(ClickUrlDto.WhatsAppSendingSettingId, ClickUrlDto.OffSet, ClickUrlDto.FetchNext);
            }
            return Json(responsedetails);
        }

    }
}
