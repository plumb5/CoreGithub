using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using P5GenralML;
using Plumb5.Areas.FacebookPage.Dto;
using Plumb5.Areas.FacebookPage.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Globalization;

namespace Plumb5.Areas.FacebookPage.Controllers
{
    [Area("FacebookPage")]
    public class ScheduledPostsController : BaseController
    {
        public ScheduledPostsController(IConfiguration _configuration) : base(_configuration)
        { }
        string PlumbFbAppId = AllConfigURLDetails.KeyValueForConfig["FACEBOOKAPPID"].ToString();
        string PlumbFbSecretKey = AllConfigURLDetails.KeyValueForConfig["FACEBOOKSECRETKEY"].ToString();
        public ActionResult Index()
        {
            return View("ScheduledPosts");
        }

        [Log]
        [HttpPost]
        public async Task<ActionResult> PostFacebook([FromBody] ScheduledPosts_PostFacebookDto objDto)
        {
            string result = "";
            //DateTime GetPostDate = Convert.ToDateTime(PostDate);
            DateTime GetPostDate = DateTime.ParseExact(objDto.PostDate, "dd-MM-yyyy HH:mm:ss", CultureInfo.InvariantCulture);
            Models.p5FBManager p5fb = new Models.p5FBManager(PlumbFbAppId, PlumbFbSecretKey);
            //string newtknjson = p5fb.initTokenAccess(Request["accessToken"]);

            p5fb.initTokenJson(HttpContext.Session.GetString("FacebookToken").ToString());
            Models.p5FBManager.Page CurrPage = p5fb.pageList[objDto.PageIndex];

            if (objDto.Id == "0")
            {
                Models.p5FBManager.SchPost oSchPost = new Models.p5FBManager.SchPost(CurrPage.pgAccessToken, CurrPage.ID, GetPostDate, objDto.Message, objDto.Link);
                result = oSchPost.CreatePost();
            }
            else
            {
                Models.p5FBManager.SchPost oSchPost = new Models.p5FBManager.SchPost(CurrPage.pgAccessToken, CurrPage.ID, objDto.Id, GetPostDate, objDto.Message, objDto.Link);
                result = oSchPost.UpdatePost().ToString();
            }
            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { MailCampaign = mailCampaign, UserName = user.UserName }), LogMessage);
            return Json(new { result = result });
        }
        [HttpPost]
        public async Task<ActionResult> GetMetaTag([FromBody] ScheduledPosts_GetMetaTagDto objDto)
        {
            string data = Models.p5FBManager.getURLMetaTags(objDto.Link);
            return Json(new { PreviewData = data });
        }
        [HttpPost]
        public async Task<ActionResult> GetFacebookPages()
        {
            var fbPages = JsonConvert.DeserializeObject<List<MLFacebookPages>>(HttpContext.Session.GetString("FacebookPages"));
            var SelectedPageIndex = HttpContext.Session.GetString("SelectedPageIndex") != null ? int.Parse(HttpContext.Session.GetString("SelectedPageIndex").ToString()) : 0;
            return Json(new { fbPages, SelectedPageIndex });
        }
        [HttpPost]
        public async Task<ActionResult> GetScheduledPosts([FromBody] ScheduledPosts_GetScheduledPostsDto objDto)
        {
            HttpContext.Session.SetString("SelectedPageIndex", JsonConvert.SerializeObject(objDto.PageIndex));
            Models.p5FBManager p5fb = new Models.p5FBManager(PlumbFbAppId, PlumbFbSecretKey);
            p5fb.initTokenJson(HttpContext.Session.GetString("FacebookToken").ToString());
            var data = p5fb.pageList[objDto.PageIndex].getScheduledPosts();
            return Json(new { PostData = data });
        }
        [HttpPost]
        public async Task<ActionResult> DeleteScheduledPost([FromBody] ScheduledPosts_DeleteScheduledPostDto objDto)
        {
            Models.p5FBManager p5fb = new Models.p5FBManager(PlumbFbAppId, PlumbFbSecretKey);
            p5fb.initTokenJson(HttpContext.Session.GetString("FacebookToken").ToString());
            Models.p5FBManager.Page CurrPage = p5fb.pageList[objDto.PageIndex];
            Models.p5FBManager.SchPost oSchPost = new Models.p5FBManager.SchPost(CurrPage.pgAccessToken, objDto.Id);
            var result = oSchPost.DeletePost();
            return Json(new { Result = result });
        }
    }
}
