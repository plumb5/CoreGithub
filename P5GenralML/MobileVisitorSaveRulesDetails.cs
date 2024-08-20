using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MobileVisitorSaveRulesDetails
    {
        #region Members declaration

        public Int16 IsLead { get; set; }
        public bool IsLeadIsTheirData { get; set; }

        public string[]? BelongsToGroup { get; set; }
        public bool BelongIsTheirData { get; set; }

        public Int16 BehavioralScore { get; set; }
        public bool BehavioralScoreIsTheirData { get; set; }

        public Int16 SessionIs { get; set; }
        public bool SessionIsTheirData { get; set; }

        public Int16 PageDepthIs { get; set; }
        public bool PageDepthIsTheirData { get; set; }

        public Int16 NPageVisited { get; set; }
        public bool NPageVisitedIsTheirData { get; set; }

        public Int16 FrequencyIs { get; set; }
        public bool FrequencyIsTheirData { get; set; }

        //public string? ReferrerUrl { get; set; }
        //public bool ReferrerUrlIsTheirData { get; set; }
        //public string? SearchString { get; set; }
        //public bool SearchStringIsTheirData { get; set; }

        public bool IsMailIsRespondent { get; set; }
        public bool IsMailIsRespondentlIsTheirData { get; set; }

        public string? Country { get; set; }
        public string? City { get; set; }
        public bool CountryCityIsTheirData { get; set; }

        public string? IsClickedSpecificButtons { get; set; }
        public bool IsClickedSpecificButtonsIsTheirData { get; set; }

        public string? IsClickedRecentButtons { get; set; }
        public bool IsClickedRecentButtonsIsTheirData { get; set; }

        public string? ClickedPriceRangeProduct { get; set; }
        public bool ClickedPriceRangeProductIsTheirData { get; set; }

        public bool IsVisitorRespondedChat { get; set; }
        public bool IsVisitorRespondedChatIsTheirData { get; set; }

        public byte MailCampignResponsiveStage { get; set; }
        public byte MailCampignResponsiveStageScore { get; set; }
        public bool MailCampignResponsiveStageIsTheirData { get; set; }

        public bool FormRespondedListIsTheirData { get; set; }
        public List<Int32> FormRespondedList { get; set; }

        public Int16 CloseCount { get; set; }
        public bool CloseCountSessionWise { get; set; }
        public bool CloseCountIsTheirData { get; set; }

        public string? AddedProductsToCart { get; set; }
        public bool AddedProductsToCartIsTheirData { get; set; }

        public string? ViewedButNotAddedProductsToCart { get; set; }
        public bool ViewedButNotAddedProductsToCartIsTheirData { get; set; }

        public string? DroppedProductsFromCart { get; set; }
        public bool DroppedProductsFromCartIsTheirData { get; set; }

        public string? PurchasedProducts { get; set; }
        public bool PurchasedProductsIsTheirData { get; set; }

        public Int16 CustomerTotalPurchase { get; set; }
        public bool CustomerTotalPurchaseIsTheirData { get; set; }

        public Int16 CustomerCurrentValue { get; set; }
        public bool CustomerCurrentValueIsTheirData { get; set; }

        public Int16 ImpressionEventCountCondition { get; set; }
        public bool ImpressionEventCountConditionIsTheirData { get; set; }

        public Int16 CloseEventCountCondition { get; set; }
        public bool CloseEventCountConditionIsTheirData { get; set; }

        public Int16 ResponsesEventCountCondition { get; set; }
        public bool ResponsesEventCountConditionIsTheirData { get; set; }

        public byte OnlineSentimentIs { get; set; }
        public bool OnlineSentimentIsTheirData { get; set; }

        public byte SocialStatusIs { get; set; }
        public bool SocialStatusIsTheirData { get; set; }

        public Int16 InfluentialScore { get; set; }
        public bool InfluentialScoreIsTheirData { get; set; }

        public byte OfflineSentimentIs { get; set; }
        public bool OfflineSentimentIsTheirData { get; set; }

        public byte ProductRatingIs { get; set; }
        public bool ProductRatingIsTheirData { get; set; }

        public string? GenderIs { get; set; }
        public bool GenderIsTheirData { get; set; }

        public byte MaritalStatusIs { get; set; }
        public bool MaritalStatusIsTheirData { get; set; }

        public string? ProfessionIs { get; set; }
        public bool ProfessionIsTheirData { get; set; }

        public byte NotConnectedSocially { get; set; }
        public bool NotConnectedSociallyIsTheirData { get; set; }

        public Int16 LoyaltyPoints { get; set; }
        public bool LoyaltyPointsConditionIsTheirData { get; set; }

        public Int16 RFMSScoreRange { get; set; }
        public bool RFMSScoreRangeIsTheirData { get; set; }

        public Int32 ShowFormOnlyNthTime { get; set; }
        public bool ShowFormOnlyNthTimeIsTheirData { get; set; }

        public Int16 OverAllTimeSpentInSite { get; set; }
        public bool OverAllTimeSpentInSiteIsTheirData { get; set; }

        public Int16 NurtureStatusIs { get; set; }
        public bool NurtureStatusIsTheirData { get; set; }

        public bool IsBusinessOrIndividualMember { get; set; }
        public bool IsBusinessOrIndividualMemberIsTheirData { get; set; }

        public bool IsOfflineOrOnlinePurchase { get; set; }
        public bool IsOfflineOrOnlinePurchaseIsTheirData { get; set; }

        public Int16 LastPurchaseInterval { get; set; }
        public bool LastPurchaseIntervalIsTheirData { get; set; }

        public Int16 CustomerExpirdayInterval { get; set; }
        public bool CustomerExpirdayIntervalIsTheirData { get; set; }


        #endregion
    }
}
