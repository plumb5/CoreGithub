using IP5GenralDL;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Text;
using Plumb5.Models;
using Plumb5.Areas.ManageContact.Dto;
using Plumb5.Dto;

namespace Plumb5.Areas.ManageUsers.Controllers
{
    [Area("ManageUsers")]
    public class UsersController : BaseController
    {
        public UsersController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("Users");
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveUserDetails([FromBody] Users_SaveUserDetailsDto objDto)
        {
            UserInfo userInfo = objDto.userInfoData;
            UserHierarchy userHierarchy = objDto.userHierarchyData;

            int UserId = 0;
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                LoginInfo? Login = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

                userInfo.LastModifiedByUserId = Login.UserId;
                var NewPassword = Helper.GeneratePassword();
                userInfo.Password = Helper.GetHashedString(NewPassword);
                userInfo.RegistrationDate = DateTime.Now;
                using (var objUser = DLUserInfo.GetDLUserInfo(SQLProvider))
                {
                    UserId = await objUser.SaveDetails(userInfo);
                    if (UserId > 0)
                    {
                        int MainUserId = 0;
                        if (Login.IsSuperAdmin == 0)
                        {
                            using (var obj = DLUserInfo.GetDLUserInfo(SQLProvider))
                            {
                                MainUserId = await obj.MainUserId(Login.UserId);
                            }
                        }

                        userHierarchy.MainUserId = (MainUserId == 0 ? Login.UserId : MainUserId);
                        userHierarchy.AccountId = 0;
                        userHierarchy.UserInfoUserId = UserId;
                        userHierarchy.CreatedByUserId = Login.UserId;

                        using (var objDL = DLUserDetails.GetDLUserDetails(SQLProvider))
                        {
                            UserDetails objML = new UserDetails();
                            if (objDto.AccountIds != null && objDto.AccountIds.Length > 0)
                            {
                                foreach (var eachAccountId in objDto.AccountIds)
                                {
                                    userHierarchy.AccountId = eachAccountId;

                                    objML = new UserDetails() { MainUserId = userHierarchy.MainUserId, UserInfoUserId = UserId, SeniorUserId = userHierarchy.SeniorUserId, AccountId = eachAccountId, CreatedByUserId = Login.UserId, PermissionLevelsId = userHierarchy.PermissionLevelsId };
                                    await objDL.InsertHierarchy(objML);
                                }
                            }
                            else
                            {
                                objML = new UserDetails() { MainUserId = userHierarchy.MainUserId, UserInfoUserId = UserId, SeniorUserId = userHierarchy.SeniorUserId, AccountId = 0, CreatedByUserId = Login.UserId, PermissionLevelsId = userHierarchy.PermissionLevelsId };
                                await objDL.InsertHierarchy(objML);
                            }

                            objML = new UserDetails() { MainUserId = userHierarchy.MainUserId, UserInfoUserId = UserId, CreatedByUserId = Login.UserId };
                            await objDL.SaveCreatedUserInfo(objML);
                        }

                        if (objDto.GroupIds != null && objDto.GroupIds.Length > 0)
                        {
                            using (var objGroup = DLUserGroupMembers.GetDLUserGroupMembers(SQLProvider))
                            {
                                foreach (var eachGroup in objDto.GroupIds)
                                {
                                    await objGroup.AddToGroup(UserId, eachGroup);
                                }
                            }
                        }
                    }
                }

                if (UserId > 0)
                {
                    SendWelcomeLoginMail(userInfo.EmailId, NewPassword, userInfo.FirstName + " " + userInfo.LastName);
                }
            }
            return Json(UserId);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> UpdateUserDetails([FromBody] Users_UpdateUserDetailsDto objDto)
        {
            UserInfo userInfo = objDto.userInfoData;
            UserHierarchy userHierarchy = objDto.userHierarchyData;

            int UserId = userInfo.UserId;
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                LoginInfo? Login = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

                userInfo.LastModifiedByUserId = Login.UserId;
                using (var objUser = DLUserInfo.GetDLUserInfo(SQLProvider))
                {
                    await objUser.UpdateDetails(userInfo);
                    int MainUserId = 0;
                    if (Login.IsSuperAdmin == 0)
                    {
                        using (var obj = DLUserInfo.GetDLUserInfo(SQLProvider))
                        {
                            MainUserId = await obj.MainUserId(Login.UserId);
                        }
                    }

                    userHierarchy.MainUserId = (MainUserId == 0 ? Login.UserId : MainUserId);
                    userHierarchy.AccountId = 0;
                    userHierarchy.UserInfoUserId = UserId;

                    using (var objDL = DLUserDetails.GetDLUserDetails(SQLProvider))
                    {
                        UserDetails objML = new UserDetails();
                        objML.UserInfoUserId = UserId;
                        await objDL.DeleteHierarchy(objML);

                        if (objDto.AccountIds != null && objDto.AccountIds.Length > 0)
                        {
                            foreach (var eachAccountId in objDto.AccountIds)
                            {
                                objML = new UserDetails() { MainUserId = userHierarchy.MainUserId, UserInfoUserId = UserId, SeniorUserId = userHierarchy.SeniorUserId, AccountId = eachAccountId, CreatedByUserId = Login.UserId, PermissionLevelsId = userHierarchy.PermissionLevelsId };
                                await objDL.InsertHierarchy(objML);
                            }
                        }
                        else
                        {
                            objML = new UserDetails() { MainUserId = userHierarchy.MainUserId, UserInfoUserId = UserId, SeniorUserId = userHierarchy.SeniorUserId, AccountId = 0, CreatedByUserId = Login.UserId, PermissionLevelsId = userHierarchy.PermissionLevelsId };
                            await objDL.InsertHierarchy(objML);
                        }

                        objML = new UserDetails() { MainUserId = Convert.ToInt32(MainUserId == 0 ? Login.UserId : MainUserId), UserInfoUserId = UserId, CreatedByUserId = Login.UserId };
                        await objDL.SaveCreatedUserInfo(objML);
                    }

                    if (objDto.GroupIds != null && objDto.GroupIds.Length > 0)
                    {
                        using (var objGroup = DLUserGroupMembers.GetDLUserGroupMembers(SQLProvider))
                        {
                            foreach (var eachGroup in objDto.GroupIds)
                            {
                                await objGroup.AddToGroup(UserId, eachGroup);
                            }
                        }
                    }
                }
            }
            return Json(UserId);
        }
        public async Task<JsonResult> GetUserDetail([FromBody] Users_GetUserDetailDto objDto)
        {
            UserInfo userInfo = null;
            PermissionsLevels UserPermission = null;
            UserHierarchy UserHierarchy = null;
            List<UserAccounts> MyUserAccounts = null;
            List<UserInfo> ReportingUserInfo = new List<UserInfo>();

            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                var Login = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

                UserDetails objml = new UserDetails();
                objml.MainUserId = Convert.ToInt32(Login.UserId);
                objml.UserInfoUserId = objDto.UserId;

                UsersModule objUsersModule = new UsersModule();
                var userinfoUserId = Convert.ToInt32(objDto.UserId);

                using (var objUserHierarchy = DLUserDetails.GetDLUserDetails(SQLProvider))
                {
                    objUsersModule.UserDetails = await objUserHierarchy.Get(userinfoUserId);
                }

                List<P5GenralML.MLUserHierarchy> userHierarchy = null;
                P5GenralML.MLUserHierarchy MYuserHierarchy = null;

                using (var objUserHierarchy = DLUserDetails.GetDLUserDetails(SQLProvider))
                {
                    userHierarchy = await objUserHierarchy.GetUsersByHierarchy(objml);
                    MLUserHierarchy removeData = userHierarchy.FirstOrDefault(x => x.UserInfoUserId == userinfoUserId);
                    if (removeData != null)
                        userHierarchy.Remove(removeData);
                }

                using (var objUserGroup = DLUserDetails.GetDLUserDetails(SQLProvider))
                {
                    userHierarchy = userHierarchy.Union(await objUserGroup.GetUsersByGroups(objml)).ToList();
                    MLUserHierarchy removeData = userHierarchy.FirstOrDefault(x => x.UserInfoUserId == userinfoUserId);
                    if (removeData != null)
                        userHierarchy.Remove(removeData);
                }

                using (var objuserhierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                {
                    List<P5GenralML.MLUserHierarchy> MyUsers = await objuserhierarchy.GetHisUsers(userinfoUserId);
                    if (MyUsers.Count() > 0)
                        userHierarchy.RemoveAll(a => MyUsers.Exists(w => w.UserInfoUserId == a.UserInfoUserId));
                }

                using (var objUserGroup = DLUserDetails.GetDLUserDetails(SQLProvider))
                {
                    MYuserHierarchy = await objUserGroup.GetUsersHierarchyByUserId(objml);
                }

                List<int> usersId = new List<int>();

                if (userHierarchy != null)
                    usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();

                for (int a = 0; a < usersId.Count(); a++)
                {
                    var filtered = from P5GenralML.MLUserHierarchy p in userHierarchy
                                   where p.UserInfoUserId == (usersId[a])
                                   select p;
                    foreach (P5GenralML.MLUserHierarchy Name in filtered)
                    {
                        if (MYuserHierarchy.UserInfoUserId != usersId[a])
                        {
                            ReportingUserInfo.Add(new UserInfo() { FirstName = Name.FirstName, UserId = usersId[a] });
                            break;
                        }
                        else
                        {
                            MYuserHierarchy.FirstName = Name.FirstName;
                        }
                    }
                }

                if (MYuserHierarchy.UserInfoUserId == Login.UserId)
                {
                    ReportingUserInfo.Add(new UserInfo() { FirstName = Login.UserName, UserId = Login.UserId });
                }
                else
                {
                    ReportingUserInfo.Add(new UserInfo() { FirstName = Login.UserName, UserId = Login.UserId });
                    ReportingUserInfo.Add(new UserInfo() { FirstName = MYuserHierarchy.FirstName, UserId = MYuserHierarchy.UserInfoUserId });
                }

                using (var objUser = DLUserInfo.GetDLUserInfo(SQLProvider))
                {
                    userInfo = await objUser.GetDetail(objDto.UserId);
                }

                using (var objHer = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                {
                    UserHierarchy = await objHer.GetHisRole(objDto.UserId);
                }

                var objDLPermission = DLPermissionsLevel.GetDLPermissionsLevel(SQLProvider);
                UserPermission = await objDLPermission.UserPermission(objDto.UserId);

                using (var objuserAccounts = DLUserDetails.GetDLUserDetails(SQLProvider))
                {
                    MyUserAccounts = await objuserAccounts.GetUsersAccountbyUserId(objml);
                }
            }

            return Json(new { userInfo = userInfo, userPermission = UserPermission, userHierarchy = UserHierarchy, myUserAccounts = MyUserAccounts, ReportingUserInfo = ReportingUserInfo });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> DeleteUserDetails([FromBody] Users_DeleteUserDetailsDto objDto)
        {
            using (var obj = DLUserInfo.GetDLUserInfo(SQLProvider))
            {
                return Json(await obj.Delete(objDto.UserId));
            }
        }
        //public async Task<JsonResult> GetUserMaxCount(string EmailId, int UserGroupId)
        //{
        //    int TotalCount = 0;
        //    if(HttpContext.Session.GetString("UserInfo") != null)
        //    {
        //        var Login = (P5GenralML.LoginInfo)Session["UserInfo"];
        //        using (DLUserDetails DLUserInfo = new DLUserDetails())
        //        {
        //            TotalCount = DLUserInfo.GetMaxCount(Login.UserId, EmailId, UserGroupId);
        //        }
        //    }

        //    return Json(TotalCount);
        //}
        [HttpPost]
        public async Task<JsonResult> GetUserDetails([FromBody] Users_GetUserDetailsDto objDto)
        {
            List<UserDetailsHierarchyWithPermissions> userList = new List<UserDetailsHierarchyWithPermissions>();
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                var Login = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                using (Models.UserDetails DLUserInfo = new Models.UserDetails())
                    userList = await DLUserInfo.GetUsersWithSenior(Login.UserId, objDto.UserGroupId, objDto.userDetailsWithPermissions, SQLProvider);
            }

            return Json(userList);
        }
        [HttpPost]
        public async Task<JsonResult> GetRoles()
        {
            List<PermissionsLevels> roleList = new List<PermissionsLevels>();
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                var Login = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                var MainUserId = 0;

                if (Login.IsSuperAdmin == 0)
                {
                    using (var obj = DLUserInfo.GetDLUserInfo(SQLProvider))
                    {
                        MainUserId = await obj.MainUserId(Login.UserId);
                    }
                }

                var bLRoles = DLPermissionsLevel.GetDLPermissionsLevel(SQLProvider);
                roleList = await bLRoles.GetRoles(Convert.ToInt32(MainUserId == 0 ? Login.UserId : MainUserId));
            }
            roleList = (roleList == null ? new List<PermissionsLevels>() : roleList);
            return Json(roleList);
        }
        [HttpPost]
        public async Task<JsonResult> GetUserGroups()
        {
            List<UserGroup> groupList = new List<UserGroup>();

            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                using (var bLUserGroup = DLUserGroup.GetDLUserGroup(SQLProvider))
                    groupList = await bLUserGroup.GetUserGroupList();
            }

