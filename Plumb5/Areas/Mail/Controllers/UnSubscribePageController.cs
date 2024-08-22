using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Mail.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;

namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class UnSubscribePageController : BaseController
    {
        public UnSubscribePageController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("UnSubscribePage");
        }
        [HttpPost]
        public async Task<JsonResult> GetHtmlContent()
        {
            string content1, content2, content3, fileName1, fileName2, fileName3 = "";
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo")); 
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAILTRACKPATH"] + "\\TempFiles\\UnSubscribeTemplate-" + domainDetails.AdsId + "\\";

            if (Directory.Exists(MainPath))
            {
                fileName1 = MainPath + "UpperTemplateContent.html";
                fileName2 = MainPath + "MiddleTemplate.html";
                fileName3 = MainPath + "LowerTemplate.html";

                content1 = await GetContentByFileName(fileName1);
                content2 = await GetContentByFileName(fileName2);
                content3 = await GetContentByFileName(fileName3);

                return Json(new { content1 = content1, content2 = content2, content3 = content3, Status = true } );
            }
            else
            {
                fileName1 = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\Template\\UnSubscribeTemplate1.html";
                fileName2 = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\Template\\UnSubscribeTemplateGroups.html";
                fileName3 = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\Template\\UnsubscribeTemplate3.html";

                content1 = await GetContentByFileName(fileName1);
                content2 = await GetContentByFileName(fileName2);
                content3 = await GetContentByFileName(fileName3);

                return Json(new { content1 = content1, content2 = content2, content3 = content3, Status = false } );
            }
        }
        [HttpPost]
        public async Task<string> GetContentByFileName(string fileName)
        {
            if (System.IO.File.Exists(fileName))
            {
                using (StreamReader rd = System.IO.File.OpenText(fileName))
                {
                    string content = rd.ReadToEnd();
                    rd.Close();

                    return content;
                }
            }
            return null;
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveorUpdateTemplate([FromBody] UnSubscribePage_SaveorUpdateTemplateDto UnSubscribePageDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs            
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "UnSubscribePage", "Mail", "SaveorUpdateTemplate", Helper.GetIP(), JsonConvert.SerializeObject(new { FinalTemplate = FinalTemplate, UpperTemplateContent = UpperTemplateContent, MiddleTemplate = MiddleTemplate, LowerTemplate = LowerTemplate }));
            //#endregion
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAILTRACKPATH"] + "\\TempFiles\\UnSubscribeTemplate-" + domainDetails.AdsId + "\\";

            StreamWriter sw;

            if (!Directory.Exists(MainPath))
            {
                DirectoryInfo dirTemp = new DirectoryInfo(MainPath);
                dirTemp.Create();
            }

            using (sw = new StreamWriter(MainPath + "UnSubscribeFinalTemplate.html"))
            {
                sw.Write(UnSubscribePageDto.FinalTemplate);
                sw.Close();
            }

            if (!string.IsNullOrEmpty(UnSubscribePageDto.UpperTemplateContent))
            {
                using (sw = new StreamWriter(MainPath + "UpperTemplateContent.html"))
                {
                    sw.Write(UnSubscribePageDto.UpperTemplateContent);
                    sw.Close();
                }
            }

            if (!string.IsNullOrEmpty(UnSubscribePageDto.MiddleTemplate))
            {
                using (sw = new StreamWriter(MainPath + "MiddleTemplate.html"))
                {
                    sw.Write(UnSubscribePageDto.MiddleTemplate);
                    sw.Close();
                }
            }

            if (!string.IsNullOrEmpty(UnSubscribePageDto.LowerTemplate))
            {
                using (sw = new StreamWriter(MainPath + "LowerTemplate.html"))
                {
                    sw.Write(UnSubscribePageDto.LowerTemplate);
                    sw.Close();
                }
            }
            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = true }),"The Unsubcribe Page has been update");
            return Json(true );
        }
        [HttpPost]
        public async Task<JsonResult> GetGroupList([FromBody] UnSubscribePage_GetGroupListDto UnSubscribePageDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            List<Groups> groupdatails = null;

            using (var objDL =   DLMailUnSubscribeLink.GetDLMailUnSubscribeLink(domainDetails.AdsId,SQLProvider))
            {
                groupdatails = (await objDL.GetGroupList(UnSubscribePageDto.ContactId)).ToList();
            }
            return Json(groupdatails );
        }
        [HttpPost]
        public async Task<JsonResult> GetUnSubscribeUrl()
        {
            return Json(AllConfigURLDetails.KeyValueForConfig["MAILTRACK"]);
        }
    }
}
