using Microsoft.Extensions.Configuration;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class MobileFormRuleChecking
    {
        private readonly string? SQLProvider;
        IDLMobileVisitorPreInformation getDetails = null;

        public MobileFormRuleChecking(IConfiguration _configuration)
        {
            SQLProvider = _configuration["SqlProvider"];
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="formRules"></param>
        /// <returns></returns>
        public bool CheckFormRules(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            bool behaviorRule = false, interactionRule = false, interactionEvent = false, profileRule = false;
            try
            {
                getDetails = DLMobileVisitorPreInformation.GetDLMobileVisitorPreInformation(visitorDetails.AdsId, SQLProvider);

               // getDetails = new MobileVisitorPreInformation(visitorDetails.AdsId);

                bool audienceRule = ByAudience(savedRulesDetails, visitorDetails, formRules);
                if (audienceRule)
                    behaviorRule = ByBehavior(savedRulesDetails, visitorDetails, formRules);
                if (behaviorRule)
                    interactionRule = ByInteraction(savedRulesDetails, visitorDetails, formRules);
                if (interactionRule)
                    interactionEvent = ByInteractionEvent(savedRulesDetails, visitorDetails, formRules);
                if (interactionEvent)
                    profileRule = ByProfile(savedRulesDetails, visitorDetails, formRules);

                return audienceRule && behaviorRule && interactionRule && profileRule;
            }
            catch
            {
                return false;
            }
        }

        #region Audience Condition Here

        private bool ByAudience(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            bool isLead = formRules.IsLead > -1 ? IsLeadType(savedRulesDetails, visitorDetails, formRules.IsLead) : true;
            if (!isLead) return false;

            bool isBelongOrNotSegment = formRules.IsBelong > 0 ? IsBelongNotBelongsToSegment(savedRulesDetails, formRules, visitorDetails) : true;

            return isLead && isBelongOrNotSegment;
        }

        private bool IsLeadType(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, short leadType)
        {
            if (!savedRulesDetails.IsLeadIsTheirData)
            {
                savedRulesDetails.IsLead = Convert.ToInt16(getDetails.GetLeadType(visitorDetails.DeviceId));
            }
            return leadType == savedRulesDetails.IsLead; //visitorDetails.LeadType;
        }

        private bool IsBelongNotBelongsToSegment(MobileVisitorSaveRulesDetails savedRulesDetails, MobileFormRules formRules, MobileVisitorDetails visitorDetails)
        {
            if (!savedRulesDetails.BelongIsTheirData)
            {
                savedRulesDetails.BelongsToGroup = getDetails.GetGroupList(visitorDetails.DeviceId).Split(',');
                savedRulesDetails.BelongIsTheirData = true;
            }

            if (formRules.IsBelong == 1)
            {
                foreach (var group in formRules.BelongsToGroup.ToString().Split(','))
                {
                    if (savedRulesDetails.BelongsToGroup.Any(x => x == group))
                        return true;
                }
            }
            else if (formRules.IsBelong == 2)
            {
                foreach (var group in formRules.BelongsToGroup.ToString().Split(','))
                {
                    if (savedRulesDetails.BelongsToGroup.Any(x => x == group))
                        return false;
                }
                return true;
            }

            return false;
        }

        #endregion Audience Condition Here

        #region Behavior Conditions
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="formRules"></param>
        /// <returns></returns>
        private bool ByBehavior(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            bool behavioralScore = formRules.BehavioralScoreCondition > 0 ? BehavioralScore(savedRulesDetails, visitorDetails, formRules) : true;
            if (!behavioralScore) return false;

            bool sessionIs = formRules.SessionIs > 0 ? CheckSessionIs(savedRulesDetails, visitorDetails, formRules) : true;
            if (!sessionIs) return false;

            bool pageDepth = formRules.PageDepthIs > 0 ? CheckPageDepth(savedRulesDetails, visitorDetails, formRules) : true;
            if (!pageDepth) return false;

            bool pageViews = formRules.NPageVisited > 0 ? CheckPageviews(savedRulesDetails, visitorDetails, formRules) : true;
            if (!pageViews) return false;

            bool frequency = formRules.FrequencyIs > 0 ? CheckFrequency(savedRulesDetails, visitorDetails, formRules) : true;
            if (!frequency) return false;

            bool pageUrl = formRules.PageUrl != null && formRules.PageUrl.Length > 0 ? CheckPageurl(visitorDetails, formRules) : true;
            if (!pageUrl) return false;

            bool pageParameter = formRules.PageParameters != null && formRules.PageParameters != "0" && formRules.PageParameters.Length > 0 ? CheckPageParameters(visitorDetails, formRules) : true;
            if (!pageParameter) return false;

            //bool referrerUrl = formRules.IsReferrer > 0 ? CheckReferrer(savedRulesDetails, visitorDetails, formRules) : true;
            //if (!referrerUrl) return false;

            bool isMailIsRespondent = formRules.IsMailIsRespondent ? CheckIsMailRespondent(savedRulesDetails, visitorDetails, formRules) : true;
            if (!isMailIsRespondent) return false;

            //bool isSearchString = formRules.SearchString != null && formRules.SearchString.Length > 0 ? CheckSearchKeyword(savedRulesDetails, visitorDetails, formRules) : true;
            //if (!isSearchString) return false;

            bool countryRule = formRules.Country != null && formRules.Country.Length > 0 ? CheckCountry(savedRulesDetails, visitorDetails, formRules) : true;
            if (!countryRule) return false;

            bool cityRule = formRules.City != null && formRules.City.Length > 0 ? CheckCity(savedRulesDetails, visitorDetails, formRules) : true;
            if (!cityRule) return false;

            bool alreadyVisitedPageRule = formRules.AlreadyVisitedPages != null && formRules.AlreadyVisitedPages.Length > 0 ? CheckAlreadyVisitedPages(savedRulesDetails, visitorDetails, formRules) : true;
            if (!alreadyVisitedPageRule) return false;

            bool overAllTimeSpentInSite = formRules.OverAllTimeSpentInSite > 0 ? CheckOverAllTimeSpentInSite(savedRulesDetails, visitorDetails, formRules) : true;
            if (!overAllTimeSpentInSite) return false;

            //bool AndroidBrowser = formRules.IsMobileDevice > 0 ? IsAndriodMobileBrowser(savedRulesDetails, visitorDetails, formRules) : true;

            return behavioralScore && sessionIs && pageDepth && pageViews && frequency && isMailIsRespondent && countryRule && cityRule && overAllTimeSpentInSite;
        }


        private bool BehavioralScore(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.BehavioralScoreIsTheirData)
            {
                savedRulesDetails.BehavioralScore = getDetails.GetBehavioralScore(visitorDetails.DeviceId);
                savedRulesDetails.BehavioralScoreIsTheirData = true;
            }

            if (formRules.BehavioralScoreCondition == 1)
            {
                return savedRulesDetails.BehavioralScore > formRules.BehavioralScore1;
            }
            else if (formRules.BehavioralScoreCondition == 2)
            {
                return savedRulesDetails.BehavioralScore < formRules.BehavioralScore1;
            }
            else if (formRules.BehavioralScoreCondition == 3)
            {
                return savedRulesDetails.BehavioralScore >= formRules.BehavioralScore1 && savedRulesDetails.BehavioralScore <= formRules.BehavioralScore2;
            }
            else if (formRules.BehavioralScoreCondition == 4)
            {
                return savedRulesDetails.BehavioralScore == formRules.BehavioralScore1;
            }
            return false;
        }

        private bool CheckSessionIs(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.SessionIsTheirData)
            {
                savedRulesDetails.SessionIs = getDetails.GetSession(visitorDetails.DeviceId);
                savedRulesDetails.SessionIsTheirData = true;
            }
            if (formRules.SessionConditionIsTrueOrIsFalse)
                return savedRulesDetails.SessionIs >= formRules.SessionIs;
            else if (!formRules.SessionConditionIsTrueOrIsFalse)
                return savedRulesDetails.SessionIs < formRules.SessionIs;
            else
                return false;
        }

        private bool CheckPageDepth(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.PageDepthIsTheirData)
            {
                savedRulesDetails.PageDepthIs = getDetails.GetPageDepeth(visitorDetails.DeviceId);
                savedRulesDetails.PageDepthIsTheirData = true;
            }
            if (formRules.PageDepthConditionIsTrueOrIsFalse)
                return savedRulesDetails.PageDepthIs >= formRules.PageDepthIs;
            else if (!formRules.PageDepthConditionIsTrueOrIsFalse)
                return savedRulesDetails.PageDepthIs < formRules.PageDepthIs;
            else
                return false;
        }

        private bool CheckPageviews(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.NPageVisitedIsTheirData)
            {
                savedRulesDetails.NPageVisited = getDetails.GetPageviews(visitorDetails.DeviceId);
                savedRulesDetails.NPageVisitedIsTheirData = true;
            }
            if (formRules.PageViewConditionIsTrueOrIsFalse)
                return savedRulesDetails.NPageVisited >= formRules.NPageVisited;
            else if (!formRules.PageViewConditionIsTrueOrIsFalse)
                return savedRulesDetails.NPageVisited < formRules.NPageVisited;
            else
                return false;
        }

        private bool CheckFrequency(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.FrequencyIsTheirData)
            {
                savedRulesDetails.FrequencyIs = getDetails.GetFrequency(visitorDetails.DeviceId);
                savedRulesDetails.FrequencyIsTheirData = true;
            }
            if (formRules.FrequencyConditionIsTrueOrIsFalse)
                return savedRulesDetails.FrequencyIs >= formRules.FrequencyIs;
            else if (!formRules.FrequencyConditionIsTrueOrIsFalse)
                return savedRulesDetails.FrequencyIs < formRules.FrequencyIs;
            else
                return false;
        }

        private bool CheckPageurl(MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (formRules.IsPageUrlContainsCondition)
            {
                string[] conditionPageUrl = formRules.PageUrl.ToString().Split(',');
                if (conditionPageUrl.Select(desUrl => desUrl.Trim().ToLower()).Any(temp1 => visitorDetails.PageUrl.ToLower().Contains(temp1)))
                {
                    return true;
                }
            }
            else
            {
                string[] conditionPageUrl = formRules.PageUrl.ToString().Split(',');
                if (conditionPageUrl.Select(desUrl => desUrl.Trim().ToLower()).Any(temp1 => temp1 == visitorDetails.PageUrl.ToLower()))
                {
                    return true;
                }
            }
            return false;

        }
        private bool CheckPageParameters(MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            string[] conditionPageParameters = formRules.PageParameters.ToString().Split(',');
            if (conditionPageParameters.Select(desUrl => desUrl.Trim().ToLower()).Any(temp1 => temp1 == visitorDetails.PageParameters.ToLower()))
            {
                return true;
            }
            return false;
        }
        private bool CheckIsMailRespondent(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.IsMailIsRespondentlIsTheirData)
            {
                savedRulesDetails.IsMailIsRespondent = getDetails.IsMailRespondent(visitorDetails.EmailId);
                savedRulesDetails.IsMailIsRespondentlIsTheirData = true;
            }
            if (formRules.MailRespondentConditionIsTrueOrIsFalse)
                return savedRulesDetails.IsMailIsRespondent == true;
            else if (!formRules.MailRespondentConditionIsTrueOrIsFalse)
                return savedRulesDetails.IsMailIsRespondent == false;
            else
                return false;
        }

        private bool CheckCountry(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.CountryCityIsTheirData)
            {
                string[] CountryCity = getDetails.GetCityCountry(visitorDetails.DeviceId);
                if (CountryCity.Length > 0)
                    savedRulesDetails.Country = CountryCity[0];
                if (CountryCity.Length > 1)
                    savedRulesDetails.City = CountryCity[1];
                savedRulesDetails.CountryCityIsTheirData = true;
            }

            if (!String.IsNullOrEmpty(savedRulesDetails.Country))
            {

                string[] countryCondition = formRules.Country.Split(new string[] { "@$" }, StringSplitOptions.RemoveEmptyEntries);

                if (formRules.CountryConditionIsTrueOrIsFalse)
                {
                    if (countryCondition.Any(loca => loca.ToLower().Trim() == savedRulesDetails.Country.ToLower().Trim()))
                    {
                        return true;
                    }
                }
                else if (!formRules.CountryConditionIsTrueOrIsFalse)
                {
                    if (countryCondition.All(loca => loca.ToLower().Trim() != savedRulesDetails.Country.ToLower().Trim()))
                    {
                        return true;
                    }
                }

            }
            return false;
        }

        private bool CheckCity(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.CountryCityIsTheirData)
            {
                string[] CountryCity = getDetails.GetCityCountry(visitorDetails.DeviceId);
                savedRulesDetails.Country = CountryCity[0];
                savedRulesDetails.City = CountryCity[1];
                savedRulesDetails.CountryCityIsTheirData = true;
            }


            if (!String.IsNullOrEmpty(savedRulesDetails.City))
            {
                string[] cityCondition = formRules.City.Split(new string[] { "@$" }, StringSplitOptions.RemoveEmptyEntries);

                if (formRules.CityConditionIsTrueOrIsFalse)
                {
                    if (cityCondition.Any(loca => loca.ToLower().Trim() == savedRulesDetails.City.ToLower().Trim()))
                    {
                        return true;
                    }
                }
                else if (!formRules.CityConditionIsTrueOrIsFalse)
                {
                    if (cityCondition.All(loca => loca.ToLower().Trim() != savedRulesDetails.City.ToLower().Trim()))
                    {
                        return true;
                    }
                }
            }

            return false;
        }
        private bool CheckAlreadyVisitedPages(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            return getDetails.AlreadyVisitedPages(visitorDetails.DeviceId, formRules.FormId, 0, visitorDetails.FormType);
        }

        private bool CheckOverAllTimeSpentInSite(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.OverAllTimeSpentInSiteIsTheirData)
            {
                savedRulesDetails.OverAllTimeSpentInSite = getDetails.OverAllTimeSpentInSite(visitorDetails.DeviceId);
                savedRulesDetails.OverAllTimeSpentInSiteIsTheirData = true;
            }
            return savedRulesDetails.OverAllTimeSpentInSite >= formRules.OverAllTimeSpentInSite;
        }

        //private bool IsAndriodMobileBrowser(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, FormRules formRules)
        //{
        //    if (formRules.IsMobileDevice == 1)
        //    {
        //        return getDetails.iAndriodBrowser();
        //    }
        //    else if (formRules.IsMobileDevice == 2)
        //    {
        //        return getDetails.isMobileBrowser(visitorDetails.DeviceId);
        //    }
        //    return false;
        //}

        #endregion Behavior Conditions

        #region Interaction Rule

        private bool ByInteraction(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            bool clickedRecentButton = formRules.IsClickedRecentButtons != null && formRules.IsClickedRecentButtons.Length > 0 ? CheckRecentClickedButton(savedRulesDetails, visitorDetails, formRules) : true;
            if (!clickedRecentButton) return false;

            bool clickedButton = formRules.IsClickedSpecificButtons != null && formRules.IsClickedSpecificButtons.Length > 0 ? CheckClickedButton(savedRulesDetails, visitorDetails, formRules) : true;
            if (!clickedButton) return false;

            bool clickedPriceRangeProduct = formRules.ClickedPriceRangeProduct != null && formRules.ClickedPriceRangeProduct.Length > 0 ? CheckClickedSpecificPriceRange(savedRulesDetails, visitorDetails, formRules) : true;
            if (!clickedPriceRangeProduct) return false;

            bool isVisitorRespondedChat = formRules.IsVisitorRespondedChat ? CheckRespondedChatAgent(savedRulesDetails, visitorDetails, formRules) : true;
            if (!isVisitorRespondedChat) return false;

            bool mailCampignResponsiveStage = formRules.MailCampignResponsiveStage > 0 ? CheckMailCampaignsStage(savedRulesDetails, visitorDetails, formRules) : true;
            if (!mailCampignResponsiveStage) return false;

            bool isRespondedForm = formRules.IsRespondedForm > 0 ? CheckResponseFormList(savedRulesDetails, visitorDetails, formRules) : true;
            if (!isRespondedForm) return false;

            bool isNotRespondedForm = formRules.IsNotRespondedForm > 0 ? CheckNotResponseFormList(savedRulesDetails, visitorDetails, formRules) : true;
            if (!isNotRespondedForm) return false;

            //bool answerDependency = formRules.DependencyFormId > 0 ? CheckAnswerDependency(savedRulesDetails, visitorDetails, formRules) : true;
            //if (!answerDependency) return false;

            bool closeCount = formRules.CloseCount > 0 ? CheckClosedFormNthTime(savedRulesDetails, visitorDetails, formRules) : true;
            if (!closeCount) return false;

            bool isaddedProductsToCart = formRules.AddedProductsToCart != null && formRules.AddedProductsToCart.Length > 0 ? CheckVisitorAddProductToCart(savedRulesDetails, visitorDetails, formRules) : true;
            if (!isaddedProductsToCart) return false;

            bool isViewedButNotAddedProductsToCart = formRules.ViewedButNotAddedProductsToCart != null && formRules.ViewedButNotAddedProductsToCart.Length > 0 ? VisitorViewedButNotAdded(savedRulesDetails, visitorDetails, formRules) : true;
            if (!isViewedButNotAddedProductsToCart) return false;

            bool isDroppedProductsFromCart = formRules.DroppedProductsFromCart != null && formRules.DroppedProductsFromCart.Length > 0 ? VisitorDroppedFromCart(savedRulesDetails, visitorDetails, formRules) : true;
            if (!isDroppedProductsFromCart) return false;

            bool isPurchasedProducts = formRules.PurchasedProducts != null && formRules.PurchasedProducts.Length > 0 ? CustomerPurchasedProducts(savedRulesDetails, visitorDetails, formRules) : true;
            if (!isPurchasedProducts) return false;

            bool isNotPurchasedProducts = formRules.NotPurchasedProducts != null && formRules.NotPurchasedProducts.Length > 0 ? CustomerNotPurchasedProducts(savedRulesDetails, visitorDetails, formRules) : true;
            if (!isNotPurchasedProducts) return false;

            bool isCustomerTotalPurchase = formRules.CustomerTotalPurchase > 0 ? CustomerTotalPurchase(savedRulesDetails, visitorDetails, formRules) : true;
            if (!isCustomerTotalPurchase) return false;

            bool isCustomerCurrentValue = formRules.CustomerCurrentValue > 0 ? CustomerCurrentValue(savedRulesDetails, visitorDetails, formRules) : true;
            if (!isCustomerCurrentValue) return false;

            bool IsBusinessOrIndividualMember = formRules.IsBusinessOrIndividualMember ? BusinessOrIndividualMember(savedRulesDetails, visitorDetails, formRules) : true;
            if (!IsBusinessOrIndividualMember) return false;

            bool IsOfflineOrOnlinePurchase = formRules.IsOfflineOrOnlinePurchase ? OfflineOrOnlinePurchase(savedRulesDetails, visitorDetails, formRules) : true;
            if (!IsOfflineOrOnlinePurchase) return false;

            bool lastPurchaseInterval = formRules.LastPurchaseIntervalCondition > 0 ? LastPurchaseInterval(savedRulesDetails, visitorDetails, formRules) : true;
            if (!lastPurchaseInterval) return false;

            bool customerExpirdayInterval = formRules.CustomerExpirdayIntervalCondition > 0 ? CustomerExpirdayInterval(savedRulesDetails, visitorDetails, formRules) : true;
            if (!customerExpirdayInterval) return false;


            bool isOnlineSentimentIs = formRules.OnlineSentimentIs > 0 ? SentimentIs(savedRulesDetails, visitorDetails, formRules) : true;

            return clickedRecentButton && clickedButton && clickedPriceRangeProduct && isVisitorRespondedChat && mailCampignResponsiveStage && isRespondedForm && isNotRespondedForm && closeCount &&
                   isaddedProductsToCart && isViewedButNotAddedProductsToCart && isDroppedProductsFromCart && isPurchasedProducts && isNotPurchasedProducts && isCustomerTotalPurchase &&
                   isCustomerCurrentValue && isOnlineSentimentIs && IsBusinessOrIndividualMember && IsOfflineOrOnlinePurchase &&
                    lastPurchaseInterval && customerExpirdayInterval;
        }
        private bool CheckRecentClickedButton(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.IsClickedRecentButtonsIsTheirData)
            {
                savedRulesDetails.IsClickedRecentButtons = getDetails.GetRecentEvent(visitorDetails.DeviceId);
                savedRulesDetails.IsClickedRecentButtonsIsTheirData = true;
            }

            formRules.IsClickedRecentButtons = System.Text.RegularExpressions.Regex.Replace(formRules.IsClickedRecentButtons, @"\s+", "");
            savedRulesDetails.IsClickedRecentButtons = System.Text.RegularExpressions.Regex.Replace(savedRulesDetails.IsClickedRecentButtons, @"\s+", "");

            string[] formConditionClicks = formRules.IsClickedRecentButtons.Split(',');
            string[] userClickedData = savedRulesDetails.IsClickedRecentButtons.Split(',');

            var result = formConditionClicks.Intersect(userClickedData);

            return result != null && result.Count() > 0;
        }
        private bool CheckClickedButton(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.IsClickedSpecificButtonsIsTheirData)
            {
                savedRulesDetails.IsClickedSpecificButtons = getDetails.GetClickedButton(visitorDetails.DeviceId);
                savedRulesDetails.IsClickedSpecificButtonsIsTheirData = true;
            }

            formRules.IsClickedSpecificButtons = System.Text.RegularExpressions.Regex.Replace(formRules.IsClickedRecentButtons, @"\s+", "");
            savedRulesDetails.IsClickedSpecificButtons = System.Text.RegularExpressions.Regex.Replace(savedRulesDetails.IsClickedRecentButtons, @"\s+", "");

            string[] formConditionClicks = formRules.IsClickedSpecificButtons.Split(',');
            string[] userClickedData = savedRulesDetails.IsClickedSpecificButtons.Split(',');

            var result = formConditionClicks.Intersect(userClickedData);

            return result != null && result.Count() > 0;
        }

        private bool CheckClickedSpecificPriceRange(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.ClickedPriceRangeProductIsTheirData)
            {
                savedRulesDetails.ClickedPriceRangeProduct = getDetails.GetClickedButton(visitorDetails.DeviceId);
                savedRulesDetails.ClickedPriceRangeProductIsTheirData = true;
            }

            formRules.ClickedPriceRangeProduct = System.Text.RegularExpressions.Regex.Replace(formRules.ClickedPriceRangeProduct, @"\s+", "");
            savedRulesDetails.ClickedPriceRangeProduct = System.Text.RegularExpressions.Regex.Replace(savedRulesDetails.ClickedPriceRangeProduct, @"\s+", "");

            string[] formConditionClicks = formRules.ClickedPriceRangeProduct.Split(',');
            string[] userClickedData = savedRulesDetails.ClickedPriceRangeProduct.Split(',');

            var result = formConditionClicks.Intersect(userClickedData);

            return result != null && result.Count() > 0;
        }

        private bool CheckRespondedChatAgent(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.IsVisitorRespondedChatIsTheirData)
            {
                savedRulesDetails.IsVisitorRespondedChat = getDetails.RespondedChatAgent(visitorDetails.EmailId);
                savedRulesDetails.IsVisitorRespondedChatIsTheirData = true;
            }
            return savedRulesDetails.IsVisitorRespondedChat;
        }

        private bool CheckMailCampaignsStage(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.MailCampignResponsiveStageIsTheirData)
            {
                byte[] MailStageScore = getDetails.MailCampignResponsiveStage(visitorDetails.EmailId);
                savedRulesDetails.MailCampignResponsiveStage = MailStageScore[0];
                savedRulesDetails.MailCampignResponsiveStageScore = MailStageScore[1];

                savedRulesDetails.MailCampignResponsiveStageIsTheirData = true;
            }

            if (savedRulesDetails.MailCampignResponsiveStage > 0)
            {
                byte visitorResponseStage = savedRulesDetails.MailCampignResponsiveStage;
                byte scoreType = savedRulesDetails.MailCampignResponsiveStageScore;

                if (formRules.MailCampignResponsiveStage == 1 && scoreType == 1)
                    return visitorResponseStage >= 10 && visitorResponseStage <= 10;
                else if (formRules.MailCampignResponsiveStage == 2 && scoreType == 1)
                    return visitorResponseStage >= 4 && visitorResponseStage <= 9;
                else if (formRules.MailCampignResponsiveStage == 3 && scoreType == 1)
                    return visitorResponseStage >= 0 && visitorResponseStage <= 3;
                else if (formRules.MailCampignResponsiveStage == 6 && scoreType == 2)
                    return visitorResponseStage >= 1 && visitorResponseStage <= 3;
                else if (formRules.MailCampignResponsiveStage == 7 && scoreType == 2)
                    return visitorResponseStage >= 4 && visitorResponseStage <= 10;
                else if (formRules.MailCampignResponsiveStage == 4 && scoreType == 0)
                    return visitorResponseStage >= 0 && visitorResponseStage <= 10;
                else if (formRules.MailCampignResponsiveStage == 5 && scoreType == 0)
                    return visitorResponseStage >= 0 && visitorResponseStage <= 0;
                else if (formRules.MailCampignResponsiveStage == 8 && scoreType == 0)
                    return visitorResponseStage >= 255 && visitorResponseStage <= 0;
            }

            return false;
        }

        private bool CheckResponseFormList(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.FormRespondedListIsTheirData)
            {
                savedRulesDetails.FormRespondedList = getDetails.ResponseFormList(visitorDetails.DeviceId, visitorDetails.FormType);
                savedRulesDetails.FormRespondedListIsTheirData = true;
            }

            foreach (var eachItem in savedRulesDetails.FormRespondedList)
            {
                if (eachItem == formRules.IsRespondedForm)
                    return true;
            }
            return false;
        }

        private bool CheckNotResponseFormList(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.FormRespondedListIsTheirData)
            {
                savedRulesDetails.FormRespondedList = getDetails.ResponseFormList(visitorDetails.DeviceId, visitorDetails.FormType);
                savedRulesDetails.FormRespondedListIsTheirData = true;
            }

            foreach (var eachItem in savedRulesDetails.FormRespondedList)
            {
                if (eachItem == formRules.IsNotRespondedForm)
                    return false;
            }
            return true;
        }


        //pending.............................


        //private bool CheckAnswerDependency(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, FormRules formRules)
        //{
        //    using (DataSet dsLead = getDetails.FormLeadDetailsAnswerDependency(visitorDetails.DeviceId, formRules.DependencyFormId))
        //    {
        //        GenralInteractionWithBL fields = new GenralInteractionWithBL(visitorDetails.AdsId);
        //        List<FormFields> fieldList = fields.GetFields(formRules.DependencyFormId);

        //        int FieldIndex = fieldList.FindIndex(c => c.Id == formRules.DependencyFormField);

        //        if (dsLead.Tables.Count > 0 && dsLead.Tables[0].Rows.Count > 0)
        //        {
        //            if (!String.IsNullOrEmpty(dsLead.Tables[0].Rows[0][FieldIndex].ToString()) && FieldIndex > -1)
        //            {
        //                long dependencyFormAnswer1 = 0;
        //                bool dependencyFormAnswer1IsInteger = long.TryParse(formRules.DependencyFormAnswer1, out dependencyFormAnswer1);

        //                long dependencyFormAnswer2 = 0;
        //                bool dependencyFormAnswer2IsInteger = long.TryParse(formRules.DependencyFormAnswer2, out dependencyFormAnswer2);

        //                long conditionValue = 0;
        //                bool conditionValueIsInteger = long.TryParse(dsLead.Tables[0].Rows[0][FieldIndex].ToString(), out conditionValue);

        //                if (formRules.DependencyFormCondition == 1 && conditionValueIsInteger && dependencyFormAnswer1IsInteger)
        //                    return dependencyFormAnswer1 > conditionValue;
        //                else if (formRules.DependencyFormCondition == 2 && conditionValueIsInteger && dependencyFormAnswer1IsInteger)
        //                    return dependencyFormAnswer1 < conditionValue;
        //                else if (formRules.DependencyFormCondition == 3 && conditionValueIsInteger && dependencyFormAnswer1IsInteger && dependencyFormAnswer2IsInteger)
        //                    return conditionValue >= dependencyFormAnswer1 && conditionValue <= dependencyFormAnswer2;
        //                else if (formRules.DependencyFormCondition == 4)
        //                    if (conditionValueIsInteger)
        //                        return conditionValue == dependencyFormAnswer1;
        //                    else
        //                        return dsLead.Tables[0].Rows[0][FieldIndex].ToString() == formRules.DependencyFormAnswer1;
        //            }
        //        }
        //    }
        //    return false;
        //}

        private bool CheckClosedFormNthTime(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (formRules.CloseCountSessionWiseOrOverAll)
            {
                if (!savedRulesDetails.CloseCountIsTheirData)
                {
                    savedRulesDetails.CloseCount = getDetails.ClosedFormNthTime(visitorDetails.DeviceId, formRules.FormId, visitorDetails.FormType);
                    savedRulesDetails.CloseCountIsTheirData = true;
                }
            }
            else if (!formRules.CloseCountSessionWiseOrOverAll)
            {
                if (!savedRulesDetails.CloseCountSessionWise)
                {
                    savedRulesDetails.CloseCount = getDetails.ClosedFormSessionWise(visitorDetails.DeviceId, visitorDetails.Session, formRules.FormId, visitorDetails.FormType);
                    savedRulesDetails.CloseCountSessionWise = true;
                }
            }
            if (savedRulesDetails.CloseCount >= formRules.CloseCount)
                return false;
            return true;
        }

        private bool CheckVisitorAddProductToCart(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.AddedProductsToCartIsTheirData)
            {
                savedRulesDetails.AddedProductsToCart = getDetails.AddProductToCart(visitorDetails.DeviceId);
                savedRulesDetails.AddedProductsToCartIsTheirData = true;
            }
            foreach (string conditionProducts in formRules.AddedProductsToCart.Split(','))
                foreach (string userProduct in savedRulesDetails.AddedProductsToCart.Split(','))
                {
                    if (userProduct.ToString().ToLower() == conditionProducts.Trim().ToLower())
                    {
                        return true;
                    }
                }
            return false;
        }

        private bool VisitorViewedButNotAdded(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.ViewedButNotAddedProductsToCartIsTheirData)
            {
                savedRulesDetails.ViewedButNotAddedProductsToCart = getDetails.ViewedButNotAddedProductsToCart(visitorDetails.DeviceId, visitorDetails.ContactId, formRules.FormId);
                savedRulesDetails.ViewedButNotAddedProductsToCartIsTheirData = true;
            }
            //foreach (string conditionProducts in browserRules.ViewedButNotAddedProductsToCart.Split(','))
            //    foreach (string userProduct in savedRulesDetails.ViewedButNotAddedProductsToCart.Split(','))
            //    {
            //        if (userProduct.Trim().ToLower() == conditionProducts.Trim().ToLower())
            //        {
            //            return true;
            //        }
            //    }
            if (savedRulesDetails.ViewedButNotAddedProductsToCart.Length > 0)
                return true;
            return false;
        }

        private bool VisitorDroppedFromCart(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.DroppedProductsFromCartIsTheirData)
            {
                savedRulesDetails.DroppedProductsFromCart = getDetails.DroppedProductsFromCart(visitorDetails.DeviceId, visitorDetails.ContactId, formRules.FormId);
                savedRulesDetails.DroppedProductsFromCartIsTheirData = true;
            }
            //foreach (string conditionProducts in browserRules.DroppedProductsFromCart.Split(','))
            //    foreach (string userProduct in savedRulesDetails.DroppedProductsFromCart.Split(','))
            //    {
            //        if (userProduct.Trim().ToLower() == conditionProducts.Trim().ToLower())
            //        {
            //            return true;
            //        }
            //    }
            if (savedRulesDetails.DroppedProductsFromCart.Length > 0)
                return true;
            return false;
        }

        private bool CustomerPurchasedProducts(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.PurchasedProductsIsTheirData)
            {
                savedRulesDetails.PurchasedProducts = getDetails.PurchasedProducts(visitorDetails.DeviceId);
                savedRulesDetails.PurchasedProductsIsTheirData = true;
            }
            foreach (string conditionProducts in formRules.PurchasedProducts.Split(','))
                foreach (string userProduct in savedRulesDetails.PurchasedProducts.Split(','))
                {
                    if (userProduct.Trim().ToLower() == conditionProducts.Trim().ToLower())
                    {
                        return true;
                    }
                }
            return false;
        }

        private bool CustomerNotPurchasedProducts(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.PurchasedProductsIsTheirData)
            {
                savedRulesDetails.PurchasedProducts = getDetails.PurchasedProducts(visitorDetails.DeviceId);
                savedRulesDetails.PurchasedProductsIsTheirData = true;
            }
            foreach (string conditionProducts in formRules.PurchasedProducts.Split(','))
                foreach (string userProduct in savedRulesDetails.PurchasedProducts.Split(','))
                {
                    if (userProduct.Trim().ToLower() == conditionProducts.Trim().ToLower())
                    {
                        return false;
                    }
                }
            return true;
        }

        private bool CustomerTotalPurchase(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.CustomerTotalPurchaseIsTheirData)
            {
                savedRulesDetails.CustomerTotalPurchase = getDetails.CustomerTotalPurchase(visitorDetails.DeviceId);
                savedRulesDetails.CustomerTotalPurchaseIsTheirData = true;
            }

            if (formRules.CustomerTotalPurchase >= savedRulesDetails.CustomerTotalPurchase)
                return true;
            return false;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="formRules"></param>
        /// <returns></returns>
        private bool CustomerCurrentValue(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.CustomerCurrentValueIsTheirData)
            {
                savedRulesDetails.CustomerCurrentValue = getDetails.CustomerCurrentValue(visitorDetails.DeviceId);
                savedRulesDetails.CustomerCurrentValueIsTheirData = true;
            }

            if (formRules.CustomerCurrentValue >= savedRulesDetails.CustomerCurrentValue)
                return true;
            return false;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool BusinessOrIndividualMember(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules browserRules)
        {
            if (!savedRulesDetails.IsBusinessOrIndividualMemberIsTheirData)
            {
                savedRulesDetails.IsBusinessOrIndividualMember = getDetails.IsBusinessOrIndividualMember(visitorDetails.DeviceId, visitorDetails.ContactId);
                savedRulesDetails.IsBusinessOrIndividualMemberIsTheirData = true;
            }
            if (browserRules.IsBusinessOrIndividualMember)
                return savedRulesDetails.IsBusinessOrIndividualMember == true;
            else if (!browserRules.IsBusinessOrIndividualMember)
                return savedRulesDetails.IsBusinessOrIndividualMember == false;
            else
                return false;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool OfflineOrOnlinePurchase(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules browserRules)
        {
            if (!savedRulesDetails.IsOfflineOrOnlinePurchaseIsTheirData)
            {
                savedRulesDetails.IsOfflineOrOnlinePurchase = getDetails.IsOfflineOrOnlinePurchase(visitorDetails.DeviceId, visitorDetails.ContactId);
                savedRulesDetails.IsOfflineOrOnlinePurchaseIsTheirData = true;
            }
            if (browserRules.IsOfflineOrOnlinePurchase)
                return savedRulesDetails.IsOfflineOrOnlinePurchase == true;
            else if (!browserRules.IsOfflineOrOnlinePurchase)
                return savedRulesDetails.IsOfflineOrOnlinePurchase == false;
            else
                return false;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool LastPurchaseInterval(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules browserRules)
        {
            if (!savedRulesDetails.LastPurchaseIntervalIsTheirData)
            {
                savedRulesDetails.LastPurchaseInterval = getDetails.GetLastPurchaseInterval(visitorDetails.DeviceId, visitorDetails.ContactId);
                savedRulesDetails.LastPurchaseIntervalIsTheirData = true;
            }
            if (browserRules.LastPurchaseIntervalCondition == 1)
            {
                return savedRulesDetails.LastPurchaseInterval > browserRules.LastPurchaseIntervalRange1;
            }
            else if (browserRules.LastPurchaseIntervalCondition == 2)
            {
                return savedRulesDetails.LastPurchaseInterval < browserRules.LastPurchaseIntervalRange1;
            }
            else if (browserRules.LastPurchaseIntervalCondition == 3)
            {
                return savedRulesDetails.LastPurchaseInterval >= browserRules.LastPurchaseIntervalRange1 && savedRulesDetails.LastPurchaseInterval <= browserRules.LastPurchaseIntervalRange2;
            }
            else if (browserRules.LastPurchaseIntervalCondition == 4)
            {
                return savedRulesDetails.LastPurchaseInterval == browserRules.LastPurchaseIntervalRange1;
            }
            return false;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CustomerExpirdayInterval(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules browserRules)
        {
            if (!savedRulesDetails.CustomerExpirdayIntervalIsTheirData)
            {
                savedRulesDetails.CustomerExpirdayInterval = getDetails.GetCustomerExpirdayInterval(visitorDetails.DeviceId, visitorDetails.ContactId);
                savedRulesDetails.CustomerExpirdayIntervalIsTheirData = true;
            }
            if (browserRules.CustomerExpirdayIntervalCondition == 1)
            {
                return savedRulesDetails.CustomerExpirdayInterval > browserRules.CustomerExpirdayIntervalRange1;
            }
            else if (browserRules.CustomerExpirdayIntervalCondition == 2)
            {
                return savedRulesDetails.CustomerExpirdayInterval < browserRules.CustomerExpirdayIntervalRange1;
            }
            else if (browserRules.CustomerExpirdayIntervalCondition == 3)
            {
                return savedRulesDetails.CustomerExpirdayInterval >= browserRules.CustomerExpirdayIntervalRange1 && savedRulesDetails.CustomerExpirdayInterval <= browserRules.CustomerExpirdayIntervalRange2;
            }
            else if (browserRules.CustomerExpirdayIntervalCondition == 4)
            {
                return savedRulesDetails.CustomerExpirdayInterval == browserRules.CustomerExpirdayIntervalRange1;
            }
            return false;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="formRules"></param>
        /// <returns></returns>
        private bool SentimentIs(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.OnlineSentimentIsTheirData)
            {
                savedRulesDetails.OnlineSentimentIs = getDetails.OnlineSentimentIs(visitorDetails.EmailId);
                savedRulesDetails.OnlineSentimentIsTheirData = true;
            }
            if (formRules.OnlineSentimentIs >= savedRulesDetails.OnlineSentimentIs)
                return true;
            return false;
        }

        #endregion Interaction Rule

        #region Interaction Event

        private bool ByInteractionEvent(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            bool formImpression = formRules.ImpressionEventForFormId > -1 && formRules.ImpressionEventCountCondition > 0 ? CheckFormImpression(savedRulesDetails, visitorDetails, formRules) : true;
            if (!formImpression) return false;

            bool formCloseCount = formRules.CloseEventForFormId > -1 && formRules.CloseEventCountCondition > 0 ? CheckFormCloseCount(savedRulesDetails, visitorDetails, formRules) : true;
            if (!formCloseCount) return false;

            bool formResponseCount = formRules.ResponsesEventForFormId > -1 && formRules.ResponsesEventCountCondition > 0 ? CheckFormResponseCount(savedRulesDetails, visitorDetails, formRules) : true;
            if (!formResponseCount) return false;

            bool ShowThisFormOnlyNthTime = formRules.ShowFormOnlyNthTime > 0 ? CheckShowThisFormOnlyNthTime(savedRulesDetails, visitorDetails, formRules) : true;

            return formImpression && formCloseCount && formResponseCount && ShowThisFormOnlyNthTime;
        }

        private bool CheckFormImpression(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.ImpressionEventCountConditionIsTheirData)
            {
                savedRulesDetails.ImpressionEventCountCondition = getDetails.GetFormImpression(visitorDetails.DeviceId, formRules.ImpressionEventForFormId, visitorDetails.FormType);
                savedRulesDetails.ImpressionEventCountConditionIsTheirData = true;
            }

            return savedRulesDetails.ImpressionEventCountCondition >= formRules.ImpressionEventCountCondition;
        }

        private bool CheckFormCloseCount(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.CloseEventCountConditionIsTheirData)
            {
                savedRulesDetails.CloseEventCountCondition = getDetails.GetFormCloseCount(visitorDetails.DeviceId, formRules.CloseEventForFormId, visitorDetails.FormType);
                savedRulesDetails.CloseEventCountConditionIsTheirData = true;
            }

            return savedRulesDetails.CloseEventCountCondition >= formRules.CloseEventCountCondition;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="formRules"></param>
        /// <returns></returns>
        private bool CheckFormResponseCount(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.ResponsesEventCountConditionIsTheirData)
            {
                savedRulesDetails.ResponsesEventCountCondition = getDetails.GetFormResponseCount(visitorDetails.DeviceId, formRules.ResponsesEventForFormId, visitorDetails.FormType);
                savedRulesDetails.ResponsesEventCountConditionIsTheirData = true;
            }

            return savedRulesDetails.ResponsesEventCountCondition >= formRules.ResponsesEventCountCondition;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="formRules"></param>
        /// <returns></returns>
        private bool CheckShowThisFormOnlyNthTime(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.ShowFormOnlyNthTimeIsTheirData)
            {
                savedRulesDetails.ShowFormOnlyNthTime = getDetails.GetCountShowThisFormOnlyNthTime(visitorDetails.DeviceId, formRules.FormId, visitorDetails.FormType);
                savedRulesDetails.ShowFormOnlyNthTimeIsTheirData = true;

            }
            // Here condition is less means, then only show form other wise don't show.
            return savedRulesDetails.ShowFormOnlyNthTime < formRules.ShowFormOnlyNthTime;
        }
        #endregion Interaction Event

        #region Profile Rule
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="formRules"></param>
        /// <returns></returns>
        private bool ByProfile(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            //bool isOnlinSentimentIs = formRules.OnlineSentimentIs > 0 ? ChekOnlineSentiment(savedRulesDetails, visitorDetails, formRules) : true;
            //if (!isOnlinSentimentIs) return false;

            bool isSocialStatusIsActive = formRules.SocialStatusIs > 0 ? ChekFacebookRecentStatus(savedRulesDetails, visitorDetails, formRules) : true;
            if (!isSocialStatusIsActive) return false;

            bool isInfluentialScore = formRules.InfluentialScoreCondition > 0 ? InfluentialScore(savedRulesDetails, visitorDetails, formRules) : true;
            if (!isInfluentialScore) return false;

            //bool isOfflineSentimentIs = formRules.OfflineSentimentIs > 0 ? savedRulesDetails.OfflineSentimentIs == 1 ? true : false : true;
            //if (!isOfflineSentimentIs) return false;

            bool isProductRating = formRules.ProductRatingIs > 0 ? ProductRatingIs(savedRulesDetails, visitorDetails, formRules) : true;
            if (!isProductRating) return false;

            //bool isNurtureStatusIs = formRules.NurtureStatusIs >= -1 ? NurtureStatusIs(savedRulesDetails, visitorDetails, formRules) : true;
            //if (!isNurtureStatusIs) return false;

            bool isGenderIs = formRules.GenderIs != null && formRules.GenderIs.Length > 1 ? GetGenderValue(savedRulesDetails, visitorDetails, formRules) : true;
            if (!isGenderIs) return false;

            bool isMaritalStatus = formRules.MaritalStatusIs > 0 ? GetMaritalStatus(savedRulesDetails, visitorDetails, formRules) : true;
            if (!isMaritalStatus) return false;

            bool isProfessionIs = formRules.ProfessionIs != null && formRules.ProfessionIs.Length > 1 ? CheckProfessionIs(savedRulesDetails, visitorDetails, formRules) ? true : false : true;
            if (!isProfessionIs) return false;

            bool isConnectedSocially = formRules.NotConnectedSocially > 0 ? ConnectedSocially(savedRulesDetails, visitorDetails, formRules) : true;
            if (!isConnectedSocially) return false;

            bool isLoyaltyPointsCondition = formRules.LoyaltyPointsCondition > 0 ? LoyaltyPoints(savedRulesDetails, visitorDetails, formRules) : true;
            if (!isLoyaltyPointsCondition) return false;

            bool isRFMSScoreRangeCondition = formRules.RFMSScoreRangeCondition > 0 ? RFMSScoreIs(savedRulesDetails, visitorDetails, formRules) : true;

            return isSocialStatusIsActive && isInfluentialScore && isGenderIs && isMaritalStatus && isProfessionIs && isProfessionIs
                   && isConnectedSocially && isProductRating && isLoyaltyPointsCondition && isRFMSScoreRangeCondition;

        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="formRules"></param>
        /// <returns></returns>
        private bool ChekOnlineSentiment(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.OnlineSentimentIsTheirData)
            {
                savedRulesDetails.OnlineSentimentIs = getDetails.OnlineSentimentIs(visitorDetails.EmailId);
                savedRulesDetails.OnlineSentimentIsTheirData = true;
            }
            return savedRulesDetails.OnlineSentimentIs == formRules.OnlineSentimentIs;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="formRules"></param>
        /// <returns></returns>
        private bool ChekFacebookRecentStatus(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.SocialStatusIsTheirData)
            {
                savedRulesDetails.SocialStatusIs = getDetails.SocialStatusIs(visitorDetails.ContactId);
                savedRulesDetails.SocialStatusIsTheirData = true;
            }
            return savedRulesDetails.SocialStatusIs == formRules.SocialStatusIs;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="formRules"></param>
        /// <returns></returns>
        private bool InfluentialScore(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.ImpressionEventCountConditionIsTheirData)
            {
                savedRulesDetails.InfluentialScore = getDetails.InfluentialScore(visitorDetails.ContactId);
                savedRulesDetails.ImpressionEventCountConditionIsTheirData = false;
            }
            if (formRules.InfluentialScoreCondition == 1)
                return savedRulesDetails.InfluentialScore > formRules.InfluentialScore1;
            else if (formRules.InfluentialScoreCondition == 2)
                return savedRulesDetails.InfluentialScore < formRules.InfluentialScore1;
            else if (formRules.InfluentialScoreCondition == 3)
                return savedRulesDetails.InfluentialScore >= formRules.InfluentialScore1 && savedRulesDetails.InfluentialScore <= formRules.InfluentialScore2;
            else if (formRules.InfluentialScoreCondition == 4)
                return formRules.InfluentialScore1 == savedRulesDetails.InfluentialScore;
            return false;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="formRules"></param>
        /// <returns></returns>
        private bool ProductRatingIs(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.ProductRatingIsTheirData)
            {
                savedRulesDetails.ProductRatingIs = getDetails.ProductRatingIs(visitorDetails.DeviceId);
                savedRulesDetails.ProductRatingIsTheirData = true;
            }
            return savedRulesDetails.ProductRatingIs == formRules.ProductRatingIs;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="formRules"></param>
        /// <returns></returns>
        private bool NurtureStatusIs(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.NurtureStatusIsTheirData)
            {
                savedRulesDetails.NurtureStatusIs = getDetails.NurtureStatusIs(visitorDetails.ContactId);
                savedRulesDetails.NurtureStatusIsTheirData = true;
            }
            return savedRulesDetails.NurtureStatusIs == formRules.NurtureStatusIs;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="formRules"></param>
        /// <returns></returns>
        private bool GetGenderValue(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.GenderIsTheirData)
            {
                savedRulesDetails.GenderIs = getDetails.GetGenderValue(visitorDetails.ContactId);
                savedRulesDetails.GenderIsTheirData = true;
            }
            if (!String.IsNullOrEmpty(savedRulesDetails.GenderIs))
            {
                if (savedRulesDetails.GenderIs.ToLower().Trim() == formRules.GenderIs.ToLower().Trim())
                    return true;
            }
            return false;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="formRules"></param>
        /// <returns></returns>
        private bool GetMaritalStatus(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.MaritalStatusIsTheirData)
            {
                savedRulesDetails.MaritalStatusIs = getDetails.GetMaritalStatus(visitorDetails.ContactId);
                savedRulesDetails.MaritalStatusIsTheirData = true;
            }
            return savedRulesDetails.MaritalStatusIs == formRules.MaritalStatusIs;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="formRules"></param>
        /// <returns></returns>
        private bool CheckProfessionIs(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.ProfessionIsTheirData)
            {
                savedRulesDetails.ProfessionIs = getDetails.ProfessionIs(visitorDetails.ContactId);
                savedRulesDetails.ProfessionIsTheirData = true;
            }
            if (!String.IsNullOrEmpty(savedRulesDetails.ProfessionIs))
            {
                string[] formprofessionList = formRules.ProfessionIs.ToLower().Trim().Split(',');
                string[] savedprofessionList = savedRulesDetails.ProfessionIs.ToLower().Trim().Split(',');

                var result = formprofessionList.Intersect(savedprofessionList);

                return result != null && result.Count() > 0;
            }
            return false;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="formRules"></param>
        /// <returns></returns>
        private bool ConnectedSocially(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.NotConnectedSociallyIsTheirData)
            {
                savedRulesDetails.NotConnectedSocially = getDetails.ConnectedSocially(visitorDetails.ContactId);
                savedRulesDetails.NotConnectedSociallyIsTheirData = true;
            }
            return savedRulesDetails.NotConnectedSocially == formRules.NotConnectedSocially;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="formRules"></param>
        /// <returns></returns>
        private bool LoyaltyPoints(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.LoyaltyPointsConditionIsTheirData)
            {
                savedRulesDetails.LoyaltyPoints = getDetails.LoyaltyPoints(visitorDetails.ContactId);
                savedRulesDetails.LoyaltyPointsConditionIsTheirData = true;
            }
            if (formRules.LoyaltyPointsCondition == 1)
                return formRules.LoyaltyPointsRange1 > savedRulesDetails.LoyaltyPoints;
            else if (formRules.LoyaltyPointsCondition == 2)
                return formRules.LoyaltyPointsRange1 < savedRulesDetails.LoyaltyPoints;
            else if (formRules.LoyaltyPointsCondition == 3)
                return savedRulesDetails.LoyaltyPoints >= formRules.LoyaltyPointsRange1 && savedRulesDetails.LoyaltyPoints <= formRules.LoyaltyPointsRange2;
            else if (formRules.LoyaltyPointsCondition == 4)
                return formRules.LoyaltyPointsRange1 == savedRulesDetails.LoyaltyPoints;
            return false;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="formRules"></param>
        /// <returns></returns>
        private bool RFMSScoreIs(MobileVisitorSaveRulesDetails savedRulesDetails, MobileVisitorDetails visitorDetails, MobileFormRules formRules)
        {
            if (!savedRulesDetails.RFMSScoreRangeIsTheirData)
            {
                savedRulesDetails.RFMSScoreRange = getDetails.RFMSScoreIs(visitorDetails.EmailId);
                savedRulesDetails.RFMSScoreRangeIsTheirData = true;
            }
            if (formRules.RFMSScoreRangeCondition == 1)
                return formRules.RFMSScoreRange1 > savedRulesDetails.RFMSScoreRange;
            else if (formRules.RFMSScoreRangeCondition == 2)
                return formRules.RFMSScoreRange1 < savedRulesDetails.RFMSScoreRange;
            else if (formRules.RFMSScoreRangeCondition == 3)
                return savedRulesDetails.RFMSScoreRange >= formRules.RFMSScoreRange1 && savedRulesDetails.RFMSScoreRange <= formRules.RFMSScoreRange2;
            else if (formRules.RFMSScoreRangeCondition == 4)
                return formRules.RFMSScoreRange1 == savedRulesDetails.RFMSScoreRange;
            return false;
        }
        #endregion Profile Rule
        /// <summary>
        /// 
        /// </summary>
        /// <param name="urlString"></param>
        /// <returns></returns>
        private string CustomizeUrl(string urlString)
        {
            urlString = urlString.Contains("https://") ? urlString.Replace("https://", "") : urlString;
            urlString = urlString.Contains("http://") ? urlString : "http://" + urlString;
            urlString = urlString.Contains("www.") ? urlString.Replace("www.", "") : urlString;
            urlString = urlString.Trim().ToLower().TrimEnd('/');
            return urlString;
        }
    }
}