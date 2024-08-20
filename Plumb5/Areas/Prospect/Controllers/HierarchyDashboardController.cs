using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Prospect.Dto;
using Plumb5.Controllers;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class HierarchyDashboardController : BaseController
    {
        public HierarchyDashboardController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /Prospect/HierarchyDashboard/

        public IActionResult Index()
        {
            return View("HierarchyDashboard");
        }

        public async Task<ActionResult> GetUserHierarchyForIndividual([FromBody] HierarchyDashboard_GetUserHierarchyForIndividualDto HierarchyDashboardDto)
        {
            #region  variable
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            string userId = String.Empty;
            int userInfoUserId = 0;
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            List<int> userGroups = new List<int>();

            #endregion

            if (HttpContext.Session.GetString("UserInfo")  != null)
            {
                if (HierarchyDashboardDto.UserId > 0)
                {
                    userInfoUserId = HierarchyDashboardDto.UserId;
                    List<Groups> Groups = new List<Groups>();
                    using (var objBLUserInfo =   DLUserInfo.GetDLUserInfo(SQLProvider))
                    {
                        Groups = (await objBLUserInfo.Groups(userInfoUserId)).ToList();
                    }
                    userGroups = Groups.Select(x => x.UserGroupId).ToList();
                }
                else
                {
                    userInfoUserId = user.UserId;
                    userGroups = user.UserGroupIdList;
                }

                using (var objUserHierarchy =   DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                     userHierarchy.Add(await objUserHierarchy.GetHisDetails(userInfoUserId));

                userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

                List<int> usersId = new List<int>();
                if (userHierarchy != null)
                    usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();

                userId = string.Join(",", usersId.ToArray());

                if (String.IsNullOrEmpty(userId))
                    userId = userInfoUserId.ToString();
            }
            return Json(new { UserIds = userId, UserGrpList = userGroups, UserHierarchy = userHierarchy } );
        }
    }
}
