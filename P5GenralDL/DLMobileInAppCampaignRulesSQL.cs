using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace P5GenralDL
{
    public class DLMobileInAppCampaignRulesSQL : CommonDataBaseInteraction, IDLMobileInAppCampaignRules
    {
        CommonInfo connection;
        public DLMobileInAppCampaignRulesSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobileInAppCampaignRulesSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<bool> Save(MobileInAppCampaignRules rulesData)
        {
            
            string storeProcCommand = "MobileInAppCampaign_Rules";
            object? param = new { Action = "Save",
                rulesData.InAppCampaignId,
                rulesData.IsLead,
                rulesData.IsBelong,
                rulesData.BelongsToGroup,
                rulesData.BehavioralScoreCondition,
                rulesData.BehavioralScore1,
                rulesData.BehavioralScore2,
                rulesData.SessionIs,
                rulesData.PageDepthIs,
                rulesData.NPageVisited,
                rulesData.FrequencyIs,
                rulesData.PageUrl,
                rulesData.IsPageUrlContainsCondition,
                rulesData.IsReferrer,
                rulesData.ReferrerUrl,
                rulesData.CheckSourceDomainOnly,
                rulesData.IsMailIsRespondent,
                rulesData.SearchString,
                rulesData.Country,
                rulesData.City,
                rulesData.IsClickedSpecificButtons,
                rulesData.ClickedPriceRangeProduct,
                rulesData.IsVisitorRespondedChat,
                rulesData.MailCampignResponsiveStage,
                rulesData.IsRespondedForm,
                rulesData.IsNotRespondedForm,
                rulesData.CloseCount,
                rulesData.AddedProductsToCart,
                rulesData.ViewedButNotAddedProductsToCart,
                rulesData.DroppedProductsFromCart,
                rulesData.PurchasedProducts,
                rulesData.NotPurchasedProducts,
                rulesData.TotalPurchaseQtyConditon,
                rulesData.CustomerTotalPurchase1,
                rulesData.CustomerTotalPurchase2,
                rulesData.TotalPurchaseAmtCondition,
                rulesData.CustomerCurrentValue1,
                rulesData.CustomerCurrentValue2,
                rulesData.DependencyFormId,
                rulesData.DependencyFormField,
                rulesData.DependencyFormCondition,
                rulesData.DependencyFormAnswer1,
                rulesData.DependencyFormAnswer2,
                rulesData.ImpressionEventForFormId,
                rulesData.ImpressionEventCountCondition,
                rulesData.CloseEventForFormId,
                rulesData.CloseEventCountCondition,
                rulesData.ResponsesEventForFormId,
                rulesData.ResponsesEventCountCondition,
                rulesData.OnlineSentimentIs,
                rulesData.SocialStatusIs,
                rulesData.InfluentialScoreCondition,
                rulesData.InfluentialScore1,
                rulesData.InfluentialScore2,
                rulesData.OfflineSentimentIs,
                rulesData.ProductRatingIs,
                rulesData.NurtureStatusIs,
                rulesData.GenderIs,
                rulesData.MaritalStatusIs,
                rulesData.ProfessionIs,
                rulesData.NotConnectedSocially,
                rulesData.LoyaltyPointsCondition,
                rulesData.LoyaltyPointsRange1,
                rulesData.LoyaltyPointsRange2,
                rulesData.RFMSScoreRangeCondition,
                rulesData.RFMSScoreRange1,
                rulesData.RFMSScoreRange2,
                rulesData.SessionConditionIsTrueOrIsFalse,
                rulesData.PageDepthConditionIsTrueOrIsFalse,
                rulesData.PageViewConditionIsTrueOrIsFalse,
                rulesData.FrequencyConditionIsTrueOrIsFalse,
                rulesData.MailRespondentConditionIsTrueOrIsFalse,
                rulesData.CountryConditionIsTrueOrIsFalse,
                rulesData.CityConditionIsTrueOrIsFalse,
                rulesData.AlreadyVisitedPages,
                rulesData.OverAllTimeSpentInSite,
                rulesData.CloseCountSessionWiseOrOverAll,
                rulesData.ShowFormOnlyNthTime,
                rulesData.IsMobileDevice,
                rulesData.AlreadyVisitedPagesOverAllOrSessionWise,
                rulesData.ClickedRecentButtonOrOverAll,
                rulesData.ExceptionPageUrl,
                rulesData.IsExceptionPageUrlContainsCondition,
                rulesData.AddedProductsCategoriesToCart,
                rulesData.NotAddedProductsCategoriesToCart,
                rulesData.AddedProductsSubCategoriesToCart,
                rulesData.NotAddedProductsSubCategoriesToCart,
                rulesData.MailRespondentTemplates,
                rulesData.IsSmsIsRespondent,
                rulesData.SmsRespondentConditionIsTrueOrIsFalse,
                rulesData.SmsRespondentTemplates,
                rulesData.IsMailRespondentClickCondition,
                rulesData.IsBirthDay,
                rulesData.IsDOBTodayOrMonth,
                rulesData.NotAlreadyVisitedPages,
                rulesData.NotAlreadyVisitedPagesOverAllOrSessionWise,
                rulesData.DOBFromDate,
                rulesData.DOBToDate,
                rulesData.DOBDaysDiffernce,
                rulesData.IsDOBIgnored,
                rulesData.IsDOBIgnoreCondition,
                rulesData.OverAllTimeSpentInSiteLess,
                rulesData.IsVisitedPagesContainsCondition,
                rulesData.IsNotVisitedPagesContainsCondition,
                rulesData.PageUrlParameters,
                rulesData.AlreadyVisitedWithPageUrlParameters,
                rulesData.NotAlreadyVisitedWithPageUrlParameters,
                rulesData.IsVisitorVisitedPagesWithPageUrlParameter,
                rulesData.IsVisitorsSource
                //rulesData.StateName,
                //rulesData.StateConditionIsTrueOrIsFalse
            };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }


        public async Task<MobileInAppCampaignRules> Get(int InAppCampaignId)
        {
            string storeProcCommand = "MobileInAppCampaign_Rules";
            List<string> paramName = new List<string> { "@Action", "@InAppCampaignId" };
            object[] objDat = { "GET", InAppCampaignId };

            using (DbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return await DataReaderMapToDetailAsync<MobileInAppCampaignRules>(Command);
            }
        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    connection = null;
                }
            }
            //dispose unmanaged ressources
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
