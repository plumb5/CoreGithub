﻿using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLWorkFlowRuleSQL : CommonDataBaseInteraction, IDLWorkFlowRule
    {
        CommonInfo connection;
        public DLWorkFlowRuleSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowRuleSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(WorkFlowSetRules setRule)
        {
            string storeProcCommand = "WorkFlow_SetRule";
            object? param = new
            {
                @Action = "Save",
                setRule.UserInfoUserId,
                setRule.UserGroupId,
                setRule.TriggerStatus,
                setRule.TriggerHeading,
                setRule.IsMailOrSMSTrigger,
                setRule.IsLead,
                setRule.IsBelong,
                setRule.BelongsToGroup,
                setRule.BehavioralScoreCondition,
                setRule.BehavioralScore1,
                setRule.BehavioralScore2,
                setRule.SessionIs,
                setRule.PageDepthIs,
                setRule.NPageVisited,
                setRule.FrequencyIs,
                setRule.PageUrl,
                setRule.IsPageUrlContainsCondition,
                setRule.IsReferrer,
                setRule.ReferrerUrl,
                setRule.CheckSourceDomainOnly,
                setRule.IsMailIsRespondent,
                setRule.SearchString,
                setRule.Country,
                setRule.City,
                setRule.IsClickedSpecificButtons,
                setRule.ClickedPriceRangeProduct,
                setRule.IsVisitorRespondedChat,
                setRule.MailCampignResponsiveStage,
                setRule.IsRespondedForm,
                setRule.IsNotRespondedForm,
                setRule.CloseCount,
                setRule.AddedProductsToCart,
                setRule.ViewedButNotAddedProductsToCart,
                setRule.DroppedProductsFromCart,
                setRule.PurchasedProducts,
                setRule.NotPurchasedProducts,
                setRule.CustomerTotalPurchase1,
                setRule.CustomerCurrentValue1,
                setRule.DependencyFormId,
                setRule.DependencyFormField,
                setRule.DependencyFormCondition,
                setRule.DependencyFormAnswer1,
                setRule.DependencyFormAnswer2,
                setRule.ImpressionEventForFormId,
                setRule.ImpressionEventCountCondition,
                setRule.CloseEventForFormId,
                setRule.CloseEventCountCondition,
                setRule.ResponsesEventForFormId,
                setRule.ResponsesEventCountCondition,
                setRule.OnlineSentimentIs,
                setRule.SocialStatusIs,
                setRule.InfluentialScoreCondition,
                setRule.InfluentialScore1,
                setRule.InfluentialScore2,
                setRule.OfflineSentimentIs,
                setRule.ProductRatingIs,
                setRule.NurtureStatusIs,
                setRule.GenderIs,
                setRule.MaritalStatusIs,
                setRule.ProfessionIs,
                setRule.NotConnectedSocially,
                setRule.LoyaltyPointsCondition,
                setRule.LoyaltyPointsRange1,
                setRule.LoyaltyPointsRange2,
                setRule.RFMSScoreRangeCondition,
                setRule.RFMSScoreRange1,
                setRule.RFMSScoreRange2,
                setRule.SessionConditionIsTrueOrIsFalse,
                setRule.PageDepthConditionIsTrueOrIsFalse,
                setRule.PageViewConditionIsTrueOrIsFalse,
                setRule.FrequencyConditionIsTrueOrIsFalse,
                setRule.MailRespondentConditionIsTrueOrIsFalse,
                setRule.CountryConditionIsTrueOrIsFalse,
                setRule.CityConditionIsTrueOrIsFalse,
                setRule.AlreadyVisitedPages,
                setRule.OverAllTimeSpentInSite,
                setRule.CloseCountSessionWiseOrOverAll,
                setRule.ShowFormOnlyNthTime,
                setRule.IsMobileDevice,
                setRule.AlreadyVisitedPagesOverAllOrSessionWise,
                setRule.InstantOrOnceInaDay,
                setRule.LastPurchaseIntervalCondition,
                setRule.LastPurchaseIntervalRange1,
                setRule.LastPurchaseIntervalRange2,
                setRule.IsNotClickedSpecificButtons,
                setRule.CustomerTotalPurchase2,
                setRule.CustomerTotalPurchaseCondition,
                setRule.CustomerCurrentValue2,
                setRule.CustomerCurrentValueCondition,
                setRule.AddedProductsCategoriesToCart,
                setRule.NotAddedProductsCategoriesToCart,
                setRule.AddedProductsSubCategoriesToCart,
                setRule.NotAddedProductsSubCategoriesToCart,
                setRule.MailRespondentTemplates,
                setRule.IsSmsIsRespondent,
                setRule.SmsRespondentConditionIsTrueOrIsFalse,
                setRule.SmsRespondentTemplates,
                setRule.IsMailRespondentClickCondition,
                setRule.IsBirthDay,
                setRule.IsDOBTodayOrMonth,
                setRule.NotAlreadyVisitedPages,
                setRule.NotAlreadyVisitedPagesOverAllOrSessionWise,
                setRule.DOBFromDate,
                setRule.DOBToDate,
                setRule.DOBDaysDiffernce,
                setRule.IsDOBIgnored,
                setRule.IsDOBIgnoreCondition,
                setRule.IsUersReachable,
                setRule.ChannelName,
                setRule.IsABTesting,
                setRule.IsABTestingContacts,
                setRule.IsABTestingCondition,
                setRule.WaitTime,
                setRule.ResponseCondition,
                setRule.ResponseFromTime,
                setRule.ResponseToTime,
                setRule.IsOBDResponse,
                setRule.TimeResponseCondition,
                setRule.TimeCondition,
                setRule.ExceptionPageUrl,
                setRule.IsExceptionPageUrlContainsCondition,
                setRule.OverAllTimeSpentInSiteLess,
                setRule.ClickedRecentButtonOrOverAll,
                setRule.NotClickedRecentButtonOrOverAll,
                setRule.ContactFieldName,
                setRule.ContactFieldCondition,
                setRule.ContactFieldValue1,
                setRule.ContactFieldValue2,
                setRule.IsCustomisedContactRule,
                setRule.VisitorActivenessConditionIsTrueOrIsFalse,
                setRule.VisitorActivenessIs,
                setRule.IsVisitedPagesContainsCondition,
                setRule.IsNotVisitedPagesContainsCondition,
                setRule.PageUrlParameters,
                setRule.AlreadyVisitedWithPageUrlParameters,
                setRule.NotAlreadyVisitedWithPageUrlParameters,
                setRule.IsVisitorVisitedPagesWithPageUrlParameter,
                setRule.IsVisitorsSource
            };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<bool> Update(WorkFlowSetRules setRule)
        {
            string storeProcCommand = "WorkFlow_SetRule";
            object? param = new
            {
                @Action = "Update",
                setRule.RuleId,
                setRule.UserInfoUserId,
                setRule.UserGroupId,
                setRule.TriggerStatus,
                setRule.TriggerHeading,
                setRule.IsMailOrSMSTrigger,
                setRule.IsLead,
                setRule.IsBelong,
                setRule.BelongsToGroup,
                setRule.BehavioralScoreCondition,
                setRule.BehavioralScore1,
                setRule.BehavioralScore2,
                setRule.SessionIs,
                setRule.PageDepthIs,
                setRule.NPageVisited,
                setRule.FrequencyIs,
                setRule.PageUrl,
                setRule.IsPageUrlContainsCondition,
                setRule.IsReferrer,
                setRule.ReferrerUrl,
                setRule.CheckSourceDomainOnly,
                setRule.IsMailIsRespondent,
                setRule.SearchString,
                setRule.Country,
                setRule.City,
                setRule.IsClickedSpecificButtons,
                setRule.ClickedPriceRangeProduct,
                setRule.IsVisitorRespondedChat,
                setRule.MailCampignResponsiveStage,
                setRule.IsRespondedForm,
                setRule.IsNotRespondedForm,
                setRule.CloseCount,
                setRule.AddedProductsToCart,
                setRule.ViewedButNotAddedProductsToCart,
                setRule.DroppedProductsFromCart,
                setRule.PurchasedProducts,
                setRule.NotPurchasedProducts,
                setRule.CustomerTotalPurchase1,
                setRule.CustomerCurrentValue1,
                setRule.DependencyFormId,
                setRule.DependencyFormField,
                setRule.DependencyFormCondition,
                setRule.DependencyFormAnswer1,
                setRule.DependencyFormAnswer2,
                setRule.ImpressionEventForFormId,
                setRule.ImpressionEventCountCondition,
                setRule.CloseEventForFormId,
                setRule.CloseEventCountCondition,
                setRule.ResponsesEventForFormId,
                setRule.ResponsesEventCountCondition,
                setRule.OnlineSentimentIs,
                setRule.SocialStatusIs,
                setRule.InfluentialScoreCondition,
                setRule.InfluentialScore1,
                setRule.InfluentialScore2,
                setRule.OfflineSentimentIs,
                setRule.ProductRatingIs,
                setRule.NurtureStatusIs,
                setRule.GenderIs,
                setRule.MaritalStatusIs,
                setRule.ProfessionIs,
                setRule.NotConnectedSocially,
                setRule.LoyaltyPointsCondition,
                setRule.LoyaltyPointsRange1,
                setRule.LoyaltyPointsRange2,
                setRule.RFMSScoreRangeCondition,
                setRule.RFMSScoreRange1,
                setRule.RFMSScoreRange2,
                setRule.SessionConditionIsTrueOrIsFalse,
                setRule.PageDepthConditionIsTrueOrIsFalse,
                setRule.PageViewConditionIsTrueOrIsFalse,
                setRule.FrequencyConditionIsTrueOrIsFalse,
                setRule.MailRespondentConditionIsTrueOrIsFalse,
                setRule.CountryConditionIsTrueOrIsFalse,
                setRule.CityConditionIsTrueOrIsFalse,
                setRule.AlreadyVisitedPages,
                setRule.OverAllTimeSpentInSite,
                setRule.CloseCountSessionWiseOrOverAll,
                setRule.ShowFormOnlyNthTime,
                setRule.IsMobileDevice,
                setRule.AlreadyVisitedPagesOverAllOrSessionWise,
                setRule.InstantOrOnceInaDay,
                setRule.LastPurchaseIntervalCondition,
                setRule.LastPurchaseIntervalRange1,
                setRule.LastPurchaseIntervalRange2,
                setRule.IsNotClickedSpecificButtons,
                setRule.CustomerTotalPurchase2,
                setRule.CustomerTotalPurchaseCondition,
                setRule.CustomerCurrentValue2,
                setRule.CustomerCurrentValueCondition,
                setRule.AddedProductsCategoriesToCart,
                setRule.NotAddedProductsCategoriesToCart,
                setRule.AddedProductsSubCategoriesToCart,
                setRule.NotAddedProductsSubCategoriesToCart,
                setRule.MailRespondentTemplates,
                setRule.IsSmsIsRespondent,
                setRule.SmsRespondentConditionIsTrueOrIsFalse,
                setRule.SmsRespondentTemplates,
                setRule.IsMailRespondentClickCondition,
                setRule.IsBirthDay,
                setRule.IsDOBTodayOrMonth,
                setRule.NotAlreadyVisitedPages,
                setRule.NotAlreadyVisitedPagesOverAllOrSessionWise,
                setRule.DOBFromDate,
                setRule.DOBToDate,
                setRule.DOBDaysDiffernce,
                setRule.IsDOBIgnored,
                setRule.IsDOBIgnoreCondition,
                setRule.IsUersReachable,
                setRule.ChannelName,
                setRule.IsABTesting,
                setRule.IsABTestingContacts,
                setRule.IsABTestingCondition,
                setRule.WaitTime,
                setRule.ResponseCondition,
                setRule.ResponseFromTime,
                setRule.ResponseToTime,
                setRule.IsOBDResponse,
                setRule.TimeResponseCondition,
                setRule.TimeCondition,
                setRule.ExceptionPageUrl,
                setRule.IsExceptionPageUrlContainsCondition,
                setRule.OverAllTimeSpentInSiteLess,
                setRule.ClickedRecentButtonOrOverAll,
                setRule.NotClickedRecentButtonOrOverAll,
                setRule.ContactFieldName,
                setRule.ContactFieldCondition,
                setRule.ContactFieldValue1,
                setRule.ContactFieldValue2,
                setRule.IsCustomisedContactRule,
                setRule.VisitorActivenessConditionIsTrueOrIsFalse,
                setRule.VisitorActivenessIs,
                setRule.IsVisitedPagesContainsCondition,
                setRule.IsNotVisitedPagesContainsCondition,
                setRule.PageUrlParameters,
                setRule.AlreadyVisitedWithPageUrlParameters,
                setRule.NotAlreadyVisitedWithPageUrlParameters,
                setRule.IsVisitorVisitedPagesWithPageUrlParameter,
                setRule.IsVisitorsSource

            };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<WorkFlowSetRules?> GetDetails(WorkFlowSetRules setRule)
        {
            string storeProcCommand = "WorkFlow_SetRule";
            object? param = new { @Action = "Get", setRule.RuleId, setRule.TriggerHeading };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WorkFlowSetRules?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Delete(Int32 RuleId)
        {
            string storeProcCommand = "WorkFlow_SetRule";
            object? param = new { @Action = "Delete", RuleId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> ToogleStatus(MLWorkFlowSetRules setRule)
        {
            string storeProcCommand = "WorkFlow_SetRule";
            object? param = new { @Action = "ToogleStatus", setRule.RuleId, setRule.TriggerStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<int> GetMaxCount(string RuleName = null)
        {
            string storeProcCommand = "WorkFlow_SetRule";
            object? param = new { @Action = "GetMaxCount", RuleName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<MLWorkFlowSetRules>> GetAllRules(int OffSet, int FetchNext, string RuleName = null)
        {
            string storeProcCommand = "WorkFlow_SetRule";
            object? param = new { @Action = "GetAllRulesData", OffSet, FetchNext, RuleName };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWorkFlowSetRules?>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<MLWorkFlowSetRules>> GetAllRule()
        {
            string storeProcCommand = "WorkFlow_SetRule";
            object? param = new { @Action = "GetAllRules" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWorkFlowSetRules?>(storeProcCommand)).ToList();
        }

        #region Dispose Method
        private bool _disposed = false;
        protected void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                _disposed = true;
                if (disposing)
                {
                    connection = null;
                }
            }
        }

        public void Dispose()
        {
            Dispose(true);
        }
        #endregion End of Dispose Method
    }
}

