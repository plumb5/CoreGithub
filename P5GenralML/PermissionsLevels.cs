using System;

namespace P5GenralML
{
    public class PermissionsLevels
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string PermissionDescription { get; set; }
        public bool IsSuperAdmin { get; set; }
        public bool UserRole { get; set; }
        public bool UserRoleHasFullControl { get; set; }
        public bool UserRoleView { get; set; }
        public bool UserRoleContribute { get; set; }
        public bool Dashboard { get; set; }
        public bool DashboardHasFullControl { get; set; }
        public bool DashboardView { get; set; }
        public bool DashboardContribute { get; set; }
        public bool DashboardGuest { get; set; }
        public bool DashboardDesign { get; set; }
        public bool Contacts { get; set; }
        public bool ContactsHasFullControl { get; set; }
        public bool ContactsView { get; set; }
        public bool ContactsContribute { get; set; }
        public bool ContactsGuest { get; set; }
        public bool ContactsDesign { get; set; }
        public bool Analytics { get; set; }
        public bool AnalyticsHasFullControl { get; set; }
        public bool AnalyticsView { get; set; }
        public bool AnalyticsContribute { get; set; }
        public bool AnalyticsGuest { get; set; }
        public bool AnalyticsDesign { get; set; }
        public bool Forms { get; set; }
        public bool FormsHasFullControl { get; set; }
        public bool FormsView { get; set; }
        public bool FormsContribute { get; set; }
        public bool FormsDesign { get; set; }
        public bool FormsGuest { get; set; }
        public bool EmailMarketing { get; set; }
        public bool EmailMarketingHasFullControl { get; set; }
        public bool EmailMarketingView { get; set; }
        public bool EmailMarketingContribute { get; set; }
        public bool EmailMarketingDesign { get; set; }
        public bool EmailMarketingGuest { get; set; }
        public bool LeadManagement { get; set; }
        public bool LeadManagementHasFullControl { get; set; }
        public bool LeadManagementView { get; set; }
        public bool LeadManagementContribute { get; set; }
        public bool LeadManagementDesign { get; set; }
        public bool LeadManagementGuest { get; set; }
        public int UserGroupId { get; set; }


        public bool Social { get; set; }
        public bool SocialHasFullControl { get; set; }
        public bool SocialView { get; set; }
        public bool SocialContribute { get; set; }
        public bool SocialDesign { get; set; }
        public bool SocialGuest { get; set; }
        public bool DataManagement { get; set; }
        public bool DataManagementHasFullControl { get; set; }
        public bool DataManagementView { get; set; }
        public bool DataManagementContribute { get; set; }
        public bool DataManagementDesign { get; set; }
        public bool DataManagementGuest { get; set; }
        public bool Mobile { get; set; }
        public bool MobileHasFullControl { get; set; }
        public bool MobileView { get; set; }
        public bool MobileContribute { get; set; }
        public bool MobileDesign { get; set; }
        public bool MobileGuest { get; set; }

        public bool SMS { get; set; }
        public bool SMSHasFullControl { get; set; }
        public bool SMSView { get; set; }
        public bool SMSContribute { get; set; }
        public bool SMSDesign { get; set; }
        public bool SMSGuest { get; set; }
        public bool SiteChat { get; set; }
        public bool SiteChatHasFullControl { get; set; }
        public bool SiteChatView { get; set; }
        public bool SiteChatContribute { get; set; }
        public bool SiteChatDesign { get; set; }
        public bool SiteChatGuest { get; set; }

        public int MainUserId { get; set; }
        public int CreatedByUserId { get; set; }
        public bool Developer { get; set; }

        public bool WorkFlow { get; set; }
        public bool WorkFlowHasFullControl { get; set; }
        public bool WorkFlowView { get; set; }
        public bool WorkFlowContribute { get; set; }
        public bool WorkFlowDesign { get; set; }
        public bool WorkFlowGuest { get; set; }
        public bool WebPushNotification { get; set; }
        public bool WebPushNotificationHasFullControl { get; set; }
        public bool WebPushNotificationView { get; set; }
        public bool WebPushNotificationContribute { get; set; }
        public bool WebPushNotificationDesign { get; set; }
        public bool WebPushNotificationGuest { get; set; }
        public bool MobileEngagement { get; set; }
        public bool MobileEngagementHasFullControl { get; set; }
        public bool MobileEngagementView { get; set; }
        public bool MobileEngagementContribute { get; set; }
        public bool MobileEngagementDesign { get; set; }
        public bool MobileEngagementGuest { get; set; }
        public bool Export { get; set; }
        public bool MaskData { get; set; }
        public DateTime CreatedDate { get; set; }

        public bool Segmentation { get; set; }
        public bool SegmentationHasFullControl { get; set; }
        public bool SegmentationView { get; set; }
        public bool SegmentationContribute { get; set; }
        public bool SegmentationDesign { get; set; }
        public bool SegmentationGuest { get; set; }
        public bool MobilePushNotification { get; set; }
        public bool MobilePushNotificationHasFullControl { get; set; }
        public bool MobilePushNotificationView { get; set; }
        public bool MobilePushNotificationContribute { get; set; }
        public bool MobilePushNotificationDesign { get; set; }
        public bool MobilePushNotificationGuest { get; set; }

        public bool LeadScoring { get; set; }
        public bool LeadScoringHasFullControl { get; set; }
        public bool LeadScoringView { get; set; }
        public bool LeadScoringContribute { get; set; }
        public bool LeadScoringDesign { get; set; }
        public bool LeadScoringGuest { get; set; }
        public bool Whatsapp { get; set; }
        public bool WhatsappHasFullControl { get; set; }
        public bool WhatsappView { get; set; }
        public bool WhatsappContribute { get; set; }
        public bool WhatsappDesign { get; set; }
        public bool WhatsappGuest { get; set; }

        public bool CustomEvents { get; set; }
        public bool CustomEventsHasFullControl { get; set; }
        public bool CustomEventsView { get; set; }
        public bool CustomEventsContribute { get; set; }
        public bool CustomEventsDesign { get; set; }
        public bool CustomEventsGuest { get; set; }

        public bool GoogleAds { get; set; }
        public bool GoogleAdsHasFullControl { get; set; }
        public bool GoogleAdsView { get; set; }
        public bool GoogleAdsContribute { get; set; }
        public bool GoogleAdsDesign { get; set; }
        public bool GoogleAdsGuest { get; set; }
    }
}
