using Microsoft.AspNetCore.Mvc;
using P5GenralML;
using P5GenralDL;
using Plumb5.Controllers;
using System.Globalization;
using System.Data;
using System.Collections;
using Microsoft.DotNet.Scaffolding.Shared.CodeModifier.CodeChange;
using Newtonsoft.Json;
using Plumb5GenralFunction;
using Microsoft.Identity.Client;
using System.Text.RegularExpressions;
using System.Reflection.PortableExecutable;
using NPOI.SS.Formula.Functions;
using System.Web;
using Microsoft.AspNetCore.OutputCaching;
using Plumb5.Areas.Analytics.Dto;

namespace Plumb5.Areas.Analytics.Controllers
{
    [Area("Analytics")]
    public class SiteSearchOverViewController : BaseController
    {
        public SiteSearchOverViewController(IConfiguration _configuration) : base(_configuration)
        { }

        public IActionResult Index()
        {
            return View("SiteSearchOverView");
        }

        [HttpPost]
        public async Task<ActionResult> IsDataExists([FromBody] SiteSearchOverView_IsDataExistsDto details)
        {
            int returnVal;
            try
            {
                using (var objDL = DLSearchedDataTags.GetDLSearchedDataTags(details.accountId, SQLProvider))
                    returnVal = await objDL.IsDataExists();

                return Json(new { returnVal });
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetOverViewGraphDetails([FromBody] SiteSearchOverView_GetOverViewGraphDetailsDto details)
        {
            try
            {
                DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

                object DataSet;

                using (var objDL = DLSearchedDataTags.GetDLSearchedDataTags(details.accountId, SQLProvider))
                    DataSet = await objDL.OverViewGraphDetails(FromDateTime, ToDateTime);

                var getdata = JsonConvert.SerializeObject(DataSet, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetTopSearchedPage([FromBody] SiteSearchOverView_GetTopSearchedPageDto details)
        {
            try
            {
                DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

                object DataSet;

                using (var objDL = DLSearchedDataTags.GetDLSearchedDataTags(details.accountId, SQLProvider))
                    DataSet = await objDL.TopSearchedPage(FromDateTime, ToDateTime);

                var getdata = JsonConvert.SerializeObject(DataSet, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetTopSearchedTerm([FromBody] SiteSearchOverView_GetTopSearchedTermDto details)
        {
            try
            {
                DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

                object DataSet;

                using (var objDL = DLSearchedDataTags.GetDLSearchedDataTags(details.accountId, SQLProvider))
                    DataSet = await objDL.TopSearchedTerm(FromDateTime, ToDateTime);

                var getdata = JsonConvert.SerializeObject(DataSet, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }
    }
}
