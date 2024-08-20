using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.MyProfile.Dto;
using Plumb5.Controllers;

namespace Plumb5.Areas.MyProfile.Controllers
{
    [Area("MyProfile")]
    public class ProfileController : BaseController
    {
        public ProfileController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("Profile");
        }

        [HttpPost]
        public async Task<JsonResult> GetUserDetails([FromBody] Profile_GetUserDetailsDto details)
        {
            UserInfo userInfo = new UserInfo();
            using (var objDLUserInfo = DLUserInfo.GetDLUserInfo(SQLProvider))
            {
                userInfo = await objDLUserInfo.GetDetail(details.UserId);
            }
            return Json(userInfo);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> UpdateProfileDetails([FromBody] Profile_UpdateProfileDetailsDto details)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                details.userInfo.LastModifiedByUserId = details.LoginUserId;

                user.UserName = details.userInfo.FirstName;
                user.EmailId = details.userInfo.EmailId;
                HttpContext.Session.SetString("UserInfo", JsonConvert.SerializeObject(user));

                if (details.userInfo.UserId <= 0)
                    details.userInfo.UserId = details.LoginUserId;

                using (var objDLUserInfo = DLUserInfo.GetDLUserInfo(SQLProvider))
                {
                    return Json(await objDLUserInfo.UpdateDetails(details.userInfo));
                }
            }
            return null;
        }
    }
}
