using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.MobileInApp.Dto;
using Plumb5.Controllers;
using System.Globalization;

namespace Plumb5.Areas.MobileInApp.Controllers
{
    [Area("MobileInApp")]
    public class DashBoardController : BaseController
    {
        public DashBoardController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /MobileInApp/DashBoard/

        public ActionResult Index()
        {
            return View("DashBoard");
        }

        [HttpPost]
        public async Task<JsonResult> GetPlatformDistribution([FromBody] DashBoard_GetPlatformDistribution commonDetails)
        {
            DateTime FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            MLMobileInAppDashBoard? mLMobileInAppDashBoard = null;

            using (var objDL = DLMobileInAppDashBoard.GetDLMobileInAppDashBoard(commonDetails.AccountId, SQLProvider))
            {
                mLMobileInAppDashBoard = await objDL.GetPlatformDistribution(FromDateTime, ToDateTime);
                if (mLMobileInAppDashBoard == null)
                    mLMobileInAppDashBoard = new MLMobileInAppDashBoard { TotalAndroid = 0, TotalIOS = 0 };

                return Json(mLMobileInAppDashBoard);
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetTotalInAppFormSubmissions([FromBody] DashBoard_GetTotalInAppFormSubmissions commonDetails)
        {
            DateTime FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var objDL = DLMobileInAppDashBoard.GetDLMobileInAppDashBoard(commonDetails.AccountId, SQLProvider))
            {
                return Json(await objDL.TotalInAppFormSubmissions(FromDateTime, ToDateTime));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetTopFivePerFormingInApp([FromBody] DashBoard_GetTopFivePerFormingInApp commonDetails)
        {
            DateTime FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var objDL = DLMobileInAppDashBoard.GetDLMobileInAppDashBoard(commonDetails.AccountId, SQLProvider))
            {
                return Json(await objDL.TopFivePerFormingInApp(FromDateTime, ToDateTime));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetAggregateInAppData([FromBody] DashBoard_GetAggregateInAppData commonDetails)
        {
            DateTime FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            MLMobileInAppDashBoard? mLMobileInAppDashBoard = null;

            using (var objDL = DLMobileInAppDashBoard.GetDLMobileInAppDashBoard(commonDetails.AccountId, SQLProvider))
            {
                mLMobileInAppDashBoard = await objDL.AggregateInAppData(FromDateTime, ToDateTime);
                if (mLMobileInAppDashBoard == null)
                    mLMobileInAppDashBoard = new MLMobileInAppDashBoard { ViewedCount = 0, ResponseCount = 0, ClosedCount = 0 };

                return Json(mLMobileInAppDashBoard);
            }
        }
    }
}
