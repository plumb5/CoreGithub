using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5GenralFunction;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Microsoft.Extensions.Configuration;

namespace Plumb5.Controllers
{
    public class BaseController : Controller
    {
        public readonly string? SQLProvider; 
        public BaseController(IConfiguration _configuration)
        {
            SQLProvider = _configuration["SqlProvider"]; 
        }

        //public override async void OnActionExecuting(ActionExecutingContext filterContext)
        //{
        //    if (HttpContext.Session.GetString("UserInfo") != null && HttpContext.Session.GetString("AccountInfo") != null)
        //    {
        //        DomainInfo? domainInfo = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
        //        LoginInfo? userInfo = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

        //        //Adding as UserGroupIdList not coming in engagement build
        //        using var objDLUserInfo = DLUserInfo.GetDLUserInfo(SQLProvider);
        //        #region UserBindingByHierarchy
        //        List<MLUserHierarchy> userHierarchyList = new List<MLUserHierarchy>();
        //        using (var objUser = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
        //        {
        //            userHierarchyList = await objUser.GetHisUsers(userInfo.UserId, domainInfo.AdsId);
        //            userHierarchyList.Add(await objUser.GetHisDetails(userInfo.UserId));
        //        }
        //        using (var objUserGroup = DLUserGroupMembers.GetDLUserGroupMembers(SQLProvider))
        //        {
        //            foreach (int UGroupId in userInfo.UserGroupIdList)
        //                userHierarchyList = userHierarchyList.Union(await objUserGroup.GetHisUsers(UGroupId)).Distinct().ToList();
        //        }
        //        userHierarchyList = userHierarchyList.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();
        //        #endregion
        //        List<Groups> Groups = await objDLUserInfo.Groups(userInfo.UserId);
        //        userInfo.UserGroupIdList = Groups.Select(x => x.UserGroupId).ToList();
        //        using var userGroup = DLUserGroupMembers.GetDLUserGroupMembers(SQLProvider);
        //        Members Self = new Members() { UserInfoUserId = userInfo.UserId };
        //        List<Members> userInfoUserList = await userGroup.GetUserGroupMembers(userInfo.UserGroupIdList);

        //        if (userInfoUserList != null && userInfoUserList.Count > 0)
        //        {
        //            userInfoUserList.Add(Self);
        //            userInfoUserList = userInfoUserList.Distinct().ToList();
        //        }
        //        else
        //        {
        //            userInfoUserList = new List<Members>();
        //            userInfoUserList.Add(Self);
        //        }

        //        userInfo.Members = userInfoUserList;
        //        userInfo.UserMembers = userHierarchyList;

        //        //if (HttpContext.Session.GetString("UserInfo") == null)
        //        //{
        //        //    HttpContext.Session.SetString("UserInfo", JsonConvert.SerializeObject(userInfo));
        //        //}

        //        //End

        //        GenralDetails GenralDetail = await Initialize(domainInfo, userInfo);
        //        GenralDetail.GetPurchasedList();
        //        TempData["GenralDetails"] = GenralDetail;
        //        if (!IsAjaxRequest())
        //        {
        //            PermissionsLevels? permissionDetails = JsonConvert.DeserializeObject<PermissionsLevels>(HttpContext.Session.GetString("PermissionsLevels" + userInfo.UserId));
        //            UserPermissionOnPage objuserpermission = new UserPermissionOnPage(domainInfo.AdsId, SQLProvider, permissionDetails);
        //            string? areaname = Convert.ToString(filterContext.RouteData.Values["area"]);
        //            areaname = !string.IsNullOrEmpty(areaname) ? areaname.ToLower() : areaname;
        //            string? controllerName = Convert.ToString(this.ControllerContext.RouteData.Values["controller"]);
        //            controllerName = !string.IsNullOrEmpty(controllerName) ? controllerName.ToLower() : controllerName;
        //            if (!await objuserpermission.IsUserHasPermission(areaname, userInfo.UserId))
        //            {
        //                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        //                HttpContext.Session.Clear();
        //                var cookieOptions = new CookieOptions
        //                {
        //                    Expires = DateTime.Now.AddMinutes(30) // Set expiration to 30 minutes
        //                };
        //                Response.Cookies.Append("PI", "value", cookieOptions);
        //                Response.Cookies.Append("PID_SSID", "");
        //                Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
        //                Response.Headers["Expires"] = DateTime.UtcNow.AddHours(-1).ToString("R");
        //                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "../Login" }, { "Action", "Index" } });
        //            }
        //            // Checking superadmin permission for campaign configuration
        //            if (controllerName == "approvalcampaignconfiguration" && userInfo.IsSuperAdmin != 1)
        //            {
        //                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "../Login" }, { "Action", "AccessDenied" } });
        //            }

