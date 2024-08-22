using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.WebPush.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.WebPush.Controllers
{
    [Area("WebPush")]
    public class SubscribersController : BaseController
    {
        public SubscribersController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("Subscribers");
        }
        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] Subscribers_GetMaxCountDto details)
        {
            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var webPushDashboard = DLWebPushUser.GetDLWebPushUser(details.AccountId, SQLProvider))
            {
                return Json(await webPushDashboard.GetMaxCount(details.webPushUser, FromDateTime, ToDateTime, details.FilterByEmailorPhone));
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetDetails([FromBody] Subscribers_GetDetailsDto details)
        {
            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            ArrayList data = new ArrayList() { details.webPushUser };
            HttpContext.Session.SetString("WebPushUser", JsonConvert.SerializeObject(data));
            HttpContext.Session.SetString("WebPushUserFilterByEmailorPhone", JsonConvert.SerializeObject(details.FilterByEmailorPhone));

            using (var webPushDashboard = DLWebPushUser.GetDLWebPushUser(details.AccountId, SQLProvider))
            {
                return Json(await webPushDashboard.GetDetails(details.webPushUser, FromDateTime, ToDateTime, details.Offset, details.FetchNext, details.FilterByEmailorPhone));
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetGroupNameByMachineId([FromBody] Subscribers_GetGroupNameByMachineIdDto details)
        {
            List<Groups> finalgroupList = new List<Groups>();
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            foreach (var deviceId in details.deviceIds)
            {
                using (var objDL = DLWebPushGroupMembers.GetDLWebPushGroupMembers(domainDetails.AdsId, SQLProvider))
                {
                    List<Groups> groupList = new List<Groups>();
                    groupList = await objDL.BelongToWhichGroup(deviceId);
                    finalgroupList.AddRange(groupList);
                }
            }
            return Json(finalgroupList);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> AddToGroup([FromBody] Subscribers_AddToGroupDto details)
        {
            List<Int64> addedId = new List<Int64>();
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            int UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(accountId, user.UserId, user.UserName, user.EmailId, "WebPush", "Subscribers", "AddToGroup", Helper.GetIP(), JsonConvert.SerializeObject(new { DeviceIds = MachineIds, Groups = Groups }));
            //#endregion

            using (GeneralAddToGroups generalAddToGroups = new GeneralAddToGroups(details.accountId, SQLProvider))
            {
                Tuple<List<Int64>, List<Int64>, List<Int64>> tuple = await generalAddToGroups.AddToGroupMemberAndRespectiveModule(user.UserId, UserGroupId, details.Groups, MachineIds: details.MachineIds);
                addedId = tuple.Item2.Where(x => x > 0).ToList();
            }
            return Json(addedId);
        }

        [Log]
        [HttpPost]
        public async Task<IActionResult> DeleteFromGroup([FromBody] Subscribers_DeleteFromGroupDto details)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(accountId, user.UserId, user.UserName, user.EmailId, "WebPush", "Subscribers", "DeleteFromGroup", Helper.GetIP(), JsonConvert.SerializeObject(new { MachineIds = MachineIds, Groups = Groups }));
            //#endregion
            bool result = false;
            foreach (var GroupId in details.Groups)
            {
                using (var objGroupMember = DLWebPushGroupMembers.GetDLWebPushGroupMembers(details.accountId, SQLProvider))
                {
                    result = await objGroupMember.RemoveFromGroup(details.MachineIds, GroupId);
                    //if (result)
                    //    LogMessage = "Deleted successfully";
                    //else
                    //    LogMessage = "Unable to delete";
                }
            }

            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Result = result }), LogMessage);
            return Json(result);
        }

        [Log]
        [HttpPost]
        public async Task<IActionResult> ExportWebPushSubscribers([FromBody] Subscribers_ExportWebPushSubscribersDto details)
        {
            System.Data.DataSet dataSet = new System.Data.DataSet("General");

            List<WebPushUser> webPushUserList = null;
            WebPushUser webPushUser = null;
            string FilterByEmailorPhone = null;

            MLGeneralSmsFilter smsFilterDetails = new MLGeneralSmsFilter();

            if (HttpContext.Session.GetString("WebPushUser") != null && HttpContext.Session.GetString("webpushTemplate") != "null")
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("WebPushUser"));
                webPushUser = JsonConvert.DeserializeObject<WebPushUser>(data[0].ToString());
            }

            if (HttpContext.Session.GetString("WebPushUserFilterByEmailorPhone") != null)
            {
                FilterByEmailorPhone = Convert.ToString(HttpContext.Session.GetString("WebPushUserFilterByEmailorPhone"));
            }

            DateTime FromDateTimes = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var webPushDashboard = DLWebPushUser.GetDLWebPushUser(details.AccountId, SQLProvider))
            {
                webPushUserList = (await webPushDashboard.GetDetails(webPushUser, FromDateTimes, ToDateTime, details.OffSet, details.FetchNext, FilterByEmailorPhone)).ToList();
            }

            int RowNo = 1;
            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(details.AccountId, SQLProvider);
            var NewListData = webPushUserList.Select(x => new
            {
                SLNo = RowNo++,
                MachineId = x.MachineId,
                IPAddress = x.IPAddress,
                SubscribedStatus = x.IsSubscribe ? "Active" : "In-Active",
                SubscribeDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.CreatedDate)).ToString(),
                SubscribedURL = x.SubscribedURL
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTable();
            dataSet.Tables.Add(dtt);

            string FileName = "WebPushSubscribers_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (details.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }
    }
}
