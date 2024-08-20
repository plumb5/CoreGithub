using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Dto;

namespace Plumb5.Controllers
{
    public class FormChatWebHookController : BaseController
    {
        public FormChatWebHookController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View();
        }

        public async Task<ActionResult> MaxCount([FromBody] FormChatWebHook_MaxCountDto objDto)
        {
            int returnVal;
            using (var objBL = DLFormChatWebHookResponse.GetDLFormChatWebHookResponse(objDto.AdsId, SQLProvider))
            {
                returnVal =await objBL.MaxCount(objDto.formOrChatId, objDto.callingSource, objDto.webhookids);
            }

            return Json(new
            {
                returnVal
            });
        }

        public async Task<JsonResult> GetDetails([FromBody] FormChatWebHook_GetDetailsDto objDto)
        {
            List<WebHookTracker> webHookTracker = new List<WebHookTracker>();
            using (var obBL = DLFormChatWebHookResponse.GetDLFormChatWebHookResponse(objDto.AdsId,SQLProvider))
            {
                webHookTracker =await obBL.GetDetails(objDto.formOrChatId, objDto.callingSource, objDto.OffSet, objDto.FetchNext, objDto.webhookids);
                return Json(webHookTracker);
            }
        }
    }
}
