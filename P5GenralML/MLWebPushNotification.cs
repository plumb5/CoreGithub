using System;

namespace P5GenralML
{
    public class PermissionData
    {
        public string Action { get; set; }
        public string NotificationName { get; set; }
        public string ImageUrl { get; set; }
        public string Title { get; set; }
        public string Ticker { get; set; }
        public string Message { get; set; }
        public string Image { get; set; }
        public int Custom { get; set; }
        public string ExtraActions { get; set; }
        public int Duration { get; set; }
        public int DisplayDuration { get; set; }
        public int WelcomeMsg { get; set; }
        public string RedirectTo { get; set; }
        public int RuleStatus { get; set; }
        public int BrowserPushId { get; set; }
        public string SaveOrSend { get; set; }
        public int PoweredBy { get; set; }
        public string ButtonText { get; set; }
        public int WelMsgStatus { get; set; }
        public string BackgroundCss { get; set; }
        public int IsBackgroundCustomCss { get; set; }
        public string ImageCss { get; set; }
        public int IsImageCustomCss { get; set; }
        public string TitleCss { get; set; }
        public int IsTitleCustomCss { get; set; }
        public string SubTitleCss { get; set; }
        public int IsSubTitleCustomCss { get; set; }
        public string AllowCss { get; set; }
        public int IsAllowCustomCss { get; set; }
        public string DisAllowCss { get; set; }
        public int IsDisAllowCustomCss { get; set; }
        public string InterPageImageCss { get; set; }
        public int IsInterPageImageCustomCss { get; set; }
        public string HeaderCss { get; set; }
        public int IsHeaderCustomCss { get; set; }
        public string ContentCss { get; set; }
        public int IsContentCustomCss { get; set; }

        public int Browser { get; set; }
        public int ShowWelcomeMsg { get; set; }
        public string ShowPages { get; set; }
        public string DontShowPages { get; set; }

