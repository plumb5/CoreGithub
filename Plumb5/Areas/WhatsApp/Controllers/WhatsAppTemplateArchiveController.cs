using Microsoft.AspNetCore.Mvc; 
using P5GenralDL;
using P5GenralML; 
using Plumb5.Controllers;
using Plumb5GenralFunction; 
using Newtonsoft.Json;
using Plumb5.Areas.WhatsApp.Dto;
namespace Plumb5.Areas.WhatsApp.Controllers
{
    [Area("WhatsApp")]
    public class WhatsAppTemplateArchiveController : BaseController
    {
        public WhatsAppTemplateArchiveController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /WhatsApp/WhatsAppTemplateArchive/

        public IActionResult Index()
        {
            return View("WhatsAppTemplateArchive");
        }
        public async Task<JsonResult> GetCampaignList([FromBody] WhatsAppTemplateArchive_GetCampaignListDto WhatsAppTemplateArchiveDto)
        {
            using (var objDLform =   DLCampaignIdentifier.GetDLCampaignIdentifier(WhatsAppTemplateArchiveDto.accountId, SQLProvider))
            {
                return Json(await objDLform.GetList(new CampaignIdentifier(), 0, 0) );
            }
        }
        public async Task<JsonResult> GetArchiveMaxCount([FromBody] WhatsAppTemplateArchive_GetArchiveMaxCountDto WhatsAppTemplateArchiveDto)
        {
            int returnVal = 0;
            using (var objDL =   DLWhatsAppTemplates.GetDLWhatsAppTemplates(WhatsAppTemplateArchiveDto.AccountId, SQLProvider))
            {
                returnVal = await objDL.GetArchiveMaxCount(WhatsAppTemplateArchiveDto.whatsAppTemplate);
            }
            return Json(new { returnVal });
        }
        public async Task<JsonResult> GetArchiveReport([FromBody] WhatsAppTemplateArchive_GetArchiveReportDto WhatsAppTemplateArchiveDto)
        {
            HttpContext.Session.SetString("WhatsAppTemplate", JsonConvert.SerializeObject(WhatsAppTemplateArchiveDto.whatsAppTemplate)); 
            List<MLWhatsAppTemplates> mLWhatsAppTemplates = new List<MLWhatsAppTemplates>();

            using (var objDL = DLWhatsAppTemplates.GetDLWhatsAppTemplates(WhatsAppTemplateArchiveDto.AccountId, SQLProvider))
            {
                mLWhatsAppTemplates = await objDL.GetArchiveReport(WhatsAppTemplateArchiveDto.whatsAppTemplate, WhatsAppTemplateArchiveDto.OffSet, WhatsAppTemplateArchiveDto.FetchNext);
            }
            return Json(new
            {
                Data = mLWhatsAppTemplates,
                MaxJsonLength = Int32.MaxValue 
            });
             
        }
        public async Task<JsonResult> UnArchive([FromBody] WhatsAppTemplateArchive_UnArchiveDto WhatsAppTemplateArchiveDto)
        {
            WhatsAppTemplateUrl whatsapptemplaterUrl = new WhatsAppTemplateUrl();
            whatsapptemplaterUrl.WhatsAppTemplatesId = WhatsAppTemplateArchiveDto.Id;
            bool result = false;
             
            using (var objDL = DLWhatsAppTemplates.GetDLWhatsAppTemplates(WhatsAppTemplateArchiveDto.AdsId, SQLProvider))
            {
                result =await objDL.UnArchive(WhatsAppTemplateArchiveDto.Id);
                return Json(result );
            }
        }
        public async Task<ActionResult> ArchiveReportExport([FromBody] WhatsAppTemplateArchive_ArchiveReportExportDto WhatsAppTemplateArchiveDto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null  )
            {
                System.Data.DataSet dataSet = new System.Data.DataSet("General");
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                
                WhatsAppTemplates whatsAppTemplate = null;
                List<MLWhatsAppTemplates> mLWhatsAppTemplates;

                if (HttpContext.Session.GetString("WhatsAppTemplate") != null )
                {
                    whatsAppTemplate = JsonConvert.DeserializeObject<WhatsAppTemplates>(HttpContext.Session.GetString("WhatsAppTemplate"));


                }

                using (var objDL = DLWhatsAppTemplates.GetDLWhatsAppTemplates(WhatsAppTemplateArchiveDto.AccountId, SQLProvider))
                {
                    mLWhatsAppTemplates =await objDL.GetArchiveReport(whatsAppTemplate, WhatsAppTemplateArchiveDto.OffSet, WhatsAppTemplateArchiveDto.FetchNext);
                }

                string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(domainDetails.AdsId,SQLProvider);
                var NewListData = mLWhatsAppTemplates.Select(x => new
                {
                    TemplateName = x.Name,
                    x.CampaignName,
                    x.TemplateType,
                    UpdatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.UpdatedDate)).ToString()
                });

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTableExport();
                dataSet.Tables.Add(dtt);

                string FileName = "WhatsAppArchiveTemplates_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + WhatsAppTemplateArchiveDto.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (WhatsAppTemplateArchiveDto.FileType.ToLower() == "csv")
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


    }
}
