using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Chat.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Data;

namespace Plumb5.Areas.Chat.Controllers
{
    [Area("Chat")]
    public class AllChatController : BaseController
    {
        public AllChatController(IConfiguration _configuration) : base(_configuration)
        { }

        public IActionResult Index()
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            ViewBag.AdsId = account.AdsId;

            return View("AllChat");
        }

        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] ChatDetails chatDetails)
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            using (var objDLChat = DLChat.GetDLChat(account.AdsId, SQLProvider))
            {
                return Json(await objDLChat.GetMaxCount(chatDetails));
            }
        }

        [HttpPost]
        public async Task<IActionResult> Get([FromBody] AllChat_GetDto commonDetails)
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            List<ChatDetails> chatList = null;

            ArrayList data = new ArrayList() { commonDetails.chatDetails };
            HttpContext.Session.SetString("ChatDetails", JsonConvert.SerializeObject(data));

            using (var objDLChat = DLChat.GetDLChat(account.AdsId, SQLProvider))
            {
                chatList = await objDLChat.GET(commonDetails.chatDetails, commonDetails.OffSet, commonDetails.FetchNext);
            }

            return Json(chatList);
        }

        [HttpPost]
        public async Task<JsonResult> GetDetails([FromBody] ChatDetails chat)
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            ChatDetails chatDetails = null;

            using (var objDLChat = DLChat.GetDLChat(account.AdsId, SQLProvider))
            {
                chatDetails = await objDLChat.GET(chat);
            }

            return Json(chatDetails);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Delete([FromBody] AllChat_DeleteDto commonDetails)
        {
            bool result = false;
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            using (var objDL = DLChat.GetDLChat(account.AdsId, SQLProvider))
            {
                result = await objDL.Delete(commonDetails.chatId);
            }

            return Json(result);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ToogleStatus([FromBody] AllChat_ToogleStatusDto chatDetails)
        {
            bool result = false;
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            using (var objDL = DLChat.GetDLChat(account.AdsId, SQLProvider))
            {
                result = await objDL.ToogleStatus(chatDetails.chatId,chatDetails.ChatStatus);
            }


            return Json(result);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ChangePriority([FromBody] AllChat_ChangePriorityDto commonDetails)
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            if (commonDetails.chatdetails != null && commonDetails.chatdetails.Count > 0)
            {
                for (int i = 0; i < commonDetails.chatdetails.Count; i++)
                {
                    using (var objDL = DLChat.GetDLChat(account.AdsId, SQLProvider))
                    {
                        bool result = false;
                        result = await objDL.ChangePriority(commonDetails.chatdetails[i].Id, commonDetails.chatdetails[i].ChatPriority);
                    }
                }
            }
            return Json(true);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ChatDetailsExport([FromBody] AllChat_ChatDetailsExportDto commonDetails)
        {
            DataSet dataSet = new DataSet();
            List<ChatDetails> chatDetailsList = new List<ChatDetails>();
            ChatDetails chatDetails = new ChatDetails();

            if (HttpContext.Session.GetString("ChatDetails") != null)
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("ChatDetails"));
                chatDetails = JsonConvert.DeserializeObject<ChatDetails>(Convert.ToString(data[0]));
            }
            using (var objDL = DLChat.GetDLChat(commonDetails.AccountId, SQLProvider))
            {
                chatDetailsList = await objDL.GET(chatDetails, commonDetails.OffSet, commonDetails.FetchNext);
            }

            var NewListData = chatDetailsList.Select(x => new
            {
                Name = x.Name,
                Header = x.Header,
                ChatStatus = x.ChatStatus,
                UpdatedDate = x.ChatCreatedDate
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTableExport();
            dataSet.Tables.Add(dtt);

            string FileName = "ChatDetailsExport_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }
    }
}
