using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.MyProfile.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;

namespace Plumb5.Areas.MyProfile.Controllers
{
    [Area("MyProfile")]
    public class PasswordController : BaseController
    {
        public PasswordController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View();
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> UpdatePassword(PasswordReset model)
        {
            bool Status = false;
            string ErrorMessage = String.Empty;
            if (ModelState.IsValid)
            {
                if (model.NewPassword != model.ConfirmPassword)
                    ErrorMessage = "New password and confirm password shoud be same.";
                else
                {
                    if (HttpContext.Session.GetString("UserInfo") != null)
                    {
                        LoginInfo? loginInfo = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

                        List<BlackListPassword> blacklistednames = new List<BlackListPassword>();
                        using (var objDLacklist = DLBlackListPassword.GetDLBlackListPassword(SQLProvider))
                        {
                            blacklistednames = await objDLacklist.GetBlackListNameExists();
                        }
                        if (blacklistednames != null && blacklistednames.Count() > 0)
                        {
                            for (int i = 0; i < blacklistednames.Count(); i++)
                            {
                                if (model.NewPassword.ToLower().Contains(blacklistednames[i].BlackListName.ToLower().ToString()))
                                {
                                    ErrorMessage = "The new password entered does not meet the password policy requirements.";
                                    break;
                                }
                            }
                        }

                        if (loginInfo.UserId > 0)
                        {
                            UserInfo userDetials = new UserInfo();
                            using (var objUser = DLUserInfo.GetDLUserInfo(SQLProvider))
                            {
                                userDetials = await objUser.GetDetail(loginInfo.UserId);
                            }

                            if (Helper.VerifyHashedString(model.OldPassword, userDetials.Password))
                            {
                                if (Helper.VerifyHashedString(model.NewPassword, userDetials.Password))
                                    ErrorMessage = "The old password and new password are same, please enter different password.";
                                else
                                {
                                    using (var objUser = DLUserInfo.GetDLUserInfo(SQLProvider))
                                    {
                                        string NewPassword = Helper.GetHashedString(model.NewPassword);
                                        if (await objUser.UpdateFirstTimePasswordReset(loginInfo.UserId, NewPassword))
                                        {
                                            Status = true;
                                            ErrorMessage = "Changed Successfully. Please login and explore Plumb5.";
                                        }
                                        else
                                            ErrorMessage = "Please login again and try.";
                                    }
                                }
                            }
                            else
                                ErrorMessage = "The old password does not match.";
                        }
                    }
                    else
                        ErrorMessage = "Please login again and try.";
                }
            }
            else
                ErrorMessage = "Please enter all fields correctly.";
            return Json(new { Status = Status, ErrorMessage = ErrorMessage });
        }
    }
}
