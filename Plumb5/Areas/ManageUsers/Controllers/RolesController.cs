using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.ManageUsers.Dto;
using Plumb5.Areas.ManageUsers.Models;
using Plumb5.Controllers;

namespace Plumb5.Areas.ManageUsers.Controllers
{
    [Area("ManageUsers")]
    public class RolesController : BaseController
    {
        public RolesController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("Roles");
        }
        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] Roles_GetMaxCountDto objDto)
        {
            int returnVal = 0;
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                var MainUserId = 0;
                var Login = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                if (Login.IsSuperAdmin == 0)
                {
                    using (var obj = DLUserInfo.GetDLUserInfo(SQLProvider))
                    {
                        MainUserId =await obj.MainUserId(Login.UserId);
                    }
                }
                var objDL =DLPermissionsLevel.GetDLPermissionsLevel(SQLProvider);
                returnVal =await objDL.GetMaxCount(Convert.ToInt32(MainUserId == 0 ? Login.UserId : MainUserId), objDto.RolesName);
            }
            return Json(returnVal);
        }
        [HttpPost]
        public async Task<JsonResult> GetPermissionsList([FromBody] Roles_GetPermissionsListDto objDto)
        {
            List<Roles> permissionsList = new List<Roles>();
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                using (RolesDetails objDL = new RolesDetails())
                {
                    LoginInfo user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                    var MainUserId = 0;
                    var Login = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                    if (Login.IsSuperAdmin == 0)
                    {
                        using (var obj = DLUserInfo.GetDLUserInfo(SQLProvider))
                        {
                            MainUserId =await obj.MainUserId(Login.UserId);
                        }
                    }
                    permissionsList =await objDL.GetRolesDetails(Convert.ToInt32(MainUserId == 0 ? Login.UserId : MainUserId), objDto.RolesName, objDto.OffSet, objDto.FetchNext, SQLProvider);
                }
            }
            return Json(permissionsList);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Delete([FromBody] Roles_DeleteDto objDto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                var objDL = DLPermissionsLevel.GetDLPermissionsLevel(SQLProvider);
                return Json(await objDL.Delete(objDto.Id));
            }
            return Json(false);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveOrUpdateDetails([FromBody] Roles_SaveOrUpdateDetailsDto objDto)
        {
            PermissionsLevels permissionslevel=new PermissionsLevels();
            permissionslevel=objDto.permissionsleveldata;

            List<PermissionSubLevels> permissionSubLevelsList = new List<PermissionSubLevels>();
            permissionSubLevelsList = objDto.permissionSubLevelsListData;

            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                var MainUserId = 0;
                var Login = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                if (Login.IsSuperAdmin == 0)
                {
                    using (var obj = DLUserInfo.GetDLUserInfo(SQLProvider))
                    {
                        MainUserId =await obj.MainUserId(Login.UserId);
                    }
                }
                permissionslevel.MainUserId = Convert.ToInt32(MainUserId == 0 ? Login.UserId : MainUserId);
                permissionslevel.CreatedByUserId = Login.UserId;

                if (objDto.PermissionLevelId > 0)
                {
                    using (var objPermissionSubLevels = DLPermissionSubLevels.GetDLPermissionSubLevels(SQLProvider))
                    {
                        objPermissionSubLevels.Delete(objDto.PermissionLevelId);
                    }
                }


                if (permissionslevel.Id <= 0)
                {
                    var objDL = DLPermissionsLevel.GetDLPermissionsLevel(SQLProvider);
                    permissionslevel.Id =await objDL.Save(permissionslevel);

                    if (permissionSubLevelsList != null)
                    {
                        foreach (PermissionSubLevels permissionSubLevels in permissionSubLevelsList)
                        {
                            if (permissionslevel.Id > 0 && permissionSubLevels.HasPermission)
                            {
                                permissionSubLevels.PermissionLevelId = permissionslevel.Id;
                                using (var objPermissionSubLevels = DLPermissionSubLevels.GetDLPermissionSubLevels(SQLProvider))
                                {
                                   await objPermissionSubLevels.Save(permissionSubLevels);
                                }
                            }
                        }
                    }
                }
                else if (permissionslevel.Id > 0)
                {
                    var objDL = DLPermissionsLevel.GetDLPermissionsLevel(SQLProvider);
                    bool updateStatus =await objDL.Update(permissionslevel);
                    if (!updateStatus)
                    {
                        permissionslevel.Id = -1;
                    }
                    else
                    {
                        if (permissionSubLevelsList != null)
                        {
                            foreach (PermissionSubLevels permissionSubLevels in permissionSubLevelsList)
                            {
                                if ((permissionSubLevelsList != null) && permissionSubLevels.HasPermission)
                                {
                                    permissionSubLevels.PermissionLevelId = permissionslevel.Id;
                                    using (var objPermissionSubLevels = DLPermissionSubLevels.GetDLPermissionSubLevels(SQLProvider))
                                    {
                                        await objPermissionSubLevels.Save(permissionSubLevels);
                                    }
                                }
                            }
                        }

                    }
                }


            }
            return Json(new { PermissionsLevel = permissionslevel });
        }
        [HttpPost]
        public async Task<JsonResult> GetPermission([FromBody] Roles_GetPermissionDto objDto)
        {
            PermissionsLevels permissionslevel = objDto.permissionsleveldata;

            List<PermissionSubLevels> responseSubRoleList = new List<PermissionSubLevels>();
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                var MainUserId = 0;
                var Login = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                if (Login.IsSuperAdmin == 0)
                {
                    using (var obj = DLUserInfo.GetDLUserInfo(SQLProvider))
                    {
                        MainUserId =await obj.MainUserId(Login.UserId);
                    }
                }
                permissionslevel.MainUserId = Convert.ToInt32(MainUserId == 0 ? Login.UserId : MainUserId);

                var objDL = DLPermissionsLevel.GetDLPermissionsLevel(SQLProvider);
                permissionslevel =await objDL.GetPermission(permissionslevel.Id, permissionslevel.MainUserId);

                using (var objsubLevels = DLPermissionSubLevels.GetDLPermissionSubLevels(SQLProvider))
                {
                    responseSubRoleList =await objsubLevels.GetAllDetails(new PermissionSubLevels() { PermissionLevelId = permissionslevel.Id });
                }
            }
            return Json(new { permissionslevel, responseSubRoleList });
            
        }
    }
}
