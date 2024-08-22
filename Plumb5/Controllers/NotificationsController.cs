using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Dto;

namespace Plumb5.Controllers
{
    public class NotificationsController : BaseController
    {
        public NotificationsController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /Notifications/

        public ActionResult Index()
        {
            return View();
        }

        public async Task<JsonResult> GetNotificationCount([FromBody] Notifications_GetNotificationCountDto NotificationsDto)
        {
            int NotificationCount = 0;
            LoginInfo? userInfo = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            using (var obDL =   DLNotifications.GetDLNotifications(NotificationsDto.AccountId, SQLProvider))
            {
                NotificationCount = await obDL.GetNotificationCount(userInfo.UserId);
                return Json(NotificationCount );
            }
        }

        public async Task<JsonResult> GetNotifications([FromBody] Notifications_GetNotificationsDto NotificationsDto)
        {
            List<Notifications> notificationsDetails;
            LoginInfo? userInfo = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            using (var obDL =   DLNotifications.GetDLNotifications(NotificationsDto.AccountId, SQLProvider))
            {
                notificationsDetails = await obDL.GetNotifications(userInfo.UserId);
                return Json(notificationsDetails );
            }
        }

        public async Task<JsonResult> UpdateSeenStatus([FromBody] Notifications_UpdateSeenStatusDto NotificationsDto)
        {
            LoginInfo? userInfo = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            NotificationsDto.notifications.UserInfoUserId = userInfo.UserId;
            bool Status = false;
            using (var obDL = DLNotifications.GetDLNotifications(NotificationsDto.AccountId, SQLProvider))
            {
                Status = await obDL.UpdateSeenStatus(NotificationsDto.notifications);
            }
            return Json(new { Status }  );
        }
    }
}
