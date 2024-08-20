using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Sms.Dto;
using Plumb5.Areas.Sms.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;

namespace Plumb5.Areas.Sms.Controllers
{
    [Area("Sms")]
    public class SmsTemplateArchiveController : BaseController
    {
        public SmsTemplateArchiveController(IConfiguration _configuration) : base(_configuration)
        { }
        public async Task<ActionResult> Index()
        {
            return View("SmsTemplateArchive");
        }
        [HttpPost]
        public async Task<ActionResult> GetArchiveMaxCount([FromBody] SmsTemplateArchive_GetArchiveMaxCountDto objDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            objDto.smsTemplate.UserInfoUserId = user.UserId;
            int returnVal;
            using (var objDL = DLSmsTemplate.GetDLSmsTemplate(domainDetails.AdsId,SQLProvider))
            {
                returnVal =await objDL.GetArchiveMaxCount(objDto.smsTemplate);
            }
            return Json(new
            {
                returnVal
            });
        }
        [HttpPost]
        public async Task<ActionResult> GetArchiveTemplateList([FromBody] SmsTemplateArchive_GetArchiveTemplateListDto objDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            objDto.smsTemplate.UserInfoUserId = user.UserId;

            ArrayList data = new ArrayList() { objDto.smsTemplate };
            HttpContext.Session.SetString("SmsTemplate", JsonConvert.SerializeObject(data));

            SmsTemplateDetails smsTemplateDetails = new SmsTemplateDetails(domainDetails.AdsId);
            var Value =await smsTemplateDetails.GetSmsTemplateArchiveDetails(objDto.smsTemplate, objDto.OffSet, objDto.FetchNext,SQLProvider);

            var getdata = JsonConvert.SerializeObject(Value, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }

        [HttpPost]
        public async Task<JsonResult> Export([FromBody] SmsTemplateArchive_ExportDto objDto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");

                SmsTemplate smsTemplate = new SmsTemplate();

                if (HttpContext.Session.GetString("SmsTemplate") != null) 
                {
                    ArrayList data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("SmsTemplate"));
                    smsTemplate = JsonConvert.DeserializeObject<SmsTemplate>(data[0].ToString());
                }

                SmsTemplateDetails TemplateDetails = new SmsTemplateDetails(objDto.AccountId);
                var Details =await TemplateDetails.GetSmsTemplateArchiveDetails(smsTemplate, objDto.OffSet, objDto.FetchNext,SQLProvider);
                string TimeZone =await Helper.GetAccountTimeZoneFromCachedMemory(objDto.AccountId,SQLProvider);
                var NewListData = Details.Select(x => new
                {
                    x.TemplateName,
                    x.TemplateDescription,
                    x.CampaignName,
                    ContentType = x.IsPromotionalOrTransactionalType ? "Transactional" : "Promotional",
                    x.MessageContent,
                    CreatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.CreatedDate)).ToString()
                });

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTable();
                dataSet.Tables.Add(dtt);

                string FileName = "SMSTemplate" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + objDto.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (objDto.FileType.ToLower() == "csv")
                    Helper.SaveDataSetToCSV(dataSet, MainPath);
                else
                    Helper.SaveDataSetToExcel(dataSet, MainPath);

                MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

                return Json(new { Status = true, MainPath });
            }
            else
            {
                return Json(new { Status = false });
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> RestoreSmsTemplate([FromBody] SmsTemplateArchive_RestoreSmsTemplateDto objDto)
        {
            using (var objDL = DLSmsTemplate.GetDLSmsTemplate(objDto.AdsId, SQLProvider))
                return Json(await objDL.RestoreTemplate(objDto.Id));
        }
    }
}
