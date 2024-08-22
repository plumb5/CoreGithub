using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Dashboard.Dto;
using Plumb5.Areas.ManageContact.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;

namespace Plumb5.Areas.ManageContact.Controllers
{
    [Area("ManageContact")]
    public class MobilePushSubscribersController : BaseController
    {
        public MobilePushSubscribersController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("MobilePushSubscribers");
        }
        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] MobilePushSubscribers_GetMaxCount objDto)
        {
            using (var webPushDashboard = DLMobileDeviceInfo.GetDLMobileDeviceInfo(objDto.AccountId,SQLProvider))
            {
                return Json(await webPushDashboard.GetGroupMaxCount(objDto.mobPushUser, objDto.GroupId));
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetDetails([FromBody] MobilePushSubscribers_GetDetails objDto)
        {

            ArrayList data = new ArrayList() { objDto.mobPushUser, objDto.GroupId };
            HttpContext.Session.SetString("mobPushUser", JsonConvert.SerializeObject(data));
            using (var webPushDashboard = DLMobileDeviceInfo.GetDLMobileDeviceInfo(objDto.AccountId,SQLProvider))
            {
                return Json(await webPushDashboard.GetGroupDetails(objDto.mobPushUser, objDto.Offset, objDto.FetchNext, objDto.GroupId));
            }
        }

        [Log]
        [HttpPost]
        public async Task<ActionResult> ExportMobPushSubscribers([FromBody] MobilePushSubscribers_ExportMobPushSubscribers objDto)
        {
            System.Data.DataSet dataSet = new System.Data.DataSet("General");

            IEnumerable<MobileDeviceInfo> webPushUserList = null;
            MobileDeviceInfo mobPushUser = null;

            MLGeneralSmsFilter smsFilterDetails = new MLGeneralSmsFilter();
            int GroupId = 0;
            if (HttpContext.Session.GetString("mobPushUser") != null)
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("mobPushUser"));               
                mobPushUser = (MobileDeviceInfo)data[0];
                GroupId = int.Parse(data[1].ToString());
            }
            using (var webPushDashboard = DLMobileDeviceInfo.GetDLMobileDeviceInfo(objDto.AccountId,SQLProvider))
            {
                webPushUserList =await webPushDashboard.GetGroupDetails(mobPushUser, objDto.OffSet, objDto.FetchNext, GroupId);
            }
            string TimeZone =await Helper.GetAccountTimeZoneFromCachedMemory(objDto.AccountId,SQLProvider);
            int RowNo = 1;
            var NewListData = webPushUserList.Select(x => new
            {
                SLNo = RowNo++,
                MachineId = x.DeviceId,
                IPAddress = x.OS,
                Manufacturer = x.Manufacturer,
                Name = x.Name,
                SubscribedStatus = x.InstalledStatus,
                SubscribedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.DeviceDate.ToString())).ToString(),
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTable();
            dataSet.Tables.Add(dtt);

            string FileName = "MobPushSubscribers_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + objDto.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (objDto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }
        [HttpPost]
        public async Task<ActionResult> GetGroupList([FromBody] MobilePushSubscribers_GetGroupList objDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            List<Groups> groupList = null;

            using (var objDL = DLGroups.GetDLGroups(objDto.accountId, SQLProvider))
            {
                groupList =await objDL.GetGroupList(new Groups { UserInfoUserId = user.UserId });
            }

            return Json(groupList);
        }
    }
}