        //            if (areaname.ToLower() == "facebookpage")
        //            {
        //                if (HttpContext.Session.GetString("FacebookToken") == null && HttpContext.Session.GetString("FacebookPages") == null)
        //                {
        //                    FacebookLoginSetup loginToken = new FacebookLoginSetup(domainInfo.AdsId, SQLProvider);
        //                    string token = await loginToken.GetSavedToken();
        //                    if (token != null && token != String.Empty && token.Length > 0)
        //                    {
        //                        string PlumbFbAppId = AllConfigURLDetails.KeyValueForConfig["FACEBOOKAPPID"].ToString();
        //                        string PlumbFbSecretKey = AllConfigURLDetails.KeyValueForConfig["FACEBOOKSECRETKEY"].ToString();


        //                        HttpContext.Session.SetString("FacebookToken", token);
        //                        p5FBManager p5fb = new p5FBManager(PlumbFbAppId, PlumbFbSecretKey);
        //                        p5fb.initTokenJson(token);
        //                        HttpContext.Session.SetString("FacebookPages", JsonConvert.SerializeObject(loginToken.GetFacebookPages(p5fb)));
        //                    }
        //                    else
        //                        filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "../FacebookPage/FacebookLogin" }, { "Action", "Index" } });
        //                }
        //            }
        //        }

        //        if (GenralDetail.permission != null)
        //        {
        //            // Checking permission from DB
        //            string actionName = this.ControllerContext.RouteData.Values["action"].ToString().ToLower();
        //            string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString().ToLower();
        //            string area_name = string.Empty;
        //            try
        //            {
        //                if (filterContext.ActionDescriptor.RouteValues["area"] != null)
        //                    area_name = (filterContext.ActionDescriptor.RouteValues["area"]).ToString().ToLower();
        //            }
        //            catch { }

        //            if (area_name != null && area_name != "" && area_name.Length > 0)
        //            {
        //                using var DLPermission = DLPermissionDetailsForCode.GetDLPermissionDetailsForCode(SQLProvider);
        //                List<PermissionDetailsForCode> PermissionForCodeList = (await DLPermission.Get()).ToList();

        //                //GenralDetail.permission.
        //                try
        //                {
        //                    if (PermissionForCodeList != null)
        //                    {
        //                        if (PermissionForCodeList.Exists(x => x.AreaName.ToLower() == area_name && x.ControllerName.ToLower() == controllerName && x.ActionName.ToLower() == actionName))
        //                        {
        //                            PermissionDetailsForCode PermissionForCode = PermissionForCodeList.Find(x => x.AreaName.ToLower() == area_name && x.ControllerName.ToLower() == controllerName && x.ActionName.ToLower() == actionName);
        //                            if (PermissionForCode != null)
        //                            {
        //                                if (GenralDetail.permission.Forms && (area_name == "Form".ToLower() || area_name == "captureform".ToLower()))
        //                                {
        //                                    if (PermissionForCode.HasFullControl == GenralDetail.permission.FormsHasFullControl || PermissionForCode.ViewControl == GenralDetail.permission.FormsView || PermissionForCode.ContributeControl == GenralDetail.permission.FormsContribute || PermissionForCode.DesignPermission == GenralDetail.permission.FormsDesign)
        //                                    {

        //                                    }
        //                                    else
        //                                    {
        //                                        filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "../Login" }, { "Action", "AccessDenied" } });
        //                                    }
        //                                }
        //                                else if (GenralDetail.permission.EmailMarketing && area_name == "mail".ToLower())
        //                                {
        //                                    if (PermissionForCode.HasFullControl == GenralDetail.permission.EmailMarketingHasFullControl || PermissionForCode.ViewControl == GenralDetail.permission.EmailMarketingView || PermissionForCode.ContributeControl == GenralDetail.permission.EmailMarketingContribute || PermissionForCode.DesignPermission == GenralDetail.permission.EmailMarketingDesign)
        //                                    {

        //                                    }
        //                                    else
        //                                    {
        //                                        filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "../Login" }, { "Action", "AccessDenied" } });
        //                                    }
        //                                }
        //                                else if (GenralDetail.permission.SMS && area_name == "sms".ToLower())
        //                                {
        //                                    if (PermissionForCode.HasFullControl == GenralDetail.permission.SMSHasFullControl || PermissionForCode.ViewControl == GenralDetail.permission.SMSView || PermissionForCode.ContributeControl == GenralDetail.permission.SMSContribute || PermissionForCode.DesignPermission == GenralDetail.permission.SMSDesign)
        //                                    {

