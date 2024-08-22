using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.WhatsApp.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.WhatsApp.Controllers
{
    [Area("WhatsApp")]
    public class WhatsAppReportController : BaseController
    {
        public WhatsAppReportController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("WhatsAppReportDetails");
        }
        [HttpPost]
        public async Task<ActionResult> MaxCount([FromBody] WhatsAppReport_MaxCountDto objDto)
        {
            DateTime? FromDateTime = null, ToDateTime = null;
            if (!string.IsNullOrEmpty(objDto.fromDateTime) && !string.IsNullOrEmpty(objDto.toDateTime))
            {
                FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            }
            using (var objBL = DLWhatsAppReportDetails.GetDLWhatsAppReportDetails(objDto.accountId,SQLProvider))
            {
                return Json(await objBL.MaxCount(objDto.sentContactDetails, FromDateTime, ToDateTime));
            }
        }
        [HttpPost]
        public async Task<ActionResult> GetReportDetails([FromBody] WhatsAppReport_GetReportDetailsDto objDto)
        {
            List<MLWhatsAppReportDetails> reportDetails = null;
            DateTime? FromDateTime = null, ToDateTime = null;
            if (!string.IsNullOrEmpty(objDto.fromDateTime) && !string.IsNullOrEmpty(objDto.toDateTime))
            {
                FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            }
            ArrayList data = new ArrayList() { objDto.sentContactDetails };
            HttpContext.Session.SetString("WhatsAppReportDetailsexport", JsonConvert.SerializeObject(data));

            using (var objBL = DLWhatsAppReportDetails.GetDLWhatsAppReportDetails(objDto.accountId,SQLProvider))
            {
                reportDetails =await objBL.GetReportDetails(objDto.sentContactDetails, FromDateTime, ToDateTime, objDto.OffSet, objDto.FetchNext);
                if (reportDetails != null && reportDetails.Count > 0)
                {
                    for (int i = 0; i < reportDetails.Count; i++)
                    {
                        reportDetails[i].PhoneNumber = !String.IsNullOrEmpty(reportDetails[i].PhoneNumber) ? Helper.MaskPhoneNumber(reportDetails[i].PhoneNumber) : reportDetails[i].PhoneNumber;
                    }
                }
            }
            return Json(reportDetails);
        }
        [HttpPost]
        public async Task<ActionResult> GetMaxClickCount([FromBody] WhatsAppReport_GetMaxClickCountDto objDto)
        {
            ArrayList data = new ArrayList() { objDto.sentContactDetails };
            HttpContext.Session.SetString("WhatsAppclickReportDetailsExport", JsonConvert.SerializeObject(data));
            DateTime? FromDateTime = null, ToDateTime = null;
            if (!string.IsNullOrEmpty(objDto.fromDateTime) && !string.IsNullOrEmpty(objDto.toDateTime))
            {
                FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            }
            using (var objBL = DLWhatsAppReportDetails.GetDLWhatsAppReportDetails(objDto.accountId,SQLProvider))
            {
                return Json(await objBL.GetMaxClickCount(objDto.sentContactDetails, FromDateTime, ToDateTime));
            }
        }
        [HttpPost]
        public async Task<ActionResult> GetClickReportDetails([FromBody] WhatsAppReport_GetClickReportDetailsDto objDto)
        {
            List<MLWhatsAppReportDetails> reportDetails = null;
            DateTime? FromDateTime = null, ToDateTime = null;
            if (!string.IsNullOrEmpty(objDto.fromDateTime) && !string.IsNullOrEmpty(objDto.toDateTime))
            {
                FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            }

            ArrayList data = new ArrayList() { objDto.sentContactDetails };
            HttpContext.Session.SetString("WhatsAppclickReportDetails", JsonConvert.SerializeObject(data));
            using (var objBL = DLWhatsAppReportDetails.GetDLWhatsAppReportDetails(objDto.accountId,SQLProvider))
            {
                reportDetails = (await objBL.GetClickReportDetails(objDto.sentContactDetails, objDto.OffSet, objDto.FetchNext, FromDateTime, ToDateTime));
                if (reportDetails != null && reportDetails.Count > 0)
                {
                    for (int i = 0; i < reportDetails.Count; i++)
                    {
                        reportDetails[i].PhoneNumber = !String.IsNullOrEmpty(reportDetails[i].PhoneNumber) ? Helper.MaskPhoneNumber(reportDetails[i].PhoneNumber) : reportDetails[i].PhoneNumber;
                    }
                }
            }
            return Json(reportDetails);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Export([FromBody] WhatsAppReport_ExportDto objDto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                System.Data.DataSet dataSet = new System.Data.DataSet("General");

                MLWhatsAppReportDetails sentContactDetails = new MLWhatsAppReportDetails();
                List<MLWhatsAppReportDetails> reportDetails = null;

                if (HttpContext.Session.GetString("WhatsAppReportDetails") != null)
                {
                    ArrayList data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("WhatsAppReportDetails"));
                    sentContactDetails = (MLWhatsAppReportDetails)data[0];
                }

                using (var objBL = DLWhatsAppReportDetails.GetDLWhatsAppReportDetails(objDto.AccountId,SQLProvider))
                {
                    reportDetails =await objBL.GetReportDetails(sentContactDetails, null, null, objDto.OffSet, objDto.FetchNext);
                }

                var NewListData = reportDetails.Select(x => new
                {
                    x.PhoneNumber,
                    x.GroupName,
                    x.SentDate
                });

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTable();
                dataSet.Tables.Add(dtt);

                string FileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + objDto.FileType;

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
        public async Task<JsonResult> ExportClickReport([FromBody] WhatsAppReport_ExportClickReportDto objDto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                System.Data.DataSet dataSet = new System.Data.DataSet("General");

                MLWhatsAppReportDetails sentContactDetails = new MLWhatsAppReportDetails();
                MLWhatsAppCampaignEffectivenessReport WhatsAppCampaignEffectivenessReport = new MLWhatsAppCampaignEffectivenessReport();
                MLWhatsAppClickUrl WhatsAppCampaignClickUrlReport = new MLWhatsAppClickUrl();
                List<MLWhatsAppReportDetails> reportDetails = null;
                List<MLWhatsAppCampaignEffectivenessReport> uniquereportDetails = null;
                List<MLWhatsAppClickUrl> ClickUrlDetails = null;

                string TimeZone =await Helper.GetAccountTimeZoneFromCachedMemory(objDto.AccountId,SQLProvider);
                if (HttpContext.Session.GetString("WhatsAppclickReportDetailsExport") != null && HttpContext.Session.GetString("WhatsAppclickReportDetailsExport") != "null")
                {
                    ArrayList data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("WhatsAppclickReportDetailsExport"));
                    sentContactDetails = JsonConvert.DeserializeObject<MLWhatsAppReportDetails>(data[0].ToString());
                }
                else if (HttpContext.Session.GetString("WhatsAppReportDetailsexport") != null && HttpContext.Session.GetString("WhatsAppReportDetailsexport") != "null")
                {
                    ArrayList data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("WhatsAppReportDetailsexport"));
                    sentContactDetails = JsonConvert.DeserializeObject<MLWhatsAppReportDetails>(data[0].ToString());
                }
                else if (HttpContext.Session.GetString("WhatsAppCampaignEffectivenessReport") != null && HttpContext.Session.GetString("WhatsAppCampaignEffectivenessReport") != "null")
                {
                    ArrayList data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("WhatsAppCampaignEffectivenessReport"));
                    WhatsAppCampaignEffectivenessReport = JsonConvert.DeserializeObject<MLWhatsAppCampaignEffectivenessReport>(data[0].ToString());
                }
                else if (HttpContext.Session.GetString("WhatsAppCampaignClickUrlReport") != null && HttpContext.Session.GetString("WhatsAppCampaignClickUrlReport") != "null")
                {
                    ArrayList data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("WhatsAppCampaignClickUrlReport")); 
                    WhatsAppCampaignClickUrlReport = JsonConvert.DeserializeObject<MLWhatsAppClickUrl>(data[0].ToString());
                }
                System.Data.DataTable dtt = new System.Data.DataTable();
                if (objDto.requireddata == "clicked")
                {

                    using (var objBL = DLWhatsAppReportDetails.GetDLWhatsAppReportDetails(objDto.AccountId,SQLProvider))
                    {
                        reportDetails = await objBL.GetClickReportDetails(sentContactDetails, 0, 0, null, null);
                    }

                    var NewListData = reportDetails.Select(x => new
                    {
                        Urllink = string.IsNullOrEmpty(x.MessageContent) ? "NA" : x.MessageContent,
                        PhoneNumber = x.PhoneNumber,
                        ResponseId = x.ResponseId,
                        SentDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.SentDate)).ToString()
                    });
                    dtt = NewListData.CopyToDataTable();
                }
                else if (objDto.requireddata == "Sent" || objDto.requireddata == "Bounced" || objDto.requireddata == "IsFailed" || objDto.requireddata == "Notclicked" || objDto.requireddata == "IsDelivered" || objDto.requireddata == "Pending" || objDto.requireddata == "OptOut" || objDto.requireddata == "IsRead" || objDto.requireddata == "Isnotread")
                {
                    using (var objBL = DLWhatsAppReportDetails.GetDLWhatsAppReportDetails(objDto.AccountId,SQLProvider))
                    {
                        reportDetails = await objBL.GetReportDetails(sentContactDetails, null, null, objDto.OffSet, objDto.FetchNext);
                    }

                    if (objDto.requireddata == "Bounced" || objDto.requireddata == "Error" || objDto.requireddata == "IsFailed")
                    {
                        var NewListData = reportDetails.Select(x => new
                        {

                            PhoneNumber = x.PhoneNumber,
                            ResponseId = x.ResponseId,
                            Reason = x.ErrorMessage,
                            SentDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.SentDate)).ToString()
                        });
                        dtt = NewListData.CopyToDataTable();
                    }

                    else
                    {
                        var NewListData = reportDetails.Select(x => new
                        {

                            PhoneNumber = x.PhoneNumber,
                            ResponseId = x.ResponseId,
                            SentDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.SentDate)).ToString()
                        });
                        dtt = NewListData.CopyToDataTable();
                    }


                }
                else if (objDto.requireddata == "ClickedUrl")
                {
                    using (var objBL = DLWhatsAppClickUrl.GetDLWhatsAppClickUrl(objDto.AccountId,SQLProvider))
                    {
                        ClickUrlDetails =await objBL.GetResponseData(WhatsAppCampaignClickUrlReport, objDto.OffSet, objDto.FetchNext);
                    }
                    var NewListData = ClickUrlDetails.Select(x => new
                    {

                        ClickURL = x.ClickURL,
                        TotalClick = x.TotalClick,
                        TotalUniqueClick = x.TotalUniqueClick
                    });
                    dtt = NewListData.CopyToDataTable();
                }
                else
                {
                    //using (DLWhatsAppCampignEffectivenessReport objBL = DLWhatsAppCampignEffectivenessReport(AccountId))
                    //{
                    //    uniquereportDetails = objBL.GetReportDetails(WhatsAppCampaignEffectivenessReport, OffSet, FetchNext);

                    //    var NewListData = uniquereportDetails.Select(x => new
                    //    {

                    //        PhoneNumber = x.PhoneNumber,

                    //    });
                    //    dtt = NewListData.CopyToDataTable();
                    //}
                }



                dataSet.Tables.Add(dtt);

                string FileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + objDto.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (objDto.FileType.ToLower() == "csv")
                    Helper.SaveDataSetToCSV(dataSet, MainPath);
                else
                    Helper.SaveDataSetToExcel(dataSet, MainPath);

                MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
                //Session["WhatsAppclickReportDetailsExport"] = null;
                //Session["WhatsAppReportDetailsexport"] = null;
                //Session["WhatsAppCampaignEffectivenessReport"] = null;
                //Session["WhatsAppCampaignClickUrlReport"] = null;
                return Json(new { Status = true, MainPath });


            }
            else
            {
                HttpContext.Session.SetString("WhatsAppclickReportDetailsExport", JsonConvert.SerializeObject(null));
                HttpContext.Session.SetString("WhatsAppReportDetailsexport", JsonConvert.SerializeObject(null));
                HttpContext.Session.SetString("WhatsAppCampaignEffectivenessReport", JsonConvert.SerializeObject(null));
                HttpContext.Session.SetString("WhatsAppCampaignClickUrlReport", JsonConvert.SerializeObject(null));

                return Json(new { Status = false });

            }

        }
    }
}
