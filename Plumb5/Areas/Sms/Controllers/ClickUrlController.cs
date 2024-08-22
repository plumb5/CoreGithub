using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Sms.Dto;
using Plumb5.Controllers;
using System.Collections;

namespace Plumb5.Areas.Sms.Controllers
{
    [Area("Sms")]
    public class ClickUrlController : BaseController
    {
        public ClickUrlController(IConfiguration _configuration) : base(_configuration)
        { }

        [HttpPost]
        public async Task<JsonResult> MaxCount([FromBody] ClickUrl_MaxCountDto objDto)
        {
            int returnVal;
            using (var objDL = DLSmsClickUrl.GetDLSmsClickUrl(objDto.accountId, SQLProvider))
            {
                returnVal =await objDL.MaxCount(objDto.smsSendingSettingId);
            }
            return Json(new
            {
                returnVal
            });
        }
        [HttpPost]
        public async Task<JsonResult> GetResponseData([FromBody] ClickUrl_GetResponseDataDto objDto)
        {
            List<MLSmsClickUrl> responsedetails = null;

            ArrayList data = new ArrayList() { objDto.smsSendingSettingId };
            HttpContext.Session.SetString("SmsClickUrlDetails", JsonConvert.SerializeObject(data));
            using (var objDL = DLSmsClickUrl.GetDLSmsClickUrl(objDto.accountId,SQLProvider))
            {
                responsedetails =await objDL.GetResponseData(objDto.smsSendingSettingId, objDto.OffSet, objDto.FetchNext);
            }
            return Json(responsedetails);
        }
    }
}