        //                                    }
        //                                    else
        //                                    {
        //                                        filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "../Login" }, { "Action", "AccessDenied" } });
        //                                    }
        //                                }
        //                                else if (GenralDetail.permission.Analytics && area_name == "Analytics".ToLower())
        //                                {
        //                                    if (PermissionForCode.HasFullControl == GenralDetail.permission.AnalyticsHasFullControl || PermissionForCode.ViewControl == GenralDetail.permission.AnalyticsView || PermissionForCode.ContributeControl == GenralDetail.permission.AnalyticsContribute || PermissionForCode.DesignPermission == GenralDetail.permission.AnalyticsDesign)
        //                                    {

        //                                    }
        //                                    else
        //                                    {
        //                                        filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "../Login" }, { "Action", "AccessDenied" } });
        //                                    }
        //                                }
        //                                else if (GenralDetail.permission.Social && area_name == "FacebookPage".ToLower())
        //                                {
        //                                    if (PermissionForCode.HasFullControl == GenralDetail.permission.SocialHasFullControl || PermissionForCode.ViewControl == GenralDetail.permission.SocialView || PermissionForCode.ContributeControl == GenralDetail.permission.SocialContribute || PermissionForCode.DesignPermission == GenralDetail.permission.SocialDesign)
        //                                    {

        //                                    }
        //                                    else
        //                                    {
        //                                        filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "../Login" }, { "Action", "AccessDenied" } });
        //                                    }
        //                                }
        //                                else if (GenralDetail.permission.WorkFlow && area_name == "Journey".ToLower())
        //                                {
        //                                    if (PermissionForCode.HasFullControl == GenralDetail.permission.WorkFlowHasFullControl || PermissionForCode.ViewControl == GenralDetail.permission.WorkFlowView || PermissionForCode.ContributeControl == GenralDetail.permission.WorkFlowContribute || PermissionForCode.DesignPermission == GenralDetail.permission.WorkFlowDesign)
        //                                    {

        //                                    }
        //                                    else
        //                                    {
        //                                        filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "../Login" }, { "Action", "AccessDenied" } });
        //                                    }
        //                                }
        //                                else if (GenralDetail.permission.LeadManagement && (area_name == "Prospect".ToLower() || area_name == "LeadProspect".ToLower()))
        //                                {
        //                                    if (PermissionForCode.HasFullControl == GenralDetail.permission.LeadManagementHasFullControl || PermissionForCode.ViewControl == GenralDetail.permission.LeadManagementView || PermissionForCode.ContributeControl == GenralDetail.permission.LeadManagementContribute)
        //                                    {

        //                                    }
        //                                    else
        //                                    {
        //                                        filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "../Login" }, { "Action", "AccessDenied" } });
        //                                    }
        //                                }
        //                                else if ((area_name == "dashboard"))
        //                                {
        //                                }
        //                                else if (GenralDetail.permission.Contacts && area_name == "managecontact")
        //                                {
        //                                    if (PermissionForCode.HasFullControl == GenralDetail.permission.ContactsHasFullControl || PermissionForCode.ViewControl == GenralDetail.permission.ContactsView || PermissionForCode.ContributeControl == GenralDetail.permission.ContactsContribute || PermissionForCode.DesignPermission == GenralDetail.permission.ContactsDesign)
        //                                    {

        //                                    }
        //                                    else
        //                                    {
        //                                        filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "../Login" }, { "Action", "AccessDenied" } });
        //                                    }
        //                                }
        //                                else if (GenralDetail.permission.WebPushNotification && area_name == "WebPush".ToLower())
        //                                {
        //                                    if (PermissionForCode.HasFullControl == GenralDetail.permission.WebPushNotificationHasFullControl || PermissionForCode.ViewControl == GenralDetail.permission.WebPushNotificationView || PermissionForCode.ContributeControl == GenralDetail.permission.WebPushNotificationContribute || PermissionForCode.DesignPermission == GenralDetail.permission.WebPushNotificationDesign)
        //                                    {