        public int IsRssFeed { get; set; }
        public string RssFeelUrl { get; set; }
        public string RssPubDate { get; set; }
    }
    public class BrowserRules
    {
        public Int32 countofRules { get; set; }
        public Int32 FormId { get; set; }
        public Int16 IsLead { get; set; }
        public byte IsBelong { get; set; }
        public string BelongsToGroup { get; set; }
        public byte BehavioralScoreCondition { get; set; }
        public Int16 BehavioralScore1 { get; set; }
        public Int16 BehavioralScore2 { get; set; }
        public Int16 SessionIs { get; set; }
        public bool SessionConditionIsTrueOrIsFalse { get; set; }
        public Int16 PageDepthIs { get; set; }
        public bool PageDepthConditionIsTrueOrIsFalse { get; set; }
        public Int16 NPageVisited { get; set; }
        public Int16 FrequencyIs { get; set; }
        public string PageUrl { get; set; }
        public bool IsPageUrlContainsCondition { get; set; }
        public string PageParameters { get; set; }
        public byte IsReferrer { get; set; }
        public string ReferrerUrl { get; set; }
        public bool CheckSourceDomainOnly { get; set; }
        public bool IsMailIsRespondent { get; set; }
        public string SearchString { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string IsClickedSpecificButtons { get; set; }
        public string ClickedPriceRangeProduct { get; set; }
        public bool IsVisitorRespondedChat { get; set; }
        public byte MailCampignResponsiveStage { get; set; }
        public Int32 IsRespondedForm { get; set; }
        public Int32 IsNotRespondedForm { get; set; }
        public Int16 CloseCount { get; set; }
        public string AddedProductsToCart { get; set; }
        public string ViewedButNotAddedProductsToCart { get; set; }
        public string DroppedProductsFromCart { get; set; }
        public string PurchasedProducts { get; set; }
        public string NotPurchasedProducts { get; set; }
        public byte TotalPurchaseQtyConditon { get; set; }
        public Int16 CustomerTotalPurchase1 { get; set; }
        public Int16 CustomerTotalPurchase2 { get; set; }
        public byte TotalPurchaseAmtCondition { get; set; }
        public Int16 CustomerCurrentValue1 { get; set; }
        public Int16 CustomerCurrentValue2 { get; set; }
        public Int32 DependencyFormId { get; set; }
        public Int16 DependencyFormField { get; set; }
        public Int16 DependencyFormCondition { get; set; }
        public string DependencyFormAnswer1 { get; set; }
        public string DependencyFormAnswer2 { get; set; }
        public Int32 ImpressionEventForFormId { get; set; }
        public Int16 ImpressionEventCountCondition { get; set; }
        public Int32 CloseEventForFormId { get; set; }
        public Int16 CloseEventCountCondition { get; set; }
        public Int32 ResponsesEventForFormId { get; set; }
        public Int16 ResponsesEventCountCondition { get; set; }
        public byte OnlineSentimentIs { get; set; }
        public byte SocialStatusIs { get; set; }
        public byte InfluentialScoreCondition { get; set; }
        public Int16 InfluentialScore1 { get; set; }
        public Int16 InfluentialScore2 { get; set; }
        public byte OfflineSentimentIs { get; set; }
        public byte ProductRatingIs { get; set; }
        public string GenderIs { get; set; }
        public byte MaritalStatusIs { get; set; }
        public string ProfessionIs { get; set; }
        public byte NotConnectedSocially { get; set; }
        public byte LoyaltyPointsCondition { get; set; }
        public Int16 LoyaltyPointsRange1 { get; set; }
        public Int16 LoyaltyPointsRange2 { get; set; }
        public byte RFMSScoreRangeCondition { get; set; }
        public Int16 RFMSScoreRange1 { get; set; }
        public Int16 RFMSScoreRange2 { get; set; }
        public Int32 ShowFormOnlyNthTime { get; set; }
        public bool CloseCountSessionWiseOrOverAll { get; set; }
        public Int16 OverAllTimeSpentInSite { get; set; }
        public string AlreadyVisitedPages { get; set; }
        public bool PageViewConditionIsTrueOrIsFalse { get; set; }
        public bool FrequencyConditionIsTrueOrIsFalse { get; set; }
        public bool MailRespondentConditionIsTrueOrIsFalse { get; set; }
        public bool CountryConditionIsTrueOrIsFalse { get; set; }
        public bool CityConditionIsTrueOrIsFalse { get; set; }
        public Int16 NurtureStatusIs { get; set; }
        public byte IsMobileDevice { get; set; }
        public bool AlreadyVisitedPagesConditionIsTrueOrIsFalse { get; set; }
        public string IsClickedRecentButtons { get; set; }

        public bool AlreadyVisitedPagesOverAllOrSessionWise { get; set; }

        public bool ClickedRecentButtonOrOverAll { get; set; }
        public string ExceptionPageUrl { get; set; }
        public bool IsExceptionPageUrlContainsCondition { get; set; }
        public string AddedProductsCategoriesToCart { get; set; }
        public string NotAddedProductsCategoriesToCart { get; set; }
        public string AddedProductsSubCategoriesToCart { get; set; }
        public string NotAddedProductsSubCategoriesToCart { get; set; }
        public string MailRespondentTemplates { get; set; }
        public bool IsSmsIsRespondent { get; set; }
        public bool SmsRespondentConditionIsTrueOrIsFalse { get; set; }
        public string SmsRespondentTemplates { get; set; }
        public bool IsMailRespondentClickCondition { get; set; }
        public bool IsBirthDay { get; set; }
        public byte IsDOBTodayOrMonth { get; set; }
        public string NotAlreadyVisitedPages { get; set; }
        public bool NotAlreadyVisitedPagesOverAllOrSessionWise { get; set; }
        public DateTime? DOBFromDate { get; set; }
        public DateTime? DOBToDate { get; set; }
        public Int16 DOBDaysDiffernce { get; set; }
        public bool? IsDOBIgnored { get; set; }
        public byte IsDOBIgnoreCondition { get; set; }
        //New Rules
        public bool ViewedProductAreInCartOrNot { get; set; }
        public bool ViewedProductAllProductOrSingle { get; set; }
        public bool DroppedProductsFromCartIsAllProductOrSingle { get; set; }
        public bool DroppedProductsFromCartPriceDrop { get; set; }
        public bool DroppedProductsFromCartSlabExists { get; set; }
        public bool DroppedProductsFromCartFreebieExists { get; set; }

        public bool IsBusinessOrIndividualMember { get; set; }
        public bool IsOfflineOrOnlinePurchase { get; set; }
        public byte LastPurchaseIntervalCondition { get; set; }
        public int LastPurchaseIntervalRange1 { get; set; }
        public int LastPurchaseIntervalRange2 { get; set; }
        public bool InstantOrOnceInaDay { get; set; }
        public byte CustomerExpirdayIntervalCondition { get; set; }
        public int CustomerExpirdayIntervalRange1 { get; set; }
        public int CustomerExpirdayIntervalRange2 { get; set; }
    }
    public class MLBrowserNotification
    {
        public int AccountId { get; set; }
        public string Action { get; set; }
        public int Id { get; set; }
        public string MachineId { get; set; }
        public string ContactId { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
    }
    public class BrowserRulesAutoSuggest
    {
        public int AccountId { get; set; }
        public string Action { get; set; }
        public string SearchKey { get; set; }
    }
    public class BrowserFormsNames
    {
        public int Id { get; set; }
        public string FormName { get; set; }
    }
    public class BrowserLmsNames
    {
        public Int16 Score { get; set; }
        public string LmsName { get; set; }
        public string IdentificationColor { get; set; }
    }
    public class BrowserEffectiveness
    {
        public int AccountId { get; set; }
        public string Action { get; set; }
        public int pushId { get; set; }
        public string BtnName { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
    }
    public class BrowserNotifyResponses
    {
        public int AccountId { get; set; }
        public string Action { get; set; }
        public string Type { get; set; }
        public string SearchBy { get; set; }
        public string Key { get; set; }
        public int PushId { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
    }
    public class NotificationsGroups
    {
        public string GroupNames { get; set; }
        public int GroupId { get; set; }
    }
    public class SaveNotificationsGroups
    {
        public int AccountId { get; set; }
        public int Id { get; set; }
        public string Action { get; set; }
        public string GroupName { get; set; }
        public string Discription { get; set; }
        public int Status { get; set; }
        public string Group { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
    }
    public class NotificationContacts
    {
        public int AccountId { get; set; }
        public string Action { get; set; }
        public int Id { get; set; }
        public string Type { get; set; }
        public string SearchBy { get; set; }
        public int GroupId { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public string MachineId { get; set; }
    }
    public class NotificationContactsToGroup
    {
        public int AccountId { get; set; }
        public string Action { get; set; }
        public int GroupId { get; set; }
        public System.Data.DataTable ListContact { get; set; }

    }
    public class BrowserTagging
    {
        public string Id { get; set; }
        public string FieldName { get; set; }
    }
    public class MailSmsTemplates
    {
        public Int32 Id { get; set; }
        public string TemplateName { get; set; }
    }


