using System;
using System.Linq;
using P5GenralML;
using System.Collections.Generic;
using System.Data;
using System.Globalization;

namespace P5GenralDL
{
    public class BrowserRuleChecking
    {
        DLVisitorInfoForBrowserRule getDetails = null;
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        public bool CheckBrowserRules(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            bool behaviorRule = false, interactionRule = false, interactionEvent = false, profileRule = false;
            try
            {
                getDetails = new DLVisitorInfoForBrowserRule(visitorDetails.AdsId);

                bool audienceRule = ByAudience(savedRulesDetails, visitorDetails, browserRules);
                if (audienceRule)
                    behaviorRule = ByBehavior(savedRulesDetails, visitorDetails, browserRules);
                if (behaviorRule)
                    interactionRule = ByInteraction(savedRulesDetails, visitorDetails, browserRules);
                if (interactionRule)
                    interactionEvent = ByInteractionEvent(savedRulesDetails, visitorDetails, browserRules);
                if (interactionEvent)
                    profileRule = ByProfile(savedRulesDetails, visitorDetails, browserRules);

                return audienceRule && behaviorRule && interactionRule && profileRule;
            }
            catch
            {
                return false;
            }
        }

        #region Audience Condition Here
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool ByAudience(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            bool isLead = browserRules.IsLead > -1 ? IsLeadType(savedRulesDetails, visitorDetails, browserRules.IsLead) : true;
            if (!isLead) return false;

            bool isBelongOrNotSegment = browserRules.IsBelong > 0 ? IsBelongNotBelongsToSegment(savedRulesDetails, browserRules, visitorDetails) : true;

            return isLead && isBelongOrNotSegment;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="leadType"></param>
        /// <returns></returns>
        private bool IsLeadType(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, short leadType)
        {
            if (!savedRulesDetails.IsLeadIsTheirData)
            {
                savedRulesDetails.IsLead = Convert.ToInt16(getDetails.GetLeadType(visitorDetails.MachineId));
            }
            return leadType == savedRulesDetails.IsLead; //visitorDetails.LeadType;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="browserRules"></param>
        /// <param name="visitorDetails"></param>
        /// <returns></returns>
        private bool IsBelongNotBelongsToSegment(VisitorSaveRulesDetails savedRulesDetails, BrowserRules browserRules, VisitorDetails visitorDetails)
        {
            if (!savedRulesDetails.BelongIsTheirData)
            {
                savedRulesDetails.BelongsToGroup = getDetails.GetGroupList(visitorDetails.MachineId).Split(',');
                savedRulesDetails.BelongIsTheirData = true;
            }
            if (browserRules.IsBelong == 1)
            {
                foreach (var group in browserRules.BelongsToGroup.ToString().Split(','))
                {
                    if (savedRulesDetails.BelongsToGroup.Any(x => x == group))
                        return true;
                }
            }
            else if (browserRules.IsBelong == 2)
            {
                foreach (var group in browserRules.BelongsToGroup.ToString().Split(','))
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
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool ByBehavior(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            bool behavioralScore = browserRules.BehavioralScoreCondition > 0 ? BehavioralScore(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!behavioralScore) return false;

            bool sessionIs = browserRules.SessionIs > 0 ? CheckSessionIs(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!sessionIs) return false;

            bool pageDepth = browserRules.PageDepthIs > 0 ? CheckPageDepth(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!pageDepth) return false;

            bool pageViews = browserRules.NPageVisited > 0 ? CheckPageviews(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!pageViews) return false;

            bool frequency = browserRules.FrequencyIs > 0 ? CheckFrequency(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!frequency) return false;

            bool pageUrl = browserRules.PageUrl != null && browserRules.PageUrl.Length > 0 ? CheckPageurl(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!pageUrl) return false;

            bool pageParameter = browserRules.PageParameters != null && browserRules.PageParameters != "0" && browserRules.PageParameters.Length > 0 ? CheckPageParameters(visitorDetails, browserRules) : true;
            if (!pageParameter) return false;

            bool exceptionPageUrl = browserRules.ExceptionPageUrl != null && browserRules.ExceptionPageUrl.Length > 0 ? CheckExceptionPageUrl(visitorDetails, browserRules) : true;
            if (!exceptionPageUrl) return false;

            bool referrerUrl = browserRules.IsReferrer > 0 ? CheckReferrer(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!referrerUrl) return false;

            bool isMailIsRespondent = browserRules.IsMailIsRespondent ? CheckIsMailRespondent(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isMailIsRespondent) return false;

            bool isSmsIsRespondent = browserRules.IsSmsIsRespondent ? CheckIsSmsRespondent(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isSmsIsRespondent) return false;

            bool isSearchString = browserRules.SearchString != null && browserRules.SearchString.Length > 0 ? CheckSearchKeyword(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isSearchString) return false;

            bool countryRule = browserRules.Country != null && browserRules.Country.Length > 0 ? CheckCountry(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!countryRule) return false;

            bool cityRule = browserRules.City != null && browserRules.City.Length > 0 ? CheckCity(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!cityRule) return false;

            bool alreadyVisitedPageRule = browserRules.AlreadyVisitedPages != null && browserRules.AlreadyVisitedPages.Length > 0 ? CheckAlreadyVisitedPages(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!alreadyVisitedPageRule) return false;

            bool notalreadyVisitedPageRule = browserRules.NotAlreadyVisitedPages != null && browserRules.NotAlreadyVisitedPages.Length > 0 ? CheckNotAlreadyVisitedPages(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!notalreadyVisitedPageRule) return false;

            bool overAllTimeSpentInSite = browserRules.OverAllTimeSpentInSite > 0 ? CheckOverAllTimeSpentInSite(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!overAllTimeSpentInSite) return false;

            bool AndroidBrowser = browserRules.IsMobileDevice > 0 ? IsAndriodMobileBrowser(savedRulesDetails, visitorDetails, browserRules) : true;

            return behavioralScore && sessionIs && pageDepth && pageViews && frequency && pageUrl && referrerUrl && isMailIsRespondent && isSearchString && countryRule && cityRule && alreadyVisitedPageRule && overAllTimeSpentInSite && AndroidBrowser;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool BehavioralScore(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.BehavioralScoreIsTheirData)
            {
                savedRulesDetails.BehavioralScore = getDetails.GetBehavioralScore(visitorDetails.MachineId);
                savedRulesDetails.BehavioralScoreIsTheirData = true;
            }
            if (browserRules.BehavioralScoreCondition == 1)
            {
                return savedRulesDetails.BehavioralScore > browserRules.BehavioralScore1;
            }
            else if (browserRules.BehavioralScoreCondition == 2)
            {
                return savedRulesDetails.BehavioralScore < browserRules.BehavioralScore1;
            }
            else if (browserRules.BehavioralScoreCondition == 3)
            {
                return savedRulesDetails.BehavioralScore >= browserRules.BehavioralScore1 && savedRulesDetails.BehavioralScore <= browserRules.BehavioralScore2;
            }
            else if (browserRules.BehavioralScoreCondition == 4)
            {
                return savedRulesDetails.BehavioralScore == browserRules.BehavioralScore1;
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
        private bool CheckSessionIs(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.SessionIsTheirData)
            {
                savedRulesDetails.SessionIs = getDetails.GetSession(visitorDetails.MachineId);
                savedRulesDetails.SessionIsTheirData = true;
            }
            if (browserRules.SessionConditionIsTrueOrIsFalse)
                return savedRulesDetails.SessionIs >= browserRules.SessionIs;
            else if (!browserRules.SessionConditionIsTrueOrIsFalse)
                return savedRulesDetails.SessionIs < browserRules.SessionIs;
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
        private bool CheckPageDepth(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.PageDepthIsTheirData)
            {
                savedRulesDetails.PageDepthIs = getDetails.GetPageDepeth(visitorDetails.MachineId);
                savedRulesDetails.PageDepthIsTheirData = true;
            }
            if (browserRules.PageDepthConditionIsTrueOrIsFalse)
                return savedRulesDetails.PageDepthIs >= browserRules.PageDepthIs;
            else if (!browserRules.PageDepthConditionIsTrueOrIsFalse)
                return savedRulesDetails.PageDepthIs < browserRules.PageDepthIs;
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
        private bool CheckPageviews(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.NPageVisitedIsTheirData)
            {
                savedRulesDetails.NPageVisited = getDetails.GetPageviews(visitorDetails.MachineId);
                savedRulesDetails.NPageVisitedIsTheirData = true;
            }
            if (browserRules.PageViewConditionIsTrueOrIsFalse)
                return savedRulesDetails.NPageVisited >= browserRules.NPageVisited;
            else if (!browserRules.PageViewConditionIsTrueOrIsFalse)
                return savedRulesDetails.NPageVisited < browserRules.NPageVisited;
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
        private bool CheckFrequency(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.FrequencyIsTheirData)
            {
                savedRulesDetails.FrequencyIs = getDetails.GetFrequency(visitorDetails.MachineId);
                savedRulesDetails.FrequencyIsTheirData = true;
            }
            if (browserRules.FrequencyConditionIsTrueOrIsFalse)
                return savedRulesDetails.FrequencyIs >= browserRules.FrequencyIs;
            else if (!browserRules.FrequencyConditionIsTrueOrIsFalse)
                return savedRulesDetails.FrequencyIs < browserRules.FrequencyIs;
            else
                return false;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CheckPageurl(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            return getDetails.GetPageUrl(visitorDetails.MachineId, browserRules.FormId);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CheckPageParameters(VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            string[] conditionPageParameters = browserRules.PageParameters.ToString().Split(',');
            if (conditionPageParameters.Select(desUrl => desUrl.Trim().ToLower()).Any(temp1 => temp1 == visitorDetails.PageParameters.ToLower()))
            {
                return true;
            }
            return false;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="visitorDetails"></param>
        /// <param name="formRules"></param>
        /// <returns></returns>
        private bool CheckExceptionPageUrl(VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (browserRules.IsExceptionPageUrlContainsCondition)
            {
                string[] conditionPageUrl = browserRules.ExceptionPageUrl.ToString().Replace("%20", " ").Split(',');
                if (conditionPageUrl.Select(desUrl => desUrl.Trim().ToLower()).Any(temp1 => CustomizeUrl(visitorDetails.PageUrl).Contains(CustomizeUrl(temp1))))
                {
                    return false;
                }
            }
            else
            {
                string[] conditionPageUrl = browserRules.ExceptionPageUrl.ToString().Replace("%20", " ").Split(',');
                if (conditionPageUrl.Select(desUrl => desUrl.Trim().ToLower()).Any(temp1 => CustomizeUrl(temp1) == CustomizeUrl(visitorDetails.PageUrl)))
                {
                    return false;
                }
            }
            return true;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CheckReferrer(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.ReferrerUrlIsTheirData)
            {
                savedRulesDetails.ReferrerUrl = getDetails.GetSource(visitorDetails.MachineId);
                savedRulesDetails.ReferrerUrlIsTheirData = false;
            }
            if (browserRules.IsReferrer == 1)
            {
                //if (string.IsNullOrEmpty(visitorDetails.Referrer))
                //    return true;
                if (savedRulesDetails.ReferrerUrl.ToString().Trim().ToLower() == "direct")
                    return true;
            }
            else if (browserRules.IsReferrer == 2)
            {
                if (String.IsNullOrEmpty(savedRulesDetails.ReferrerUrl))
                {
                    return false;
                }
                else if (browserRules.CheckSourceDomainOnly)
                {
                    string[] conditionRefeereUrl = browserRules.ReferrerUrl.ToString().Replace("%20", " ").Split(',');
                    if (conditionRefeereUrl.Select(desUrl => desUrl.Trim().ToLower()).Any(temp1 => CustomizeUrl(savedRulesDetails.ReferrerUrl).Contains(CustomizeUrl(temp1))))
                    {
                        return true;
                    }
                }
                else
                {
                    string[] conditionRefeereUrl = browserRules.ReferrerUrl.ToString().Replace("%20", " ").Split(',');
                    if (conditionRefeereUrl.Select(desUrl => desUrl.Trim().ToLower()).Any(temp1 => CustomizeUrl(temp1) == CustomizeUrl(savedRulesDetails.ReferrerUrl)))
                    {
                        return true;
                    }
                }
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
        private bool CheckIsMailRespondent(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            savedRulesDetails.IsMailIsRespondent = getDetails.IsMailRespondent(visitorDetails.EmailId, browserRules.MailRespondentTemplates, browserRules.IsMailRespondentClickCondition);

            if (browserRules.MailRespondentConditionIsTrueOrIsFalse)
                return savedRulesDetails.IsMailIsRespondent == true;
            else if (!browserRules.MailRespondentConditionIsTrueOrIsFalse)
                return savedRulesDetails.IsMailIsRespondent == false;
            else
                return false;
        }

        private bool CheckIsSmsRespondent(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            savedRulesDetails.IsSmsIsRespondent = getDetails.IsSmsRespondent(visitorDetails.PhoneNumber, browserRules.SmsRespondentTemplates);

            if (browserRules.SmsRespondentConditionIsTrueOrIsFalse)
                return savedRulesDetails.IsSmsIsRespondent == true;
            else if (!browserRules.SmsRespondentConditionIsTrueOrIsFalse)
                return savedRulesDetails.IsSmsIsRespondent == false;
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
        private bool CheckSearchKeyword(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.SearchStringIsTheirData)
            {
                savedRulesDetails.SearchString = getDetails.SearchKeyword(visitorDetails.MachineId);
                savedRulesDetails.SearchStringIsTheirData = true;
            }
            return !String.IsNullOrEmpty(savedRulesDetails.SearchString);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CheckCountry(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.CountryCityIsTheirData)
            {
                string[] CountryCity = getDetails.GetCityCountry(visitorDetails.MachineId);
                if (CountryCity.Length > 0)
                    savedRulesDetails.Country = CountryCity[0];
                if (CountryCity.Length > 1)
                    savedRulesDetails.City = CountryCity[1];
                savedRulesDetails.CountryCityIsTheirData = true;
            }
            if (!String.IsNullOrEmpty(savedRulesDetails.Country))
            {
                string[] countryCondition = browserRules.Country.Split(new string[] { "@$" }, StringSplitOptions.RemoveEmptyEntries);

                if (browserRules.CountryConditionIsTrueOrIsFalse)
                {
                    if (countryCondition.Any(loca => loca.ToLower().Trim() == savedRulesDetails.Country.ToLower().Trim()))
                    {
                        return true;
                    }
                }
                else if (!browserRules.CountryConditionIsTrueOrIsFalse)
                {
                    if (countryCondition.All(loca => loca.ToLower().Trim() != savedRulesDetails.Country.ToLower().Trim()))
                    {
                        return true;
                    }
                }
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
        private bool CheckCity(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.CountryCityIsTheirData)
            {
                string[] CountryCity = getDetails.GetCityCountry(visitorDetails.MachineId);
                savedRulesDetails.Country = CountryCity[0];
                savedRulesDetails.City = CountryCity[1];
                savedRulesDetails.CountryCityIsTheirData = true;
            }
            if (!String.IsNullOrEmpty(savedRulesDetails.City))
            {
                string[] cityCondition = browserRules.City.Split(new string[] { "@$" }, StringSplitOptions.RemoveEmptyEntries);
                if (browserRules.CityConditionIsTrueOrIsFalse)
                {
                    if (cityCondition.Any(loca => loca.ToLower().Trim() == savedRulesDetails.City.ToLower().Trim()))
                    {
                        return true;
                    }
                }
                else if (!browserRules.CityConditionIsTrueOrIsFalse)
                {
                    if (cityCondition.All(loca => loca.ToLower().Trim() != savedRulesDetails.City.ToLower().Trim()))
                    {
                        return true;
                    }
                }
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
        private bool CheckAlreadyVisitedPages(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            return getDetails.AlreadyVisitedPages(visitorDetails.MachineId, browserRules.FormId, visitorDetails.Session);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CheckNotAlreadyVisitedPages(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            return getDetails.AlreadyNotVisitedPages(visitorDetails.MachineId, browserRules.FormId, visitorDetails.Session);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CheckOverAllTimeSpentInSite(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.OverAllTimeSpentInSiteIsTheirData)
            {
                savedRulesDetails.OverAllTimeSpentInSite = getDetails.OverAllTimeSpentInSite(visitorDetails.MachineId);
                savedRulesDetails.OverAllTimeSpentInSiteIsTheirData = true;
            }
            return savedRulesDetails.OverAllTimeSpentInSite >= browserRules.OverAllTimeSpentInSite;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool IsAndriodMobileBrowser(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (browserRules.IsMobileDevice == 1)
            {
                return getDetails.iAndriodBrowser() == true ? true : false;
            }
            else if (browserRules.IsMobileDevice == 2)
            {
                return getDetails.iAndriodBrowser() == true ? false : true;
            }
            return false;
        }
        #endregion Behavior Conditions

        #region Interaction Rule
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool ByInteraction(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            bool clickedRecentButton = browserRules.IsClickedRecentButtons != null && browserRules.IsClickedRecentButtons.Length > 0 ? CheckRecentClickedButton(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!clickedRecentButton) return false;

            bool clickedButton = browserRules.IsClickedSpecificButtons != null && browserRules.IsClickedSpecificButtons.Length > 0 ? CheckClickedButton(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!clickedButton) return false;

            bool clickedPriceRangeProduct = browserRules.ClickedPriceRangeProduct != null && browserRules.ClickedPriceRangeProduct.Length > 0 ? CheckClickedSpecificPriceRange(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!clickedPriceRangeProduct) return false;

            bool isVisitorRespondedChat = browserRules.IsVisitorRespondedChat ? CheckRespondedChatAgent(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isVisitorRespondedChat) return false;

            bool mailCampignResponsiveStage = browserRules.MailCampignResponsiveStage > 0 ? CheckMailCampaignsStage(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!mailCampignResponsiveStage) return false;

            bool isRespondedForm = browserRules.IsRespondedForm > 0 ? CheckResponseFormList(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isRespondedForm) return false;

            bool isNotRespondedForm = browserRules.IsNotRespondedForm > 0 ? CheckNotResponseFormList(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isNotRespondedForm) return false;

            bool answerDependency = browserRules.DependencyFormId > 0 ? CheckAnswerDependency(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!answerDependency) return false;

            bool closeCount = browserRules.CloseCount > 0 ? CheckClosedFormNthTime(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!closeCount) return false;

            bool isaddedProductsToCart = browserRules.AddedProductsToCart != null && browserRules.AddedProductsToCart.Length > 0 ? CheckVisitorAddProductToCart(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isaddedProductsToCart) return false;

            bool isaddedProductsCategoriesToCart = browserRules.AddedProductsCategoriesToCart != null && browserRules.AddedProductsCategoriesToCart.Length > 0 ? CheckVisitorAddProductCategoriesToCart(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isaddedProductsCategoriesToCart) return false;

            bool isnotaddedProductsCategoriesToCart = browserRules.NotAddedProductsCategoriesToCart != null && browserRules.NotAddedProductsCategoriesToCart.Length > 0 ? CheckVisitorNotAddProductCategoriesToCart(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isnotaddedProductsCategoriesToCart) return false;

            bool isaddedProductsSubCategoriesToCart = browserRules.AddedProductsSubCategoriesToCart != null && browserRules.AddedProductsSubCategoriesToCart.Length > 0 ? CheckVisitorAddProductSubCategoriesToCart(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isaddedProductsSubCategoriesToCart) return false;

            bool isnotaddedProductsSubCategoriesToCart = browserRules.NotAddedProductsSubCategoriesToCart != null && browserRules.NotAddedProductsSubCategoriesToCart.Length > 0 ? CheckVisitorNotAddProductSubCategoriesToCart(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isnotaddedProductsSubCategoriesToCart) return false;

            bool isViewedButNotAddedProductsToCart = browserRules.ViewedButNotAddedProductsToCart != null && browserRules.ViewedButNotAddedProductsToCart.Length > 0 ? VisitorViewedButNotAdded(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isViewedButNotAddedProductsToCart) return false;

            bool isDroppedProductsFromCart = browserRules.DroppedProductsFromCart != null && browserRules.DroppedProductsFromCart.Length > 0 ? VisitorDroppedFromCart(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isDroppedProductsFromCart) return false;

            bool isPurchasedProducts = browserRules.PurchasedProducts != null && browserRules.PurchasedProducts.Length > 0 ? CustomerPurchasedProducts(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isPurchasedProducts) return false;

            bool isNotPurchasedProducts = browserRules.NotPurchasedProducts != null && browserRules.NotPurchasedProducts.Length > 0 ? CustomerNotPurchasedProducts(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isNotPurchasedProducts) return false;

            bool isCustomerTotalPurchase = browserRules.TotalPurchaseQtyConditon > 0 ? CustomerTotalPurchaseQty(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isCustomerTotalPurchase) return false;

            bool isCustomerCurrentValue = browserRules.TotalPurchaseAmtCondition > 0 ? CustomerTotalPurchaseValue(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isCustomerCurrentValue) return false;

            bool IsBusinessOrIndividualMember = browserRules.IsBusinessOrIndividualMember ? BusinessOrIndividualMember(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!IsBusinessOrIndividualMember) return false;

            bool IsOfflineOrOnlinePurchase = browserRules.IsOfflineOrOnlinePurchase ? OfflineOrOnlinePurchase(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!IsOfflineOrOnlinePurchase) return false;

            bool lastPurchaseInterval = browserRules.LastPurchaseIntervalCondition > 0 ? LastPurchaseInterval(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!lastPurchaseInterval) return false;

            bool customerExpirdayInterval = browserRules.CustomerExpirdayIntervalCondition > 0 ? CustomerExpirdayInterval(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!customerExpirdayInterval) return false;

            bool isOnlineSentimentIs = browserRules.OnlineSentimentIs > 0 ? SentimentIs(savedRulesDetails, visitorDetails, browserRules) : true;

            return clickedRecentButton && clickedButton && clickedPriceRangeProduct && isVisitorRespondedChat && mailCampignResponsiveStage && isRespondedForm &&
                    closeCount && ////&& isNotRespondedForm
                    isaddedProductsToCart && isViewedButNotAddedProductsToCart && isDroppedProductsFromCart && isPurchasedProducts && isNotPurchasedProducts &&
                    isCustomerTotalPurchase && isCustomerCurrentValue && isOnlineSentimentIs && IsBusinessOrIndividualMember && IsOfflineOrOnlinePurchase &&
                    lastPurchaseInterval && customerExpirdayInterval;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CheckRecentClickedButton(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.IsClickedRecentButtonsIsTheirData)
            {
                savedRulesDetails.IsClickedRecentButtons = getDetails.GetRecentClickedButton(visitorDetails.MachineId);
                savedRulesDetails.IsClickedRecentButtonsIsTheirData = true;
            }

            browserRules.IsClickedRecentButtons = System.Text.RegularExpressions.Regex.Replace(browserRules.IsClickedRecentButtons, @"\s+", "");
            savedRulesDetails.IsClickedRecentButtons = System.Text.RegularExpressions.Regex.Replace(savedRulesDetails.IsClickedRecentButtons, @"\s+", "");

            string[] formConditionClicks = browserRules.IsClickedRecentButtons.Split(',');
            string[] userClickedData = savedRulesDetails.IsClickedRecentButtons.Split(',');

            var result = formConditionClicks.Intersect(userClickedData);

            return result != null && result.Count() > 0;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CheckClickedButton(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.IsClickedSpecificButtonsIsTheirData)
            {
                savedRulesDetails.IsClickedSpecificButtons = getDetails.GetClickedButton(visitorDetails.MachineId);
                savedRulesDetails.IsClickedSpecificButtonsIsTheirData = true;
            }

            browserRules.IsClickedSpecificButtons = System.Text.RegularExpressions.Regex.Replace(browserRules.IsClickedSpecificButtons, @"\s+", "");
            savedRulesDetails.IsClickedSpecificButtons = System.Text.RegularExpressions.Regex.Replace(savedRulesDetails.IsClickedSpecificButtons, @"\s+", "");

            string[] formConditionClicks = browserRules.IsClickedSpecificButtons.Split(',');
            string[] userClickedData = savedRulesDetails.IsClickedSpecificButtons.Split(',');

            var result = formConditionClicks.Intersect(userClickedData);

            return result != null && result.Count() > 0;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CheckClickedSpecificPriceRange(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.ClickedPriceRangeProductIsTheirData)
            {
                savedRulesDetails.ClickedPriceRangeProduct = getDetails.GetClickedButton(visitorDetails.MachineId);
                savedRulesDetails.ClickedPriceRangeProductIsTheirData = true;
            }

            browserRules.ClickedPriceRangeProduct = System.Text.RegularExpressions.Regex.Replace(browserRules.ClickedPriceRangeProduct, @"\s+", "");
            savedRulesDetails.ClickedPriceRangeProduct = System.Text.RegularExpressions.Regex.Replace(savedRulesDetails.ClickedPriceRangeProduct, @"\s+", "");

            string[] formConditionClicks = browserRules.ClickedPriceRangeProduct.Split(',');
            string[] userClickedData = savedRulesDetails.ClickedPriceRangeProduct.Split(',');

            var result = formConditionClicks.Intersect(userClickedData);

            return result != null && result.Count() > 0;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CheckRespondedChatAgent(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.IsVisitorRespondedChatIsTheirData)
            {
                savedRulesDetails.IsVisitorRespondedChat = getDetails.RespondedChatAgent(visitorDetails.MachineId);
                savedRulesDetails.IsVisitorRespondedChatIsTheirData = true;
            }
            return savedRulesDetails.IsVisitorRespondedChat;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CheckMailCampaignsStage(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
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

                if (browserRules.MailCampignResponsiveStage == 1 && scoreType == 1)
                    return visitorResponseStage >= 10 && visitorResponseStage <= 10;
                else if (browserRules.MailCampignResponsiveStage == 2 && scoreType == 1)
                    return visitorResponseStage >= 4 && visitorResponseStage <= 9;
                else if (browserRules.MailCampignResponsiveStage == 3 && scoreType == 1)
                    return visitorResponseStage >= 0 && visitorResponseStage <= 3;
                else if (browserRules.MailCampignResponsiveStage == 6 && scoreType == 2)
                    return visitorResponseStage >= 1 && visitorResponseStage <= 3;
                else if (browserRules.MailCampignResponsiveStage == 7 && scoreType == 2)
                    return visitorResponseStage >= 4 && visitorResponseStage <= 10;
                else if (browserRules.MailCampignResponsiveStage == 4 && scoreType == 0)
                    return visitorResponseStage >= 0 && visitorResponseStage <= 10;
                else if (browserRules.MailCampignResponsiveStage == 5 && scoreType == 0)
                    return visitorResponseStage >= 0 && visitorResponseStage <= 0;
                else if (browserRules.MailCampignResponsiveStage == 8 && scoreType == 0)
                    return visitorResponseStage <= 0;
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
        private bool CheckResponseFormList(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.FormRespondedListIsTheirData)
            {
                savedRulesDetails.FormRespondedList = getDetails.ResponseFormList(visitorDetails.MachineId);
                savedRulesDetails.FormRespondedListIsTheirData = true;
            }
            foreach (var eachItem in savedRulesDetails.FormRespondedList)
            {
                if (eachItem == browserRules.IsRespondedForm)
                    return true;
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
        private bool CheckNotResponseFormList(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.FormRespondedListIsTheirData)
            {
                savedRulesDetails.FormRespondedList = getDetails.ResponseFormList(visitorDetails.MachineId);
                savedRulesDetails.FormRespondedListIsTheirData = true;
            }
            foreach (var eachItem in savedRulesDetails.FormRespondedList)
            {
                if (eachItem == browserRules.IsNotRespondedForm)
                    return false;
            }
            return true;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CheckAnswerDependency(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            using (DataSet dsLead = getDetails.FormLeadDetailsAnswerDependency(visitorDetails.MachineId, browserRules.DependencyFormId))
            {
                int FieldIndex = 0;
                DLWebPushNotification fields = new DLWebPushNotification(visitorDetails.AdsId);
                List<FormFieldsForPsuh> fieldList = fields.GetFields(browserRules.DependencyFormId);

                if (fieldList != null && fieldList.Count > 1)
                {
                    FieldIndex = fieldList.FindIndex(c => c.Id == browserRules.DependencyFormField);
                }
                else if (fieldList != null && fieldList.Count == 1)
                {
                    FormDetailsForPsuh form = new FormDetailsForPsuh();

                    using (DLWebPushNotification objformDetails = new DLWebPushNotification(visitorDetails.AdsId))
                    {
                        form = objformDetails.GetDetails(browserRules.DependencyFormId);
                    }

                    if (form != null && (form.FormType == 12 || form.FormType == 20))
                        FieldIndex = fieldList.FindIndex(c => c.Id == browserRules.DependencyFormField);
                }

                if (dsLead.Tables.Count > 0 && dsLead.Tables[0].Rows.Count > 0)
                {
                    if (!String.IsNullOrEmpty(dsLead.Tables[0].Rows[0][FieldIndex].ToString()) && FieldIndex > -1)
                    {
                        long dependencyFormAnswer1 = 0;
                        bool dependencyFormAnswer1IsInteger = long.TryParse(browserRules.DependencyFormAnswer1, out dependencyFormAnswer1);

                        long dependencyFormAnswer2 = 0;
                        bool dependencyFormAnswer2IsInteger = long.TryParse(browserRules.DependencyFormAnswer2, out dependencyFormAnswer2);

                        long conditionValue = 0;
                        bool conditionValueIsInteger = long.TryParse(dsLead.Tables[0].Rows[0][FieldIndex].ToString(), out conditionValue);

                        if (browserRules.DependencyFormCondition == 1 && conditionValueIsInteger && dependencyFormAnswer1IsInteger)
                            return conditionValue > dependencyFormAnswer1;
                        else if (browserRules.DependencyFormCondition == 2 && conditionValueIsInteger && dependencyFormAnswer1IsInteger)
                            return conditionValue < dependencyFormAnswer1;
                        else if (browserRules.DependencyFormCondition == 3 && conditionValueIsInteger && dependencyFormAnswer1IsInteger && dependencyFormAnswer2IsInteger)
                            return conditionValue >= dependencyFormAnswer1 && conditionValue <= dependencyFormAnswer2;
                        else if (browserRules.DependencyFormCondition == 4)
                            if (conditionValueIsInteger)
                                return conditionValue == dependencyFormAnswer1;
                            else
                                return dsLead.Tables[0].Rows[0][FieldIndex].ToString() == browserRules.DependencyFormAnswer1;
                    }
                }
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
        private bool CheckClosedFormNthTime(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (browserRules.CloseCountSessionWiseOrOverAll)
            {
                if (!savedRulesDetails.CloseCountIsTheirData)
                {
                    savedRulesDetails.CloseCount = getDetails.ClosedFormNthTime(visitorDetails.MachineId, browserRules.FormId);
                    savedRulesDetails.CloseCountIsTheirData = true;
                }
            }
            else if (!browserRules.CloseCountSessionWiseOrOverAll)
            {
                if (!savedRulesDetails.CloseCountSessionWise)
                {
                    savedRulesDetails.CloseCount = getDetails.ClosedFormSessionWise(visitorDetails.MachineId, visitorDetails.Session, browserRules.FormId);
                    savedRulesDetails.CloseCountSessionWise = true;
                }
            }
            if (savedRulesDetails.CloseCount >= browserRules.CloseCount)
                return false;
            return true;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CheckVisitorAddProductToCart(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.AddedProductsToCartIsTheirData)
            {
                savedRulesDetails.AddedProductsToCart = getDetails.AddProductToCart(visitorDetails.MachineId);
                savedRulesDetails.AddedProductsToCartIsTheirData = true;
            }
            foreach (string conditionProducts in browserRules.AddedProductsToCart.Split(','))
                foreach (string userProduct in savedRulesDetails.AddedProductsToCart.Split(','))
                {
                    if (userProduct.Trim().ToLower() == conditionProducts.Trim().ToLower())
                    {
                        return true;
                    }
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
        private bool CheckVisitorAddProductCategoriesToCart(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.AddedProductsCategoriesToCartIsTheirData)
            {
                savedRulesDetails.AddedProductsCategoriesToCart = getDetails.GetProductIdByCategoryName(visitorDetails.MachineId, browserRules.FormId);
                savedRulesDetails.AddedProductsCategoriesToCartIsTheirData = true;
            }
            foreach (string conditionProducts in browserRules.AddedProductsCategoriesToCart.Split(','))
                foreach (string userProduct in savedRulesDetails.AddedProductsCategoriesToCart.Split(','))
                {
                    if (userProduct.Trim().ToLower() == conditionProducts.Trim().ToLower())
                    {
                        return true;
                    }
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
        private bool CheckVisitorNotAddProductCategoriesToCart(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.AddedProductsCategoriesToCartIsTheirData)
            {
                savedRulesDetails.AddedProductsCategoriesToCart = getDetails.GetProductIdByCategoryName(visitorDetails.MachineId, browserRules.FormId);
                savedRulesDetails.AddedProductsCategoriesToCartIsTheirData = true;
            }
            foreach (string conditionProducts in browserRules.AddedProductsCategoriesToCart.Split(','))
                foreach (string userProduct in savedRulesDetails.AddedProductsCategoriesToCart.Split(','))
                {
                    if (userProduct.Trim().ToLower() == conditionProducts.Trim().ToLower())
                    {
                        return false;
                    }
                }
            return true;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CheckVisitorAddProductSubCategoriesToCart(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.AddedProductsSubCategoriesToCartIsTheirData)
            {
                savedRulesDetails.AddedProductsSubCategoriesToCart = getDetails.GetProductIdBySubCategoryName(visitorDetails.MachineId, browserRules.FormId);
                savedRulesDetails.AddedProductsSubCategoriesToCartIsTheirData = true;
            }
            foreach (string conditionProducts in browserRules.AddedProductsSubCategoriesToCart.Split(','))
                foreach (string userProduct in savedRulesDetails.AddedProductsSubCategoriesToCart.Split(','))
                {
                    if (userProduct.Trim().ToLower() == conditionProducts.Trim().ToLower())
                    {
                        return true;
                    }
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
        private bool CheckVisitorNotAddProductSubCategoriesToCart(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.NotAddedProductsSubCategoriesToCartIsTheirData)
            {
                savedRulesDetails.NotAddedProductsSubCategoriesToCart = getDetails.GetProductIdBySubCategoryName(visitorDetails.MachineId, browserRules.FormId);
                savedRulesDetails.NotAddedProductsSubCategoriesToCartIsTheirData = true;
            }
            foreach (string conditionProducts in browserRules.NotAddedProductsSubCategoriesToCart.Split(','))
                foreach (string userProduct in savedRulesDetails.NotAddedProductsSubCategoriesToCart.Split(','))
                {
                    if (userProduct.Trim().ToLower() == conditionProducts.Trim().ToLower())
                    {
                        return false;
                    }
                }
            return true;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool VisitorViewedButNotAdded(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.ViewedButNotAddedProductsToCartIsTheirData)
            {
                savedRulesDetails.ViewedButNotAddedProductsToCart = getDetails.ViewedButNotAddedProductsToCart(visitorDetails.MachineId, visitorDetails.ContactId, visitorDetails.FormId);
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
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool VisitorDroppedFromCart(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.DroppedProductsFromCartIsTheirData)
            {
                savedRulesDetails.DroppedProductsFromCart = getDetails.DroppedProductsFromCart(visitorDetails.MachineId, visitorDetails.ContactId, visitorDetails.FormId);
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
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CustomerPurchasedProducts(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.PurchasedProductsIsTheirData)
            {
                savedRulesDetails.PurchasedProducts = getDetails.PurchasedProducts(visitorDetails.MachineId);
                savedRulesDetails.PurchasedProductsIsTheirData = true;
            }
            foreach (string conditionProducts in browserRules.PurchasedProducts.Split(','))
                foreach (string userProduct in savedRulesDetails.PurchasedProducts.Split(','))
                {
                    if (userProduct.Trim().ToLower() == conditionProducts.Trim().ToLower())
                    {
                        return true;
                    }
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
        private bool CustomerNotPurchasedProducts(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.PurchasedProductsIsTheirData)
            {
                savedRulesDetails.PurchasedProducts = getDetails.PurchasedProducts(visitorDetails.MachineId);
                savedRulesDetails.PurchasedProductsIsTheirData = true;
            }
            foreach (string conditionProducts in browserRules.NotPurchasedProducts.Split(','))
                foreach (string userProduct in savedRulesDetails.PurchasedProducts.Split(','))
                {
                    if (userProduct.Trim().ToLower() == conditionProducts.Trim().ToLower())
                    {
                        return false;
                    }
                }
            return true;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CustomerTotalPurchaseQty(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.CustomerTotalPurchaseIsTheirData)
            {
                savedRulesDetails.CustomerTotalPurchase = getDetails.CustomerTotalPurchase(visitorDetails.MachineId);
                savedRulesDetails.CustomerTotalPurchaseIsTheirData = true;
            }

            if (browserRules.TotalPurchaseQtyConditon == 1)
                return savedRulesDetails.CustomerTotalPurchase > browserRules.CustomerTotalPurchase1;
            else if (browserRules.TotalPurchaseQtyConditon == 2)
                return savedRulesDetails.CustomerTotalPurchase < browserRules.CustomerTotalPurchase1;
            else if (browserRules.TotalPurchaseQtyConditon == 3)
                return savedRulesDetails.CustomerTotalPurchase >= browserRules.CustomerTotalPurchase1 && savedRulesDetails.CustomerTotalPurchase <= browserRules.CustomerTotalPurchase2;
            else if (browserRules.TotalPurchaseQtyConditon == 4)
                return savedRulesDetails.CustomerTotalPurchase == browserRules.CustomerTotalPurchase1;

            return false;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CustomerTotalPurchaseValue(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.CustomerCurrentValueIsTheirData)
            {
                savedRulesDetails.CustomerCurrentValue = getDetails.CustomerCurrentValue(visitorDetails.MachineId);
                savedRulesDetails.CustomerCurrentValueIsTheirData = true;
            }

            if (browserRules.TotalPurchaseAmtCondition == 1)
                return savedRulesDetails.CustomerCurrentValue > browserRules.CustomerCurrentValue1;
            else if (browserRules.TotalPurchaseAmtCondition == 2)
                return savedRulesDetails.CustomerCurrentValue < browserRules.CustomerCurrentValue1;
            else if (browserRules.TotalPurchaseAmtCondition == 3)
                return savedRulesDetails.CustomerCurrentValue >= browserRules.CustomerCurrentValue1 && savedRulesDetails.CustomerCurrentValue <= browserRules.CustomerCurrentValue2;
            else if (browserRules.TotalPurchaseAmtCondition == 4)
                return savedRulesDetails.CustomerCurrentValue == browserRules.CustomerCurrentValue1;

            return false;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool BusinessOrIndividualMember(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.IsBusinessOrIndividualMemberIsTheirData)
            {
                savedRulesDetails.IsBusinessOrIndividualMember = getDetails.IsBusinessOrIndividualMember(visitorDetails.MachineId, visitorDetails.ContactId);
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
        private bool OfflineOrOnlinePurchase(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.IsOfflineOrOnlinePurchaseIsTheirData)
            {
                savedRulesDetails.IsOfflineOrOnlinePurchase = getDetails.IsOfflineOrOnlinePurchase(visitorDetails.MachineId, visitorDetails.ContactId);
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
        private bool LastPurchaseInterval(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.LastPurchaseIntervalIsTheirData)
            {
                savedRulesDetails.LastPurchaseInterval = getDetails.GetLastPurchaseInterval(visitorDetails.MachineId, visitorDetails.ContactId);
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
        private bool CustomerExpirdayInterval(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.CustomerExpirdayIntervalIsTheirData)
            {
                savedRulesDetails.CustomerExpirdayInterval = getDetails.GetCustomerExpirdayInterval(visitorDetails.MachineId, visitorDetails.ContactId);
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
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool SentimentIs(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.OnlineSentimentIsTheirData)
            {
                savedRulesDetails.OnlineSentimentIs = getDetails.OnlineSentimentIs(visitorDetails.EmailId);
                savedRulesDetails.OnlineSentimentIsTheirData = true;
            }
            if (browserRules.OnlineSentimentIs >= savedRulesDetails.OnlineSentimentIs)
                return true;
            return false;
        }
        #endregion Interaction Rule

        #region Interaction Event
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool ByInteractionEvent(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            bool formImpression = browserRules.ImpressionEventForFormId > -1 && browserRules.ImpressionEventCountCondition > 0 ? CheckFormImpression(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!formImpression) return false;

            bool formCloseCount = browserRules.CloseEventForFormId > -1 && browserRules.CloseEventCountCondition > 0 ? CheckFormCloseCount(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!formCloseCount) return false;

            bool formResponseCount = browserRules.ResponsesEventForFormId > -1 && browserRules.ResponsesEventCountCondition > 0 ? CheckFormResponseCount(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!formResponseCount) return false;

            bool ShowThisFormOnlyNthTime = browserRules.ShowFormOnlyNthTime > 0 ? CheckShowThisFormOnlyNthTime(savedRulesDetails, visitorDetails, browserRules) : true;

            return formImpression && formCloseCount && formResponseCount && ShowThisFormOnlyNthTime;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CheckFormImpression(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.ImpressionEventCountConditionIsTheirData)
            {
                savedRulesDetails.ImpressionEventCountCondition = getDetails.GetFormImpression(visitorDetails.MachineId, browserRules.ImpressionEventForFormId);
                savedRulesDetails.ImpressionEventCountConditionIsTheirData = true;
            }
            return savedRulesDetails.ImpressionEventCountCondition >= browserRules.ImpressionEventCountCondition;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CheckFormCloseCount(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.CloseEventCountConditionIsTheirData)
            {
                savedRulesDetails.CloseEventCountCondition = getDetails.GetFormCloseCount(visitorDetails.MachineId, browserRules.CloseEventForFormId);
                savedRulesDetails.CloseEventCountConditionIsTheirData = true;
            }
            return savedRulesDetails.CloseEventCountCondition >= browserRules.CloseEventCountCondition;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CheckFormResponseCount(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.ResponsesEventCountConditionIsTheirData)
            {
                savedRulesDetails.ResponsesEventCountCondition = getDetails.GetFormResponseCount(visitorDetails.MachineId, browserRules.ResponsesEventForFormId);
                savedRulesDetails.ResponsesEventCountConditionIsTheirData = true;
            }
            return savedRulesDetails.ResponsesEventCountCondition >= browserRules.ResponsesEventCountCondition;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CheckShowThisFormOnlyNthTime(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.ShowFormOnlyNthTimeIsTheirData)
            {
                savedRulesDetails.ShowFormOnlyNthTime = getDetails.GetCountShowThisFormOnlyNthTime(visitorDetails.MachineId, browserRules.FormId);
                savedRulesDetails.ShowFormOnlyNthTimeIsTheirData = true;
            }
            // Here condition is less means, then only show form other wise don't show.
            return savedRulesDetails.ShowFormOnlyNthTime < browserRules.ShowFormOnlyNthTime;
        }
        #endregion Interaction Event

        #region Profile Rule
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool ByProfile(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            bool isOnlinSentimentIs = browserRules.OnlineSentimentIs > 0 ? ChekOnlineSentiment(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isOnlinSentimentIs) return false;

            bool isSocialStatusIsActive = browserRules.SocialStatusIs > 0 ? ChekFacebookRecentStatus(savedRulesDetails, visitorDetails, browserRules) : true; // need to check
            if (!isSocialStatusIsActive) return false;

            bool isInfluentialScore = browserRules.InfluentialScoreCondition > 0 ? InfluentialScore(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isInfluentialScore) return false;

            bool isOfflineSentimentIs = browserRules.OfflineSentimentIs > 0 ? savedRulesDetails.OfflineSentimentIs == 1 ? true : false : true;
            if (!isOfflineSentimentIs) return false;

            bool isGenderIs = browserRules.GenderIs != null && browserRules.GenderIs.Length > 1 ? GetGenderValue(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isGenderIs) return false;

            bool isMaritalStatus = browserRules.MaritalStatusIs > 0 ? GetMaritalStatus(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isMaritalStatus) return false;

            bool isProfessionIs = browserRules.ProfessionIs != null && browserRules.ProfessionIs.Length > 1 ? CheckProfessionIs(savedRulesDetails, visitorDetails, browserRules) ? true : false : true;
            if (!isProfessionIs) return false;

            bool isConnectedSocially = browserRules.NotConnectedSocially > 0 ? ConnectedSocially(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isConnectedSocially) return false;

            bool isNurtureStatusIs = browserRules.NurtureStatusIs >= 0 ? NurtureStatusIs(savedRulesDetails, visitorDetails, browserRules) : true; // need to check
            if (!isNurtureStatusIs) return false;

            bool isProductRating = browserRules.ProductRatingIs > 0 ? ProductRatingIs(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isProductRating) return false;

            bool isLoyaltyPointsCondition = browserRules.LoyaltyPointsCondition > 0 ? LoyaltyPoints(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isLoyaltyPointsCondition) return false;

            bool isRFMSScoreRangeCondition = browserRules.RFMSScoreRangeCondition > 0 ? RFMSScoreIs(savedRulesDetails, visitorDetails, browserRules) : true;
            if (!isRFMSScoreRangeCondition) return false;

            bool isBirthDay = browserRules.IsBirthDay ? CheckBirthDayCondition(savedRulesDetails, visitorDetails, browserRules) : true;

            return isOnlinSentimentIs && isSocialStatusIsActive && isInfluentialScore && isOfflineSentimentIs && isGenderIs && isMaritalStatus && isProfessionIs && isProfessionIs
                   && isConnectedSocially && isNurtureStatusIs && isProductRating && isLoyaltyPointsCondition && isRFMSScoreRangeCondition && isBirthDay;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool ChekOnlineSentiment(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.OnlineSentimentIsTheirData)
            {
                savedRulesDetails.OnlineSentimentIs = getDetails.OnlineSentimentIs(visitorDetails.EmailId);
                savedRulesDetails.OnlineSentimentIsTheirData = true;
            }
            return savedRulesDetails.OnlineSentimentIs == browserRules.OnlineSentimentIs;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool ChekFacebookRecentStatus(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.SocialStatusIsTheirData)
            {
                savedRulesDetails.SocialStatusIs = getDetails.SocialStatusIs(visitorDetails.ContactId);
                savedRulesDetails.SocialStatusIsTheirData = true;
            }
            return savedRulesDetails.SocialStatusIs == browserRules.SocialStatusIs;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool InfluentialScore(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.ImpressionEventCountConditionIsTheirData)
            {
                savedRulesDetails.InfluentialScore = getDetails.InfluentialScore(visitorDetails.ContactId);
                savedRulesDetails.ImpressionEventCountConditionIsTheirData = false;
            }

            if (browserRules.InfluentialScoreCondition == 1)
                return savedRulesDetails.InfluentialScore > browserRules.InfluentialScore1;
            else if (browserRules.InfluentialScoreCondition == 2)
                return savedRulesDetails.InfluentialScore < browserRules.InfluentialScore1;
            else if (browserRules.InfluentialScoreCondition == 3)
                return savedRulesDetails.InfluentialScore >= browserRules.InfluentialScore1 && savedRulesDetails.InfluentialScore <= browserRules.InfluentialScore2;
            else if (browserRules.InfluentialScoreCondition == 4)
                return browserRules.InfluentialScore1 == savedRulesDetails.InfluentialScore;
            return false;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="formRules"></param>
        /// <returns></returns>
        private bool GetMaritalStatus(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules formRules)
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
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CheckProfessionIs(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules formRules)
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
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool ProductRatingIs(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.ProductRatingIsTheirData)
            {
                savedRulesDetails.ProductRatingIs = getDetails.ProductRatingIs(visitorDetails.MachineId);
                savedRulesDetails.ProductRatingIsTheirData = true;
            }
            return savedRulesDetails.ProductRatingIs == browserRules.ProductRatingIs;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool NurtureStatusIs(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.NurtureStatusIsTheirData)
            {
                savedRulesDetails.NurtureStatusIs = getDetails.NurtureStatusIs(visitorDetails.ContactId);
                savedRulesDetails.NurtureStatusIsTheirData = true;
            }
            return savedRulesDetails.NurtureStatusIs == browserRules.NurtureStatusIs;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool GetGenderValue(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules formRules)
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
        private bool ConnectedSocially(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules formRules)
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
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool LoyaltyPoints(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.LoyaltyPointsConditionIsTheirData)
            {
                savedRulesDetails.LoyaltyPoints = getDetails.LoyaltyPoints(visitorDetails.ContactId);
                savedRulesDetails.LoyaltyPointsConditionIsTheirData = true;
            }

            if (browserRules.LoyaltyPointsCondition == 1)
                return browserRules.LoyaltyPointsRange1 > savedRulesDetails.LoyaltyPoints;
            else if (browserRules.LoyaltyPointsCondition == 2)
                return browserRules.LoyaltyPointsRange1 < savedRulesDetails.LoyaltyPoints;
            else if (browserRules.LoyaltyPointsCondition == 3)
                return savedRulesDetails.LoyaltyPoints >= browserRules.LoyaltyPointsRange1 && savedRulesDetails.LoyaltyPoints <= browserRules.LoyaltyPointsRange2;
            else if (browserRules.LoyaltyPointsCondition == 4)
                return browserRules.LoyaltyPointsRange1 == savedRulesDetails.LoyaltyPoints;
            return false;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool RFMSScoreIs(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (!savedRulesDetails.RFMSScoreRangeIsTheirData)
            {
                savedRulesDetails.RFMSScoreRange = getDetails.RFMSScoreIs(visitorDetails.EmailId);
                savedRulesDetails.RFMSScoreRangeIsTheirData = true;
            }

            if (browserRules.RFMSScoreRangeCondition == 1)
                return browserRules.RFMSScoreRange1 > savedRulesDetails.RFMSScoreRange;
            else if (browserRules.RFMSScoreRangeCondition == 2)
                return browserRules.RFMSScoreRange1 < savedRulesDetails.RFMSScoreRange;
            else if (browserRules.RFMSScoreRangeCondition == 3)
                return savedRulesDetails.RFMSScoreRange >= browserRules.RFMSScoreRange1 && savedRulesDetails.RFMSScoreRange <= browserRules.RFMSScoreRange2;
            else if (browserRules.RFMSScoreRangeCondition == 4)
                return browserRules.RFMSScoreRange1 == savedRulesDetails.RFMSScoreRange;
            return false;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="savedRulesDetails"></param>
        /// <param name="visitorDetails"></param>
        /// <param name="browserRules"></param>
        /// <returns></returns>
        private bool CheckBirthDayCondition(VisitorSaveRulesDetails savedRulesDetails, VisitorDetails visitorDetails, BrowserRules browserRules)
        {
            if (visitorDetails.Age != null)
            {
                string ageformatdetails = (visitorDetails.Age.Value.Day.ToString().Length == 1 ? "0" + visitorDetails.Age.Value.Day.ToString() : visitorDetails.Age.Value.Day.ToString()) + "-" + (visitorDetails.Age.Value.Month.ToString().Length == 1 ? "0" + visitorDetails.Age.Value.Month.ToString() : visitorDetails.Age.Value.Month.ToString()) + "-" + DateTime.Now.Year.ToString();
                bool Status = true;
                DateTime Age = new DateTime();

                DateTime.TryParseExact(ageformatdetails, "dd-MM-yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out Age);
                DateTime TodayDate = DateTime.Now;

                if (browserRules.IsDOBIgnored == true && !(browserRules.IsDOBTodayOrMonth == 0))
                {
                    if (browserRules.IsDOBIgnoreCondition == 1 && (Age.Date == DateTime.Now.Date))
                        Status = false;
                    else if (browserRules.IsDOBIgnoreCondition == 2 && (Age.Date < DateTime.Now.Date))
                        Status = false;
                    else if (browserRules.IsDOBIgnoreCondition == 3 && (Age.Date > DateTime.Now.Date))
                        Status = false;
                    else if (browserRules.IsDOBIgnoreCondition == 4 && (Age.Date <= DateTime.Now.Date))
                        Status = false;
                    else if (browserRules.IsDOBIgnoreCondition == 5 && (Age.Date >= DateTime.Now.Date))
                        Status = false;
                }

                if (Status)
                {
                    if (browserRules.IsDOBTodayOrMonth == 0)
                    {
                        return TodayDate.Day == Age.Day && TodayDate.Month == Age.Month;
                    }
                    else if (browserRules.IsDOBTodayOrMonth == 1)
                    {
                        return TodayDate.Month == Age.Month;
                    }
                    else if (browserRules.IsDOBTodayOrMonth == 2 && browserRules.DOBFromDate != null && browserRules.DOBToDate != null)
                    {
                        return Age >= browserRules.DOBFromDate && Age <= browserRules.DOBToDate;
                    }
                    else if (browserRules.IsDOBTodayOrMonth == 3 && browserRules.DOBDaysDiffernce != 0)
                    {
                        DateTime FromDate = DateTime.Now;
                        DateTime ToDate = DateTime.Now;

                        if (browserRules.DOBDaysDiffernce > 0)
                        {
                            FromDate = DateTime.Now;
                            ToDate = DateTime.Now.AddDays(browserRules.DOBDaysDiffernce);
                        }
                        else if (browserRules.DOBDaysDiffernce < 0)
                        {
                            FromDate = DateTime.Now.AddDays(browserRules.DOBDaysDiffernce);
                            ToDate = DateTime.Now;
                        }

                        return Age >= FromDate && Age <= ToDate;
                    }
                }
                return false;
            }
            else
            {
                return false;
            }
        }

        #endregion Profile Rule

        #region Customize Url
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
        #endregion Customize Url
    }
}
