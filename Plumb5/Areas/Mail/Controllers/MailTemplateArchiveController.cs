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
    public class MailTemplateArchiveController : BaseController
    {
        public MailTemplateArchiveController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /Mail/MailTemplateArchive/

        public IActionResult Index()
        {
            return View("MailTemplateArchive");
        }

        [HttpPost]
        public async Task<IActionResult> GetArchiveMaxCount([FromBody] MailTemplateArchive_GetArchiveMaxCountDto commonDetails)
        {
            int returnVal = 0;
            using (var objDL = DLMailTemplate.GetDLMailTemplate(commonDetails.AdsId, SQLProvider))
            {
                returnVal = await objDL.GetArchiveMaxCount(commonDetails.mailTemplate);
            }

            return Json(new { returnVal });
        }

        [HttpPost]
        public async Task<IActionResult> GetArchiveTemplateList([FromBody] MailTemplateArchive_GetArchiveTemplateListDto commonDetails)
        {
            HttpContext.Session.SetString("MailTemplateArchive", JsonConvert.SerializeObject(commonDetails.mailTemplate));

            List<MLMailTemplate> mailTemplateList;

            using (var objDL = DLMailTemplate.GetDLMailTemplate(commonDetails.AdsId, SQLProvider))
            {
                mailTemplateList = await objDL.GetArchiveList(commonDetails.mailTemplate, commonDetails.OffSet, commonDetails.FetchNext);
            }

            return Json(mailTemplateList);

        }

        [Log]
        [HttpPost]
        public async Task<IActionResult> Export([FromBody] MailTemplateArchive_Export commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                System.Data.DataSet dataSet = new System.Data.DataSet("General");

                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                MailTemplate? mailTemplate = null;
                List<MLMailTemplate> mailTemplateList;

                if (HttpContext.Session.GetString("MailTemplateArchive") != null)
                {
                    mailTemplate = JsonConvert.DeserializeObject<MailTemplate>(HttpContext.Session.GetString("MailTemplateArchive"));
                }

                using (var objDL = DLMailTemplate.GetDLMailTemplate(commonDetails.AccountId, SQLProvider))
                {
                    mailTemplateList = await objDL.GetArchiveList(mailTemplate, commonDetails.OffSet, commonDetails.FetchNext);
                }
                string? TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(domainDetails.AdsId, SQLProvider);
                var NewListData = mailTemplateList.Select(x => new
                {
                    TemplateName = x.Name,
                    x.CampaignName,
                    UpdatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.UpdatedDate)).ToString(),
                    x.SpamScore
                });

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTableExport();
                dataSet.Tables.Add(dtt);

                string FileName = "MailTemplateArchive_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (commonDetails.FileType.ToLower() == "csv")
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
        public async Task<JsonResult> RestoreMailTemplate([FromBody] MailTemplateArchive_RestoreMailTemplate commonDetails)
        {
            using (var objDL = DLMailTemplate.GetDLMailTemplate(commonDetails.AdsId, SQLProvider))
            {
                return Json(await objDL.RestoreTemplate(commonDetails.Id));
            }
        }
    }
}
