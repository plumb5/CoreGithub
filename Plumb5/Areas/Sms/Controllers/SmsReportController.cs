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
    public class SmsReportController : BaseController
    {
        public SmsReportController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("SmsReportDetails");
        }

        [HttpPost]
        public async Task<ActionResult> MaxCount([FromBody] SmsReportDto_MaxCount commonDetails)
        {
            DateTime? FromDateTime = null, ToDateTime = null;
            ArrayList data = new ArrayList() { commonDetails.sentContactDetails };
            HttpContext.Session.SetString("SmsReportDetailsexport", JsonConvert.SerializeObject(data));
            if (!string.IsNullOrEmpty(commonDetails.fromDateTime) && !string.IsNullOrEmpty(commonDetails.toDateTime))
            {
                FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            }
            using (var objDL = DLSmsReportDetails.GetDLSmsReportDetails(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDL.MaxCount(commonDetails.sentContactDetails, FromDateTime, ToDateTime));
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetReportDetails([FromBody] SmsReportDto_GetReportDetails commonDetails)
        {
            List<MLSmsReportDetails> reportDetails = null;
            DateTime? FromDateTime = null, ToDateTime = null;
            if (!string.IsNullOrEmpty(commonDetails.fromDateTime) && !string.IsNullOrEmpty(commonDetails.toDateTime))
            {
                FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            }
            ArrayList data = new ArrayList() { commonDetails.sentContactDetails };
            HttpContext.Session.SetString("SmsReportDetails", JsonConvert.SerializeObject(data));

            using (var objDL = DLSmsReportDetails.GetDLSmsReportDetails(commonDetails.accountId, SQLProvider))
            {
                reportDetails = (await objDL.GetReportDetails(commonDetails.sentContactDetails, commonDetails.OffSet, commonDetails.FetchNext, FromDateTime, ToDateTime)).ToList();
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
        public async Task<ActionResult> GetMaxClickCount([FromBody] SmsReportDto_GetMaxClickCount commonDetails)
        {
            DateTime? FromDateTime = null, ToDateTime = null;
            ArrayList data = new ArrayList() { commonDetails.sentContactDetails };
            HttpContext.Session.SetString("SmsclickReportDetailsexport", JsonConvert.SerializeObject(data));
            if (!string.IsNullOrEmpty(commonDetails.fromDateTime) && !string.IsNullOrEmpty(commonDetails.toDateTime))
            {
                FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            }
            using (var objDL = DLSmsReportDetails.GetDLSmsReportDetails(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDL.GetMaxClickCount(commonDetails.sentContactDetails, FromDateTime, ToDateTime));
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetClickReportDetails([FromBody] SmsReportDto_GetClickReportDetails commonDetails)
        {
            List<MLSmsReportDetails> reportDetails = null;
            DateTime? FromDateTime = null, ToDateTime = null;
            if (!string.IsNullOrEmpty(commonDetails.fromDateTime) && !string.IsNullOrEmpty(commonDetails.toDateTime))
            {
                FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            }

            ArrayList data = new ArrayList() { commonDetails.sentContactDetails };
            HttpContext.Session.SetString("SmsclickReportDetails", JsonConvert.SerializeObject(data));

            using (var objDL = DLSmsReportDetails.GetDLSmsReportDetails(commonDetails.accountId, SQLProvider))
            {
                reportDetails = (await objDL.GetClickReportDetails(commonDetails.sentContactDetails, commonDetails.OffSet, commonDetails.FetchNext, FromDateTime, ToDateTime)).ToList();
                if (reportDetails != null && reportDetails.Count > 0)
                {
                    for (int i = 0; i < reportDetails.Count; i++)
                        reportDetails[i].PhoneNumber = !String.IsNullOrEmpty(reportDetails[i].PhoneNumber) ? Helper.MaskPhoneNumber(reportDetails[i].PhoneNumber) : reportDetails[i].PhoneNumber;
                }
            }
            return Json(reportDetails);
        }

        [HttpPost]
        public async Task<ActionResult> GetSmsStatusCount([FromBody] SmsReportDto_GetSmsStatusCount commonDetails)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            MLSmsSentStatusReport? SmsSentStatusReport = null;

            using (var objDL = DLSmsSent.GetDLSmsSent(domainDetails.AdsId, SQLProvider))
            {
                SmsSentStatusReport = await objDL.GetSmsStatusCount(commonDetails.SmsSendingSettingId);
            }
            return Json(SmsSentStatusReport);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Export([FromBody] SmsReportDto_Export commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                System.Data.DataSet dataSet = new System.Data.DataSet("General");

                MLSmsReportDetails sentContactDetails = new MLSmsReportDetails();
                List<MLSmsReportDetails> reportDetails = null;

                if (HttpContext.Session.GetString("SmsReportDetails") != null && HttpContext.Session.GetString("webpushTemplate") != "null")
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("SmsReportDetails"));
                    sentContactDetails = JsonConvert.DeserializeObject<MLSmsReportDetails>(data[0].ToString());
                }

                using (var objDL = DLSmsReportDetails.GetDLSmsReportDetails(commonDetails.AccountId, SQLProvider))
                {
                    reportDetails = (await objDL.GetReportDetails(sentContactDetails, commonDetails.OffSet, commonDetails.FetchNext, null, null)).ToList();
                }
                string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(commonDetails.AccountId, SQLProvider);
                var NewListData = reportDetails.Select(x => new
                {
                    x.PhoneNumber,
                    x.GroupName,
                    SentDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.SentDate)).ToString()
                });

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTable();
                dataSet.Tables.Add(dtt);

                string FileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;

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


        #region Sms not sent report
        public IActionResult BlockSMSReport()
        {
            return View("BlockSMSReport");
        }

        [HttpPost]
        public async Task<ActionResult> GetProductDetailsById([FromBody] SmsReportDto_GetProductDetailsById commonDetails)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            List<Product> lstproduct = new List<Product>();
            List<string> prdIds = commonDetails.ProductIds.Split(',').ToList();

            using (var objproduct = DLProduct.GetDLProduct(domainDetails.AdsId, SQLProvider))
            {
                lstproduct = (await objproduct.GetProductList(new Product(), prdIds)).ToList();
            }
            return Json(lstproduct);
        }

        [HttpPost]
        public async Task<JsonResult> GetContactDetails([FromBody] SmsReportDto_GetContactDetails commonDetails)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            Contact? objcontact = new Contact() { ContactId = commonDetails.contactId };
            using (var objDL = DLContact.GetContactDetails(domainDetails.AdsId, SQLProvider))
            {
                objcontact = await objDL.GetContactDetails(objcontact, null);
                return Json(objcontact);
            }
        }
        #endregion

        [HttpPost]
        public async Task<ActionResult> GetBouncedDetails([FromBody] SmsReportDto_GetBouncedDetails commonDetails)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            using (var objDL = DLSmsReportDetails.GetDLSmsReportDetails(domainDetails.AdsId, SQLProvider))
            {
                return Json(await objDL.GetBouncedDetails(commonDetails.SMSSendingSettingId));
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ExportClickReport([FromBody] SmsReportDto_ExportClickReport commonDetails)
        {

            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                System.Data.DataSet dataSet = new System.Data.DataSet("General");
                //var NewListData=new object() ;
                MLSmsReportDetails sentContactDetails = new MLSmsReportDetails();
                List<MLSmsCampaignEffectivenessReport> uniquereportDetails = null;
                MLSmsCampaignEffectivenessReport SMSCampaignEffectivenessReport = new MLSmsCampaignEffectivenessReport();
                List<MLSmsReportDetails> reportDetails = null;
                List<MLSmsClickUrl> mlSmsClickUrl = null;
                MLSmsClickUrl mLSmsClickUrl = null;

                string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(commonDetails.AccountId, SQLProvider);

                if (!String.IsNullOrEmpty(HttpContext.Session.GetString("SmsclickReportDetailsexport")) && HttpContext.Session.GetString("SmsclickReportDetailsexport") != "null")
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("SmsclickReportDetailsexport"));
                    sentContactDetails = JsonConvert.DeserializeObject<MLSmsReportDetails>(data[0].ToString());
                }
                else if (!String.IsNullOrEmpty(HttpContext.Session.GetString("SmsReportDetailsexport")) && HttpContext.Session.GetString("SmsReportDetailsexport") != "null")
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("SmsReportDetailsexport"));
                    sentContactDetails = JsonConvert.DeserializeObject<MLSmsReportDetails>(data[0].ToString());
                }
                else if (!String.IsNullOrEmpty(HttpContext.Session.GetString("SMSCampaignEffectivenessReport")) && HttpContext.Session.GetString("SMSCampaignEffectivenessReport") != "null")
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("SMSCampaignEffectivenessReport"));
                    SMSCampaignEffectivenessReport = JsonConvert.DeserializeObject<MLSmsCampaignEffectivenessReport>(data[0].ToString());
                }
                System.Data.DataTable dtt = new System.Data.DataTable();
                if (commonDetails.requireddata == "clicked")
                {
                    using (var objDL = DLSmsReportDetails.GetDLSmsReportDetails(commonDetails.AccountId, SQLProvider))
                    {
                        reportDetails = (await objDL.GetClickReportDetails(sentContactDetails, 0, 0, null, null)).ToList();
                    }


                    var NewListData = reportDetails.Select(x => new
                    {
                        Urllink = x.MessageContent,
                        PhoneNumber = x.PhoneNumber,
                        ResponseId = x.ResponseId,
                        SentDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.SentDate)).ToString()
                    });
                    dtt = NewListData.CopyToDataTable();
                }
                else if (commonDetails.requireddata == "ClickedUrl")
                {
                    if (HttpContext.Session.GetString("SmsClickUrlDetails") != null)
                    {
                        ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("SmsClickUrlDetails"));

                        mLSmsClickUrl = (MLSmsClickUrl)data[0];
                    }

                    using (var objBL = DLSmsClickUrl.GetDLSmsClickUrl(commonDetails.AccountId, SQLProvider))
                    {
                        mlSmsClickUrl = await objBL.GetResponseData(mLSmsClickUrl, commonDetails.OffSet, commonDetails.FetchNext);
                    }
                    var NewListData = mlSmsClickUrl.Select(x => new
                    {

                        ClickURL = x.ClickURL,
                        TotalClick = x.TotalClick,
                        TotalUniqueClick = x.TotalUniqueClick
                    });
                    dtt = NewListData.CopyToDataTable();
                }

                else if (commonDetails.requireddata == "Sent" || commonDetails.requireddata == "Bounced" || commonDetails.requireddata == "IsDelivered" || commonDetails.requireddata == "Pending" || commonDetails.requireddata == "OptOut" || commonDetails.requireddata == "Notclicked")
                {
                    using (var objBL = DLSmsReportDetails.GetDLSmsReportDetails(commonDetails.AccountId, SQLProvider))
                    {

                        reportDetails = (await objBL.GetReportDetails(sentContactDetails, commonDetails.OffSet, commonDetails.FetchNext, null, null)).ToList();
                    }

                    if (commonDetails.requireddata == "Bounced" || commonDetails.requireddata == "Error")
                    {
                        var NewListData = reportDetails.Select(x => new
                        {

                            PhoneNumber = x.PhoneNumber,
                            ResponseId = x.ResponseId,
                            Reason = x.ReasonForNotDelivery,
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
                else
                {
                    using (var objBL = DLSmsCampignEffectivenessReport.GetDLSmsCampignEffectivenessReport(commonDetails.AccountId, SQLProvider))
                    {
                        uniquereportDetails = await objBL.GetReportDetails(SMSCampaignEffectivenessReport, commonDetails.OffSet, commonDetails.FetchNext);
                        var NewListData = uniquereportDetails.Select(x => new
                        {

                            PhoneNumber = x.PhoneNumber,

                        });
                        dtt = NewListData.CopyToDataTable();
                    }
                }
                dataSet.Tables.Add(dtt);

                string FileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (commonDetails.FileType.ToLower() == "csv")
                    Helper.SaveDataSetToCSV(dataSet, MainPath);
                else
                    Helper.SaveDataSetToExcel(dataSet, MainPath);


                MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
                HttpContext.Session.SetString("SmsclickReportDetailsexport", JsonConvert.SerializeObject(null));
                HttpContext.Session.SetString("SmsReportDetailsexport", JsonConvert.SerializeObject(null));
                HttpContext.Session.SetString("SMSCampaignEffectivenessReport", JsonConvert.SerializeObject(null));
                HttpContext.Session.SetString("SmsClickUrlDetails", JsonConvert.SerializeObject(null));

                return Json(new { Status = true, MainPath });
            }
            else
            {
                HttpContext.Session.SetString("SmsclickReportDetailsexport", JsonConvert.SerializeObject(null));
                HttpContext.Session.SetString("SmsReportDetailsexport", JsonConvert.SerializeObject(null));
                HttpContext.Session.SetString("SMSCampaignEffectivenessReport", JsonConvert.SerializeObject(null));
                HttpContext.Session.SetString("SmsClickUrlDetails", JsonConvert.SerializeObject(null));

                return Json(new { Status = false });
            }
        }
    }
}

