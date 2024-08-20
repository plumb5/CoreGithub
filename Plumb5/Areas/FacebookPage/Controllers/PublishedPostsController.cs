using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using P5GenralML;
using Plumb5.Areas.FacebookPage.Dto;
using Plumb5.Areas.FacebookPage.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;

namespace Plumb5.Areas.FacebookPage.Controllers
{
    [Area("FacebookPage")]
    public class PublishedPostsController : BaseController
    {
        public PublishedPostsController(IConfiguration _configuration) : base(_configuration)
        { }

        string PlumbFbAppId = AllConfigURLDetails.KeyValueForConfig["FACEBOOKAPPID"].ToString();
        string PlumbFbSecretKey = AllConfigURLDetails.KeyValueForConfig["FACEBOOKSECRETKEY"].ToString();
        public ActionResult Index()
        {
            return View("PublishedPosts");
        }
        [HttpPost]
        public async Task<ActionResult> GetFacebookPages()
        {
            var fbPages = JsonConvert.DeserializeObject<List<MLFacebookPages>>(HttpContext.Session.GetString("FacebookPages"));
            var SelectedPageIndex = HttpContext.Session.GetString("SelectedPageIndex") != null ? int.Parse(HttpContext.Session.GetString("SelectedPageIndex").ToString()) : 0;
            return Json(new { fbPages, SelectedPageIndex });
        }
        [HttpPost]
        public async Task<ActionResult> GetMaxCount([FromBody] PublishedPosts_GetMaxCountDto objDto)
        {
            HttpContext.Session.SetString("SelectedPageIndex", JsonConvert.SerializeObject(objDto.PageIndex));
            Models.p5FBManager p5fb = new Models.p5FBManager(PlumbFbAppId, PlumbFbSecretKey);
            p5fb.initTokenJson(HttpContext.Session.GetString("FacebookToken").ToString());
            var data = p5fb.pageList[objDto.PageIndex].getPublishedPosts(objDto.Duration);

            var PostList = JsonConvert.DeserializeObject <MLFacebookPost[] >(data);
            HttpContext.Session.SetString("ScheduledPosts", JsonConvert.SerializeObject(PostList)); 
            return Json(new
            {
                PostList.ToList().Count
            });
        }
        [HttpPost]
        public async Task<JsonResult> GetScheduledPosts([FromBody] PublishedPosts_GetScheduledPostsDto objDto)
        {
            var PostList = JsonConvert.DeserializeObject<MLFacebookPost[]>(HttpContext.Session.GetString("FacebookToken"));
            var finalPostList = PostList.Skip(objDto.OffSet).Take(objDto.FetchNext).ToList();

            //var newData=JsonConvert.DeserializeObject<FacebookPost>(data);
            return Json(finalPostList);
        }
        [HttpPost]
        public async Task<JsonResult> GetPostPreview([FromBody] PublishedPosts_GetPostPreviewDto objDto)
        {
            Models.p5FBManager p5fb = new Models.p5FBManager(PlumbFbAppId, PlumbFbSecretKey);
            p5fb.initTokenJson(HttpContext.Session.GetString("FacebookToken").ToString());
            Models.p5FBManager.Page CurrPage = p5fb.pageList[objDto.PageIndex];
            Models.p5FBManager.PubPost oPubPost = new Models.p5FBManager.PubPost(CurrPage.pgAccessToken, objDto.PostLink);

            var data = oPubPost.getPostEmbedHTML();

            return Json(new { PreviewData = data });
        }

    }
}
