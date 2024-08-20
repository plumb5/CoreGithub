using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Mail.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class MailCampaignResponseReportController : BaseController
    {
        public MailCampaignResponseReportController(IConfiguration _configuration) : base(_configuration)
        { }

        public IActionResult Index()
        {
            return View("MailCampaignResponseReport");
        }

        #region mail not sent report
        public ActionResult BlockMailReport()
        {
            return View("BlockMailReport");
        }
        #endregion mail not sent report

        [HttpPost]
        public async Task<IActionResult> MaxCount([FromBody] MailCampaignResponseReport_MaxCountDto commonDetails)
        {
            DateTime? FromDateTime = null, ToDateTime = null;
            if (!string.IsNullOrEmpty(commonDetails.fromDateTime) && !string.IsNullOrEmpty(commonDetails.toDateTime))
            {
                FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            }
            int returnVal;
            using (var objDL = DLMailCampaignResponseReport.GetDLMailCampaignResponseReport(commonDetails.accountId, SQLProvider))
            {
                returnVal = await objDL.MaxCount(commonDetails.sentContactDetails, FromDateTime, ToDateTime);
            }
            return Json(new
            {
                returnVal
            });
        }

        [HttpPost]
        public async Task<IActionResult> GetMaxClickCount([FromBody] MailCampaignResponseReport_GetMaxClickCountDto commonDetails)
        {
            DateTime? FromDateTime = null, ToDateTime = null;
            if (!string.IsNullOrEmpty(commonDetails.fromDateTime) && !string.IsNullOrEmpty(commonDetails.toDateTime))
            {
                FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            }

            int returnVal;
            using (var objBL = DLMailCampaignResponseReport.GetDLMailCampaignResponseReport(commonDetails.accountId, SQLProvider))
            {
                returnVal = await objBL.GetMaxClickCount(commonDetails.sentContactDetails, FromDateTime, ToDateTime);
            }
            return Json(new
            {
                returnVal
            });
        }

        [HttpPost]
        public async Task<IActionResult> GetReportDetails([FromBody] MailCampaignResponseReport_GetReportDetails commonDetails)
        {
            DateTime? FromDateTime = null, ToDateTime = null;
            if (!string.IsNullOrEmpty(commonDetails.fromDateTime) && !string.IsNullOrEmpty(commonDetails.toDateTime))
            {
                FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            }
            string Type = "";
            List<MLMailCampaignResponseReport> reportDetails = null;

            if (commonDetails.sentContactDetails.Sent == 1)
            {
                Type = "Sent";
            }
            else if (commonDetails.sentContactDetails.Opened == 1)
            {
                Type = "Open";
            }
            else if (commonDetails.sentContactDetails.Clicked == 1)
            {
                Type = "Click";
            }
            else if (commonDetails.sentContactDetails.Forward == 1)
            {
                Type = "Forward";
            }
            else if (commonDetails.sentContactDetails.NotSent == 1)
            {
                Type = "Block";
            }
            else if (commonDetails.sentContactDetails.Unsubscribe == 1)
            {
                Type = "Optout";
            }
            else if (commonDetails.sentContactDetails.IsBounced == 1)
            {
                Type = "Bounce";
            }

            ArrayList data = new ArrayList() { commonDetails.sentContactDetails, Type, commonDetails.sentContactDetails.EmailId };
            HttpContext.Session.SetString("MailCampaignResponses", JsonConvert.SerializeObject(data));

            using (var objDL = DLMailCampaignResponseReport.GetDLMailCampaignResponseReport(commonDetails.accountId, SQLProvider))
            {
                reportDetails = await objDL.GetReportDetails(commonDetails.sentContactDetails, commonDetails.OffSet, commonDetails.FetchNext, FromDateTime, ToDateTime);
            }

            if (reportDetails != null && reportDetails.Count > 0)
            {
                for (int i = 0; i < reportDetails.Count; i++)
                {
                    reportDetails[i].EmailId = Helper.MaskEmailAddress(reportDetails[i].EmailId);
                }
            }

            return Json(reportDetails);
        }

        [HttpPost]
        public async Task<IActionResult> GetClickReportDetails([FromBody] MailCampaignResponseReport_GetClickReportDetails commonDetails)
        {
            DateTime? FromDateTime = null, ToDateTime = null;
            if (!string.IsNullOrEmpty(commonDetails.fromDateTime) && !string.IsNullOrEmpty(commonDetails.toDateTime))
            {
                FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            }
            string Type = "";
            List<MLMailCampaignResponseReport> reportDetails = null;

            if (commonDetails.sentContactDetails.Sent == 1)
            {
                Type = "Sent";
            }
            else if (commonDetails.sentContactDetails.Opened == 1)
            {
                Type = "Open";
            }
            else if (commonDetails.sentContactDetails.Clicked == 1)
            {
                Type = "Click";
            }
            else if (commonDetails.sentContactDetails.Forward == 1)
            {
                Type = "Forward";
            }
            else if (commonDetails.sentContactDetails.NotSent == 1)
            {
                Type = "Block";
            }
            else if (commonDetails.sentContactDetails.Unsubscribe == 1)
            {
                Type = "Optout";
            }
            else if (commonDetails.sentContactDetails.IsBounced == 1)
            {
                Type = "Bounce";
            }

            ArrayList data = new ArrayList() { commonDetails.sentContactDetails, Type, commonDetails.sentContactDetails.EmailId };
            HttpContext.Session.SetString("MailClickCampaignResponses", JsonConvert.SerializeObject(data));

            using (var objBL = DLMailCampaignResponseReport.GetDLMailCampaignResponseReport(commonDetails.accountId, SQLProvider))
            {
                reportDetails = (await objBL.GetClickReportDetails(commonDetails.sentContactDetails, commonDetails.OffSet, commonDetails.FetchNext, FromDateTime, ToDateTime));
            }

            if (reportDetails != null && reportDetails.Count > 0)
            {
                for (int i = 0; i < reportDetails.Count; i++)
                {
                    reportDetails[i].EmailId = Helper.MaskEmailAddress(reportDetails[i].EmailId);
                }
            }

            return Json(reportDetails);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Export([FromBody] MailCampaignResponseReport_ExportDto commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");
                string type = "";
                MLMailCampaignResponseReport sentContactDetails = new MLMailCampaignResponseReport();

                if (HttpContext.Session.GetString("MailCampaignResponses") != null)
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("MailCampaignResponses"));
                    sentContactDetails = (MLMailCampaignResponseReport)data[0];
                    type = (string)data[1];
                }

                List<MLMailCampaignResponseReport> reportDetails = null;

                using (var objDL = DLMailCampaignResponseReport.GetDLMailCampaignResponseReport(domainDetails.AdsId, SQLProvider))
                {
                    reportDetails = await objDL.GetReportDetails(sentContactDetails, commonDetails.OffSet, commonDetails.FetchNext, null, null);
                }

                string? TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(domainDetails.AdsId, SQLProvider);

                System.Data.DataTable dtt = new System.Data.DataTable();
                if (type == "Bounce")
                {
                    var NewListData = reportDetails.Select(x => new
                    {
                        x.EmailId,
                        x.GroupName,
                        x.BouncedReason,
                        x.BouncedErrorcode,
                        BouncedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.BouncedDate)).ToString(),
                        x.ResponseId
                    });

                    dtt = NewListData.CopyToDataTable();
                }
                else
                {
                    if (type == "Open")
                    {
                        var NewListData = reportDetails.Select(x => new
                        {
                            x.EmailId,
                            x.GroupName,
                            OpenDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.Date)).ToString(),
                            x.OpenedDevice,
                            x.OpenedDeviceType,
                            x.ResponseId
                        });

                        dtt = NewListData.CopyToDataTable();
                    }

                    else if (type == "Click")
                    {
                        var NewListData = reportDetails.Select(x => new
                        {
                            x.EmailId,
                            x.GroupName,
                            ClickDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.Date)).ToString(),
                            x.ClickedDevice,
                            x.ClickedDeviceType,
                            x.ResponseId
                        });

                        dtt = NewListData.CopyToDataTable();
                    }
                    else if (type == "Forward")
                    {
                        var NewListData = reportDetails.Select(x => new
                        {
                            x.EmailId,
                            x.GroupName,
                            ForwardDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.Date)).ToString(),
                            x.ForwardedDevice,
                            x.ForwardedDeviceType,
                            x.ResponseId
                        });

                        dtt = NewListData.CopyToDataTable();
                    }
                    else if (type == "Optout")
                    {
                        var NewListData = reportDetails.Select(x => new
                        {
                            x.EmailId,
                            x.GroupName,
                            UnsubscribedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.Date)).ToString(),
                            x.UnsubscribedDevice,
                            x.UnsubscribedDeviceType,
                            x.ResponseId
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
                return Json(new { Status = true, MainPath });
            }
            else
            {
                return Json(new { Status = false });
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ExportClickReport([FromBody] MailCampaignResponseReport_ExportClickReport commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");

                MLMailCampaignResponseReport sentContactDetails = new MLMailCampaignResponseReport();

                if (HttpContext.Session.GetString("MailClickCampaignResponses") != null)
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("MailClickCampaignResponses")); ;
                    sentContactDetails = JsonConvert.DeserializeObject<MLMailCampaignResponseReport>(data[0].ToString());
                }

                List<MLMailCampaignResponseReport> reportDetails = null;

                using (var objBL = DLMailCampaignResponseReport.GetDLMailCampaignResponseReport(domainDetails.AdsId, SQLProvider))
                {
                    reportDetails = (await objBL.GetClickReportDetails(sentContactDetails, commonDetails.OffSet, commonDetails.FetchNext, null, null));
                }
                string? TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(domainDetails.AdsId, SQLProvider);
                System.Data.DataTable dtt = new System.Data.DataTable();

                var NewListData = reportDetails.Select(x => new
                {
                    Urlink = x.MailContent,
                    EmailId = x.EmailId,
                    ResponseId = x.ResponseId,
                    Date = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.Date)).ToString()
                });

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

        [Log]
        [HttpPost]
        public async Task<JsonResult> ExportSentOpenOptOutBounceErrorReport([FromBody] MailCampaignResponseReport_ExportSentOpenOptOutBounceErrorReport commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");

                MLMailCampaignResponseReport sentContactDetails = new MLMailCampaignResponseReport();

                if (HttpContext.Session.GetString("MailCampaignResponses") != null)
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("MailCampaignResponses"));
                    sentContactDetails = JsonConvert.DeserializeObject<MLMailCampaignResponseReport>(data[0].ToString());
                }

                List<MLMailCampaignResponseReport> reportDetails = null;

                using (var objBL = DLMailCampaignResponseReport.GetDLMailCampaignResponseReport(domainDetails.AdsId, SQLProvider))
                {
                    reportDetails = await objBL.GetReportDetails(sentContactDetails, commonDetails.OffSet, commonDetails.FetchNext, null, null);
                }
                System.Data.DataTable dtt = new System.Data.DataTable();
                string? TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(domainDetails.AdsId, SQLProvider);
                if (sentContactDetails.IsBounced == 1)
                {
                    var NewListData = reportDetails.Select(x => new
                    {
                        EmailId = x.EmailId,
                        Reason = x.BouncedReason,
                        ResponseId = x.ResponseId,
                        Date = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.BouncedDate)).ToString(),
                    });

                    dtt = NewListData.CopyToDataTable();
                }
                else if (sentContactDetails.NotSent == 1)
                {
                    var NewListData = reportDetails.Select(x => new
                    {
                        EmailId = x.EmailId,
                        Reason = x.ErrorMessage,
                        ResponseId = x.ResponseId,
                        Date = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.Date)).ToString(),
                    });

                    dtt = NewListData.CopyToDataTable();
                }
                else
                {
                    var NewListData = reportDetails.Select(x => new
                    {
                        EmailId = x.EmailId,
                        ResponseId = x.ResponseId,
                        Date = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.Date)).ToString(),
                    });

                    dtt = NewListData.CopyToDataTable();
                }

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

        [HttpPost]
        public async Task<IActionResult> GetBouncedDetails([FromBody] MailCampaignResponseReport_GetBouncedDetails commonDetails)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            using (var objDL = DLMailCampaignResponseReport.GetDLMailCampaignResponseReport(domainDetails.AdsId, SQLProvider))
            {
                return Json(await objDL.GetBouncedDetails(commonDetails.MailSendingSettingId));
            }
        }
    }
}
