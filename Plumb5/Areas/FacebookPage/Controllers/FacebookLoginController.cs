using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using Plumb5.Areas.FacebookPage.Dto;
using Plumb5.Areas.FacebookPage.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;

namespace Plumb5.Areas.FacebookPage.Controllers
{
    [Area("FacebookPage")]
    public class FacebookLoginController : BaseController
    {
        public FacebookLoginController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("FacebookLogin");
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveFacebookToken([FromBody] FacebookLogin_SaveFacebookTokenDto objDto)
        {
            bool Status = false;
            //FacebookToken fbToken = new FacebookToken();
            Models.FacebookLoginSetup loginToken = new Models.FacebookLoginSetup(objDto.AdsId);

            string PlumbFbAppId = AllConfigURLDetails.KeyValueForConfig["FACEBOOKAPPID"].ToString();
            string PlumbFbSecretKey = AllConfigURLDetails.KeyValueForConfig["FACEBOOKSECRETKEY"].ToString();

            Models.p5FBManager p5fb = new Models.p5FBManager(PlumbFbAppId, PlumbFbSecretKey);
            var getDbToken = loginToken.GetSavedToken(SQLProvider);
            var getToken = getDbToken.Result;
            //if Token JSON not available or First request call or token older than 30 days
            if (getToken == String.Empty && getToken.ToString().Length == 0)
            {
                if (objDto.RequestAccessToken != null)
                {
                    getToken = p5fb.initTokenAccess(objDto.RequestAccessToken);
                    if (getToken != null && getToken.Contains("LongAccessToken"))
                    {
                        loginToken.SaveToken(getToken, SQLProvider);
                        Status = true;
                    }
                }
            }
            //if JSON is present then call
            else
                p5fb.initTokenJson(getToken);

            HttpContext.Session.SetString("FacebookToken", JsonConvert.SerializeObject(getToken));
            HttpContext.Session.SetString("FacebookPages", JsonConvert.SerializeObject(loginToken.GetFacebookPages(p5fb)));

            return Json(Status);
        }
        [HttpPost]
        public async Task<JsonResult> GetFacebookAppId()
        {
            string Id = AllConfigURLDetails.KeyValueForConfig["FACEBOOKAPPID"].ToString();
            return Json(Id);
        }
        [HttpPost]
        public async Task<JsonResult> GetFacebookSecretKey()
        {
            string key = AllConfigURLDetails.KeyValueForConfig["FACEBOOKAPPID"].ToString();
            return Json(key);
        }
    }
}
