using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Models;
using Plumb5GenralFunction;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace Plumb5.Controllers
{
    public class LoginController : Controller
    {
        private readonly string? SQLProvider;
        public LoginController(IConfiguration _configuration)
        {
            SQLProvider = _configuration["SqlProvider"];
        }

        //
        // GET: /Login/

        public ActionResult Index()
        {
            //clearSessions();
            bool checkLicense = true; // P5License.CheckLicense();
            if (checkLicense)
                return View("Login");
            else
            {
                return RedirectToAction("Index", "Licensing");
            }
        }

        // [HttpPost]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Index(RegisterModel model, string ReturnUrl)
        {
            bool IsAuthanticate = false;
            try
            {
                if (Request.Cookies[".ASPXAUTH"] != null && Request.Cookies[".ASPXAUTH"] != null && !string.IsNullOrEmpty(Request.Cookies[".ASPXAUTH"]) && Request.Cookies["PID_SSID"] != null && Request.Cookies["PID_SSID"].Length > 0)
                {
                    return RedirectToAction("Index", "Login", new { IsLogin = false });
                }

                if (Request.Cookies["PID_SSID"] != null && Request.Cookies["PID_SSID"] != null && !string.IsNullOrEmpty(Request.Cookies["PID_SSID"]) && Request.Cookies["PID_SSID"].Length > 0)
                {
                    HttpContext.Response.Cookies.Append("PID_SSID", "");
                }

                if (!String.IsNullOrEmpty(model.HDEmailId) && !String.IsNullOrEmpty(model.HDPassword))
                {
                    model.EmailId = AESEncrytDecry.DecryptStringAES(model.HDEmailId);
                    model.Password = AESEncrytDecry.DecryptStringAES(model.HDPassword);

                    if (String.IsNullOrEmpty(model.EmailId) || !Helper.IsValidEmailAddress(model.EmailId))
                    {
                        ViewBag.ErrorMessage = "Email is not valid";
                        return View("Login");
                    }

                    if (String.IsNullOrEmpty(model.Password))
                    {
                        ViewBag.ErrorMessage = "Password is not valid";
                        return View("Login");
                    }

                    var objBLUserInfo = DLUserInfo.GetDLUserInfo(SQLProvider);
                    UserInfo? userInfo = await objBLUserInfo.GetDetail(model.EmailId);
                    bool IsValidUser = false;
                    UserInValidLogin? userInValidLogin = new UserInValidLogin();
                    if (userInfo != null && !String.IsNullOrEmpty(userInfo.Password) && userInfo.UserId > 0)
                    {
                        IsValidUser = Helper.VerifyHashedString(model.Password, userInfo.Password);
                        IsAuthanticate = IsValidUser;
                        userInValidLogin.UserInfoUserId = userInfo.UserId;
                        using (var objBL = DLUserInValidLogin.GetDLUserInValidLogin(SQLProvider))
                        {
                            userInValidLogin = await objBL.GetDetail(userInValidLogin);
                        }
                    }
                    if (userInfo == null)
                    {
                        ViewBag.ErrorMessage = "Invalid Credentials";
                    }
                    else if (userInfo.UserId > 0 && !userInfo.ActiveStatus)
                    {
                        ViewBag.ErrorMessage = "Your account is not active";
                    }
                    else if (userInValidLogin != null && userInValidLogin.IsLocked == true && userInValidLogin.InValidLoginDate.Value.AddHours(1) >= DateTime.Now)
                    {
                        ViewBag.ErrorMessage = "Invalid Credentials";
                    }
                    else if (!IsValidUser)
                    {
                        ViewBag.ErrorMessage = "Invalid Credentials";
                        using (var objBL = DLUserInValidLogin.GetDLUserInValidLogin(SQLProvider))
                        {
                            userInValidLogin = await objBL.Save(new UserInValidLogin() { UserInfoUserId = userInfo.UserId });
                        }
                        if (userInValidLogin != null && userInValidLogin.IsLocked == true && userInValidLogin.InValidLoginCount == 5)
                        {
                            try
                            {
                                StringBuilder MailBody = new StringBuilder();
                                string TemplatePath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\Template\\UserAccountLock.htm";
                                if (System.IO.File.Exists(TemplatePath))
                                {
                                    using (StreamReader reader = System.IO.File.OpenText(TemplatePath))
                                    {
                                        MailBody.Append(reader.ReadToEnd());
                                        reader.Close();
                                    }
                                    MailBody = MailBody.Replace("&lt;", "<").Replace("&gt;", ">").Replace("&amp;", "&");
                                    var OnlineUrl = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"].ToString();

                                    StringBuilder data = new StringBuilder();
                                    data.Clear().Append(Regex.Replace(MailBody.ToString(), "<!--OnlineUrl-->", OnlineUrl));
                                    MailBody.Clear().Append(data);

                                    data.Clear().Append(Regex.Replace(MailBody.ToString(), "<!--CLIENTLOGO_ONLINEURL-->", AllConfigURLDetails.KeyValueForConfig["CLIENTLOGO_ONLINEURL"].ToString()));
                                    MailBody.Clear().Append(data);

                                    using (MailMessage mailMsg = new MailMessage())
                                    {
                                        mailMsg.To.Add(userInfo.EmailId);
                                        mailMsg.Subject = "Plumb5 Account Locked";
                                        mailMsg.Body = MailBody.ToString();
                                        mailMsg.IsBodyHtml = true;
                                        //Helper.SendMail(mailMsg);
                                    }
                                }
                            }
                            catch { }
                        }
                    }
                    else if (userInfo.UserId > 0)
                    {
                        if (IsAuthanticate)
                        {
                            HttpContext.Session.SetString("userInfo", JsonConvert.SerializeObject(userInfo));
                            return RedirectToAction("GoToMyAccounts", "Login", new { GetReturnUrl = ReturnUrl, ReturnAccountId = 0 });
                        }
                        //System.Web.Helpers.AntiForgery.Validate();

                    }
                    return View("Login");
                }
                else
                {
                    ViewBag.ErrorMessage = "Enter email id and password";
                    return View("Login");
                }
            }
            catch (Exception ex)
            {
                ViewBag.ErrorMessage = "Invalid Credentials";
                return View("Login");
            }
        }

        public async Task<ActionResult> GoToMyAccounts(string GetReturnUrl, int ReturnAccountId)
        {
            try
            {
                //UserInfo userInfo = TempData["userInfo"] as UserInfo;

                UserInfo? userInfo = JsonConvert.DeserializeObject<UserInfo>(HttpContext.Session.GetString("userInfo"));

                TempData["userInfo"] = null;
                using (var objDL = DLUserInValidLogin.GetDLUserInValidLogin(SQLProvider))
                {
                    await objDL.Delete(userInfo.UserId);
                }
                var objDLUserInfo = DLUserInfo.GetDLUserInfo(SQLProvider);
                //FormsAuthentication.SetAuthCookie(userInfo.EmailId, true);
                List<Groups> Groups = await objDLUserInfo.Groups(userInfo.UserId);
                LoginInfo logIn = new LoginInfo() { UserId = userInfo.UserId, UserName = userInfo.FirstName, EmailId = userInfo.EmailId, IsSuperAdmin = Convert.ToInt32(userInfo.IsAdmin), FirstTimePasswordReset = userInfo.FirstTimePasswordReset, UserAccountType = userInfo.UserAccountType, PreferredAccountId = userInfo.PreferredAccountId };
                logIn.UserGroupIdList = Groups.Select(x => x.UserGroupId).ToList();

                try
                {
                    if (Request.Cookies["PID_SSID"] != null && Request.Cookies["PID_SSID"] != null && !string.IsNullOrEmpty(Request.Cookies["PID_SSID"]) && Request.Cookies["PID_SSID"].Length > 0)
                    {
                        //HttpCookie authCookie = Request.Cookies[FormsAuthentication.FormsCookieName];
                        //if (authCookie != null && !string.IsNullOrEmpty(authCookie.Value))
                        //{
                        //    UserSession userSession = new UserSession();
                        //    userSession.UserInfoUserId = logIn.UserId;
                        //    userSession.SessionId = Request.Cookies["PID_SSID"].Value;
                        //    userSession.AuthValue = authCookie.Value;
                        //    userSession.SecureKey = Security.GenerateSecureKey();

                        //    using (DLUserSession objDL = new DLUserSession())
                        //    {
                        //        int result = objDL.Save(userSession);
                        //    }
                        //}
                    }
                }
                catch
                {
                    //
                }

                HttpContext.Session.SetString("UserInfo", JsonConvert.SerializeObject(logIn));

                if (!logIn.FirstTimePasswordReset)
                {
                    return RedirectToAction("UserFirstLogin", "Login");
                }
                else
                {
                    MyAccountsDetails myAccount = new MyAccountsDetails(SQLProvider);
                    await myAccount.GetInformationForHome(logIn.UserId);

                    if (myAccount == null || myAccount.accounts == null || myAccount.accounts.Count == 0)
                    {
                        return RedirectToAction("NoAccountAssigned", "Login");
                    }
                    else
                    {
                        myAccount.accounts = myAccount.accounts.OrderBy(x => x.AccountId).ToList();
                        DomainInfo domainInfo = new DomainInfo();
                        if (ReturnAccountId > 0 && myAccount.accounts.Any(x => x.AccountId == ReturnAccountId))
                        {
                            Account accountsDetails = myAccount.accounts.Where(x => x.AccountId == ReturnAccountId).First();
                            domainInfo = new DomainInfo()
                            {
                                AdsId = accountsDetails.AccountId,
                                AccountName = accountsDetails.AccountName,
                                DomainName = accountsDetails.DomainName,
                                AccessType = "0",
                                TrackerDomain = accountsDetails.TrackerDomain,
                                Timezone = accountsDetails.Timezone,
                                Connection = accountsDetails.Connection
                            };
                        }
                        else
                        {
                            if (userInfo.PreferredAccountId == 0)
                            {
                                using (var objDL = DLUserInfo.GetDLUserInfo(SQLProvider))
                                {
                                    await objDL.UpdatePreferredAccountId(myAccount.accounts[0].AccountId, userInfo.UserId);
                                }

                                logIn.PreferredAccountId = myAccount.accounts[0].AccountId;

                                domainInfo = new DomainInfo()
                                {
                                    AdsId = myAccount.accounts[0].AccountId,
                                    AccountName = myAccount.accounts[0].AccountName,
                                    DomainName = myAccount.accounts[0].DomainName,
                                    AccessType = "0",
                                    TrackerDomain = myAccount.accounts[0].TrackerDomain,
                                    Timezone = myAccount.accounts[0].Timezone,
                                    Connection = myAccount.accounts[0].Connection
                                };
                            }
                            else
                            {
                                if (myAccount.accounts.Any(x => x.AccountId == userInfo.PreferredAccountId))
                                {
                                    Account accountsDetails = myAccount.accounts.Where(x => x.AccountId == userInfo.PreferredAccountId).First();
                                    domainInfo = new DomainInfo()
                                    {
                                        AdsId = accountsDetails.AccountId,
                                        AccountName = accountsDetails.AccountName,
                                        DomainName = accountsDetails.DomainName,
                                        AccessType = "0",
                                        TrackerDomain = accountsDetails.TrackerDomain,
                                        Timezone = accountsDetails.Timezone,
                                        Connection = accountsDetails.Connection
                                    };
                                }
                                else
                                {
                                    domainInfo = new DomainInfo()
                                    {
                                        AdsId = myAccount.accounts[0].AccountId,
                                        AccountName = myAccount.accounts[0].AccountName,
                                        DomainName = myAccount.accounts[0].DomainName,
                                        AccessType = "0",
                                        TrackerDomain = myAccount.accounts[0].TrackerDomain,
                                        Timezone = myAccount.accounts[0].Timezone,
                                        Connection = myAccount.accounts[0].Connection
                                    };
                                }
                            }
                        }

                        Groups = await objDLUserInfo.GroupsbyAccountId(logIn.UserId, domainInfo.AdsId);
                        logIn.UserGroupIdList = Groups.Select(x => x.UserGroupId).ToList();

                        await myAccount.GetAccountDetails(logIn.UserId, domainInfo.AdsId);
                        //myAccount.GetFeatutrInfo(domainInfo.AdsId);
                        await myAccount.GetPermissionsbyAcountId(logIn.UserId, domainInfo.AdsId);

                        ViewBag.UserInfoUserIDEncrpted = EncryptDecrypt.Encrypt(logIn.UserId.ToString());


                        HttpContext.Session.SetString("UserInfo", JsonConvert.SerializeObject(logIn));
                        HttpContext.Session.SetString("MyAccountsDetails", JsonConvert.SerializeObject(myAccount));
                        HttpContext.Session.SetString("MyPermission", JsonConvert.SerializeObject(myAccount.UserPermission));
                        HttpContext.Session.SetString("MySubPermission", JsonConvert.SerializeObject(myAccount.UserSubPermission));
                        HttpContext.Session.SetString("PermissionsLevels" + logIn.UserId.ToString(), JsonConvert.SerializeObject(myAccount.UserPermission));
                        HttpContext.Session.SetString("PermissionsSubLevels" + logIn.UserId.ToString(), JsonConvert.SerializeObject(myAccount.UserSubPermission));
                        HttpContext.Session.SetString("AccountInfo", JsonConvert.SerializeObject(domainInfo));
                        HttpContext.Session.SetString("MLPurchase", JsonConvert.SerializeObject(myAccount.purchaseLists));
                        //return RedirectToAction("AccountDashBoard", "Account");

                        //here we are redirecting to publisher page based on user id login and if it is superadmin we will not redirect to publisher page
                        try
                        {
                            if (logIn.IsSuperAdmin <= 0)
                            {
                                string encryptvalue = await AccountDetails.GetEncryptedValueAccountId(domainInfo.AdsId, logIn.UserId, SQLProvider);

                                if (!string.IsNullOrEmpty(encryptvalue))
                                {
                                    return RedirectToAction("Publisher", "Prospect", new
                                    {
                                        value = encryptvalue
                                    });
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            ViewBag.ErrorMessage = "Invalid Publisher Details";
                            return RedirectToAction("Index", "Login");
                        }

                        if (!string.IsNullOrEmpty(GetReturnUrl))
                        {
                            return Redirect("../" + GetReturnUrl);
                        }
                        else
                        {
                            Tuple<string, string> tuple = GetRedirectPermissionedPage(myAccount.UserPermission);
                            //return RedirectToAction("DashboardOverview", "Dashboard");
                            return RedirectToAction(tuple.Item1, tuple.Item2);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                ViewBag.ErrorMessage = "Invalid Credentials";
                return RedirectToAction("Index", "Login");
            }
        }

        public ActionResult UserFirstLogin()
        {
            return View("UserFirstLogin");
        }

        public ActionResult NoAccountAssigned()
        {
            return View("NoAccountAssigned");
        }

        public JsonResult AccessDenied()
        {
            Response.StatusCode = 201;
            return Json(new { Status = false, Message = "Access Denied" });
        }

        public async Task<ActionResult> SignOut()
        {
            await clearSessions();
            return Redirect("~/Login");
        }
        private async Task clearSessions()
        {
            try
            {
                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                HttpContext.Session.Clear();
                Response.Cookies.Delete("PID_SSID");
            }
            catch
            {
                Response.Redirect("~/Login");
            }
        }
        
        [HttpPost]
        public async Task<IActionResult> PreLogin(string UserIdString, string AccountId)
        {
            try
            {
                UserIdString = Helper.Decrypt(UserIdString);
                int UserId = int.Parse(UserIdString);
                int ReturnAccountId = int.Parse(Helper.Decrypt(AccountId));
                using var objDLUserInfo = DLUserInfo.GetDLUserInfo(SQLProvider);
                UserInfo? userInfo = await objDLUserInfo.GetDetail(UserId);
                if (userInfo != null && userInfo.UserId > 0)
                {
                    TempData["userInfo"] = userInfo;
                    return RedirectToAction("GoToMyAccounts", "Login", new { GetReturnUrl = "", ReturnAccountId = ReturnAccountId });
                }
                return View("Login");
            }
            catch
            {
                ViewBag.ErrorMessage = "Invalid Credentials";
                return View("Login");
            }
        }

        //public ActionResult AccountRedirect(string UserIdString, string AccountId)
        //{
        //    try
        //    {
        //        UserIdString = Helper.Base64Decode(UserIdString);
        //        int UserId = int.Parse(UserIdString);

        //        AccountId = Helper.Base64Decode(AccountId);
        //        int ReturnAccountId = int.Parse(AccountId);

        //        DLUserInfo objDLUserInfo = new DLUserInfo();
        //        UserInfo userInfo = objDLUserInfo.GetDetail(UserId);
        //        if (userInfo != null && userInfo.UserId > 0)
        //        {
        //            TempData["userInfo"] = userInfo;
        //            return RedirectToAction("GoToMyAccounts", "Login", new { GetReturnUrl = "", ReturnAccountId = ReturnAccountId });
        //        }
        //        return View("Login");
        //    }
        //    catch
        //    {
        //        ViewBag.ErrorMessage = "Invalid Credentials";
        //        return View("Login");
        //    }
        //}

        //[HttpPost]
        //public ActionResult UserFirstLogin(UserFirstPassword userFirstPassword)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        if (userFirstPassword.NewPassword != userFirstPassword.ConfirmPassword)
        //        {
        //            ViewBag.Result = "False";
        //            ViewBag.ErrorMessage = "password and confirm password shoud be same.";
        //        }
        //        else
        //        {
        //            if (Session["UserInfo"] != null)
        //            {
        //                LoginInfo loginIfno = (LoginInfo)Session["UserInfo"];

        //                List<BlackListPassword> blacklistednames = new List<BlackListPassword>();

        //                using (DLBlackListPassword objDLacklist = new DLBlackListPassword())
        //                {
        //                    blacklistednames = objDLacklist.GetBlackListNameExists();
        //                }

        //                if (blacklistednames != null && blacklistednames.Count() > 0)
        //                {
        //                    for (int i = 0; i < blacklistednames.Count(); i++)
        //                    {
        //                        if (userFirstPassword.NewPassword.ToLower().Contains(blacklistednames[i].BlackListName.ToLower().ToString()))
        //                        {
        //                            ViewBag.ErrorMessage = "The new password entered does not meet the password policy requirements.";
        //                            break;
        //                        }
        //                    }
        //                }

        //                using (DLUserInfo objUser = new DLUserInfo())
        //                {
        //                    string NewPassword = Helper.GetHashedString(userFirstPassword.NewPassword);
        //                    loginIfno.FirstTimePasswordReset = objUser.UpdateFirstTimePasswordReset(loginIfno.UserId, NewPassword);
        //                    Session["UserInfo"] = loginIfno;
        //                    if (loginIfno.FirstTimePasswordReset)
        //                    {
        //                        ViewBag.Result = "True";
        //                        ViewBag.ErrorMessage = "Changed Successfully. Please login and explore Plumb5.";
        //                    }
        //                    else
        //                    {
        //                        ViewBag.Result = "False";
        //                        ViewBag.ErrorMessage = "Please login again and try.";
        //                    }
        //                }
        //            }
        //            else
        //            {
        //                ViewBag.Result = "False";
        //                ViewBag.ErrorMessage = "Please login again and try.";
        //            }
        //        }
        //        return View("UserFirstLogin");
        //    }
        //    else
        //    {
        //        return View(userFirstPassword);
        //    }
        //}

        private Tuple<string, string> GetRedirectPermissionedPage(PermissionsLevels permissionsLevels)
        {
            string ControllerName = string.Empty, ControllMethodName = String.Empty;
            try
            {
                if (permissionsLevels != null && !permissionsLevels.IsSuperAdmin)
                {
                    if (permissionsLevels.Dashboard || permissionsLevels.DashboardHasFullControl || permissionsLevels.DashboardView || permissionsLevels.DashboardContribute || permissionsLevels.DashboardGuest || permissionsLevels.DashboardDesign)
                    {
                        ControllMethodName = "DashboardOverview";
                        ControllerName = "Dashboard";
                    }
                    else if (permissionsLevels.Contacts || permissionsLevels.ContactsHasFullControl || permissionsLevels.ContactsView || permissionsLevels.ContactsContribute || permissionsLevels.ContactsGuest || permissionsLevels.ContactsDesign)
                    {
                        ControllMethodName = "Contact";
                        ControllerName = "ManageContact";
                    }
                    else if (permissionsLevels.Analytics || permissionsLevels.AnalyticsHasFullControl || permissionsLevels.AnalyticsView || permissionsLevels.AnalyticsContribute || permissionsLevels.AnalyticsGuest || permissionsLevels.AnalyticsDesign)
                    {
                        ControllMethodName = "Dashboard/Visits";
                        ControllerName = "Analytics";
                    }
                    else if (permissionsLevels.Forms || permissionsLevels.FormsHasFullControl || permissionsLevels.FormsView || permissionsLevels.FormsContribute || permissionsLevels.FormsGuest || permissionsLevels.FormsDesign)
                    {
                        ControllMethodName = "Dashboard";
                        ControllerName = "CaptureForm";
                    }
                    else if (permissionsLevels.WebPushNotification || permissionsLevels.WebPushNotificationHasFullControl || permissionsLevels.WebPushNotificationView || permissionsLevels.WebPushNotificationContribute || permissionsLevels.WebPushNotificationGuest || permissionsLevels.WebPushNotificationDesign)
                    {
                        ControllMethodName = "Dashboard";
                        ControllerName = "WebPush";
                    }
                    else if (permissionsLevels.EmailMarketing || permissionsLevels.EmailMarketingHasFullControl || permissionsLevels.EmailMarketingView || permissionsLevels.EmailMarketingContribute || permissionsLevels.EmailMarketingGuest || permissionsLevels.EmailMarketingDesign)
                    {
                        ControllMethodName = "MailDashboard";
                        ControllerName = "Mail";
                    }
                    else if (permissionsLevels.SMS || permissionsLevels.SMSHasFullControl || permissionsLevels.SMSView || permissionsLevels.SMSContribute || permissionsLevels.SMSGuest || permissionsLevels.SMSDesign)
                    {
                        ControllMethodName = "SmsDashboard";
                        ControllerName = "Sms";
                    }
                    else if (permissionsLevels.SiteChat || permissionsLevels.SiteChatHasFullControl || permissionsLevels.SiteChatView || permissionsLevels.SiteChatContribute || permissionsLevels.SiteChatGuest || permissionsLevels.SiteChatDesign)
                    {
                        ControllMethodName = "Dashboard";
                        ControllerName = "Chat";
                    }
                    else if (permissionsLevels.LeadManagement || permissionsLevels.LeadManagementHasFullControl || permissionsLevels.LeadManagementView || permissionsLevels.LeadManagementContribute || permissionsLevels.LeadManagementDesign || permissionsLevels.LeadManagementGuest)
                    {
                        ControllMethodName = "Dashboard";
                        ControllerName = "Prospect";
                    }
                    else if (permissionsLevels.Mobile || permissionsLevels.MobileHasFullControl || permissionsLevels.MobileView || permissionsLevels.MobileContribute || permissionsLevels.MobileDesign || permissionsLevels.MobileGuest)
                    {
                        ControllMethodName = "MobileApp/Visits";
                        ControllerName = "MobileAnalytics";
                    }
                    else if (permissionsLevels.MobilePushNotification || permissionsLevels.MobilePushNotificationHasFullControl || permissionsLevels.MobilePushNotificationView || permissionsLevels.MobilePushNotificationContribute || permissionsLevels.MobilePushNotificationDesign || permissionsLevels.MobilePushNotificationGuest)
                    {
                        ControllMethodName = "Dashboard";
                        ControllerName = "MobilePushNotification";
                    }
                    else if (permissionsLevels.MobileEngagement || permissionsLevels.MobileEngagementHasFullControl || permissionsLevels.MobileEngagementView || permissionsLevels.MobileEngagementContribute || permissionsLevels.MobileEngagementDesign || permissionsLevels.MobileEngagementGuest)
                    {
                        ControllMethodName = "DashBoard";
                        ControllerName = "MobileInApp";
                    }
                    else if (permissionsLevels.Social || permissionsLevels.SocialHasFullControl || permissionsLevels.SocialView || permissionsLevels.SocialContribute || permissionsLevels.SocialDesign || permissionsLevels.SocialGuest)
                    {
                        ControllMethodName = "Dashboard";
                        ControllerName = "FacebookPage";
                    }
                    else if (permissionsLevels.WorkFlow || permissionsLevels.WorkFlowHasFullControl || permissionsLevels.WorkFlowView || permissionsLevels.WorkFlowContribute || permissionsLevels.WorkFlowDesign || permissionsLevels.WorkFlowGuest)
                    {
                        ControllMethodName = "Workflows";
                        ControllerName = "Journey";
                    }
                    else if (permissionsLevels.Segmentation || permissionsLevels.SegmentationHasFullControl || permissionsLevels.SegmentationView || permissionsLevels.SegmentationContribute || permissionsLevels.SegmentationDesign || permissionsLevels.SegmentationGuest)
                    {
                        ControllMethodName = "CreateSegment";
                        ControllerName = "SegmentBuilder";
                    }
                }
                else
                {
                    ControllMethodName = "DashboardOverview";
                    ControllerName = "Dashboard";

                }
            }
            catch (Exception ex)
            {
                ControllMethodName = "DashboardOverview";
                ControllerName = "Dashboard";
            }

            return Tuple.Create(ControllMethodName, ControllerName);
        }
    }
}
