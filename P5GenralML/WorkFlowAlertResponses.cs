using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowAlertResponses
    {
        public int ConfigureAlertId { get; set; }
        public string AlertThroughEmail { get; set; }
        public string AlertThroughSMS { get; set; }      
        public string AlertThroughCall { get; set; }
        public string RedirectUrl { get; set; }
        public string GroupId { get; set; }
        public string AssignLeadToUserId { get; set; }
        public string WebHooksUrl { get; set; }
        public string WebHooksFinalUrl { get; set; }
        public string WebHookMethodType { get; set; }
        public string WebHookHeader { get; set; }
        public string WebHookParams { get; set; }
        public DateTime CreatedDate { get; set; }       
        public string SelectedTab { get; set; }
        public string WebHookFinalParams { get; set; }
        public string WebPushUsers { get; set; }
        public string AppPushUsers { get; set; }
        public string WebHookExtraParams { get; set; }
        public string IsPlugins { get; set; }
        public string ContentType { get; set; }
        public string PostMethodBody { get; set; }
    }
}