            if (groupList != null && groupList.Count() > 0)
            {
                var MainUserId = 0;
                var Login = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

                if (Login.IsSuperAdmin == 0)
                {
                    using (var obj = DLUserInfo.GetDLUserInfo(SQLProvider))
                        MainUserId = await obj.MainUserId(Login.UserId);
                }
                int UserInfoUserId = Convert.ToInt32(MainUserId == 0 ? Login.UserId : MainUserId);

                groupList = groupList.Where(x => x.UserInfoUserId == UserInfoUserId).ToList();
            }

            groupList = (groupList == null ? new List<UserGroup>() : groupList);
            return Json(groupList);
        }
        [HttpPost]
        public async Task<JsonResult> GetAccounts()
        {
            List<UserAccounts> Accounts = null;
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                var Login = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                UserDetails objml = new UserDetails() { MainUserId = Login.UserId };
                using (var objuserAccounts = DLUserDetails.GetDLUserDetails(SQLProvider))
                {
                    Accounts = await objuserAccounts.GetUsersAccount(objml);
                }
            }
            return Json(Accounts);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> AddToGroup([FromBody] Users_AddToGroupDto objDto)
        {
            int UserAdded = 0;
            int UserNotAdded = 0;
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                using (var objGroup = DLUserGroupMembers.GetDLUserGroupMembers(SQLProvider))
                {
                    foreach (var eachGroup in objDto.GroupIds)
                    {
                        foreach (var UserInfoUserId in objDto.UserIds)
                        {
                            int Id = await objGroup.AddToGroup(UserInfoUserId, eachGroup);
                            if (Id > 0)
                            {
                                UserAdded++;
                            }
                            else
                            {
                                UserNotAdded++;
                            }
                        }
                    }
                }
            }
            return Json(new { UserAdded = UserAdded, UserNotAdded = UserNotAdded });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> RemoveFromGroup([FromBody] Users_RemoveFromGroupDto objDto)
        {
            int UserRemoved = 0;
            int UserNotRemoved = 0;
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                using (var objGroup = DLUserGroupMembers.GetDLUserGroupMembers(SQLProvider))
                {
                    foreach (var eachGroup in objDto.GroupIds)
                    {
                        foreach (var UserInfoUserId in objDto.UserIds)
                        {
                            bool result = await objGroup.RemoveFromGroup(UserInfoUserId, eachGroup);

                            if (result)
                            {
                                UserRemoved++;
                            }
                            else
                            {
                                UserNotRemoved++;
                            }
                        }
                    }
                }
            }
            return Json(new { UserRemoved = UserRemoved, UserNotRemoved = UserNotRemoved });
        }

        [Log]
        [HttpPost]
        public async Task<int> ChangeStatus([FromBody] Users_ChangeStatusDto objDto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                var Loginuser = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

                var objUserHiararch = DLUserHierarchy.GetDLUserHierarchy(SQLProvider);
                List<MLUserHierarchy> userHierarchyList = await objUserHiararch.GetHisUsers(Loginuser.UserId);

                if (userHierarchyList != null && userHierarchyList.Any(x => x.UserInfoUserId == objDto.Id))
                {
                    using (var obj = DLUserInfo.GetDLUserInfo(SQLProvider))
                    {
                        await obj.ToogleStatus(objDto.Id, objDto.Isactive);
                    }
                }
            }
            return 0;
        }

        [HttpPost]
        private async Task SendWelcomeLoginMail(string EmailId, string Password, string UserName)
        {
            try
            {
                string filePath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\Template\\userassign.htm";
                string MailBody = "";
                if (System.IO.File.Exists(filePath))
                {
                    using (StreamReader rd = new StreamReader(filePath))
                    {
                        MailBody = rd.ReadToEnd();
                        rd.Close();
                    }

                    StringBuilder ContactDetails = new StringBuilder();
                    ContactDetails.Append("<br> EmailId :- " + EmailId + "<br> Password :- " + Password + "<br/>");

                    string OnlineUrl = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"].ToString();
                    string SupportEmailId = AllConfigURLDetails.KeyValueForConfig["SUPPORTEMAILID"].ToString();

                    MailBody = MailBody.Replace("<!--UserName-->", UserName);
                    MailBody = MailBody.Replace("<!--$$$$$1-->", ContactDetails.ToString());
                    MailBody = MailBody.Replace("<!--OnlineUrl-->", OnlineUrl);
                    MailBody = MailBody.Replace("<!--SupportEmailId-->", SupportEmailId);
                    MailBody = MailBody.Replace("<!--CLIENTLOGO_ONLINEURL-->", AllConfigURLDetails.KeyValueForConfig["CLIENTLOGO_ONLINEURL"].ToString());

                    DomainInfo domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                    if (Helper.IsValidEmailAddress(EmailId))
                    {
                        LoginInfo user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                        MailConfiguration mailconfiguration = new MailConfiguration();
                        using (var objDLConfig = DLMailConfiguration.GetDLMailConfiguration(domainDetails.AdsId, SQLProvider))
                            mailconfiguration = await objDLConfig.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);

                        if (mailconfiguration != null && mailconfiguration.Id > 0 && mailconfiguration.IsPromotionalOrTransactionalType == true)
                        {
                            MailSetting mailSetting = new MailSetting()
                            {
                                Forward = false,
                                FromEmailId = string.Empty,
                                FromName = AllConfigURLDetails.KeyValueForConfig["FROM_NAME_EMAIL"].ToString(),
                                MailTemplateId = 0,
                                ReplyTo = string.Empty,
                                Subject = "Your plumb5 account has been created by Admin",
                                Subscribe = true,
                                MessageBodyText = string.Empty,
                                IsTransaction = true
                            };

                            MailConfigForSending mailConfigForSending = null;
                            using (var objDL = DLMailConfigForSending.GetDLMailConfigForSending(domainDetails.AdsId, SQLProvider))
                                mailConfigForSending = await objDL.GetActiveFromEmailId();

                            if (mailConfigForSending != null && !String.IsNullOrEmpty(mailConfigForSending.FromEmailId))
                            {
                                mailSetting.FromEmailId = mailConfigForSending.FromEmailId;
                                mailSetting.ReplyTo = mailConfigForSending.FromEmailId;
                            }
                            else
                            {
                                mailSetting.FromEmailId = user.EmailId;
                                mailSetting.ReplyTo = user.EmailId;
                            }


                            mailSetting.MessageBodyText = MailBody.ToString();

                            MLMailSent mailSent = new MLMailSent()
                            {
                                MailCampaignId = 0,
                                MailSendingSettingId = 0,
                                GroupId = 0,
                                ContactId = 0,
                                EmailId = EmailId,
                                P5MailUniqueID = Guid.NewGuid().ToString()
                            };


                            MailSentSavingDetials mailSentSavingDetials = new MailSentSavingDetials()
                            {
                                ConfigurationId = 0,
                                GroupId = 0
                            };

                            IBulkMailSending MailGeneralBaseFactory = Plumb5GenralFunction.MailGeneralBaseFactory.GetMailVendor(domainDetails.AdsId, mailSetting, mailSentSavingDetials, mailconfiguration, "UsersController", "ManageUsers");
                            var SentStatus = MailGeneralBaseFactory.SendSingleMail(mailSent);

                            if (MailGeneralBaseFactory.VendorResponses != null && MailGeneralBaseFactory.VendorResponses.Count > 0)
                            {
                                List<MLMailVendorResponse> responses = MailGeneralBaseFactory.VendorResponses;
                                MailSent responseMailSent = new MailSent()
                                {
                                    FromEmailId = mailSetting.FromEmailId,
                                    FromName = mailSetting.FromName,
                                    MailTemplateId = mailSetting.MailTemplateId,
                                    Subject = mailSetting.Subject,
                                    MailCampaignId = responses[0].MailCampaignId,
                                    MailSendingSettingId = responses[0].MailSendingSettingId,
                                    GroupId = responses[0].GroupId,
                                    ContactId = responses[0].ContactId,
                                    EmailId = responses[0].EmailId,
                                    P5MailUniqueID = responses[0].P5MailUniqueID,
                                    CampaignJobName = responses[0].CampaignJobName,
                                    ErrorMessage = responses[0].ErrorMessage,
                                    ProductIds = responses[0].ProductIds,
                                    ResponseId = responses[0].ResponseId,
                                    SendStatus = (byte)responses[0].SendStatus,
                                    WorkFlowDataId = responses[0].WorkFlowDataId,
                                    WorkFlowId = responses[0].WorkFlowId,
                                    SentDate = DateTime.Now,
                                    ReplayToEmailId = mailSetting.ReplyTo,
                                    TriggerMailSmsId = 0,
                                    MailConfigurationNameId = mailconfiguration.MailConfigurationNameId
                                };

                                using (var objDL = DLMailSent.GetDLMailSent(domainDetails.AdsId, SQLProvider))
                                {
                                    await objDL.Send(responseMailSent);
                                }
                            }
                            else
                            {
                                using (ErrorUpdation objError = new ErrorUpdation("UserController"))
                                {
                                    objError.AddError("User create mail sending issue", "Error", DateTime.Now.ToString(), "UserController-->SendWelcomeLoginMail", "");
                                }
                            }
                        }
                        else
                        {
                            using (ErrorUpdation objError = new ErrorUpdation("UserController"))
                            {
                                objError.AddError("Transactional settings has not been configured", "Error", DateTime.Now.ToString(), "UserController-->SendWelcomeLoginMail", "");
                            }
                        }
                    }
                }
                else
                {
                    ErrorUpdation.AddErrorLog("UserController", "User Creation Welcome Mail", "User Creation Welcome template not exists", DateTime.Now, "UserController-->SendWelcomeLoginMail", "User Creation Welcome Mail Cannot be sent");
                }
            }
            catch (Exception ex)
            {
                ErrorUpdation.AddErrorLog("UserController", ex.Message.ToString(), "User Creation Welcome Mail exception in UserController-->SendWelcomeLoginMail", DateTime.Now, "UserController-->SendWelcomeLoginMail", ex.InnerException.ToString());
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetUsersGroup([FromBody] Users_GetUsersGroupDto objDto)
        {
            List<MLUserGroup> Groups = new List<MLUserGroup>();
            if (HttpContext.Session.GetString("UserInfo") != null)
            {

                if (objDto.Id > 0)
                {
                    var objuser = DLUserDetails.GetDLUserDetails(SQLProvider);
                    Groups = await objuser.GetUsersGroup(objDto.Id);
                }
            }
            return Json(Groups);
        }

        [HttpPost]
        public async Task<int> RemoveUserfromGroup([FromBody] Users_RemoveUserfromGroupDto objDto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                MLUserGroup objml = new MLUserGroup() { UserGroupId = objDto.usergroupid, UserInfoUserId = objDto.userid };
                var objDL = DLUserGroup.GetDLUserGroup(SQLProvider);
                await objDL.DeleteUserFromGroup(objml);
            }
            return 0;
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> UpdatePassword([FromBody] Users_UpdatePasswordDto objDto)
        {
            
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                UserInfo userInfo = new UserInfo();
                userInfo.UserId= objDto.UserId;
                userInfo.Password = objDto.Password;

                LoginInfo loginIfno = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                UserInfo userDetials = null;
                userInfo.LastModifiedByUserId = loginIfno.UserId;

                List<BlackListPassword> blacklistednames = new List<BlackListPassword>();

                using (var objDLacklist = DLBlackListPassword.GetDLBlackListPassword(SQLProvider))
                {
                    blacklistednames = await objDLacklist.GetBlackListNameExists();
                }

                if (blacklistednames != null && blacklistednames.Count() > 0)
                {
                    for (int i = 0; i < blacklistednames.Count(); i++)
                    {
                        if (userInfo.Password.ToLower().Contains(blacklistednames[i].BlackListName.ToLower().ToString()))
                        {
                            return Json(new { Status = false, Message = "The entered password does not meet the password policy requirements." });
                        }
                    }
                }

                if (userInfo.UserId <= 0)
                    userInfo.UserId = loginIfno.UserId;

                if (!Helper.VerifyPassword(userInfo.Password))
                {
                    return Json(new { Status = false, Message = "The entered password does not meet the password policy requirements." });
                }

                if (userInfo.UserId > 0)
                {
                    using (var objUser = DLUserInfo.GetDLUserInfo(SQLProvider))
                    {
                        userDetials = await objUser.GetDetail(userInfo.UserId);
                    }

                    if (Helper.VerifyHashedString(userInfo.Password, userDetials.Password))
                    {
                        return Json(new { Status = false, Message = "The old password and new password are same, please enter different password" });
                    }

                    using (var objDLUserInfo = DLUserInfo.GetDLUserInfo(SQLProvider))
                    {
                        userInfo.Password = Helper.GetHashedString(userInfo.Password);
                        return Json(new { Status = await objDLUserInfo.UpdateDetails(userInfo), Message = "" });
                    }
                }
            }
            return Json(new { Status = false, Message = "" });
        }

        [HttpPost]
        public async Task<JsonResult> GetReportingUsersByHierarchy()
        {
            List<UserInfo> UserInfo = new List<UserInfo>();

            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                var Login = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

                var MainUserId = 0;

                if (Login.IsSuperAdmin == 0)
                {
                    using (var obj = DLUserInfo.GetDLUserInfo(SQLProvider))
                    {
                        MainUserId = await obj.MainUserId(Login.UserId);
                    }
                }

                UsersModule objUsersModule = new UsersModule();
                UserDetails objml = new UserDetails();
                List<P5GenralML.MLUserHierarchy> userHierarchy = null;
                List<int> usersId = new List<int>();

                objml.MainUserId = Convert.ToInt32(Login.UserId);
                objml.GroupId = Login.UserGroupIdList;

                using (var objUserHierarchy = DLUserDetails.GetDLUserDetails(SQLProvider))
                {
                    userHierarchy = await objUserHierarchy.GetUsersByHierarchy(objml);
                }

                using (var objUserGroup = DLUserDetails.GetDLUserDetails(SQLProvider))
                {
                    userHierarchy = userHierarchy.Union(await objUserGroup.GetUsersByGroups(objml)).ToList();
                }

                if (userHierarchy != null)
                    usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();

                for (int a = 0; a < usersId.Count(); a++)
                {
                    var filtered = from P5GenralML.MLUserHierarchy p in userHierarchy
                                   where p.UserInfoUserId == (usersId[a])
                                   select p;

                    foreach (P5GenralML.MLUserHierarchy Name in filtered)
                    {
                        UserInfo.Add(new UserInfo() { FirstName = Name.FirstName, UserId = usersId[a] });
                        break;
                    }
                }
                UserInfo.Add(new UserInfo() { FirstName = Login.UserName, UserId = Login.UserId });
            }
            return Json(UserInfo);
        }

        [HttpPost]
        public async Task<JsonResult> GetUser([FromBody] Users_GetUserDto objDto)
        {
            List<UserInfo> userInfo = null;
            using (var objUser = DLUserInfo.GetDLUserInfo(SQLProvider))
            {
                userInfo = objUser.GetDetail(objDto.UserIds);
            }

            return Json(userInfo);
        }

        [HttpPost]
        public async Task<JsonResult> GetUsersBySeniorIdForTree([FromBody] Users_GetUsersBySeniorIdForTreeDto objDto)
        {
            using var objBL = DLUserHierarchy.GetDLUserHierarchy(SQLProvider);
            return Json(await objBL.GetUsersBySeniorIdForTree(objDto.UserId));
        }
    }
}
