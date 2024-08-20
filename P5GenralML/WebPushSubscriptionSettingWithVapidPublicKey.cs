using System;

namespace P5GenralML
{
    public class WebPushSubscriptionSettingWithVapidPublicKey
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int UserGroupId { get; set; }
        public string? WebPushStep { get; set; }
        public bool IsShowOnAllPages { get; set; }
        public string? ShowSpecificPageUrl { get; set; }
        public int ShowOptInDelayTime { get; set; }
        public int HideOptInDelayTime { get; set; }
        public bool IsOptInDeviceDesktop { get; set; }
        public bool IsOptInDeviceMobile { get; set; }
        public bool IsNotificationToLastDevice { get; set; }
        public string? ExcludePageUrl { get; set; }
        public string? WelcomeMessageTitle { get; set; }
        public string? WelcomeMessageText { get; set; }
        public string? WelcomeMessageIcon { get; set; }
        public string? WelcomeMessageRedirectUrl { get; set; }
        public string? HttpOrHttpsPush { get; set; }
        public string? Step2ConfigurationSubDomain { get; set; }
        public string? NotificationPromptType { get; set; }
        public string? NotificationPosition { get; set; }
        public string? NotificationMessage { get; set; }
        public string? NotificationAllowButtonText { get; set; }
        public string? NotificationDoNotAllowButtonText { get; set; }
        public string? NotificationBodyBackgoundColor { get; set; }
        public string? NotificationBodyTextColor { get; set; }
        public string? NotificationButtonBackgoundColor { get; set; }
        public string? NotificationButtonTextColor { get; set; }
        public string? NativeBrowserMessage { get; set; }
        public string? NativeBrowserIcon { get; set; }
        public string? NativeBrowserBackgoundColor { get; set; }
        public string? NativeBrowserTextColor { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string? VapidPublicKey { get; set; }
        public int GroupId { get; set; }
    }
}
