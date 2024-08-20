using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Analytics.Dto;
using Plumb5.Areas.CaptureForm.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.CaptureForm.Controllers
{
    [Area("CaptureForm")]
    public class DashboardController : BaseController
    {
        public DashboardController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("FormDashboard");
        }

        [HttpPost]
        public async Task<JsonResult> GetTotalFormSubmissions([FromBody] Dashboard_GetTotalFormSubmissionsDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var objDL = DLFormDashboard.GetDLFormDashboard(objDto.AccountId,SQLProvider))
            {
                return Json(await objDL.GetTotalFormSubmissions(FromDateTime, ToDateTime));
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetTopFivePerFormingForms([FromBody] Dashboard_GetTopFivePerFormingFormsDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var objDL =DLFormDashboard.GetDLFormDashboard(objDto.AccountId,SQLProvider))
            {
                return Json(await objDL.GetTopFivePerFormingForms(FromDateTime, ToDateTime));
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetPlatformDistribution([FromBody] Dashboard_GetPlatformDistributionDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var objDL = DLFormDashboard.GetDLFormDashboard(objDto.AccountId,SQLProvider))
            {
                return Json(await objDL.GetPlatformDistribution(FromDateTime, ToDateTime));
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetAggregateFormsData([FromBody] Dashboard_GetAggregateFormsDataDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var objDL = DLFormDashboard.GetDLFormDashboard(objDto.AccountId,SQLProvider))
            {
                return Json(await objDL.GetAggregateFormsData(FromDateTime, ToDateTime));
            }
        }
        //[HttpPost]
        //public async Task<JsonResult> GetFormReport([FromBody] Dashboard_GetFormReportDto objDto)
        //{
        //    DateTime FromDateTime = DateTime.ParseExact(fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
        //    DateTime ToDateTime = DateTime.ParseExact(toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

        //    DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

        //    List<MLFormDashboard> dashboardDetails = null;
        //    using (var objDL =DLFormDashboard.GetDLFormDashboard(domainDetails.AdsId,SQLProvider))
        //    {
        //        dashboardDetails =await objDL.GetFormReport(FormId, Duration, FromDateTime, ToDateTime, IsBannerOrForm);
        //    }

        //    return Json(dashboardDetails);
        //}
        //[HttpPost]
        //public async Task<JsonResult> BindFormImpressionsCount([FromBody] Dashboard_BindFormImpressionsCountDto objDto)
        //{
        //    DateTime FromDateTime = DateTime.ParseExact(fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
        //    DateTime ToDateTime = DateTime.ParseExact(toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

        //    DomainInfo domainDetails = (DomainInfo)Session["AccountInfo"];

        //    List<MLFormDashboard> dashboardDetails = null;
        //    using (DLFormDashboard objDL = new DLFormDashboard(domainDetails.AdsId))
        //    {
        //        dashboardDetails = objDL.BindFormImpressionsCount(FormId, FromDateTime, ToDateTime);
        //    }

        //    return Json(dashboardDetails, JsonRequestBehavior.AllowGet);
        //}
        //[HttpPost]
        //public async Task<ActionResult> Top5BannerResponses([FromBody] Dashboard_Top5BannerResponsesDto objDto)
        //{
        //    DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
        //    LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

        //    List<MLFormBannerLoadClickReponses> listOfData = new List<MLFormBannerLoadClickReponses>();
        //    using (var objDL = DLFormDashboard.GetDLFormDashboard(domainDetails.AdsId,SQLProvider))
        //    {
        //        listOfData =await objDL.Top5BannerResponses(FormId);
        //    }

        //    return Json(listOfData);
        //}
        [HttpPost]
        public async Task<JsonResult> GetFormMaxCountByReport([FromBody] Dashboard_GetFormMaxCountByReportDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            using (var objDL = DLFormDashboard.GetDLFormDashboard(objDto.AdsId,SQLProvider)) 
            {
                return Json(await objDL.GetMaxCount(FromDateTime, ToDateTime, objDto.EmbeddedFormOrPopUpFormOrTaggedForm, objDto.FormId));
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetFormByReport([FromBody] Dashboard_GetFormByReportDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            ArrayList data = new ArrayList() { FromDateTime, ToDateTime, objDto.EmbeddedFormOrPopUpFormOrTaggedForm, objDto.FormId };
            HttpContext.Session.SetString("GetFormByReport", JsonConvert.SerializeObject(data));
           
            List<MLFormDashboard> dashboardDetails = null;
            using (var objDL = DLFormDashboard.GetDLFormDashboard(objDto.AdsId,SQLProvider))
            {
                dashboardDetails =await objDL.GetFormByReport(objDto.OffSet, objDto.FetchNext, FromDateTime, ToDateTime, objDto.EmbeddedFormOrPopUpFormOrTaggedForm, objDto.FormId);
            }
            return Json(dashboardDetails);
        }
        [HttpPost]
        public async Task<JsonResult> GetFormDetailsByReport([FromBody] Dashboard_GetFormDetailsByReportDto objDto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                List<FormDetails> formsList = new List<FormDetails>();
                using (var objDLform = DLFormDashboard.GetDLFormDashboard(objDto.AdsId,SQLProvider))
                {
                    formsList =await objDLform.GetFormDetailsByReport(FromDateTime, ToDateTime, objDto.EmbeddedFormOrPopUpFormOrTaggedForm);
                }

                return Json(new { Data = formsList, MaxJsonLength= Int32.MaxValue });

            }
            return null;
        }
    }
}
