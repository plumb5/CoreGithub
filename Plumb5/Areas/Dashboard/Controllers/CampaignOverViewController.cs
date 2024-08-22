using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using Newtonsoft.Json;
using P5GenralDL;
using Plumb5.Areas.Dashboard.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Data;
using System.Globalization;

namespace Plumb5.Areas.Dashboard.Controllers
{
    [Area("Dashboard")]
    public class CampaignOverViewController : BaseController
    {
        public CampaignOverViewController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /Dashboard/CampaignOverView/

        public IActionResult Index()
        {
            return View("CampaignOverView");
        }

        public async Task<JsonResult> GetMaxCount([FromBody]CampaignOverView_GetMaxCountDto CampaignOverViewDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(CampaignOverViewDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(CampaignOverViewDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            int returnVal;
            using (var objDL =   DLCampaignOverView.GetDLCampaignCalendar(CampaignOverViewDto.accountId,SQLProvider))
            {
                returnVal = await objDL.CampaignMaxCount(FromDateTime, ToDateTime, CampaignOverViewDto.CampaignName, CampaignOverViewDto.TemplateName, CampaignOverViewDto.ChannelType);
            }
            return Json(new
            {
                returnVal
            });
        }

        public async Task<ActionResult> GetReportDetails([FromBody] CampaignOverView_GetReportDetailsDto CampaignOverViewDto)
        {

            ArrayList arraylist = new ArrayList { CampaignOverViewDto.CampaignName, CampaignOverViewDto.TemplateName, CampaignOverViewDto.ChannelType }; 
            HttpContext.Session.SetString("CampOverviewDetails", JsonConvert.SerializeObject(arraylist));
            DateTime FromDateTime = DateTime.ParseExact(CampaignOverViewDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(CampaignOverViewDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            System.Data.DataSet DataSet = new System.Data.DataSet();

            using (var objDL = DLCampaignOverView.GetDLCampaignCalendar(CampaignOverViewDto.accountId, SQLProvider))
            {
                DataSet = await objDL.GetCampaignReportDetails(FromDateTime, ToDateTime, CampaignOverViewDto.OffSet, CampaignOverViewDto.FetchNext, CampaignOverViewDto.CampaignName, CampaignOverViewDto.TemplateName, CampaignOverViewDto.ChannelType);
            }
            var getdata = JsonConvert.SerializeObject(DataSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");

        }

        public async Task<ActionResult> GetTemplateList([FromBody] CampaignOverView_GetTemplateListDto CampaignOverViewDto)
        {
            System.Data.DataSet DataSet = new System.Data.DataSet();

            using (var objDL = DLCampaignOverView.GetDLCampaignCalendar(CampaignOverViewDto.accountId, SQLProvider))
                DataSet = await objDL.GetTemplateDetails(CampaignOverViewDto.ChannelType);

            var getdata = JsonConvert.SerializeObject(DataSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }

        public async Task<ActionResult> GetCampaignList([FromBody] CampaignOverView_GetCampaignListDto CampaignOverViewDto)
        {
            System.Data.DataSet DataSet = new System.Data.DataSet();

            using (var objDL = DLCampaignOverView.GetDLCampaignCalendar(CampaignOverViewDto.accountId, SQLProvider))
                DataSet = await objDL.GetCampaignDetails(CampaignOverViewDto.ChannelType);

            var getdata = JsonConvert.SerializeObject(DataSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");

        }

        public async Task<ActionResult> ExportCampaignOveriViewReport([FromBody] CampaignOverView_ExportCampaignOveriViewReportDto CampaignOverViewDto)
        {
            System.Data.DataSet DataSet = new System.Data.DataSet("General");
            System.Data.DataSet finalSet = new System.Data.DataSet("General");
            DateTime FromDateTimes = DateTime.ParseExact(CampaignOverViewDto.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(CampaignOverViewDto.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);


            string CampaignName = "";
            string TemplateName = "";
            string ChannelType = "";
            if (HttpContext.Session.GetString("CampOverviewDetails") != null) 
            {
                ArrayList array = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("CampOverviewDetails"));  

                CampaignName = (string?)array[0];
                TemplateName = (string?)array[1];
                ChannelType = (string?)array[2];
            }

            using (var objDL = DLCampaignOverView.GetDLCampaignCalendar(CampaignOverViewDto.AccountId, SQLProvider))
            {
                DataSet = await objDL.GetCampaignReportDetails(FromDateTimes, ToDateTime, CampaignOverViewDto.OffSet, CampaignOverViewDto.FetchNext, CampaignName, TemplateName, ChannelType);
            }

            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(CampaignOverViewDto.AccountId, SQLProvider);

            DataTable tableToQuery = DataSet.Tables[0];
            var NewListData = (from dataRow in tableToQuery.AsEnumerable()
                               select new
                               {
                                   CampaignIdentifier = Convert.ToString(dataRow.Field<string>("Name")).Replace("&amp;", "and"),
                                   CampaignName = dataRow.Field<string>("CampaignName"),
                                   TemplateName = dataRow.Field<string>("TemplateName"),
                                   ChannelType = dataRow.Field<string>("ChannelType"),
                                   Sent = dataRow.Field<Int64>("TotalSent"),
                                   Delivered = dataRow.Field<Int64>("TotalDelivered"),
                                   Opened = dataRow.Field<Int64>("TotalOpened"),
                                   Clicked = dataRow.Field<Int64>("TotalClicked"),
                                   Unsubscribed = dataRow.Field<Int64>("TotalUnsubscribed"),
                                   Bounced = dataRow.Field<Int64>("TotalBounced"),
                                   Read = dataRow.Field<Int64>("TotalRead"),
                                   Failed = dataRow.Field<Int64>("TotalFailed"),
                                   Closed = dataRow.Field<Int64>("TotalClosed"),
                                   IsABTesting = dataRow.Field<bool>("IsMailSplit"),
                                   IsWorkFlow = dataRow.Field<Int16>("IsWorkFlowOrNotification") == 1 ? true : false,
                                   IsAlertsAndNotification = dataRow.Field<Int16>("IsWorkFlowOrNotification") == 2 ? true : false,
                                   SentDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(dataRow.Field<DateTime>("CreatedDate"))).ToString(),
                                   ConfigurationName = dataRow.Field<string>("ConfigurationName")
                               }).ToList();

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTable();
            finalSet.Tables.Add(dtt);

            string FileName = "CampaignOverViewData_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + CampaignOverViewDto.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            //string MainPath = "E:/" + FileName;

            if (CampaignOverViewDto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(finalSet, MainPath);
            else
                Helper.SaveDataSetToExcel(finalSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath } );
        }

    }
}
