using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.MyProfile.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;

namespace Plumb5.Areas.MyProfile.Controllers
{
    [Area("MyProfile")]
    public class GoogleTagManagerController : BaseController
    {
        public GoogleTagManagerController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View();
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> GetGoogleAccessToken([FromBody] GoogleTagManager_GetGoogleAccessTokenDto details)
        {
            bool Result = false;
            GoogleTagManagerAccessToken accesstoken = null;
            using (var p5gapi = new P5GAPIManager())
                accesstoken = p5gapi.getAccessToken(details.code);

            if (accesstoken != null)
            {
                using (var obj = DLGoogleToken.GetDLGoogleToken(details.accountId, SQLProvider))
                {
                    var Id = await obj.Save(new GoogleToken { AccessToken = accesstoken.access_token });
                    if (Id > 0)
                        Result = true;
                    else
                        Result = false;
                }
            }
            return Json(Result);
        }

        [HttpPost]
        public async Task<JsonResult> GetGoogleAccount([FromBody] GoogleTagManager_GetGoogleAccountDto details)
        {
            string response = string.Empty;
            GoogleToken googleToken = null;
            using (var obj = DLGoogleToken.GetDLGoogleToken(details.accountId, SQLProvider))
            {
                googleToken = await obj.Get();

                if (googleToken != null)
                {
                    using (var p5gapi = new P5GAPIManager())
                    {
                        response = p5gapi.getGTMAccounts(googleToken.AccessToken);
                    }
                }
            }
            return Json(response);
        }

        [HttpPost]
        public async Task<JsonResult> GetGoogleContainers([FromBody] GoogleTagManager_GetGoogleContainersDto details)
        {
            string response = string.Empty;
            GoogleToken googleToken = null;
            using (var obj = DLGoogleToken.GetDLGoogleToken(details.accountId, SQLProvider))
            {
                googleToken = await obj.Get();

                if (googleToken != null)
                {
                    using (var p5gapi = new P5GAPIManager())
                    {
                        response = p5gapi.getGTMContainers(details.accountpath, googleToken.AccessToken);
                    }
                }
            }
            return Json(response);
        }

        [HttpPost]
        public async Task<JsonResult> GetGoogleWorkSpace([FromBody] GoogleTagManager_GetGoogleWorkSpaceDto details)
        {
            string response = string.Empty;
            GoogleToken googleToken = null;
            using (var obj = DLGoogleToken.GetDLGoogleToken(details.accountId, SQLProvider))
            {
                googleToken = await obj.Get();

                if (googleToken != null)
                {
                    using (var p5gapi = new P5GAPIManager())
                    {
                        response = p5gapi.getGTMWorkSpace(details.containerpath, googleToken.AccessToken);
                    }
                }
            }
            return Json(response);
        }

        [HttpPost]
        public async Task<JsonResult> GetGoogleTags([FromBody] GoogleTagManager_GetGoogleTagsDto details)
        {
            string response = string.Empty;
            GoogleToken googleToken = null;
            using (var obj = DLGoogleToken.GetDLGoogleToken(details.accountId, SQLProvider))
            {
                googleToken = await obj.Get();

                if (googleToken != null)
                {
                    using (var p5gapi = new P5GAPIManager())
                    {
                        response = p5gapi.getGTMTags(details.workspcpath, googleToken.AccessToken);
                    }
                }
            }
            return Json(response);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> AddPlumb5Tag([FromBody] GoogleTagManager_AddPlumb5TagDto details)
        {
            string response = string.Empty;
            GoogleToken googleToken = null;
            using (var obj = DLGoogleToken.GetDLGoogleToken(details.accountId, SQLProvider))
            {
                googleToken = await obj.Get();

                if (googleToken != null)
                {
                    using (var p5gapi = new P5GAPIManager())
                    {
                        string plumb5Script = "<script type='text/javascript'>(function () { var p5 = document.createElement('script'); p5.type = 'text/javascript'; p5.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'src.plumb5.com/[{*scriptname*}]'; var p5s = document.getElementsByTagName('script')[0]; p5s.parentNode.insertBefore(p5, p5s); })();</script>".Replace("[{*scriptname*}]", details.domainName);

                        response = p5gapi.addPlumb5Tag(details.workspcpath, details.sTagName, plumb5Script, googleToken.AccessToken);
                    }
                }
            }
            return Json(response);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> DeletePlumb5Tag([FromBody] GoogleTagManager_DeletePlumb5TagDto details)
        {
            string response = string.Empty;
            GoogleToken googleToken = null;
            using (var obj = DLGoogleToken.GetDLGoogleToken(details.accountId, SQLProvider))
            {
                googleToken = await obj.Get();

                if (googleToken != null)
                {
                    using (var p5gapi = new P5GAPIManager())
                    {
                        response = p5gapi.deletePlumb5Tag(details.Tagpath, googleToken.AccessToken);
                    }
                }
            }
            return Json(response);
        }
    }
}