        //                                    }
        //                                    else
        //                                    {
        //                                        filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "../Login" }, { "Action", "AccessDenied" } });
        //                                    }
        //                                }
        //                                else if (GenralDetail.permission.Mobile && area_name == "MobileAnalytics".ToLower())
        //                                {
        //                                    if (PermissionForCode.HasFullControl == GenralDetail.permission.MobileHasFullControl || PermissionForCode.ViewControl == GenralDetail.permission.MobileView || PermissionForCode.ContributeControl == GenralDetail.permission.MobileContribute || PermissionForCode.DesignPermission == GenralDetail.permission.MobileDesign)
        //                                    {

        //                                    }
        //                                    else
        //                                    {
        //                                        filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "../Login" }, { "Action", "AccessDenied" } });
        //                                    }
        //                                }
        //                                else if (GenralDetail.permission.SiteChat && area_name == "Chat".ToLower())
        //                                {
        //                                    if (PermissionForCode.HasFullControl == GenralDetail.permission.SiteChatHasFullControl || PermissionForCode.ViewControl == GenralDetail.permission.SiteChatView || PermissionForCode.ContributeControl == GenralDetail.permission.SiteChatContribute || PermissionForCode.DesignPermission == GenralDetail.permission.SiteChatDesign)
        //                                    {

        //                                    }
        //                                    else
        //                                    {
        //                                        filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "../Login" }, { "Action", "AccessDenied" } });
        //                                    }
        //                                }
        //                                else if (GenralDetail.permission.MobileEngagement && area_name == "mobileinapp".ToLower())
        //                                {
        //                                    if (PermissionForCode.HasFullControl == GenralDetail.permission.MobileEngagementHasFullControl || PermissionForCode.ViewControl == GenralDetail.permission.MobileEngagementView || PermissionForCode.ContributeControl == GenralDetail.permission.MobileEngagementContribute || PermissionForCode.DesignPermission == GenralDetail.permission.MobileEngagementDesign)
        //                                    {

        //                                    }
        //                                    else
        //                                    {
        //                                        filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "../Login" }, { "Action", "AccessDenied" } });
        //                                    }
        //                                }
        //                                else if (GenralDetail.permission.MobilePushNotification && area_name == "mobilepushnotification".ToLower())
        //                                {
        //                                    if (PermissionForCode.HasFullControl == GenralDetail.permission.MobilePushNotificationHasFullControl || PermissionForCode.ViewControl == GenralDetail.permission.MobilePushNotificationView || PermissionForCode.ContributeControl == GenralDetail.permission.MobilePushNotificationContribute || PermissionForCode.DesignPermission == GenralDetail.permission.MobilePushNotificationDesign)
        //                                    {

        //                                    }
        //                                    else
        //                                    {
        //                                        filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "../Login" }, { "Action", "AccessDenied" } });
        //                                    }
        //                                }
        //                                else
        //                                {
        //                                    filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "../Login" }, { "Action", "AccessDenied" } });
        //                                }
        //                            }
        //                        }
        //                    }
        //                }
        //                catch
        //                {
        //                    //
        //                }
        //            }
        //            else if (area_name == null || area_name == "" && (controllerName == "Account".ToLower() || controllerName == "AgencyFormController".ToLower() || controllerName == "AlertsController".ToLower() || controllerName == "AuthenticationController".ToLower() || controllerName == "ConnectorController".ToLower() || controllerName == "CrmController".ToLower() || controllerName == "ErrorUpdation".ToLower() || controllerName == "ExportToXlsController".ToLower() || controllerName == "ForgotPasswordController".ToLower() || controllerName == "GcmFcmSettingsController".ToLower() || controllerName == "LicensingController".ToLower() || controllerName == "PricingController".ToLower() || controllerName == "SignUpSignInController".ToLower() || controllerName == "TicketController".ToLower() || controllerName == "UserController".ToLower()))
        //            {
        //                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "../Login" }, { "Action", "AccessDenied" } });
        //            }
        //        }
        //    }
        //    else if (HttpContext.Session.GetString("UserInfo") == null)
        //    {
        //        string actionName = this.ControllerContext.RouteData.Values["action"].ToString().ToLower();
        //        string controllerName = this.ControllerContext.RouteData.Values["controller"].ToString().ToLower();
        //        string area_name = string.Empty;
        //        try
        //        {
        //            if (filterContext.ActionDescriptor.RouteValues["area"] != null)
        //                area_name = (filterContext.ActionDescriptor.RouteValues["area"]).ToString().ToLower();
        //        }
        //        catch { }

