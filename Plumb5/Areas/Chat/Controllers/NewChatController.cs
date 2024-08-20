using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralML;
using Plumb5.Areas.Chat.Dto;
using Plumb5.Areas.Chat.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;

namespace Plumb5.Areas.Chat.Controllers
{
    [Area("Chat")]
    public class NewChatController : BaseController
    {
        public NewChatController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            ViewBag.DomainName = domainDetails.DomainName;

            return View("NewChat");
        }

       
        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveChatDetails([FromBody] NewChat_SaveChatDetailsDto objDto)
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(account.AdsId, user.UserId, user.UserName, user.EmailId, "NewChat", "Chat", "SaveChatDetails", Helper.GetIP(), JsonConvert.SerializeObject(new { chat = chat, rulesData = rulesData }));
            //#endregion

            GenralChatDetails saveForm = new GenralChatDetails(account.AdsId, user.UserId, SQLProvider);

            if (user != null)
            {
                saveForm.SaveAllDetailsOfForm(objDto.chat, objDto.rulesData, objDto.webHookData, objDto.DeletedWebhookId);
                //LogMessage = "ChatDetails has been saved successfully";
            }
            else
            {
                saveForm.Status = false;
                //LogMessage = saveForm.ErrorMessage = "Session Expired";
            }
            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { saveForm = saveForm }), LogMessage);
            return Json(saveForm);
        }
        [HttpPost]
        public async Task<JsonResult> GetChatDetails([FromBody] NewChat_GetChatDetailsDto objDto)
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            GenralChatDetails saveForm = new GenralChatDetails(account.AdsId, user.UserId, SQLProvider);

            if (user != null)
            {
                await saveForm.GetChatDetailsRules(objDto.ChatId);
            }
            else
            {
                saveForm.Status = false;
                saveForm.ErrorMessage = "Session Expired";
            }

            return Json(saveForm);
        }

    }
}
