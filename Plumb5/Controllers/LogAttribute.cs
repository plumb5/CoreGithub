using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using P5GenralML;
using Plumb5GenralFunction;
using System.Text;
using System.IO;
using Microsoft.AspNetCore.Http;

namespace Plumb5.Controllers
{
    public class LogAttribute : ActionFilterAttribute
    {
        private readonly string? SQLProvider;
        public string? CustomMessage { get; set; }
        public LogAttribute()
        {
            IConfiguration Configuration = new
                            ConfigurationBuilder()
                            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true).Build();
            SQLProvider = Configuration.GetSection("SqlProvider").Value;
        }

        public override async void OnActionExecuting(ActionExecutingContext filterContext)
        {
            try
            {
                var requestHeaderString = new StringBuilder();
                foreach (string keys in filterContext.HttpContext.Request.Headers.Keys)
                {
                    requestHeaderString.Append($"{keys}: {String.Join(", ", filterContext.HttpContext.Request.Headers[keys])}{Environment.NewLine}");
                }

                var RequestString = String.Empty;
                filterContext.HttpContext.Request.Body.Position = 0;

                if (filterContext.HttpContext.Request.Form.Files.Count > 0)
                {
                    RequestString = filterContext.HttpContext.Request.Form.Files[0].FileName;
                }
                else
                {
                    using (var inputStream = new StreamReader(filterContext.HttpContext.Request.Body))
                    {
                        RequestString = inputStream.ReadToEnd();
                        inputStream.Close();
                    }
                }

                WebLogger webLogger = new WebLogger()
                {
                    Headers = requestHeaderString.ToString(),
                    RequestType = "REQUEST",
                    StatusCode = string.Empty,
                    LogContent = RequestString
                };

                await WebLogger(filterContext.RouteData, filterContext.HttpContext, webLogger);
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("LogAttributeActionExecuting"))
                {
                    objError.AddError(ex.Message.ToString(), "Error in Saving the Log" + filterContext.RouteData.Values["action"].ToString(), DateTime.Now.ToString(), "LogAttribute->OnActionExecuting", ex.ToString(), true);
                }
            }
        }

        public override async void OnActionExecuted(ActionExecutedContext filterContext)
        {
            try
            {
                var responseHeaderString = new StringBuilder();
                foreach (string keys in filterContext.HttpContext.Response.Headers.Keys)
                {
                    responseHeaderString.Append($"{keys}: {String.Join(", ", filterContext.HttpContext.Response.Headers[keys])}{Environment.NewLine}");
                }

                var ResponseString = String.Empty;

                if (filterContext.Result is ViewResult viewResult)
                {
                    ResponseString = JsonConvert.SerializeObject(viewResult.ViewData);
                }
                if (filterContext.Result is JsonResult jsonResult)
                {
                    ResponseString = JsonConvert.SerializeObject(jsonResult.Value);
                }

                WebLogger webLogger = new WebLogger()
                {
                    Headers = responseHeaderString.ToString(),
                    RequestType = "RESPONSE",
                    StatusCode = Convert.ToString(filterContext.HttpContext.Response.StatusCode),
                    LogContent = ResponseString
                };

                await WebLogger(filterContext.RouteData, filterContext.HttpContext, webLogger);
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("LogAttributeActionExecuted"))
                {
                    objError.AddError(ex.Message.ToString(), "Error in Saving the Log" + filterContext.RouteData.Values["action"].ToString(), DateTime.Now.ToString(), "LogAttribute->OnActionExecuted", ex.ToString(), true);
                }
            }
        }

        //public override void OnResultExecuted(ResultExecutedContext filterContext)
        //{
        //    Log("OnResultExecuted", filterContext.RouteData, filterContext.HttpContext);
        //}

        //public override void OnResultExecuting(ResultExecutingContext filterContext)
        //{
        //    Log("OnResultExecuting ", filterContext.RouteData, filterContext.RequestContext);
        //}

        private async Task WebLogger(RouteData routeData, HttpContext httpContext, WebLogger webLogger)
        {
            try
            {
                int AccountId = 0;
                int UserId = 0;
                string UserName = string.Empty;
                string UserEmail = string.Empty;
                if (httpContext.Session.GetString("UserInfo") != null)
                {
                    UserInfo? userInfo = JsonConvert.DeserializeObject<UserInfo>(httpContext.Session.GetString("UserInfo"));
                    UserId = userInfo.UserId;
                    UserName = userInfo.FirstName;
                    UserEmail = userInfo.EmailId;
                }

                if (httpContext.Session.GetString("AccountInfo") != null)
                {
                    DomainInfo? domainInfo = JsonConvert.DeserializeObject<DomainInfo>(httpContext.Session.GetString("AccountInfo"));
                    AccountId = domainInfo.AdsId;
                }

                webLogger.AccountId = AccountId;
                webLogger.AbsoluteUri = httpContext.Request.Host.Value;
                webLogger.UserEmail = UserEmail;
                webLogger.UserInfoUserId = UserId;
                webLogger.UserName = UserName;
                webLogger.CreatedDate = DateTime.Now;
                webLogger.ActionName = routeData.Values["action"].ToString();
                webLogger.ControllerName = routeData.Values["controller"].ToString();
                webLogger.ChannelName = httpContext.GetRouteValue("area") as string ?? string.Empty;
                webLogger.IpAddress = Helper.GetIpAddress(httpContext);
                //webLogger.LogUniqueId = httpContext.Session.Id;
                webLogger.LogUniqueId = httpContext.Session.Id + "$$$" + DateTime.Now.ToLongTimeString();
                webLogger.RequestedMethod = httpContext.Request.Method;
                webLogger.CallType = (httpContext.Request != null && httpContext.Request.Headers["X-Requested-With"] == "XMLHttpRequest") ? "AJAX" : "DIRECT";
                webLogger.Useragent = httpContext.Request.Headers.UserAgent;
                webLogger.CustomMessage = CustomMessage;

                 await Helper.SaveWebLogger(webLogger, SQLProvider);// un comment
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("LogAttribute"))
                {
                    objError.AddError(ex.Message.ToString(), "Error in Saving the Log" + routeData.Values["action"].ToString() + JsonConvert.SerializeObject(webLogger).ToString(), DateTime.Now.ToString(), "LogAttribute->Log", ex.ToString(), true);
                }
            }
        }
    }
}
