using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Globalization;
using Plumb5.Areas.Dashboard.Models;
using Plumb5.Areas.Dashboard.Dto;

namespace Plumb5.Areas.Dashboard.Controllers
{
    [Area("Dashboard")]
    public class CampaignCalendarController : BaseController
    {
        public CampaignCalendarController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /Dashboard/CampaignCalendar/

        public IActionResult Index()
        {
            return View("CampaignCalendar");
        }

        public async Task<ActionResult> GetOverallScheduledDetails(int AdsId, string fromDateTime, string toDateTime)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo")); 
            DateTime FromDateTime = DateTime.ParseExact(fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<CalendarData> calendarData = null;

            using (CampaignCalendar obj = new CampaignCalendar())
            {
                calendarData = await obj.GetJsonData(AdsId, FromDateTime, ToDateTime,SQLProvider);
            }
            var getdata = JsonConvert.SerializeObject(calendarData, Formatting.Indented);
            return Content(getdata.ToString());
        }

    }
}
