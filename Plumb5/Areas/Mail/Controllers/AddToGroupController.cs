using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Mail.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;

namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class AddToGroupController : BaseController
    {
        public AddToGroupController(IConfiguration _configuration) : base(_configuration)
        { }

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<JsonResult> ImportNewContactList(int[] contact, int GroupId, Groups group)
        {

            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo")); 
            //#region Logs
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "AddToGroup", "Mail", "ImportNewContactList", Helper.GetIP(), JsonConvert.SerializeObject(new { group = group, GroupId = GroupId, contact = contact }));
            //#endregion

            int UserInfoUserId =  group.UserInfoUserId = user.UserId;
            int UserGroupId =  group.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
            bool Status = false;
            string Message = ""; 
            if (!String.IsNullOrEmpty( group.Name))
            {
                using (var objDL =   DLGroups.GetDLGroups(domainDetails.AdsId,SQLProvider))
                {
                     GroupId = await objDL.Save( group);
                }
            } 
            if ( GroupId > 0)
            {
                int[] Groups = {  GroupId };
                using (GeneralAddToGroups generalAddToGroups = new GeneralAddToGroups(domainDetails.AdsId,SQLProvider))
                {
                    await generalAddToGroups.AddToGroupMemberAndRespectiveModule(UserInfoUserId, UserGroupId, Groups.ToArray(), contact);
                    Status = true;
                    Message = "Added Succesfully";
                    //LogMessage = "The Contact has been added to the group";
                }
            }
            else if (  GroupId == -1)
            {
                Status = false;
                Message = "This group name already exists.Please enter a different name";
                //LogMessage = "The contact has not been added into the group";
            }
            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = Status, Message = Message }), LogMessage);
            return Json(new { Status = Status, Message = Message } );
        }
    }
}
