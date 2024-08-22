using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using P5GenralML;
using Plumb5.Areas.Dashboard.Dto;
using Plumb5.Areas.FacebookPage.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;

namespace Plumb5.Areas.FacebookPage.Controllers
{
    [Area("FacebookPage")]
    public class DashboardController : BaseController
    {
        public DashboardController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("Dashboard");
        }

        [OutputCache]
        [HttpPost]
        public async Task<JsonResult> GetDashboardDetails([FromBody] Dashboard_GetDashboardDetailsDto objDto)
        {
            HttpContext.Session.SetString("SelectedPageIndex", JsonConvert.SerializeObject(objDto.PageIndex));

            //string DataFolderPath = @"E:\P5Utilities\p5social\DIST\Dashboard_Data_Month.json";

            //string dashboarresponsedetails = string.Empty;
            //if (System.IO.File.Exists(DataFolderPath))
            //{
            //    dashboarresponsedetails = System.IO.File.ReadAllText(DataFolderPath);
            //}

            //return Json(dashboarresponsedetails, JsonRequestBehavior.AllowGet);

            bool Status = false;
            string dashboarresponsedetails = string.Empty;

            if (HttpContext.Session.GetString("FacebookToken") != null)
            {
                Status = true;
                p5FBManager p5fb = new p5FBManager(AllConfigURLDetails.KeyValueForConfig["FACEBOOKAPPID"].ToString(), AllConfigURLDetails.KeyValueForConfig["FACEBOOKSECRETKEY"].ToString());
                p5fb.initTokenJson(HttpContext.Session.GetString("FacebookToken").ToString());

                try
                {
                    p5FBManager.Page CurrPage = p5fb.pageList[objDto.PageIndex];
                    dashboarresponsedetails = p5fb.pageList[objDto.PageIndex].getInsights(objDto.TimeDuration);
                }
                catch (Exception ex)
                {
                    using (ErrorUpdation objError = new ErrorUpdation("GetFBDashboardDetails"))
                    {
                        objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "FacebookPage/Dashboard->GetDashboardDetails", ex.ToString(), false);
                    }
                }
            }
            return Json(new { Status = Status, dashboarddetails = dashboarresponsedetails });
        }

        public async Task<JsonResult> GetFacebookPages()
        {
            MLFacebookPages? fbPages = JsonConvert.DeserializeObject<MLFacebookPages>(HttpContext.Session.GetString("FacebookPages"));
            var SelectedPageIndex = HttpContext.Session.GetString("SelectedPageIndex") != null ? int.Parse(HttpContext.Session.GetString("SelectedPageIndex").ToString()) : 0;
            return Json(new { fbPages, SelectedPageIndex });
        }
        [HttpPost]
        public async Task<JsonResult> GetPageContent([FromBody] Dashboard_GetPageContentDto objDto)
        {
            bool Status = false;
            string fbpagecontent = string.Empty;

            if (HttpContext.Session.GetString("FacebookToken") != null)
            {
                Status = true;
                p5FBManager p5fb = new p5FBManager(AllConfigURLDetails.KeyValueForConfig["FACEBOOKAPPID"].ToString(), AllConfigURLDetails.KeyValueForConfig["FACEBOOKSECRETKEY"].ToString());
                p5fb.initTokenJson(HttpContext.Session.GetString("FacebookToken").ToString());
                try
                {
                    fbpagecontent = p5fb.pageList[objDto.PageIndex].getPageEmbed();
                }
                catch (Exception ex)
                {
                    using (ErrorUpdation objError = new ErrorUpdation("GetFBPageContent"))
                    {
                        objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "FacebookPage/Dashboard->GetFBPageContent", ex.ToString(), false);
                    }
                }
            }
            return Json(new { Status = Status, fbpagecontent = fbpagecontent });
        }
    }
}
