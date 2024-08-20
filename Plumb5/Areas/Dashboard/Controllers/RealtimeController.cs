using Microsoft.AspNetCore.Mvc;
using Plumb5.Areas.Dashboard.Dto;
using Plumb5.Areas.Dashboard.Models;
using Plumb5.Controllers;

namespace Plumb5.Areas.Dashboard.Controllers
{
    [Area("Dashboard")]
    public class RealtimeController : BaseController
    {
        public RealtimeController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("Realtime");
        }
        [HttpPost]
        public async Task<JsonResult> GetRealTimeDashboard([FromBody] Realtime_GetRealTimeDashboardDto objDto)
        {
            List<Realtime> getRealTimeList = null;
            using (Realtime objReal = new Realtime())
            {
                getRealTimeList =await objReal.GetRealTimeDetails(objDto.AdsId, SQLProvider);
            }
            return Json(getRealTimeList);
        }

    }
}
