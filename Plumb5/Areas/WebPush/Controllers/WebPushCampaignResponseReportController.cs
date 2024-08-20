using Microsoft.AspNetCore.Mvc;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;
using P5GenralDL;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using Plumb5.Areas.WebPush.Dto;

namespace Plumb5.Areas.WebPush.Controllers
{
    [Area("WebPush")]
    public class WebPushCampaignResponseReportController : BaseController
    {
        public WebPushCampaignResponseReportController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View();
        }

        public async Task<ActionResult> MaxCount([FromBody] WebPushCampaignResponseReport_MaxCountDto objDto)
        {
            DateTime? FromDateTime = null, ToDateTime = null;
            if (!string.IsNullOrEmpty(objDto.fromDateTime) && !string.IsNullOrEmpty(objDto.toDateTime))
            {
                FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            }
            int returnVal;
            using (var objDL = DLWebPushCampaignResponseReport.GetDLWebPushCampaignResponseReport(objDto.accountId,SQLProvider))
            {
                returnVal =await objDL.MaxCount(objDto.webpushReport, FromDateTime, ToDateTime);
            }
            return Json(new
            {
                returnVal
            });
        }

        public async Task<ActionResult> GetReportDetails([FromBody] WebPushCampaignResponseReport_GetReportDetailsDto objDto)
        {
            List<MLWebPushCampaignResponseReport> reportDetails = null;
            DateTime? FromDateTime = null, ToDateTime = null;
            if (!string.IsNullOrEmpty(objDto.fromDateTime) && !string.IsNullOrEmpty(objDto.toDateTime))
            {
                FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            }
            using (var objDL = DLWebPushCampaignResponseReport.GetDLWebPushCampaignResponseReport(objDto.accountId,SQLProvider))
            {
                reportDetails =await objDL.GetReportDetails(objDto.webpushReport, objDto.OffSet, objDto.FetchNext, FromDateTime, ToDateTime);
            }
            ArrayList data = new ArrayList() { objDto.webpushReport };
            HttpContext.Session.SetString("WebPushCampaignResponses", JsonConvert.SerializeObject(data));
            return Json(reportDetails);
        }
        public async Task<JsonResult> Export([FromBody] WebPushCampaignResponseReport_ExportDto objDto)
        {
            if (HttpContext.Session.GetString("AccountInfo") != null)
            {
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");

                List<MLWebPushCampaignResponseReport> reportDetails = null;
                MLWebPushCampaignResponseReport webpushReport = new MLWebPushCampaignResponseReport();
                if (HttpContext.Session.GetString("WebPushCampaignResponses") != null && HttpContext.Session.GetString("webpushTemplate") != "null")
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("WebPushCampaignResponses"));
                    webpushReport = JsonConvert.DeserializeObject<MLWebPushCampaignResponseReport>(data[0].ToString());
                }
                DateTime? FromDateTime = null, ToDateTime = null;
                if (!string.IsNullOrEmpty(objDto.fromDateTime) && !string.IsNullOrEmpty(objDto.toDateTime))
                {
                    FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                }
                using (var objDL = DLWebPushCampaignResponseReport.GetDLWebPushCampaignResponseReport(objDto.AccountId,SQLProvider))
                {
                    reportDetails =await objDL.GetReportDetails(webpushReport, objDto.OffSet, objDto.FetchNext, FromDateTime, ToDateTime);
                }
                System.Data.DataTable dtt = new System.Data.DataTable();

                string TimeZone =await Helper.GetAccountTimeZoneFromCachedMemory(domainDetails.AdsId,SQLProvider);
                var NewListData = reportDetails.Select(x => new
                {
                    MachineId = x.MachineId,
                    UniqueId = x.P5UniqueId,
                    Date = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.Date)).ToString(),
                });

                dtt = NewListData.CopyToDataTable();
                dataSet.Tables.Add(dtt);
                string FileName = DateTime.Now.ToString("CampaignResponse_ddMMyyyyHHmmssfff") + "." + objDto.FileType;
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
    }
}
