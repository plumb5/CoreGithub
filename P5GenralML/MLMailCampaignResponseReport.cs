using System;
namespace P5GenralML
{
    public class MLMailCampaignResponseReport
    {
        public int MailSendingSettingId { get; set; }
        public long Id { get; set; }
        public string? MailContent { get; set; }
        public string? ProductIds { get; set; }
        public int Sent { get; set; }
        public int Opened { get; set; }
        public int Clicked { get; set; }
        public int Forward { get; set; }
        public int Unsubscribe { get; set; }
        public int IsBounced { get; set; }
        public int NotSent { get; set; }
        public int ContactId { get; set; }
        public string? EmailId { get; set; }
        public string? GroupName { get; set; }
        public short DripSequence { get; set; }
        public short DripConditionType { get; set; }
        public Nullable<DateTime> Date { get; set; }
        public string? ErrorMessage { get; set; }
        public string? BouncedReason { get; set; }
        public Nullable<DateTime> BouncedDate { get; set; }
        public string? BouncedCategory { get; set; }
        public string? BouncedErrorcode { get; set; }
        public string? OpenedDevice { get; set; }
        public string? OpenedDeviceType { get; set; }
        public string? ClickedDevice { get; set; }
        public string? ClickedDeviceType { get; set; }
        public string? ForwardedDevice { get; set; }
        public string? ForwardedDeviceType { get; set; }
        public string? UnsubscribedDevice { get; set; }
        public string? UnsubscribedDeviceType { get; set; }
        public string? ResponseId { get; set; }
        public int WorkFlowId { get; set; }
        public int Delivered { get; set; }
    }
}
