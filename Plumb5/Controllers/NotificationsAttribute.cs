using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5GenralFunction;

namespace Plumb5.Controllers
{
    public class NotificationsAttribute : ActionFilterAttribute
    {
        public string Heading { get; set; }
        public string ActionDetails { get; set; } 
        public  string SqlProvider { get; set; } 
        public override async void OnActionExecuted(ActionExecutedContext filterContext)
        {
            try
            {
                int AccountId = 0;
                int UserId = 0;

                if (filterContext.HttpContext.Session.GetString("UserInfo") != null)
                {
                    LoginInfo? userInfo = JsonConvert.DeserializeObject<LoginInfo>(filterContext.HttpContext.Session.GetString("UserInfo"));
                    
                    UserId = userInfo.UserId;

                }

                if (filterContext.HttpContext.Session.GetString("AccountInfo") != null)
                {
                    DomainInfo? domainInfo = JsonConvert.DeserializeObject<DomainInfo>(filterContext.HttpContext.Session.GetString("AccountInfo"));
                     
                    AccountId = domainInfo.AdsId;
                }

                Notifications notifications = new Notifications()
                {
                    UserInfoUserId = UserId,
                    Heading = Heading,
                    Details = ActionDetails,
                    PageUrl = filterContext.RouteData.Values["controller"].ToString(),
                    IsThatSeen = false
                };

                using (var objDL =  DLNotifications.GetDLNotifications(AccountId, SqlProvider))
                {
                    await objDL.Save(notifications);
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("NotificationsAttribute"))
                {
                    objError.AddError(ex.Message.ToString(), "Error in Saving the Notifications", DateTime.Now.ToString(), "NotificationsAttribute->OnActionExecuting", ex.ToString(), true);
                }
            }
        }

    }
}
