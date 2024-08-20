using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLMobilePushCampaignResponseReport
    {
        public int MobilePushSendingSettingId { get; set; }
        public long Id { get; set; }
        public string? MessageContent { get; set; }
        public string? MessageTitle { get; set; }
        public int Sent { get; set; }
        public int IsViewed { get; set; }
        public int IsClicked { get; set; }
        public int IsClosed { get; set; }
        public int IsUnsubscribed { get; set; }
        public int NotSent { get; set; }
        public int ContactId { get; set; }
        public string? DeviceId { get; set; }
        public Nullable<DateTime> Date { get; set; }
        public string? ErrorMessage { get; set; }
        public string? P5UniqueId { get; set; }
        public string? ResponseId { get; set; }
        public int WorkFlowId { get; set; }
    }
}
