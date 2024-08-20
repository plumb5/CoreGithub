using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MobilePushSent
    {
        public long Id { get; set; }

        public int MobilePushSendingSettingId { get; set; }

        public int MobilePushTemplateId { get; set; }

        public string SessionId { get; set; }

        public string DeviceId { get; set; }

        public byte IsSent { get; set; }

        public byte IsViewed { get; set; }

        public byte IsClicked { get; set; }

        public byte IsClosed { get; set; }

        public byte IsUnsubscribed { get; set; }

        public byte SendStatus { get; set; }

        public int WorkFlowId { get; set; }

        public int WorkFlowDataId { get; set; }

        public string CampaignJobName { get; set; }

        public DateTime? SentDate { get; set; }

        public DateTime? ViewDate { get; set; }

        public DateTime? ClickDate { get; set; }

        public DateTime? CloseDate { get; set; }

        public DateTime? UnsubscribedDate { get; set; }

        public int ContactId { get; set; }

        public string ErrorMessage { get; set; }

        public string Title { get; set; }
        public string SubTitle { get; set; }
        public string MessageContent { get; set; }

        public string P5UniqueId { get; set; }

        public string ResponseId { get; set; }

        public string OSName { get; set; }

        public string FCMRegId { get; set; }

        public string ClickedDevice { get; set; }

        public string ClickedDeviceType { get; set; }

        public string ClickedUserAgent { get; set; }
    }
}
