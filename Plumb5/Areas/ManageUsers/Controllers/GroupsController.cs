using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.ManageContact.Dto;
using Plumb5.Areas.ManageUsers.Dto;
using Plumb5.Controllers;

namespace Plumb5.Areas.ManageUsers.Controllers
{
    [Area("ManageUsers")]
    public class GroupsController : BaseController
    {
        public GroupsController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("Groups");
        }
        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] Groups_GetMaxCountDto objDto)
        {
            int returnVal = 0;
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                var MainUserId = 0;
                var Login = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));;
                if (Login.IsSuperAdmin == 0)
                {
                    using (var obj = DLUserInfo.GetDLUserInfo(SQLProvider))
                    {
                        MainUserId =await obj.MainUserId(Login.UserId);
                    }
                }
                var objDL = DLUserGroup.GetDLUserGroup(SQLProvider);
                returnVal =await objDL.GetUserGroupPermissionsCount(objDto.UserGroupName, Convert.ToInt32(MainUserId == 0 ? Login.UserId : MainUserId));
            }
            return Json(returnVal);
        }
        [HttpPost]
        public async Task<JsonResult> GetUserGroupList([FromBody] Groups_GetUserGroupListDto objDto)
        {
            List<MLUserGroupWithHierarchy> permissionsList = new List<MLUserGroupWithHierarchy>();
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                int MainUserId = 0;
                var Login = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));;
                if (Login.IsSuperAdmin == 0)
                {
                    using (var obj = DLUserInfo.GetDLUserInfo(SQLProvider))
                    {
                        MainUserId =await obj.MainUserId(Login.UserId);
                    }
                }
                var objDL = DLUserGroup.GetDLUserGroup(SQLProvider);
                permissionsList =await objDL.GetUserGroupPermissionsList(objDto.UserGroupName, objDto.OffSet, objDto.FetchNext, Convert.ToInt32(MainUserId == 0 ? Login.UserId : MainUserId));
            }
            return Json(permissionsList);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> DeleteUserGroup([FromBody] Groups_DeleteUserGroupDto objDto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                var objDL = DLUserGroup.GetDLUserGroup(SQLProvider);
                return Json(await objDL.DeleteUserGroupPermissions(objDto.UserGroupId));
            }
            return Json(false);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveOrUpdateGroup([FromBody] Groups_SaveOrUpdateGroupDto objDto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                var MainUserId = 0;
                var Login = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));;
                if (Login.IsSuperAdmin == 0)
                {
                    using (var obj = DLUserInfo.GetDLUserInfo(SQLProvider))
                    {
                        MainUserId =await obj.MainUserId(Login.UserId);
                    }
                }
                objDto.userGroup.UserInfoUserId = Convert.ToInt32(MainUserId == 0 ? Login.UserId : MainUserId);
                objDto.userGroup.CreatedByUserId = Login.UserId;
                bool Status = false;
                if (objDto.userGroup.Id <= 0)
                {
                    var objDL = DLUserGroup.GetDLUserGroup(SQLProvider);
                    objDto.userGroup.Id =await objDL.Save(objDto.userGroup);
                }
                else if (objDto.userGroup.Id > 0)
                {
                    var objDL = DLUserGroup.GetDLUserGroup(SQLProvider);
                    await objDL.Update(objDto.userGroup);
                }
                if (objDto.userGroup.Id > 0 && objDto.permissionsList != null)
                {
                    var objDL = DLUserGroup.GetDLUserGroup(SQLProvider);
                    await objDL.DeleteSavedGroupPermissions(objDto.permissionsList, objDto.userGroup.Id);
                    Status =await objDL.SavePermissions(objDto.permissionsList, objDto.userGroup.Id);
                }
                if (objDto.userGroup.Id > 0)
                {
                    var objDL = DLUserGroup.GetDLUserGroup(SQLProvider);
                     await objDL.DeleteUserGroupsAccount(objDto.userGroup);

                    if (objDto.Accounts != null && objDto.Accounts.Count() > 0)
                        for (int i = 0; i < objDto.Accounts.Count(); i++)
                        {
                           await objDL.InsertUserGroupsAccount(objDto.userGroup, objDto.Accounts[i]);
                        }
                }
            }
            return Json(new { UserGroup = objDto.userGroup });
        }
        [HttpPost]
        public async Task<JsonResult> GetAccounts()
        {
            List<UserAccounts> Accounts = new List<UserAccounts>();
            List<UserAccounts> AccountsNew = new List<UserAccounts>();
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                var Login = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));;
                UserDetails objml = new UserDetails() { MainUserId = Login.UserId };
                using (var objuserAccounts = DLUserDetails.GetDLUserDetails(SQLProvider))
                {
                    Accounts =await objuserAccounts.GetUsersAccount(objml);
                }
            }
            return Json(Accounts);
        }
        [HttpPost]
        public async Task<JsonResult> GetPermissionsList([FromBody] Groups_GetPermissionsListDto objDto)
        {
            int getFetchNext = objDto.FetchNext;
            if (objDto.FetchNext == 0)
            {
                getFetchNext = 10;
            }
            List<PermissionsLevels> permissionsList = null;
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                var objDL = DLPermissionsLevel.GetDLPermissionsLevel(SQLProvider);                
                var MainUserId = 0;
                var Login = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));;
                if (Login.IsSuperAdmin == 0)
                {
                    using (var obj = DLUserInfo.GetDLUserInfo(SQLProvider))
                    {
                        MainUserId =await obj.MainUserId(Login.UserId);
                    }
                }
                permissionsList =await objDL.GetPermissionsList(objDto.OffSet, getFetchNext, Convert.ToInt32(MainUserId == 0 ? Login.UserId : MainUserId));
            }
            return Json(permissionsList);
        }
        [HttpPost]
        public async Task<JsonResult> GetUserGroupToEdit([FromBody] Groups_GetUserGroupToEditDto objDto)
        {
            List<MLUserGroup> permissionsList = null;
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                var objDL = DLUserGroup.GetDLUserGroup(SQLProvider);
                permissionsList =await objDL.GetUserGroupPermissionsToBind(objDto.userGroup);
            }
            permissionsList = (permissionsList != null ? permissionsList : new List<MLUserGroup>());
            return Json(permissionsList);
        }
        [HttpPost]
        public async Task<JsonResult> GetGroupAccountsToEdit([FromBody] Groups_GetGroupAccountsToEditDto objDto)
        {
            List<UserAccounts> Accounts = null;
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                var objuserAccounts = DLUserGroup.GetDLUserGroup(SQLProvider);
                Accounts =await objuserAccounts.GetGroupAccounts(objDto.UserGroupId);
            }
            Accounts = (Accounts != null ? Accounts : new List<UserAccounts>());
            return Json(Accounts);
        }
    }
}
