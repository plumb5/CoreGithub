using System;

namespace P5GenralML
{
    public class WebPushSent
    {
        public Int64 Id { get; set; }

        public int WebPushSendingSettingId { get; set; }

        public int? WebPushTemplateId { get; set; }

        public string? SessionId { get; set; }

        public string? MachineId { get; set; }

        public short IsSent { get; set; }

        public short IsViewed { get; set; }

        public short IsClicked { get; set; }

        public short IsClosed { get; set; }

        public short IsUnsubscribed { get; set; }

        public short? SendStatus { get; set; }

        public int? WorkFlowId { get; set; }

        public int? WorkFlowDataId { get; set; }

        public string? CampaignJobName { get; set; }

        public DateTime? SentDate { get; set; }

        public DateTime? ViewDate { get; set; }

        public DateTime? ClickDate { get; set; }

        public DateTime? CloseDate { get; set; }

        public DateTime? UnsubscribedDate { get; set; }

        public int? ContactId { get; set; }

        public string? ErrorMessage { get; set; }

        public string? MessageTitle { get; set; }

        public string? MessageContent { get; set; }

        public string? P5UniqueId { get; set; }

        public string? ResponseId { get; set; }

        public string? VendorName { get; set; }

        public string? FCMRegId { get; set; }

        public string? VapidEndpointUrl { get; set; }

        public string? VapidTokenkey { get; set; }

        public string? VapidAuthkey { get; set; }

        public string? ClickedDevice { get; set; }

        public string? ClickedDeviceType { get; set; }

        public string? ClickedUserAgent { get; set; }
        public string? BrowserName { get; set; }       
        public string? Button1_Redirect { get; set; }
        public string? Button2_Redirect { get; set; }
        public string? OnClickRedirect { get; set; }
        public string? BannerImage { get; set; }
    }
}
