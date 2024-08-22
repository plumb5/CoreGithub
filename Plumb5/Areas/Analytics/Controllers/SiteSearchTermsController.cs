using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Analytics.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Data;
using System.Globalization;

namespace Plumb5.Areas.Analytics.Controllers
{
    [Area("Analytics")]
    public class SiteSearchTermsController : BaseController
    {
        public SiteSearchTermsController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("SiteSearchTerms");
        }

        [HttpPost]
        public async Task<ActionResult> GetSearchTerm([FromBody] SiteSearchTerms_GetSearchTermDto details)
        {
            try
            {
                DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

                object DataSet;

                using (var objDL = DLSearchedDataTags.GetDLSearchedDataTags(details.accountId, SQLProvider))
                    DataSet = await objDL.GetSearchTerm(FromDateTime, ToDateTime);

                var getdata = JsonConvert.SerializeObject(DataSet, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> SiteSearchTermExport([FromBody] SiteSearchTerms_SiteSearchTermExportDto details)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                List<MLSiteSearchTerm> sitesearchterm = new List<MLSiteSearchTerm>();
                DataSet dataSet = new DataSet();

                using (var objDL = DLSearchedDataTags.GetDLSearchedDataTags(details.AccountId, SQLProvider))
                {
                    sitesearchterm = await objDL.GetSiteSearchTermForExport(details.OffSet, details.FetchNext);
                }

                var SiteSearchTermData = sitesearchterm.Select(x => new
                {
                    x.SearchedData,
                    x.UniqueSearch,
                    x.PageViews
                });

                string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(details.AccountId, SQLProvider);

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = SiteSearchTermData.CopyToDataTableExport();
                dataSet.Tables.Add(dtt);

                string FileName = "SiteSearchTermData_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;
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
