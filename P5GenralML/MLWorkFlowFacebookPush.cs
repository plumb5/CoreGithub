using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWorkFlowFacebookPush
    {
        public int ConfigureFacebookPushId { get; set; }
        public int CampaignId { get; set; }
        public Int32 SentCount { get; set; }
        public Int32 ClickCount { get; set; }
        public Int32 NotClickCount { get; set; }
        public DateTime Date { get; set; }
        public string? TemplateName { get; set; }
    }
    public class SendingList
    {
        public int ConfigureFacebookPushId { get; set; }
        public int CampaignId { get; set; }
        public string? Message { get; set; }
    }
    public class FacebookPushMachineList
    {
        public string? MachineId { get; set; }
        public int ContactId { get; set; }
        public string? FbUserId { get; set; }
    }
}