namespace P5GenralML
{
    public class PushCampaignModel
    {
        public int AccountId { get; set; }
        public string? CampaignName { get; set; }
        public int Type { get; set; }
        public string? ImageUrl { get; set; }
        public string? Ticker { get; set; }
        public string? Title { get; set; }
        public string? Message { get; set; }
        public string? SubText { get; set; }
        public string? Redirection { get; set; }
        public string? ExternalUrl { get; set; }
        public string? DeepLinkUrl { get; set; }
        public string? Parameters { get; set; }
        public string? ExtraButtons { get; set; }
        public int RuleStatus { get; set; }
        public int ResponseStatus { get; set; }
        public int CampaignId { get; set; }
        public string? BtnAction { get; set; }
        public System.Data.DataTable? GeoData { get; set; }
        public System.Data.DataTable? BeaconData { get; set; }
        public int GeoUpdate { get; set; }
        public int BeaconUpdate { get; set; }
        public int SendingType { get; set; }

        public string? IosRedirectTo { get; set; }
        public string? IosParameters { get; set; }

    }
    public class PushCampaign
    {
        public int AccountId { get; set; }
        public string? Action { get; set; }
        public string? Id { get; set; }
        public int Status { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public string? Type { get; set; }
        public string? SearchBy { get; set; }
        public string? Move { get; set; }
        public string? CamapignType { get; set; }
        public int Priority { get; set; }
        public int UserId { get; set; }
        public int UserGroupId { get; set; }
    }
    public class CampaignEffectiv
    {
        //public int AccountId { get; set; }
        public string? Action { get; set; }
        public int CampId { get; set; }
        public string? CampType { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
    }
    public class CampaignEffectivenessReport
    {
        public string? Action { get; set; }
        public int CampId { get; set; }
        public string? CampType { get; set; }
        public string? ButtonName { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
    }
    public class InAppBanners
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? ImageName { get; set; }
    }
    public class InAppDesign
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? CampaignName { get; set; }
        public string? Design { get; set; }
        public int RuleStatus { get; set; }
        public int ResponseStatus { get; set; }
        public int StaticForm { get; set; }
        public string? StartDate { get; set; }
        public string? ExpiryDate { get; set; }
    }
    public class ScreenNames
    {
        public string? Screen { get; set; }
    }
    public class Campaigns
    {
        public int CId { get; set; }
        public string? CamapaignName { get; set; }
    }
    public class CustomFieldTags
    {
        public string? Id { get; set; }
        public string? FieldName { get; set; }
    }
    public class ResponseSetting
    {
        public int MId { get; set; }
        public string? MailName { get; set; }
        public int SmsId { get; set; }
        public string? SMSName { get; set; }
        public int UserId { get; set; }
        public string? FirstName { get; set; }
        public int GId { get; set; }
        public string? GroupName { get; set; }
    }
    public class ResponseTypes
    {
        public string? FormType { get; set; }
        public int FormId { get; set; }
    }
    public class InAppDesignData
    {
        public int BannerId { get; set; }
        public int CampaignId { get; set; }
        public string? CampaignName { get; set; }
        public string? Design { get; set; }
        public string? RuleStatus { get; set; }
        public int ResponseStatus { get; set; }
        public int RecentEvent { get; set; }
        public int StaticForm { get; set; }
        public string? StartDate { get; set; }
        public string? ExpiryDate { get; set; }
    }
    public class MobileFormResponses
    {
        public int AccountId { get; set; }
        public string? Action { get; set; }
        public int Id { get; set; }
        public string? Type { get; set; }
        public string? SearchBy { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public string? DeviceId { get; set; }
        public string? SessionId { get; set; }
        public string? SearchKey { get; set; }
    }
    public class MobileRulesAutoSuggest
    {
        public int AccountId { get; set; }
        public string? Action { get; set; }
        public string? SearchKey { get; set; }
    }
    public class SaveGroups
    {
        public int AccountId { get; set; }
        public int Id { get; set; }
        public string? Action { get; set; }
        public string? GroupName { get; set; }
        public string? Discription { get; set; }
        public int Status { get; set; }
        public string? Group { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public short GroupType { get; set; }
    }
    public class MlCampaignDetails
    {
        public int AccountId { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int CampaignId { get; set; }
        public string? Key { get; set; }
    }
    public class MobileGroups
    {
        public string? GroupNames { get; set; }
        public int GroupId { get; set; }
    }
    public class MobileContacts
    {
        public int AccountId { get; set; }
        public string? Action { get; set; }
        public int Id { get; set; }
        public string? Type { get; set; }
        public string? SearchBy { get; set; }
        public int GroupId { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public string? DeviceId { get; set; }
        public string? SessionId { get; set; }
    }
    public class MobileContactsToGroup
    {
        public int AccountId { get; set; }
        public string? Action { get; set; }
        public int GroupId { get; set; }
        public System.Data.DataTable? ListContact { get; set; }

    }
    public class CopyGroupData
    {
        public string? Action { get; set; }
        public int FromGroupId { get; set; }
        public int ToGroupId { get; set; }
    }
}
