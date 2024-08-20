using P5GenralML;

namespace P5GenralDL
{
    public interface IDLMobileVisitorPreInformation
    {
        string AddProductToCart(string DeviceId);
        bool AlreadyVisitedPages(string DeviceId, int FormId, int ChatId, int FormType);
        short ClosedFormNthTime(string DeviceId, int FormId, int FormType);
        short ClosedFormSessionWise(string DeviceId, string SessionRefeer, int FormId, int FormType);
        byte ConnectedSocially(int ContactId);
        short CustomerCurrentValue(string DeviceId);
        short CustomerTotalPurchase(string DeviceId);
        string DroppedProductsFromCart(string DeviceId, int ContactId, int FormId);
        short GetBehavioralScore(string DeviceId);
        string[] GetCityCountry(string DeviceId);
        string GetClickedButton(string DeviceId);
        string[] GetContactDetailsByDeviceId(string DeviceId);
        string[] GetContactDetailsByEmailMobile(string EmailId, string Mobile);
        MobileVisitorDetails GetContactInfoTaggingByDeviceId(string DeviceId);
        short GetCountShowThisFormOnlyNthTime(string DeviceId, int FormId, int FormType);
        short GetCustomerExpirdayInterval(string DeviceId, int ContactId);
        short GetFormCloseCount(string DeviceId, int FormId, int FormType);
        short GetFormImpression(string DeviceId, int FormId, int FormType);
        short GetFormResponseCount(string DeviceId, int FormId, int FormType);
        MobileFormRules GetFormRule(int FormId, int TypeOfCamp);
        short GetFrequency(string DeviceId);
        string GetGenderValue(int ContactId);
        string GetGroupList(string DeviceId);
        short GetLastPurchaseInterval(string DeviceId, int ContactId);
        int GetLeadType(string DeviceId);
        byte GetMaritalStatus(int ContactId);
        short GetPageDepeth(string DeviceId);
        short GetPageviews(string DeviceId);
        string GetRecentEvent(string DeviceId);
        short GetSession(string DeviceId);
        string[] GetSessionContactDetails(string DeviceId, int MobileFormId);
        short InfluentialScore(int ContactId);
        bool IsBusinessOrIndividualMember(string DeviceId, int ContactId);
        bool IsMailRespondent(string EmailId);
        bool IsOfflineOrOnlinePurchase(string DeviceId, int ContactId);
        short LoyaltyPoints(int ContactId);
        byte[] MailCampignResponsiveStage(string EmailId);
        List<int> NotResponseFormList(string DeviceId, int FormType);
        short NurtureStatusIs(int ContactId);
        byte OnlineSentimentIs(string EmailId);
        short OverAllTimeSpentInSite(string DeviceId);
        byte PaidCampaignFlag(string DeviceId);
        byte ProductRatingIs(string DeviceId);
        string ProfessionIs(int ContactId);
        string PurchasedProducts(string DeviceId);
        bool RespondedChatAgent(string EmailId);
        List<int> ResponseFormList(string DeviceId, int FormType);
        short RFMSScoreIs(string EmailId);
        byte SocialStatusIs(int ContactId);
        string ViewedButNotAddedProductsToCart(string DeviceId, int ContactId, int FormId);
    }
}