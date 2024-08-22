using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using P5GenralDL;
using System.Collections;
using Plumb5.Areas.Mail.Dto;

namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class GroupController : BaseController
    {
        public GroupController(IConfiguration _configuration) : base(_configuration)
        { }

        public ActionResult Index()
        {
            return View("Groups");
        }

        [HttpPost]
        public async Task<IActionResult> MaxCount([FromBody] Groups group)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            group.UserInfoUserId = user.UserId;
            int returnVal;
            using (var objDL = DLGroups.GetDLGroups(domainDetails.AdsId, SQLProvider))
            {
                returnVal = await objDL.MaxCount(group);
            }
            return Json(new
            {
                returnVal
            });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveOrUpdateDetails([FromBody] Groups group)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            if (user != null)
            {
                group.UserInfoUserId = user.UserId;
                group.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
            }

            if (group.Id <= 0)
            {
                using (var objDL = DLGroups.GetDLGroups(domainDetails.AdsId, SQLProvider))
                {
                    group.Id = await objDL.Save(group);
                }
            }
            else if (group.Id > 0)
            {
                using (var objDL = DLGroups.GetDLGroups(domainDetails.AdsId, SQLProvider))
                {
                    if (!await objDL.Update(group))
                    {
                        group.Id = -1;
                    }
                }
            }
            return Json(new { Group = group, UserName = user.UserName });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Delete(int Id)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            Groups? groupDetails;
            using (var objDL = DLGroups.GetDLGroups(domainDetails.AdsId, SQLProvider))
            {
                groupDetails = await objDL.Get(new Groups() { Id = Id });
            }

            using (var objDL = DLGroups.GetDLGroups(domainDetails.AdsId, SQLProvider))
            {
                bool result = await objDL.Delete(Id);
                return Json(result);
            }
        }

        //Separate Method

        [HttpPost]
        public async Task<JsonResult> GetAllActiveInactiveCustomerCount()
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            using (var objDL = DLGroups.GetDLGroups(domainDetails.AdsId, SQLProvider))
            {
                List<MLMailGroupsStaticContacts> allcontacts = await objDL.GetAllActiveInactiveCustomerCount();

                return Json(allcontacts);
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetMaxCount([FromBody] MLGroups group)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            int returnVal;
            using (var objDL = DLGroups.GetDLGroups(domainDetails.AdsId, SQLProvider))
            {
                returnVal = await objDL.GetMaxCount(group);
            }
            return Json(new
            {
                returnVal
            });
        }

        [HttpPost]
        public async Task<IActionResult> BindGroupsContact([FromBody] GroupDto_BindGroupsContact commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            List<MLGroups> groupdetails = null;

            ArrayList data = new ArrayList() { commonDetails.group };
            HttpContext.Session.SetString("UserInfo", JsonConvert.SerializeObject(data));

            using (var objDL = DLGroups.GetDLGroups(domainDetails.AdsId, SQLProvider))
            {
                groupdetails = await objDL.BindGroupsContact(commonDetails.group, commonDetails.FetchNext, commonDetails.OffSet);
            }
            return Json(groupdetails);
        }

        [HttpPost]
        public async Task<IActionResult> GroupsContactImport([FromBody] GroupDto_GroupsContactImport commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            List<MLGroups> groupdetails = null;

            using (var objDL = DLGroups.GetDLGroups(domainDetails.AdsId, SQLProvider))
            {
                groupdetails = await objDL.BindGroupsContact(commonDetails.group, commonDetails.FetchNext, commonDetails.OffSet);
            }
            return Json(groupdetails);
        }

        [HttpPost]
        public async Task<IActionResult> GetGroupList([FromBody] GroupDto_GetGroupList commonDetails)
        {
            Groups groupData=new Groups();
            if (commonDetails.group != null)
                groupData = commonDetails.group;

            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            List<Groups> groupList = null;

            using (var objDL = DLGroups.GetDLGroups(commonDetails.accountId, SQLProvider))
            {
                groupData.UserInfoUserId = user.UserId;
                groupList = await objDL.GetGroupList(groupData);
            }

            return Json(groupList);
        }

        [HttpPost]
        public async Task<IActionResult> BindGroupsDetailsWithoutCount([FromBody] GroupDto_BindGroupsDetailsWithoutCount commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            List<MLGroups> groupdetails = null;

            ArrayList data = new ArrayList() { commonDetails.group };
            HttpContext.Session.SetString("MailGroups", JsonConvert.SerializeObject(data));

            using (var objDL = DLGroups.GetDLGroups(domainDetails.AdsId, SQLProvider))
            {
                groupdetails = await objDL.BindGroupsDetailsWithoutCount(commonDetails.group, commonDetails.FetchNext, commonDetails.OffSet);
            }
            return Json(groupdetails);
        }

        [HttpPost]
        public async Task<IActionResult> GetGroupsCountByGroupId([FromBody] GroupDto_GetGroupsCountByGroupId commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            MLGroups? groupDetails = null;

            using (var objDL = DLGroups.GetDLGroups(domainDetails.AdsId, SQLProvider))
            {
                groupDetails = await objDL.GetGroupsCountByGroupId(commonDetails.GroupId);
            }

            if (groupDetails == null)
            {
                groupDetails = new MLGroups()
                {
                    Id = commonDetails.GroupId,
                    Total = 0,
                    InValid = 0,
                    UnVerified = 0,
                    Unsubscribe = 0,
                    Verified = 0
                };
            }

            return Json(groupDetails);
        }
    }
}
