using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Preference.Dto;
using Plumb5.Controllers;

namespace Plumb5.Areas.Preference.Controllers
{
    [Area("Preference")]
    public class WhatsAppNotificationController : BaseController
    {
        public WhatsAppNotificationController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("WhatsAppNotification");
        }
        [HttpPost]
        public async Task<ActionResult> GetMaxCount([FromBody] WhatsAppNotification_GetMaxCountDto objDto)
        {
            int returnVal = 0;
            using (var objBL = DLWhatsAppNotificationTemplate.GetDLWhatsAppNotificationTemplate(objDto.AdsId, SQLProvider))
            {
                returnVal = await objBL.GetMaxCount();
            }
            return Json(new { returnVal });
        }
        [HttpPost]
        public async Task<ActionResult> GetTemplateList([FromBody] WhatsAppNotification_GetTemplateListDto objDto)
        {
            List<WhatsAppNotificationTemplate> mailTemplateList = null;

            using (var objBL = DLWhatsAppNotificationTemplate.GetDLWhatsAppNotificationTemplate(objDto.AdsId,SQLProvider))
            {
                mailTemplateList = await objBL.Get(objDto.OffSet, objDto.FetchNext);
            }
           
            return Json(new
            {
                Data = mailTemplateList,
                MaxJsonLength = Int32.MaxValue
            });
        }
        [HttpPost]
        public async Task<ActionResult> GetById([FromBody] WhatsAppNotification_GetByIdDto objDto)
        {
            WhatsAppNotificationTemplate mailTemplateList = null;

            using (var objBL = DLWhatsAppNotificationTemplate.GetDLWhatsAppNotificationTemplate(objDto.AdsId,SQLProvider))
            {
                mailTemplateList =await objBL.GetById(objDto.Id);
            }
            return Json(new
            {
                Data = mailTemplateList,
                MaxJsonLength = Int32.MaxValue
            });
            
        }
        [HttpPost]
        public async Task<JsonResult> Update([FromBody] WhatsAppNotification_UpdateDto objDto)
        {
            using (var objBL = DLWhatsAppNotificationTemplate.GetDLWhatsAppNotificationTemplate(objDto.AdsId, SQLProvider))
            {
                return Json(await objBL.Update(objDto.notificationTemplate));
            }
        }
        [HttpPost]
        public async Task<JsonResult> UpdateStatus([FromBody] WhatsAppNotification_UpdateStatusDto objDto)
        {
            using (var objBL = DLWhatsAppNotificationTemplate.GetDLWhatsAppNotificationTemplate(objDto.AdsId,SQLProvider))
            {
                return Json(await objBL.UpdateStatus(objDto.IsWhatsAppNotificationEnabled));
            }
        }
    }
}
