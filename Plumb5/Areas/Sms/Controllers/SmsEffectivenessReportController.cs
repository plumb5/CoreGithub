using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Sms.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.Sms.Controllers
{
    [Area("Sms")]
    public class SmsEffectivenessReportController : BaseController
    {
        public SmsEffectivenessReportController(IConfiguration _configuration) : base(_configuration)
        { }
        public async Task<ActionResult> MaxCount([FromBody] SmsEffectivenessReport_MaxCountDto SmsEffectivenessReportDto)
        {
            int returnVal;
            ArrayList data = new ArrayList() { SmsEffectivenessReportDto.smsCampaignEffectivenessReport };
            HttpContext.Session.SetString("SMSCampaignEffectivenessReport", JsonConvert.SerializeObject(data)); 
            using (var objDL =   DLSmsCampignEffectivenessReport.GetDLSmsCampignEffectivenessReport(SmsEffectivenessReportDto.accountId, SQLProvider))
            {
                returnVal = await objDL.MaxCount(SmsEffectivenessReportDto.smsCampaignEffectivenessReport);
            }
            return Json(new
            {
                returnVal
            });
        }

        public async Task<ActionResult> GetReportDetails([FromBody] SmsEffectivenessReport_GetReportDetailsDto SmsEffectivenessReportDto)
        {
            List<MLSmsCampaignEffectivenessReport> reportDetails = null;

            using (var objDL = DLSmsCampignEffectivenessReport.GetDLSmsCampignEffectivenessReport(SmsEffectivenessReportDto.accountId, SQLProvider))
            {
                reportDetails = await objDL.GetReportDetails(SmsEffectivenessReportDto.smsCampaignEffectivenessReport, SmsEffectivenessReportDto.OffSet, SmsEffectivenessReportDto.FetchNext);
                if (reportDetails != null && reportDetails.Count > 0)
                {
                    for (int i = 0; i < reportDetails.Count; i++)
                        reportDetails[i].PhoneNumber = !String.IsNullOrEmpty(reportDetails[i].PhoneNumber) ? Helper.MaskPhoneNumber(reportDetails[i].PhoneNumber) : reportDetails[i].PhoneNumber;
                }
            }
            return Json(reportDetails );
        }
    }
}

