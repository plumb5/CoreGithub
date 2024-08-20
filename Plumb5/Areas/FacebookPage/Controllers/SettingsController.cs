using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.FacebookPage.Dto;
using Plumb5.Controllers;

namespace Plumb5.Areas.FacebookPage.Controllers
{
    [Area("FacebookPage")]
    public class SettingsController : BaseController
    {
        public SettingsController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("Settings");
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveSettings([FromBody] Settings_SaveSettingsDto objDto)
        {
            int returnval = 0;
            using (var objDL = DLFacebookAssignmentSettings.GetDLFacebookAssignmentSettings(objDto.accountId,SQLProvider))
            {
                returnval =await objDL.SaveSettings(objDto.AssignmentSettings);
            }

            return Json(returnval);
        }
        [HttpPost]
        public async Task<JsonResult> GetSettings([FromBody] Settings_GetSettingsDto objDto)
        {
            HttpContext.Session.SetString("SelectedPageIndex", JsonConvert.SerializeObject(objDto.PageIndex));

            FacebookAssignmentSettings facebookSettings = null;
            using (var objDL = DLFacebookAssignmentSettings.GetDLFacebookAssignmentSettings(objDto.accountId,SQLProvider))
            {
                facebookSettings =await objDL.GetSettings(objDto.AssignmentSettings);
            }

            return Json(new { data = facebookSettings});
        }
        [HttpPost]
        public async Task<JsonResult> GetGroupList([FromBody] Settings_GetGroupListDto objDto)
        {
            using (var objDL = DLGroups.GetDLGroups(objDto.accountId,SQLProvider))
            {
                return Json(await objDL.GetGroupList(new Groups()));
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetUserList([FromBody] Settings_GetUserListDto objDto)
        {
            List<MLUserHierarchy> userHierarchyList = new List<MLUserHierarchy>();
            using (var objUser = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchyList =await objUser.GetHisUsers(objDto.UserId, objDto.accountId);
                userHierarchyList.Add(await objUser.GetHisDetails(objDto.UserId));
            }

            userHierarchyList = userHierarchyList.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

            return Json(userHierarchyList);
        }
        [HttpPost]
        public async Task<JsonResult> GetUserGroupList([FromBody] Settings_GetUserGroupListDto objDto)
        {
            List<UserGroup> userGroupList = new List<UserGroup>();

            Account account = new Account();
            using (var objAccount = DLAccount.GetDLAccount(SQLProvider))
            {
                account =await objAccount.GetAccountDetails(objDto.accountId);
            }
            using (var objDL =  DLUserGroup.GetDLUserGroup(SQLProvider))
            {
                userGroupList =await objDL.GetUserGroup(account.UserInfoUserId);
            }
            return Json(userGroupList);
        }
        [HttpPost]
        public async Task<JsonResult> GetFacebookPages()
        {
            var fbPages = JsonConvert.DeserializeObject<List<MLFacebookPages>>(HttpContext.Session.GetString("FacebookPages"));
            var SelectedPageIndex = HttpContext.Session.GetString("SelectedPageIndex")!= null ? int.Parse (HttpContext.Session.GetString("SelectedPageIndex").ToString()) : 0;
            return Json(new { fbPages, SelectedPageIndex });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> RemoveAccessToken([FromBody] Settings_RemoveAccessTokenDto objDto)
        {
            if (HttpContext.Session.GetString("FacebookToken") != null)
            {
                HttpContext.Session.SetString("FacebookToken", JsonConvert.SerializeObject(null));
            }
            if (HttpContext.Session.GetString("FacebookPages") != null)
            {
                HttpContext.Session.SetString("FacebookPages", JsonConvert.SerializeObject(null));
            }
            if (HttpContext.Session.GetString("SelectedPageIndex") != null)
            {
                HttpContext.Session.SetString("SelectedPageIndex", JsonConvert.SerializeObject(null));
            }
            using (var objDL = DLFacebookToken.GetDLFacebookToken(objDto.accountId,SQLProvider))
            {
                return Json(objDL.DeleteToken());
            }
        }
        [HttpPost]
        public async Task<JsonResult> LmsGroupsList([FromBody] Settings_LmsGroupsListDto objDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<MLUserHierarchy> userHierarchy = null;

            using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchy = await objUserHierarchy.GetHisUsers(user.UserId, objDto.accountId);
            }

            List<int> usersId = new List<int>();
            if (userHierarchy != null)
                usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();

            usersId.Add(user.UserId);

            string userId = string.Join(",", usersId.ToArray());

            if (String.IsNullOrEmpty(userId))
            {
                userId = user.UserId.ToString();
            }

            using (var objGroup = DLLmsGroup.GetDLLmsGroup(objDto.accountId,SQLProvider))
            {
                return Json(objGroup.GetListLmsGroup(0, 0, userId));
            }
        }
    }
}
