using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using P5GenralDL;
using Plumb5.Areas.Mail.Dto;

namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class MailEffectivenessReportController : BaseController
    {
        public MailEffectivenessReportController(IConfiguration _configuration) : base(_configuration)
        { }

        public IActionResult Index()
        {
            return View("MailEffectivenessReport");
        }

        [HttpPost]
        public async Task<ActionResult> MaxCount([FromBody] MailEffectivenessReportDto_MaxCount commonDetails)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            int returnVal;
            using (var objDL = DLMailCampignEffectivenessReport.GetDLMailCampignEffectivenessReport(domainDetails.AdsId, SQLProvider))
            {
                returnVal = await objDL.MaxCount(commonDetails.mailCampaignEffectivenessReport);
            }
            return Json(new
            {
                returnVal
            });
        }

        [HttpPost]
        public async Task<ActionResult> GetReportDetails([FromBody] MailEffectivenessReportDto_GetReportDetails commonDetails)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            List<MLMailCampaignEffectivenessReport> reportDetails = null;

            HttpContext.Session.SetString("MailEffectivenessReport", JsonConvert.SerializeObject(commonDetails.mailCampaignEffectivenessReport));

            using (var objDL = DLMailCampignEffectivenessReport.GetDLMailCampignEffectivenessReport(domainDetails.AdsId, SQLProvider))
            {
                reportDetails = await objDL.GetReportDetails(commonDetails.mailCampaignEffectivenessReport, commonDetails.OffSet, commonDetails.FetchNext);
                if (reportDetails != null && reportDetails.Count > 0)
                {
                    for (int i = 0; i < reportDetails.Count; i++)
                        reportDetails[i].EmailId = !String.IsNullOrEmpty(reportDetails[i].EmailId) ? Helper.MaskEmailAddress(reportDetails[i].EmailId) : reportDetails[i].EmailId;
                }
            }
            return Json(reportDetails);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Export([FromBody] MailEffectivenessReportDto_Export commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");

                List<MLMailCampaignEffectivenessReport> reportDetails = null;
                MLMailCampaignEffectivenessReport? mailCampaignEffectivenessReport = new MLMailCampaignEffectivenessReport();

                if (HttpContext.Session.GetString("MailEffectivenessReport") != null)
                {
                    mailCampaignEffectivenessReport = JsonConvert.DeserializeObject<MLMailCampaignEffectivenessReport>(HttpContext.Session.GetString("MailEffectivenessReport"));
                }

                using (var objDL = DLMailCampignEffectivenessReport.GetDLMailCampignEffectivenessReport(domainDetails.AdsId, SQLProvider))
                {
                    reportDetails = await objDL.GetReportDetails(mailCampaignEffectivenessReport, commonDetails.OffSet, commonDetails.FetchNext);
                }

                var NewListData = reportDetails.Select(x => new { x.EmailId });

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTable();
                dataSet.Tables.Add(dtt);

                string FileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

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