        //        filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary
        //        {
        //            { "Controller", "../Login"},
        //            { "Action", "Index" },
        //            {"ReturnUrl", area_name+"/"+controllerName+"/"+actionName}
        //        });
        //    }
        //    else if (HttpContext.Session.GetString("AccountInfo") == null)
        //    {
        //        filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary
        //        {
        //            { "Controller", "../Account" },
        //            { "Action", "MyAccounts" }
        //        });
        //    }
        //    base.OnActionExecuting(filterContext);
        //}
        
        public JsonResult GetEncryptedOfUserInfoUserId()
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                LoginInfo? loginInfo = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                string UserInfoUserId = Plumb5GenralFunction.EncryptDecrypt.Encrypt(loginInfo.UserId.ToString());
                return Json(new { Status = true, UserInfoUserId = UserInfoUserId });
            }
            return Json(new { Status = false, UserInfoUserId = "" });
        }
        protected bool IsAjaxRequest()
        {
            if (Request != null && HttpContext.Request.HasJsonContentType())
            {
                return true;
            }
            return false;
        }

        private async Task<GenralDetails> Initialize(DomainInfo? domainInfo, LoginInfo? userInfo)
        {
            Account account = new Account();
            GenralDetails genralDetails = new GenralDetails();

            if (HttpContext.Session.GetString("MLUserInfo") != null)
            {
                genralDetails.userInfo = JsonConvert.DeserializeObject<UserInfo>(HttpContext.Session.GetString("MLUserInfo"));
            }
            else
            {
                using (var objAcc = DLAccount.GetDLAccount(SQLProvider))
                {
                    account = await objAcc.GetAccountDetails(domainInfo.AdsId);
                }

                using (var objUserInfo = DLUserInfo.GetDLUserInfo(SQLProvider))
                {
                    genralDetails.userInfo = await objUserInfo.GetDetail(account.UserInfoUserId);
                    HttpContext.Session.SetString("MLUserInfo", JsonConvert.SerializeObject(userInfo));
                }
            }

            if (HttpContext.Session.GetString("MLPurchase") != null)
            {
                genralDetails.purchaseLists = JsonConvert.DeserializeObject<List<Purchase>>(HttpContext.Session.GetString("MLPurchase"));
            }
            else
            {
                using (var objDLPurchase = DLPurchase.GetDLPurchase(SQLProvider))
                {
                    genralDetails.purchaseLists = await objDLPurchase.GetDetail(account.UserInfoUserId);
                }

                HttpContext.Session.SetString("MLPurchase", JsonConvert.SerializeObject(genralDetails.purchaseLists));
            }

            if (HttpContext.Session.GetString("MLFeature") != null)
            {
                genralDetails.features = JsonConvert.DeserializeObject<List<Feature>>(HttpContext.Session.GetString("MLFeature"));
            }
            else
            {
                using (var objDLFeature = DLFeature.GetDLFeature(SQLProvider))
                {
                    genralDetails.features = await objDLFeature.GetList(0, 30);
                }
                HttpContext.Session.SetString("MLFeature", JsonConvert.SerializeObject(genralDetails.features));
            }

            if (HttpContext.Session.GetString("PermissionsLevels" + userInfo.UserId.ToString()) == null)
            {
                using var objDLPermission = DLPermissionsLevel.GetDLPermissionsLevel(SQLProvider);
                genralDetails.permission = await objDLPermission.UserPermissionbyAccountId(userInfo.UserId, domainInfo.AdsId);
                HttpContext.Session.SetString("PermissionsLevels" + userInfo.UserId, JsonConvert.SerializeObject(genralDetails.permission));
            }
            else
            {
                genralDetails.permission = JsonConvert.DeserializeObject<PermissionsLevels>(HttpContext.Session.GetString("PermissionsLevels" + userInfo.UserId.ToString()));
            }

            if (HttpContext.Session.GetString("PermissionsSubLevels" + userInfo.UserId.ToString()) == null)
            {
                if (genralDetails.permission != null)
                {
                    using (var objDL = DLPermissionSubLevels.GetDLPermissionSubLevels(SQLProvider))
                    {
                        genralDetails.subPermission = await objDL.GetAllDetails(new PermissionSubLevels() { PermissionLevelId = genralDetails.permission.Id });
                    }
                }

                HttpContext.Session.SetString("PermissionsSubLevels" + userInfo.UserId, JsonConvert.SerializeObject(genralDetails.subPermission));
            }
            else
            {
                genralDetails.subPermission = JsonConvert.DeserializeObject<List<PermissionSubLevels>>(HttpContext.Session.GetString("PermissionsSubLevels" + userInfo.UserId.ToString()));
            }

            return genralDetails;
        }
    }
}
