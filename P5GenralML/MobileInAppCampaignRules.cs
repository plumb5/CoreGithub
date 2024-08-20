using System;

namespace P5GenralML
{
    public class MobileInAppCampaignRules
    {
        public Int32 InAppCampaignId { get; set; }
        public Int16 IsLead { get; set; }
        public Int16 IsBelong { get; set; }
        public string? BelongsToGroup { get; set; }
        public Int16 BehavioralScoreCondition { get; set; }
        public Int16 BehavioralScore1 { get; set; }
        public Int16 BehavioralScore2 { get; set; }
        public Int16 SessionIs { get; set; }
        public bool SessionConditionIsTrueOrIsFalse { get; set; }
        public Int16 PageDepthIs { get; set; }
        public bool PageDepthConditionIsTrueOrIsFalse { get; set; }
        public Int16 NPageVisited { get; set; }
        public Int16 FrequencyIs { get; set; }
        public string? PageUrl { get; set; }
        public bool IsPageUrlContainsCondition { get; set; }
        public Int16 IsReferrer { get; set; }
        public string? ReferrerUrl { get; set; }
        public bool CheckSourceDomainOnly { get; set; }
        public bool IsMailIsRespondent { get; set; }
        public string? SearchString { get; set; }
        public string? Country { get; set; }
        public string? City { get; set; }
        public string? IsClickedSpecificButtons { get; set; }
        public string? ClickedPriceRangeProduct { get; set; }
        public bool IsVisitorRespondedChat { get; set; }
        public Int16 MailCampignResponsiveStage { get; set; }
        public Int32 IsRespondedForm { get; set; }
        public Int32 IsNotRespondedForm { get; set; }
        public Int16 CloseCount { get; set; }
        public string? AddedProductsToCart { get; set; }
        public string? ViewedButNotAddedProductsToCart { get; set; }
        public string? DroppedProductsFromCart { get; set; }
        public string? PurchasedProducts { get; set; }
        public string? NotPurchasedProducts { get; set; }
        public Int16 TotalPurchaseQtyConditon { get; set; }
        public Int16 CustomerTotalPurchase1 { get; set; }
        public Int16 CustomerTotalPurchase2 { get; set; }
        public Int16 TotalPurchaseAmtCondition { get; set; }
        public Int16 CustomerCurrentValue1 { get; set; }
        public Int16 CustomerCurrentValue2 { get; set; }
        public Int32 DependencyFormId { get; set; }
        public Int16 DependencyFormField { get; set; }
        public Int16 DependencyFormCondition { get; set; }
        public string? DependencyFormAnswer1 { get; set; }
        public string? DependencyFormAnswer2 { get; set; }
        public Int32 ImpressionEventForFormId { get; set; }
        public Int16 ImpressionEventCountCondition { get; set; }
        public Int32 CloseEventForFormId { get; set; }
        public Int16 CloseEventCountCondition { get; set; }
        public Int32 ResponsesEventForFormId { get; set; }
        public Int16 ResponsesEventCountCondition { get; set; }
        public Int16 OnlineSentimentIs { get; set; }
        public Int16 SocialStatusIs { get; set; }
        public Int16 InfluentialScoreCondition { get; set; }
        public Int16 InfluentialScore1 { get; set; }
        public Int16 InfluentialScore2 { get; set; }
        public Int16 OfflineSentimentIs { get; set; }
        public Int16 ProductRatingIs { get; set; }
        public string? GenderIs { get; set; }
        public Int16 MaritalStatusIs { get; set; }
        public string? ProfessionIs { get; set; }
        public Int16 NotConnectedSocially { get; set; }
        public Int16 LoyaltyPointsCondition { get; set; }
        public Int16 LoyaltyPointsRange1 { get; set; }
        public Int16 LoyaltyPointsRange2 { get; set; }
        public Int16 RFMSScoreRangeCondition { get; set; }
        public Int16 RFMSScoreRange1 { get; set; }
        public Int16 RFMSScoreRange2 { get; set; }
        public Int32 ShowFormOnlyNthTime { get; set; }
        public bool CloseCountSessionWiseOrOverAll { get; set; }
        public Int16 OverAllTimeSpentInSite { get; set; }
        public string? AlreadyVisitedPages { get; set; }
        public bool PageViewConditionIsTrueOrIsFalse { get; set; }
        public bool FrequencyConditionIsTrueOrIsFalse { get; set; }
        public bool MailRespondentConditionIsTrueOrIsFalse { get; set; }
        public bool CountryConditionIsTrueOrIsFalse { get; set; }
        public bool CityConditionIsTrueOrIsFalse { get; set; }
        public Int16 NurtureStatusIs { get; set; }
        public Int16 IsMobileDevice { get; set; }
        // public bool AlreadyVisitedPagesConditionIsTrueOrIsFalse { get; set; }

        public bool AlreadyVisitedPagesOverAllOrSessionWise { get; set; }

        public bool ClickedRecentButtonOrOverAll { get; set; }
        public string? ExceptionPageUrl { get; set; }
        public bool IsExceptionPageUrlContainsCondition { get; set; }
        public string? AddedProductsCategoriesToCart { get; set; }
        public string? NotAddedProductsCategoriesToCart { get; set; }
        public string? AddedProductsSubCategoriesToCart { get; set; }
        public string? NotAddedProductsSubCategoriesToCart { get; set; }
        public string? MailRespondentTemplates { get; set; }
        public bool IsSmsIsRespondent { get; set; }
        public bool SmsRespondentConditionIsTrueOrIsFalse { get; set; }
        public string? SmsRespondentTemplates { get; set; }
        public bool IsMailRespondentClickCondition { get; set; }
        public bool IsBirthDay { get; set; }
        public Int16 IsDOBTodayOrMonth { get; set; }
        public string? NotAlreadyVisitedPages { get; set; }
        public bool NotAlreadyVisitedPagesOverAllOrSessionWise { get; set; }
        public DateTime? DOBFromDate { get; set; }
        public DateTime? DOBToDate { get; set; }
        public Int16 DOBDaysDiffernce { get; set; }
        public bool? IsDOBIgnored { get; set; }
        public Int16 IsDOBIgnoreCondition { get; set; }
        public Int16 OverAllTimeSpentInSiteLess { get; set; }
        public bool IsVisitedPagesContainsCondition { get; set; }
        public bool IsNotVisitedPagesContainsCondition { get; set; }
        public string? PageUrlParameters { get; set; }
        public string? AlreadyVisitedWithPageUrlParameters { get; set; }
        public string? NotAlreadyVisitedWithPageUrlParameters { get; set; }
        public bool IsVisitorVisitedPagesWithPageUrlParameter { get; set; }
        public bool IsVisitorsSource { get; set; }

    }
}
