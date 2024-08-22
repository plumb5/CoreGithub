using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Analytics.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Data;
using System.Globalization;

namespace Plumb5.Areas.Analytics.Controllers
{
    [Area("Analytics")]
    public class SiteSearchPagesController : BaseController
    {
        public SiteSearchPagesController(IConfiguration _configuration) : base(_configuration)
        { }

        public IActionResult Index()
        {
            return View("SiteSearchPages");
        }

        [HttpPost]
        public async Task<ActionResult> GetSearchPage([FromBody] SiteSearchPages_GetSearchPageDto details)
        {
            try
            {
                DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

                object DataSet;

                using (var objDL = DLSearchedDataTags.GetDLSearchedDataTags(details.accountId, SQLProvider))
                    DataSet = await objDL.GetSearchPage(FromDateTime, ToDateTime);

                var getdata = JsonConvert.SerializeObject(DataSet, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> SiteSearchPagesExport([FromBody] SiteSearchPages_SiteSearchPagesExportDto details)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                List<MLSiteSearchPages> sitesearcpages = new List<MLSiteSearchPages>();
                DataSet dataSet = new DataSet();

                using (var objDL = DLSearchedDataTags.GetDLSearchedDataTags(details.AccountId, SQLProvider))
                {
                    sitesearcpages = await objDL.GetSiteSearchPagesForExport(details.OffSet, details.FetchNext);
                }

                var SiteSearchPageData = sitesearcpages.Select(x => new
                {
                    x.PageURL,
                    x.PageViews,
                    AvgTime = Helper.AverageTime(Convert.ToDecimal(x.AvgTime))
                });

                string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(details.AccountId, SQLProvider);

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = SiteSearchPageData.CopyToDataTableExport();
                dataSet.Tables.Add(dtt);

                string FileName = "SiteSearchPagesData_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;
                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                //string MainPath = "E:/" + FileName;

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
