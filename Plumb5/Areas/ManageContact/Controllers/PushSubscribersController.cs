using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.ManageContact.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;

namespace Plumb5.Areas.ManageContact.Controllers
{
    [Area("ManageContact")]
    public class PushSubscribersController : BaseController
    {
        public PushSubscribersController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("PushSubscribers");
        }
        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] PushSubscribers_GetMaxCountDto objDto)
        {
            using (var webPushDashboard = DLWebPushUser.GetDLWebPushUser(objDto.AccountId, SQLProvider))
            {
                return Json(await webPushDashboard.GetGroupMaxCount(objDto.webPushUser, objDto.GroupId));
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetDetails([FromBody] PushSubscribers_GetDetailsDto objDto)
        {

            ArrayList data = new ArrayList() { objDto.webPushUser, objDto.GroupId };
            HttpContext.Session.SetString("WebPushUser", JsonConvert.SerializeObject(data));

            using (var webPushDashboard = DLWebPushUser.GetDLWebPushUser(objDto.AccountId,SQLProvider))
            {
                return Json(await webPushDashboard.GetGroupDetails(objDto.webPushUser, objDto.Offset, objDto.FetchNext, objDto.GroupId));
            }
        }

        [Log]
        [HttpPost]
        public async Task<ActionResult> ExportWebPushSubscribers([FromBody] PushSubscribers_ExportWebPushSubscribersDto objDto)
        {
            System.Data.DataSet dataSet = new System.Data.DataSet("General");

            List<MLWebPushUser> webPushUserList = null;
            WebPushUser webPushUser = null;

            MLGeneralSmsFilter smsFilterDetails = new MLGeneralSmsFilter();
            int GroupId = 0;
            if (HttpContext.Session.GetString("WebPushUser") != null)
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("WebPushUser"));
                webPushUser = (WebPushUser)data[0];
                GroupId = int.Parse(data[1].ToString());
            }

            using (var webPushDashboard =  DLWebPushUser.GetDLWebPushUser(objDto.AccountId,SQLProvider))
            {
                webPushUserList =(await webPushDashboard.GetGroupDetails(webPushUser, objDto.OffSet, objDto.FetchNext, GroupId)).ToList();
            }

            string TimeZone =await Helper.GetAccountTimeZoneFromCachedMemory(objDto.AccountId,SQLProvider);
            int RowNo = 1;
            var NewListData = webPushUserList.Select(x => new
            {
                SLNo = RowNo++,
                Name = x.Name,
                MachineId = x.MachineId,
                IPAddress = x.IPAddress,
                SubscribedStatus = x.IsSubscribe ? "Active" : "In-Active",
                SubscribedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.SubscribeDate.ToString())).ToString(),
                SubscribedURL = x.SubscribedURL
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTable();
            dataSet.Tables.Add(dtt);

            string FileName = "WebPushSubscribers_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + objDto.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (objDto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }
        [HttpPost]
        public async Task<ActionResult> GetGroupList([FromBody] PushSubscribers_GetGroupListDto objDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            List<Groups> groupList = null;

            using (var objDL = DLGroups.GetDLGroups(objDto.accountId,SQLProvider))
            {
                groupList =await objDL.GetGroupList(new Groups { UserInfoUserId = user.UserId });
            }

            return Json(groupList);
        }
    }
}