    //Schedule and send.....

    public class MLBrowserPushCampaign
    {
        public int PushId { get; set; }
        public string CampaignName { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public string ImageUrl { get; set; }
        public string ExtraActions { get; set; }
        public string RedirectTo { get; set; }
        public int WelcomeMsg { get; set; }
        public int Browser { get; set; }
        public int Duration { get; set; }
        public string Image { get; set; }
    }


    public class MLGcmSettings
    {
        public string VapidSubject { get; set; }
        public string VapidPublicKey { get; set; }
        public string VapidPrivateKey { get; set; }

    } 

    public class MLBrowserPushTestSend
    {
        public string VendorName { get; set; }
        public string MachineId { get; set; }
        public string EndpointUrl { get; set; }
        public string Tokenkey { get; set; }
        public string Authkey { get; set; }
    }

    public class BrowserGroups
    {
        public Int64 RowNo { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public string GroupDescription { get; set; }
        public int DisplayInUnscubscribe { get; set; }
        public DateTime CreatedDate { get; set; }
        public int GrpCount { get; set; }
    }

    public class BrowserPushDashBoard
    {
        public int Delivered { get; set; }
        public int Clicked { get; set; }
        public int SentPush { get; set; }
        public int Unsubscribe { get; set; }
        public string GDate { get; set; }
        public int Hour { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }

        public int TotalDelivered { get; set; }
        public int TotalClicked { get; set; }
        public int TotalSent { get; set; }
    }
}