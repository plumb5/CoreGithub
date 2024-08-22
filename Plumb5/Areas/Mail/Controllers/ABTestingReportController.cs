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
    public class ABTestingReportController : BaseController
    {
        public ABTestingReportController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            DomainInfo domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            ViewBag.AdsId = domainDetails.AdsId;
            return View("ABTestingReport");
        }

        [HttpPost]
        public async Task<JsonResult> MaxCount([FromBody] ABTestingReport_MaxCountDto details)
        {
            DomainInfo domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            int returnVal;
            using (var objBL = DLMailCampaignResponses.GetDLMailCampaignResponses(domainDetails.AdsId, SQLProvider))
            {
                returnVal = await objBL.ABTestingMaxCount(FromDateTime, ToDateTime, details.mailCampaignId);
            }
            return Json(new
            {
                returnVal
            });
        }

        public async Task<JsonResult> GetResponseData([FromBody] ABTestingReport_GetResponseDataDto details)
        {
            DomainInfo domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            List<MLMailCampaignResponses> responsedetails = null;

            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            ArrayList data = new ArrayList() { details.mailCampaignId };
            HttpContext.Session.SetString("MailResponses", JsonConvert.SerializeObject(data));

            using (var objBL = DLMailCampaignResponses.GetDLMailCampaignResponses(domainDetails.AdsId, SQLProvider))
            {
                responsedetails = await objBL.GetABTestingResponseData(FromDateTime, ToDateTime, details.OffSet, details.FetchNext, details.mailCampaignId);
            }

            return Json(responsedetails);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Export([FromBody] ABTestingReport_ExportDto details)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");

                List<MLMailCampaignResponses> responsedetails = null;

                int mailCampaignId = 0;
                DateTime fromDateTime = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime toDateTime = DateTime.ParseExact(details.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);


                if (HttpContext.Session.GetString("MailResponses") != null)
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("MailResponses"));
                    mailCampaignId = Convert.ToInt32(data[0]);
                }

                using (var objBL = DLMailCampaignResponses.GetDLMailCampaignResponses(details.AccountId, SQLProvider))
                {
                    responsedetails = await objBL.GetABTestingResponseData(fromDateTime, toDateTime, details.OffSet, details.FetchNext, mailCampaignId);
                }

                var responsedetail = (from c in responsedetails
                                      group c by c.SplitId into grp
                                      where grp.Count() > 1
                                      select grp.Key).ToList();


                var responsedetaillist = (from x in responsedetails
                                          join responses in responsedetail
                                          on x.SplitId equals responses
                                          select new
                                          {
                                              x.CampaignIdentifier,
                                              x.CampaignName,
                                              x.TemplateName,
                                              x.GroupName,
                                              x.Subject,
                                              x.CreatedDate,
                                              x.UpdatedDate,
                                              x.ScheduledDate,
                                              x.TotalSent,
                                              x.TotalOpen,
                                              x.TotalClick,
                                              x.UniqueClick,
                                              x.URL,
                                              x.TotalUnsubscribe,
                                              x.TotalForward,
                                              x.TotalBounced,
                                              x.TotalNotSent,
                                              x.ABWinningMetricRate,
                                              x.ABTestDuration,
                                              x.IsABWinner,
                                              x.FallbackTemplate
                                          }).ToList();


                string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(details.AccountId, SQLProvider);


                var NewListData = responsedetaillist.Select(x => new
                {
                    x.CampaignIdentifier,
                    x.CampaignName,
                    x.TemplateName,
                    x.GroupName,
                    x.Subject,
                    CreatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.CreatedDate)).ToString(),
                    UpdatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.UpdatedDate)).ToString(),
                    ScheduledDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.ScheduledDate)).ToString(),
                    Sent = x.TotalSent,
                    Opened = x.TotalOpen,
                    Clicked = x.TotalClick,
                    x.UniqueClick,
                    x.URL,
                    Optout = x.TotalUnsubscribe,
                    Forward = x.TotalForward,
                    Bounce = x.TotalBounced,
                    Error = x.TotalNotSent,
                    x.ABWinningMetricRate,
                    x.ABTestDuration,
                    IsABWinnerTemplate = x.IsABWinner == true ? "True" : "False",
                    ResultDrawTemplate = x.FallbackTemplate == "A" ? "Template A" : "Template B"
                });

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTable();
                dataSet.Tables.Add(dtt);

                string FileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (details.FileType.ToLower() == "csv")
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
