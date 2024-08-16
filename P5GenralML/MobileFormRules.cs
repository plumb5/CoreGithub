using System;

namespace P5GenralML
{
    public class FormInputs
    {
        public int Id { get; set; }
        public string Action { get; set; }
        public int TypeOfCampaign { get; set; }
    }
    public class MobileFormRules
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
        public Int16 CustomerTotalPurchase { get; set; }
        public Int16 CustomerCurrentValue { get; set; }
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
        public short LoyaltyPointsRange2 { get; set; }
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
    public class MobileResponseSetting
    {
        public string ReportToDetailsByMail { get; set; }
        public string ReportToDetailsBySMS { get; set; }
        public int MailTemplateId { get; set; }
        public string Subject { get; set; }
        public string FromName { get; set; }
        public string FromEmailId { get; set; }
        public string SMSName { get; set; }
        public int SmsTemplateId { get; set; }
        public string AccesLeadToUserId { get; set; }
        public int GroupId { get; set; }
    }
}
