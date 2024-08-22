using DocumentFormat.OpenXml.InkML;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Plumb5GenralFunction
{
    public class FormChatDetails
    {
        int AdsId;
        private readonly string sQlVendor;
        private readonly HttpContext httpContext;
        public int LeadNotificationToSalesMailSendingSettingId = 0;
        public int LeadNotificationToSalesSmsSendingSettingId = 0;
        public int UserInfoUserId;

        #region Rule Section

        public FormChatDetails(int adsId, string SQlVendor, HttpContext httpContext)
        {
            AdsId = adsId;
            sQlVendor = SQlVendor;
            this.httpContext = httpContext;
        }

        public async Task<int> GetLeadType(string MachineId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.GetLeadType(MachineId);
            }
        }

        public async Task<string> GetGroupList(string MachineId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.GroupsByMachineId(MachineId);
            }
        }

        public async Task<string> GetSession(string MachineId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.GetSession(MachineId);
            }
        }

        public async Task<short> GetBehavioralScore(string MachineId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.GetBehavioralScore(MachineId);
            }
        }

        public async Task<short> GetPageDepeth(string MachineId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.GetPageDepeth(MachineId);
            }
        }

        public async Task<Int32> GetPageviews(string MachineId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.GetPageviews(MachineId);
            }
        }

        public async Task<short> GetFrequency(string MachineId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.GetFrequency(MachineId);
            }
        }

        public async Task<string> GetSource(string MachineId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.GetSource(MachineId);
            }
        }

        public async Task<string> GetSourcekey(string MachineId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.GetSourcekey(MachineId);
            }
        }

        public async Task<string> GetSourceType(string MachineId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.GetSourceType(MachineId);
            }
        }

        public async Task<string> GetUtmTagSource(string MachineId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.GetUtmTagSource(MachineId);
            }
        }

        public async Task<bool> IsMailRespondent(string EmailId, string MailTemplateIds, bool IsMailRespondentClickCondition)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.IsMailRespondent(EmailId, MailTemplateIds, IsMailRespondentClickCondition);
            }
        }

        public async Task<bool> IsSmsRespondent(string PhoneNumber, string SmsTemplateIds)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.IsSmsRespondent(PhoneNumber, SmsTemplateIds);
            }
        }

        public async Task<string> SearchKeyword(string MachineId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.SearchKeyword(MachineId);
            }
        }

        public async Task<string> GetStateDetails(string MachineId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.GetStateDetails(MachineId);
            }
        }

        public async Task<string[]> GetCityCountry(string MachineId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.GetCityCountry(MachineId);
            }
        }

        public async Task<bool> AlreadyVisitedPages(string MachineId, string SessionRefeer, string PageUrls, bool VisitedPagesOverAllOrSessionWise, bool IsVisitedPagesContainsCondition)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.AlreadyVisitedPages(MachineId, SessionRefeer, PageUrls, VisitedPagesOverAllOrSessionWise, IsVisitedPagesContainsCondition);
            }
        }

        public async Task<bool> AlreadyNotVisitedPages(string MachineId, string SessionRefeer, string PageUrls, bool VisitedPagesOverAllOrSessionWise, bool IsNotVisitedPagesContainsCondition)
        {
            using (var objDL = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await objDL.AlreadyNotVisitedPages(MachineId, SessionRefeer, PageUrls, VisitedPagesOverAllOrSessionWise, IsNotVisitedPagesContainsCondition);
            }
        }

        public async Task<List<string>> GetPageNamesByMachineId(string MachineId)
        {
            using (var objDL = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await objDL.GetPageNamesByMachineId(MachineId);
            }
        }

        public async Task<int> OverAllTimeSpentInSite(string MachineId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.OverAllTimeSpentInSite(MachineId);
            }
        }

        public async Task<bool> isMobileBrowser()
        {
            var userAgent = httpContext.Request.Headers["User-Agent"].ToString();
            if (userAgent.Contains("android"))
                return true;

            var isMobileDevice = userAgent.Contains("Mobile") || userAgent.Contains("Tablet");

            if (isMobileDevice)
                return true;

            if (httpContext.Request.Headers.TryGetValue("X-WAP-Profile", out var wapProfile))
            {
                return true;
            }

            if (httpContext.Request.Headers.TryGetValue("Accept", out var acceptHeader))
            {
                if (acceptHeader.ToString().ToLower().Contains("wap"))
                    return true;
            }

            if (httpContext.Request.Headers.TryGetValue("User-Agent", out var userAgents))
            {
                // Use the userAgent value
                string[] mobiles =
                    new[]
                {
                    "midp", "j2me", "avant", "docomo",
                    "novarra", "palmos", "palmsource",
                    "240x320", "opwv", "chtml",
                    "pda", "windows ce", "mmp/",
                    "blackberry", "mib/", "symbian",
                    "wireless", "nokia", "hand", "mobi",
                    "phone", "cdm", "up.b", "audio",
                    "SIE-", "SEC-", "samsung", "HTC",
                    "mot-", "mitsu", "sagem", "sony"
                    , "alcatel", "lg", "eric", "vx",
                    "NEC", "philips", "mmm", "xx",
                    "panasonic", "sharp", "wap", "sch",
                    "rover", "pocket", "benq", "java",
                    "pt", "pg", "vox", "amoi",
                    "bird", "compal", "kg", "voda",
                    "sany", "kdd", "dbt", "sendo",
                    "sgh", "gradi", "jb", "dddi",
                    "moto", "iphone"
                };

                foreach (string s in mobiles)
                {
                    if (httpContext.Request.Headers["User-Agent"].ToString().ToLower().Contains(s.ToLower()))
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        public bool iAndriodBrowser()
        {
            var userAgent = httpContext.Request.Headers["User-Agent"].ToString();
            if (userAgent.Contains("android"))
                return true;

            var isMobileDevice = userAgent.Contains("Mobile") || userAgent.Contains("Tablet");

            if (isMobileDevice)
                return true;

            if (httpContext.Request.Headers.TryGetValue("X-WAP-Profile", out var wapProfile))
            {
                return true;
            }

            if (httpContext.Request.Headers.TryGetValue("Accept", out var acceptHeader))
            {
                if (acceptHeader.ToString().ToLower().Contains("wap"))
                    return true;
            }

            if (httpContext.Request.Headers.TryGetValue("User-Agent", out var userAgents))
            {
                // Use the userAgent value
                string[] mobiles =
                    new[]
                {
                    "midp", "j2me", "avant", "docomo",
                    "novarra", "palmos", "palmsource",
                    "240x320", "opwv", "chtml",
                    "pda", "windows ce", "mmp/",
                    "blackberry", "mib/", "symbian",
                    "wireless", "nokia", "hand", "mobi",
                    "phone", "cdm", "up.b", "audio",
                    "SIE-", "SEC-", "samsung", "HTC",
                    "mot-", "mitsu", "sagem", "sony"
                    , "alcatel", "lg", "eric", "vx",
                    "NEC", "philips", "mmm", "xx",
                    "panasonic", "sharp", "wap", "sch",
                    "rover", "pocket", "benq", "java",
                    "pt", "pg", "vox", "amoi",
                    "bird", "compal", "kg", "voda",
                    "sany", "kdd", "dbt", "sendo",
                    "sgh", "gradi", "jb", "dddi",
                    "moto", "iphone"
                };

                foreach (string s in mobiles)
                {
                    if (httpContext.Request.Headers["User-Agent"].ToString().ToLower().Contains(s.ToLower()))
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        public bool CheckExcludeIpList(string TrackIp, string ExcludeIPListFromRulesList)
        {
            string[] ExIpList = ExcludeIPListFromRulesList.Split(',');

            if (ExIpList != null && ExIpList.Count() > 0)
            {
                return (!ExIpList.Contains(TrackIp));
            }
            return true;
        }

        public async Task<string> GetClickedButton(string MachineId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.GetClickedButton(MachineId);
            }
        }

        public async Task<string> GetRecentClickedButton(string MachineId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.GetRecentClickedButton(MachineId);
            }
        }

        public async Task<bool> RespondedChatAgent(string MachineId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.RespondedChatAgent(MachineId);
            }
        }

        public async Task<byte[]> MailCampignResponsiveStage(string EmailId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.MailCampignResponsiveStage(EmailId);
            }
        }


        public async Task<List<int>> ResponseFormList(string MachineId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.ResponseFormList(MachineId);
            }
        }

        public async Task<DataSet> FormLeadDetailsAnswerDependency(string MachineId, int FormId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.FormLeadDetailsAnswerDependency(MachineId, FormId);
            }
        }


        public async Task<short> ClosedFormNthTime(string MachineId, int FormId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.ClosedFormNthTime(MachineId, FormId);
            }
        }

        public async Task<short> ChatClosedFormNthTime(string MachineId, int ChatId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.ChatClosedFormNthTime(MachineId, ChatId);
            }
        }

        public async Task<short> ClosedFormSessionWise(string MachineId, string SessionRefeer, int FormId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.ClosedFormSessionWise(MachineId, SessionRefeer, FormId);
            }
        }

        public List<ProductWishList> AddProductToCart(string MachineId)
        {
            //using (DLProductWishList obj = new DLProductWishList(AdsId))
            //{
            //    return obj.GetList(new ProductWishList() { IsAddedToCart = true }, null, null, new List<string>() { MachineId }, null, null, null, null, new List<string>() { "ProductId" });
            //}
            return new List<ProductWishList>();
        }

        public async Task<List<Product>> GetProductIdByCategoryName(List<string> ProductIdList, List<string> CategoryList)
        {
            using (var obj = DLProduct.GetDLProduct(AdsId, sQlVendor))
            {
                return (await obj.GetProductList(new Product() { }, ProductIdList, null, CategoryList, null)).ToList();
            }
        }
        public async Task<List<Product>> GetProductIdBySubCategoryName(List<string> ProductIdList, List<string> SubCategoryList)
        {
            using (var obj = DLProduct.GetDLProduct(AdsId, sQlVendor))
            {
                return (await obj.GetProductList(new Product() { }, ProductIdList, null, null, SubCategoryList)).ToList();
            }
        }


        public List<ProductWishList> ViewedButNotAddedProductsToCart(string MachineId)
        {
            //using (DLProductWishList obj = new DLProductWishList(AdsId))
            //{
            //    return obj.GetList(new ProductWishList() { IsAddedToCart = false, IsViewed = true }, null, null, new List<string>() { MachineId }, null, null, null, null, new List<string>() { "ProductId" });
            //}
            return new List<ProductWishList>();
        }

        public List<ProductWishList> DroppedProductsFromCart(string MachineId)
        {
            //using (DLProductWishList obj = new DLProductWishList(AdsId))
            //{
            //    return obj.GetList(new ProductWishList() { IsDroped = true }, null, null, new List<string>() { MachineId }, null, null, null, null, new List<string>() { "ProductId" });
            //}
            return new List<ProductWishList>();
        }

        public List<Transaction> PurchasedProducts(int ContactId)
        {
            //using (DLTransaction obj = new DLTransaction(AdsId))
            //{
            //    return obj.GetList(new Transaction() { ContactId = ContactId }, null, null, null, null, null, null, null, null, new List<string>() { "ProductId" });
            //}
            return new List<Transaction>();
        }

        public async Task<Contact> CustomerTotalPurchase(int ContactId)
        {
            using (var obj = DLContact.GetContactDetails(AdsId, sQlVendor))
            {
                return await obj.GetContactDetails(new Contact() { ContactId = ContactId }, new List<string>() { "TotalLifetimeTranCount" });
            }
        }

        public async Task<Contact> CustomerTotalPurchaseValue(int ContactId)
        {
            using (var obj = DLContact.GetContactDetails(AdsId, sQlVendor))
            {
                return await obj.GetContactDetails(new Contact() { ContactId = ContactId }, new List<string>() { "TotalLifeTimePurchaseValue" });
            }
        }

        public async Task<byte> OnlineSentimentIs(string EmailId)
        {
            //using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            //{
            //    return obj.OnlineSentimentIs(EmailId);
            //}
            return 0;
        }

        public async Task<short> GetFormImpression(string MachineId, int FormId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.GetFormImpression(MachineId, FormId);
            }
        }

        public async Task<short> GetFormCloseCount(string MachineId, int FormId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.GetFormCloseCount(MachineId, FormId);
            }
        }

        public async Task<short> GetFormResponseCount(string MachineId, int FormId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.GetFormResponseCount(MachineId, FormId);
            }
        }

        public async Task<short> GetCountShowThisFormOnlyNthTime(string MachineId, int FormId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.GetCountShowThisFormOnlyNthTime(MachineId, FormId);
            }
        }

        public async Task<short> ChatGetCountShowThisFormOnlyNthTime(string MachineId, int ChatId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.ChatGetCountShowThisFormOnlyNthTime(MachineId, ChatId);
            }
        }

        public async Task<short> SocialStatusIs(int ContactId)
        {
            //using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            //{
            //    return await obj.SocialStatusIs(ContactId);
            //}

            return 0;
        }

        public async Task<short> InfluentialScore(int ContactId)
        {
            //using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            //{
            //    return obj.InfluentialScore(ContactId);
            //}

            return 0;
        }

        public async Task<byte> ProductRatingIs(string MachineId)
        {
            //using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            //{
            //    return obj.ProductRatingIs(MachineId);
            //}

            return 0;
        }

        public async Task<string> ProfessionIs(int ContactId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.ProfessionIs(ContactId);
            }
        }

        public async Task<short> NurtureStatusIs(int ContactId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.NurtureStatusIs(ContactId);
            }
        }

        public async Task<short> LoyaltyPoints(int ContactId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.LoyaltyPoints(ContactId);
            }
        }

        public async Task<short> RFMSScoreIs(string EmailId)
        {
            //using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            //{
            //    return obj.RFMSScoreIs(EmailId);
            //}

            return 0;
        }

        public async Task<Int16> PaidCampaignFlag(string MachineId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.PaidCampaignFlag(MachineId);
            }
        }

        public async Task<string> GetGenderValue(int ContactId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.GetGenderValue(ContactId);
            }
        }

        public async Task<short> GetMaritalStatus(int ContactId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.GetMaritalStatus(ContactId);
            }
        }

        public async Task<short> ConnectedSocially(int ContactId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.ConnectedSocially(ContactId);
            }
        }

        #endregion Rule Section


        #region Response Action

        public async Task<List<FormDetails>> GetForm(bool OnPageOrInPage, bool IsEventForms)
        {
            using (var objDLForm = DLFormDetails.GetDLFormDetails(AdsId, sQlVendor))
            {
                FormDetails formDetails = new FormDetails() { FormStatus = true, OnPageOrInPage = OnPageOrInPage, AppearOnLoadOnExitOnScroll = 2 };
                List<string> fieldName = new List<string>() { "Id", "FormPriority" };
                List<FormDetails> formList = await objDLForm.GET(formDetails, -1, -1, null, fieldName, IsEventForms);
                formList = formList.OrderBy(x => x.FormPriority).ToList();

                return formList;
            }
        }

        public async Task<List<FormDetails>> GetOnExitForm(byte OnLoadOrOnExit, bool IsEventForms)
        {
            using (var objDLForm = DLFormDetails.GetDLFormDetails(AdsId, sQlVendor))
            {
                FormDetails formDetails = new FormDetails() { FormStatus = true, AppearOnLoadOnExitOnScroll = OnLoadOrOnExit };
                List<string> fieldName = new List<string>() { "Id", "FormPriority" };
                List<FormDetails> formList = await objDLForm.GET(formDetails, -1, -1, null, fieldName, IsEventForms);
                formList = formList.OrderBy(x => x.FormPriority).ToList();

                return formList;
            }
        }

        public async Task<List<FormDetails>> GetMobileForm(bool IsEventForms, bool IsWebOrMobileForm)
        {
            using (var objDLForm = DLFormDetails.GetDLFormDetails(AdsId, sQlVendor))
            {
                FormDetails formDetails = new FormDetails() { FormStatus = true, IsWebOrMobileForm = IsWebOrMobileForm };
                List<string> fieldName = new List<string>() { "Id", "FormPriority" };
                List<FormDetails> formList = await objDLForm.GET(formDetails, -1, -1, null, fieldName, IsEventForms);
                formList = formList.OrderBy(x => x.FormPriority).ToList();

                return formList;
            }
        }

        public async Task<List<FormDetails>> GetForm(int FormId)
        {
            using (var objDLForm = DLFormDetails.GetDLFormDetails(AdsId, sQlVendor))
            {
                FormDetails formDetails = new FormDetails() { Id = FormId, FormStatus = true, OnPageOrInPage = false };
                List<string> fieldName = new List<string>() { "Id" };
                return await objDLForm.GET(formDetails, -1, -1, null, fieldName, false);
            }
        }

        public async Task<FormRules> GetFormRule(int FormId)
        {
            using (var objDLFormRule = DLFormRules.GetDLFormRules(AdsId, sQlVendor))
            {
                return await objDLFormRule.GetRawRules(FormId);
            }
        }

        public async Task<List<FormFields>> GetFields(int FormId)
        {
            using (var objDL = DLFormFields.GetDLFormFields(AdsId, sQlVendor))
            {
                return (await objDL.GET(FormId)).ToList();
            }
        }

        public async Task<Contact?> GetContactDetailsByMachineId(string MachineId)
        {
            Contact contact = new Contact();
            using (var objFormDL = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                contact.ContactId = await objFormDL.GetContactDetailsByMachineId(MachineId);
            }

            if (contact.ContactId > 0)
            {
                using (var objContact = DLContact.GetContactDetails(AdsId, sQlVendor))
                {
                    return await objContact.GetDetails(contact);
                }
            }
            return null;
        }

        #region Impression and Close Banner Track


        public void FormImpression(int FormId, string TrackIp, string MachineId, string SessionRefeer)
        {
            using (var objFromImpression = DLFormLoadCloseResponseCount.GetDLFormLoadCloseResponseCount(AdsId, sQlVendor))
            {
                objFromImpression.SaveUpdateForImpression(FormId);
            }

            using (var objFromImpression = DLFormLoadCloseResponse.GetDLFormLoadCloseResponse(AdsId, sQlVendor))
            {
                objFromImpression.SaveUpdateForImpression(FormId, TrackIp, MachineId, SessionRefeer);
            }
        }

        public void BannerImpression(int BannerId, string TrackIp, string MachineId, string SessionRefeer)
        {
            using (var objFromImpression = DLFormBannerLoadClickCount.GetDLFormBannerLoadClickCount(AdsId, sQlVendor))
            {
                objFromImpression.SaveUpdateForImpression(BannerId);
            }

            using (var objFromImpression = DLFormBannerLoadClick.GetDLFormBannerLoadClick(AdsId, sQlVendor))
            {
                objFromImpression.SaveUpdateForImpression(BannerId, TrackIp, MachineId, SessionRefeer);
            }
        }
        public void VariantImpression(int FormVariantId, string TrackIp, string MachineId, string SessionRefeer, int LastVariantStatus)
        {

            //DLFormVariantLoadClick objFromVariant = new DLFormVariantLoadClick(AdsId);

            //using (DLFormVariantLoadClickCount objFromVariantLoadClickcount = new DLFormVariantLoadClickCount(AdsId))
            //{
            //    objFromVariantLoadClickcount.SaveUpdateForImpression(FormVariantId);
            //}

            //The below code is to update onebyoneload count for all form variants except for the last one
            //if (LastVariantStatus != 1)
            //    objFromVariant.UpdateFormVariantOneByOneLoadCount(FormVariantId);

            ////The below code is to update Form Variant Load Click
            //objFromVariant.SaveUpdateForImpression(FormVariantId, TrackIp, MachineId, SessionRefeer);

        }


        public void CloseFormImpression(int FormId, string TrackIp, string MachineId, string SessionRefeer)
        {
            using (var objFromImpression = DLFormLoadCloseResponseCount.GetDLFormLoadCloseResponseCount(AdsId, sQlVendor))
            {
                objFromImpression.UpdateFormClose(FormId);
            }

            using (var objFromImpression = DLFormLoadCloseResponse.GetDLFormLoadCloseResponse(AdsId, sQlVendor))
            {
                objFromImpression.UpdateFormClose(FormId, TrackIp, MachineId, SessionRefeer);
            }
        }

        public void CloseBannerImpression(int BannerId, string TrackIp, string MachineId, string SessionRefeer)
        {
            using (var objFromImpression = DLFormBannerLoadClickCount.GetDLFormBannerLoadClickCount(AdsId, sQlVendor))
            {
                objFromImpression.UpdateFormClose(BannerId);
            }

            using (var objFromImpression = DLFormBannerLoadClick.GetDLFormBannerLoadClick(AdsId, sQlVendor))
            {
                objFromImpression.UpdateFormClose(BannerId, TrackIp, MachineId, SessionRefeer);
            }
        }

        public void BannerClickedResponse(int BannerId, string TrackIp, string MachineId, string SessionRefeer)
        {
            using (var objFromImpression = DLFormBannerLoadClickCount.GetDLFormBannerLoadClickCount(AdsId, sQlVendor))
            {
                objFromImpression.UpdateFormResponse(BannerId);
            }

            using (var objFromImpression = DLFormBannerLoadClick.GetDLFormBannerLoadClick(AdsId, sQlVendor))
            {
                objFromImpression.UpdateFormResponse(BannerId, TrackIp, MachineId, SessionRefeer);
            }
        }

        public void VariantClickedResponse(int FormVariantId, string TrackIp, string MachineId, string SessionRefeer, string TagSelector)
        {
            //using (DLFormVariantLoadClickCount objFromVariantClick = new DLFormVariantLoadClickCount(AdsId))
            //{
            //    objFromVariantClick.UpdateFormResponse(FormVariantId);
            //}

            //using (DLFormVariantLoadClick objFromVariantClick = new DLFormVariantLoadClick(AdsId))
            //{
            //    objFromVariantClick.UpdateFormResponse(FormVariantId, TrackIp, MachineId, SessionRefeer);
            //}

            //using (DLFormVariantReportDetails objDLFormVariantReportDetails = new DLFormVariantReportDetails(AdsId))
            //{
            //    objDLFormVariantReportDetails.Save(FormVariantId, MachineId, SessionRefeer, TagSelector);
            //}
        }

        public void FormImpressionResponse(int FormId, string TrackIp, string MachineId, string SessionRefeer)
        {

            using (var objFromImpression = DLFormLoadCloseResponseCount.GetDLFormLoadCloseResponseCount(AdsId, sQlVendor))
            {
                objFromImpression.UpdateFormResponse(FormId);
            }

            using (var objFromImpression = DLFormLoadCloseResponse.GetDLFormLoadCloseResponse(AdsId, sQlVendor))
            {
                objFromImpression.UpdateFormResponse(FormId, TrackIp, MachineId, SessionRefeer);
            }

        }

        #endregion Impression and Close Banner Track

        //public void BasicInitilazation(FormDetails formDetails, ref P5GenralML.VisitorDetails visitorDetails, Object[] answer, ref Contact contact, ref List<FormFields> fieldList, ref FormResponseReportToSetting responseSetting)
        //{
        //    ManageCustomFields objcustfields = new ManageCustomFields(AdsId, sqlVendor: sQlVendor);
        //    formDetails = new FormDetails() { Id = visitorDetails.FormId };
        //    using (var obj = DLFormDetails.GetDLFormDetails(AdsId, sQlVendor))
        //    {
        //        formDetails = obj.GETDetailss(formDetails);
        //    }

        //    using var objDLResponseSetting = DLFormResponseReportToSetting.GetDLFormResponseReportToSetting(AdsId, sQlVendor);
        //    responseSetting = objDLResponseSetting.Gets(visitorDetails.FormId);

        //    if (responseSetting != null && responseSetting.FormId > 0)
        //    {
        //        if (!string.IsNullOrEmpty(responseSetting.WebHooks))
        //            responseSetting.WebHooks = WebUtility.HtmlDecode(responseSetting.WebHooks);

        //        if (!string.IsNullOrEmpty(responseSetting.WebHooksFinalUrl))
        //            responseSetting.WebHooksFinalUrl = WebUtility.HtmlDecode(responseSetting.WebHooksFinalUrl);

        //        if (!string.IsNullOrEmpty(responseSetting.RedirectUrl))
        //            responseSetting.RedirectUrl = WebUtility.HtmlDecode(responseSetting.RedirectUrl);

        //        if (!string.IsNullOrEmpty(responseSetting.ReportToDetailsByPhoneCall))
        //            responseSetting.ReportToDetailsByPhoneCall = WebUtility.HtmlDecode(responseSetting.ReportToDetailsByPhoneCall);

        //        if (!string.IsNullOrEmpty(responseSetting.GroupId))
        //            responseSetting.GroupId = WebUtility.HtmlDecode(responseSetting.GroupId);

        //        if (!string.IsNullOrEmpty(responseSetting.GroupIdBasedOnOptin))
        //            responseSetting.GroupIdBasedOnOptin = WebUtility.HtmlDecode(responseSetting.GroupIdBasedOnOptin);
        //    }


        //    string Name = "", EmailId = "", PhoneNumber = "", LastName = "", Project = "", CountryCode = "";

        //    FormResponses formResponses = new FormResponses() { MachineId = visitorDetails.MachineId, PageUrl = visitorDetails.PageUrl, SessionRefer = visitorDetails.SessionRefeer, TrackIp = visitorDetails.TrackIp, FormId = visitorDetails.FormId };

        //    fieldList = null;//GetFields(visitorDetails.FormId);
        //    int NameFieldIndex = -1, EmailIdFieldIndex = -1, PhoneNumberFieldIndex = -1, LastNameFieldIndex = -1, CountryCodeFieldIndex = -1;

        //    if (fieldList.Any(x => x.FieldType == 1))
        //        NameFieldIndex = fieldList.Select((field, index) => new { field, index }).First(x => x.field.FieldType == 1).index;
        //    if (fieldList.Any(x => x.FieldType == 2))
        //        EmailIdFieldIndex = fieldList.Select((field, index) => new { field, index }).First(x => x.field.FieldType == 2).index;
        //    if (fieldList.Any(x => x.FieldType == 3))
        //        PhoneNumberFieldIndex = fieldList.Select((field, index) => new { field, index }).First(x => x.field.FieldType == 3).index;
        //    if (fieldList.Any(x => x.FieldType == 21))
        //        LastNameFieldIndex = fieldList.Select((field, index) => new { field, index }).First(x => x.field.FieldType == 21).index;
        //    if (fieldList.Any(x => x.FieldType == 22))
        //        CountryCodeFieldIndex = fieldList.Select((field, index) => new { field, index }).First(x => x.field.FieldType == 22).index;

        //    if (NameFieldIndex > -1 && NameFieldIndex < answer.Length && answer[NameFieldIndex] != null)
        //    {
        //        Name = Convert.ToString(answer[NameFieldIndex]);
        //    }
        //    if (EmailIdFieldIndex > -1 && EmailIdFieldIndex < answer.Length && answer[EmailIdFieldIndex] != null)
        //    {
        //        EmailId = Convert.ToString(answer[EmailIdFieldIndex]);
        //    }
        //    if (PhoneNumberFieldIndex > -1 && PhoneNumberFieldIndex < answer.Length && answer[PhoneNumberFieldIndex] != null)
        //    {
        //        PhoneNumber = Convert.ToString(answer[PhoneNumberFieldIndex]);
        //    }
        //    if (LastNameFieldIndex > -1 && LastNameFieldIndex < answer.Length && answer[LastNameFieldIndex] != null)
        //    {
        //        LastName = Convert.ToString(answer[LastNameFieldIndex]);
        //    }

        //    if (CountryCodeFieldIndex > -1 && CountryCodeFieldIndex < answer.Length && answer[CountryCodeFieldIndex] != null)
        //    {
        //        CountryCode = Convert.ToString(answer[CountryCodeFieldIndex]);
        //    }

        //    if (fieldList.Count > 0)
        //    {
        //        for (int i = 0; i < answer.Length; i++)
        //        {
        //            formResponses.GetType().GetProperty("Field" + (i + 1).ToString()).SetValue(formResponses, answer[i], null);
        //        }
        //    }
        //    else
        //    {
        //        if (answer.Length > 0)
        //            formResponses.Field1 = answer[0].ToString();
        //    }

        //    FormChatDetails getDetails = new FormChatDetails(AdsId, sQlVendor, httpContext);

        //    var Tuple = getDetails.GetVisitorDetails(visitorDetails.MachineId);
        //    string SourceType = "", UTMTagSource = "";
        //    if (Tuple != null)
        //    {
        //        SourceType = !String.IsNullOrEmpty(Tuple.Item1) ? Tuple.Item1 : "Direct";
        //        visitorDetails.RefferDomain = formResponses.Referrer = !String.IsNullOrEmpty(Tuple.Item2) ? Tuple.Item2 : "";
        //        formResponses.SearchKeyword = !String.IsNullOrEmpty(Tuple.Item3) && Tuple.Item3 != "NA" ? Tuple.Item3 : "";
        //        visitorDetails.SourceKey = !String.IsNullOrEmpty(Tuple.Item4) ? Tuple.Item4 : "";
        //        formResponses.Country = !String.IsNullOrEmpty(Tuple.Item5) ? Tuple.Item5 : "";
        //        visitorDetails.City = formResponses.City = !String.IsNullOrEmpty(Tuple.Item6) ? Tuple.Item6 : "";
        //        formResponses.IsAdSenseOrAdWord = !String.IsNullOrEmpty(Tuple.Item7) ? Convert.ToByte(Tuple.Item7) : Convert.ToByte(0);
        //        //formResponses.UtmTagSource = UTMTagSource = !String.IsNullOrEmpty(Tuple.Rest.ToString()) && Tuple.Rest.ToString() != "(NA)" ? Tuple.Rest.ToString().Replace("(", "").Replace(")", "") : null;
        //        if (visitorDetails.UtmTagSource == null || string.IsNullOrEmpty(visitorDetails.UtmTagSource))
        //        {
        //            visitorDetails.UtmTagSource = UTMTagSource = !String.IsNullOrEmpty(Tuple.Rest.Item1.ToString()) && Tuple.Rest.Item1.ToString() != "(NA)" ? Tuple.Rest.Item1.ToString().Replace("(", "").Replace(")", "") : null;
        //            visitorDetails.UtmMedium = !String.IsNullOrEmpty(Tuple.Rest.Item2) && Tuple.Rest.Item2 != "NA" ? Tuple.Rest.Item2 : "";
        //            visitorDetails.UtmCampaign = !String.IsNullOrEmpty(Tuple.Rest.Item3) && Tuple.Rest.Item3 != "NA" ? Tuple.Rest.Item3 : "";
        //        }
        //    }

        //    //For Getting the Project Details
        //    ProjectConfigurationDetails projectDetails = new ProjectConfigurationDetails(AdsId);
        //    Project = projectDetails.GetProjectName(visitorDetails);

        //    if (!String.IsNullOrEmpty(EmailId) || !String.IsNullOrEmpty(PhoneNumber))
        //    {
        //        int Score = 0;
        //        int ContactIdForScoreChecking = 0;
        //        try
        //        {
        //            DLContact objDLContact = new DLContact(AdsId);

        //            if (!String.IsNullOrEmpty(EmailId))
        //                ContactIdForScoreChecking = objDLContact.CheckEmailIdExists(EmailId);

        //            if (ContactIdForScoreChecking > 0)
        //            {
        //                Score = -1;
        //            }
        //            else if (!String.IsNullOrEmpty(PhoneNumber))
        //            {
        //                ContactIdForScoreChecking = objDLContact.CheckPhoneNumberExists(PhoneNumber);

        //                if (ContactIdForScoreChecking > 0)
        //                    Score = -1;
        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            Helper.SendMailOnMajorError("Score Saving Part ==> Account " + AdsId.ToString() + "", "CaptureForm", ex.ToString());
        //        }

        //        Helper.IsValidPhoneNumber(ref PhoneNumber);
        //        contact = SaveUpdateGetContact(Name, EmailId, PhoneNumber, answer, fieldList, SourceType, UTMTagSource, visitorDetails, LastName, Project, CountryCode, Score);
        //    }

        //    if (contact == null)
        //    {
        //        contact = GetContactDetailsByMachineId(visitorDetails.MachineId);
        //    }

        //    if (contact != null && contact.ContactId > 0)
        //    {
        //        formResponses.ContactId = contact.ContactId;
        //        SaveInLMS(contact, answer, fieldList, responseSetting, visitorDetails);
        //        AutoAssignToGroup(contact, visitorDetails.FormId, responseSetting, fieldList, answer, formDetails.Heading);

        //        AutoAssignToGroupBasedOnOptin(contact, visitorDetails.FormId, responseSetting, fieldList, answer, visitorDetails);
        //        //the below line is for Updating Contact and LmsCustom Fields at once place
        //        objcustfields.UpdateCustomFields(answer, "CaptureForm", contact.ContactId, fieldList);

        //        using (DLContact objContact = new DLContact(AdsId))
        //        {
        //            contact = objContact.GetContactDetails(contact, null);
        //        }
        //    }

        //    //Assign Subscription data to formresponse

        //    if (visitorDetails.SmsBrandOptIn != null)
        //    {
        //        formResponses.SmsSubscribe = visitorDetails.SmsBrandOptIn;
        //    }

        //    if (visitorDetails.SmsOverallOptIn != null)
        //    {
        //        if (visitorDetails.SmsOverallOptIn == true)
        //            formResponses.SmsSubscribe = true;
        //        formResponses.SmsOverallSubscribe = visitorDetails.SmsOverallOptIn;
        //    }

        //    if (visitorDetails.MailBrandOptIn != null)
        //    {
        //        formResponses.MailSubscribe = visitorDetails.MailBrandOptIn;
        //    }

        //    if (visitorDetails.MailOverallOptIn != null)
        //    {
        //        if (visitorDetails.MailOverallOptIn == true)
        //            formResponses.MailSubscribe = true;
        //        formResponses.MailOverallSubscribe = visitorDetails.MailOverallOptIn;
        //    }

        //    if (visitorDetails.Mail_SmsBrandOptIn != null)
        //    {
        //        formResponses.MailSubscribe = visitorDetails.Mail_SmsBrandOptIn;
        //        formResponses.SmsSubscribe = visitorDetails.Mail_SmsBrandOptIn;
        //    }

        //    if (visitorDetails.Mail_SmsOverallOptIn != null)
        //    {
        //        if (visitorDetails.Mail_SmsOverallOptIn == true)
        //        {
        //            formResponses.MailSubscribe = true;
        //            formResponses.SmsSubscribe = true;
        //        }

        //        formResponses.MailOverallSubscribe = visitorDetails.Mail_SmsOverallOptIn;
        //        formResponses.SmsOverallSubscribe = visitorDetails.Mail_SmsOverallOptIn;
        //    }

        //    if (!string.IsNullOrEmpty(Project))
        //        formResponses.ProjectDate = DateTime.Now;

        //    using (DLFormResponses objDLResponse = new DLFormResponses(AdsId))
        //    {
        //        formResponses.UtmTagSource = visitorDetails.UtmTagSource;
        //        formResponses.UtmMedium = visitorDetails.UtmMedium;
        //        formResponses.UtmContent = visitorDetails.UtmContent;
        //        formResponses.UtmCampaign = visitorDetails.UtmCampaign;
        //        formResponses.UtmTerm = visitorDetails.UtmTerm;
        //        formResponses.Project = Project;
        //        formResponses.Id = objDLResponse.Save(formResponses);
        //    }

        //    if (visitorDetails.FormType == 20 && !String.IsNullOrEmpty(PhoneNumber) && !String.IsNullOrEmpty(responseSetting.ReportToDetailsByPhoneCall))
        //        ReportThroughCall(PhoneNumber, visitorDetails.FormId, responseSetting, fieldList, answer, formDetails.Heading);

        //    ResponseAction(formDetails, answer, fieldList, visitorDetails, contact, formResponses, responseSetting);
        //}

        //public void ResponseAction(FormDetails formDetails, Object[] answerList, List<FormFields> formFields, P5GenralML.VisitorDetails visitorDetails, Contact contact, FormResponses formResponses, FormResponseReportToSetting responseSetting)
        //{
        //    try
        //    {
        //        //Report To Mail 
        //        if (responseSetting.ReportToFormsMailFieldId > 0)
        //        {
        //            var eachField = formFields.FirstOrDefault(x => x.Id == responseSetting.ReportToFormsMailFieldId);
        //            var answerIndex = formFields.FindIndex(x => x.Id == responseSetting.ReportToFormsMailFieldId);

        //            if (eachField != null && answerIndex > -1)
        //            {
        //                string[] fieldAllAnswerList = eachField.SubFields.Split(',');
        //                string[] eachMailDetails = responseSetting.ReportToDetailsByMail.Split(new string[] { "@$" }, StringSplitOptions.RemoveEmptyEntries);

        //                for (int aRP = 0; aRP < fieldAllAnswerList.Length; aRP++)
        //                {
        //                    if (answerList[answerIndex].ToString().Trim() == fieldAllAnswerList[aRP].Trim())
        //                    {
        //                        Task.Run(() =>
        //                        {
        //                            ReportThroughMail(eachMailDetails[aRP], formDetails, answerList, formFields, formResponses, visitorDetails);
        //                        });
        //                        break;
        //                    }
        //                }
        //            }
        //        }
        //        else if (!String.IsNullOrEmpty(responseSetting.ReportToDetailsByMail))
        //        {
        //            Task.Run(() =>
        //            {
        //                ReportThroughMail(responseSetting.ReportToDetailsByMail, formDetails, answerList, formFields, formResponses, visitorDetails);
        //            });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Helper.SendMailOnMajorError("Report To Mail ==> Account " + AdsId.ToString() + "", "CaptureForm", ex.ToString());
        //    }

        //    try
        //    {
        //        //Report To Sms 
        //        if (responseSetting.ReportToFormsSMSFieldId > 0)
        //        {
        //            var eachField = formFields.FirstOrDefault(x => x.Id == responseSetting.ReportToFormsSMSFieldId);
        //            var answerIndex = formFields.FindIndex(x => x.Id == responseSetting.ReportToFormsSMSFieldId);

        //            if (eachField != null && answerIndex > -1)
        //            {
        //                string[] fieldAllAnswerList = eachField.SubFields.Split(',');
        //                string[] eachSMSDetails = responseSetting.ReportToDetailsBySMS.Split(new string[] { "@$" }, StringSplitOptions.RemoveEmptyEntries);

        //                for (int aRS = 0; aRS < fieldAllAnswerList.Length; aRS++)
        //                {
        //                    if (answerList[answerIndex].ToString().Trim() == fieldAllAnswerList[aRS].Trim())
        //                    {
        //                        Task.Run(() =>
        //                        {
        //                            ReportThroughSMS(eachSMSDetails[aRS], formDetails, answerList, formFields, visitorDetails);
        //                        });
        //                        break;
        //                    }
        //                }
        //            }
        //        }
        //        else if (!String.IsNullOrEmpty(responseSetting.ReportToDetailsBySMS))
        //        {
        //            Task.Run(() =>
        //            {
        //                ReportThroughSMS(responseSetting.ReportToDetailsBySMS, formDetails, answerList, formFields, visitorDetails);
        //            });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Helper.SendMailOnMajorError("Report To Sms ==> Account " + AdsId.ToString() + "", "CaptureForm", ex.ToString());
        //    }

        //    //WebHooks 
        //    if (!string.IsNullOrEmpty(responseSetting.WebHooks) && !string.IsNullOrEmpty(responseSetting.WebHooksFinalUrl))
        //    {
        //        WebHooks objwebhooks = new WebHooks(AdsId, visitorDetails.RefferDomain, visitorDetails.PageUrl, visitorDetails.Domain, formDetails.Heading, visitorDetails.City, visitorDetails.SourceKey, "Form-" + formDetails.Id);
        //        objwebhooks.UrlData(answerList, formFields, responseSetting.WebHooksFinalUrl);
        //    }
        //}

        //public void AutoAssignToGroup(Contact contact, int FormId, FormResponseReportToSetting responseSetting, List<FormFields> formFields, Object[] answerList, string FormHeading)
        //{
        //    int[] ContactDetails = new int[1];
        //    ContactDetails[0] = contact.ContactId;
        //    int GroupId = 0;


        //    if (responseSetting.GroupId != null && responseSetting.GroupId.Length > 0)
        //    {
        //        try
        //        {
        //            var data = JArray.Parse(responseSetting.GroupId);

        //            foreach (var item in data.Children())
        //            {
        //                JObject jObject = JObject.Parse(item.ToString());
        //                int DependencyFieldId = Convert.ToInt32((string)jObject["DependencyFieldId"]);

        //                //UnConditional
        //                if (DependencyFieldId <= 0)
        //                {
        //                    GroupId = Convert.ToInt32((string)jObject["UnconditionalGroupId"]);
        //                    AddToGroup(GroupId, ContactDetails);
        //                }
        //                else if (DependencyFieldId > 0)
        //                {
        //                    JToken[] SubFieldList = jObject["Subfields"].ToArray();

        //                    //Conditional
        //                    if (SubFieldList != null && SubFieldList.Length > 0)
        //                    {
        //                        var answerIndex = formFields.FindIndex(x => x.Id == DependencyFieldId);
        //                        var FieldType = formFields.Where(x => x.Id == DependencyFieldId).Select(a => a.FieldType).FirstOrDefault();

        //                        if (answerIndex > -1)
        //                        {
        //                            string AnswerdValue = answerList[answerIndex].ToString().Trim();

        //                            if (!string.IsNullOrEmpty(AnswerdValue))
        //                            {
        //                                if (FieldType == 10)   //For CheckBox we need to ad multiple times
        //                                {
        //                                    List<string> CheckBoxAnsweredValues = new List<string>();

        //                                    if (AnswerdValue.IndexOf("|") > -1)
        //                                        CheckBoxAnsweredValues = AnswerdValue.Split('|').ToList();
        //                                    else
        //                                        CheckBoxAnsweredValues.Add(AnswerdValue.ToString());

        //                                    for (int j = 0; j < CheckBoxAnsweredValues.Count(); j++)
        //                                    {
        //                                        for (int i = 0; i < SubFieldList.Length; i++)
        //                                        {
        //                                            var values = JObject.Parse(SubFieldList[i].ToString()).ToObject<Dictionary<string, int>>();

        //                                            if (values.ContainsKey(CheckBoxAnsweredValues[j].Trim()))
        //                                            {
        //                                                GroupId = values[CheckBoxAnsweredValues[j].Trim()];
        //                                                AddToGroup(GroupId, ContactDetails);
        //                                                break;
        //                                            }
        //                                        }
        //                                    }
        //                                }
        //                                else
        //                                {
        //                                    for (int i = 0; i < SubFieldList.Length; i++)
        //                                    {
        //                                        var values = JObject.Parse(SubFieldList[i].ToString()).ToObject<Dictionary<string, int>>();

        //                                        if (values.ContainsKey(AnswerdValue))
        //                                        {
        //                                            GroupId = values[AnswerdValue];
        //                                            AddToGroup(GroupId, ContactDetails);
        //                                            break;
        //                                        }
        //                                    }
        //                                }
        //                            }
        //                        }
        //                    }
        //                }
        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            Helper.SendMailOnMajorError("AutoAssignToGroup ==> Account " + AdsId.ToString() + "", "CaptureForm", ex.ToString());
        //        }
        //    }
        //}
        public class Mail_Sms
        {
            public string MailOptin { get; set; }

        }
        //public void AutoAssignToGroupBasedOnOptin(Contact contact, int FormId, FormResponseReportToSetting responseSetting, List<FormFields> formFields, Object[] answerList, VisitorDetails visitorDetails)
        //{
        //    int[] ContactDetails = new int[1];
        //    ContactDetails[0] = contact.ContactId;
        //    int GroupId = 0;
        //    if (responseSetting.GroupIdBasedOnOptin != null && responseSetting.GroupIdBasedOnOptin.Length > 0)
        //    {

        //        try
        //        {

        //            var data = JArray.Parse(responseSetting.GroupIdBasedOnOptin);

        //            foreach (var item in data.Children())
        //            {
        //                JObject itemObject = JObject.Parse(item.ToString());

        //                string OptinFieldType = itemObject["FieldType"].ToString();
        //                string OptinType = itemObject["OptinType"].ToString().ToLower();
        //                GroupId = Convert.ToInt32((string)itemObject["GroupId"]);

        //                if (OptinFieldType != null && OptinType != null && GroupId > 0)
        //                {

        //                    switch (OptinFieldType.ToLower())
        //                    {
        //                        case "mailspecific":
        //                            if (OptinType == "optin" && visitorDetails.MailBrandOptIn.HasValue && visitorDetails.MailBrandOptIn.Value)
        //                            {
        //                                AddToGroup(GroupId, ContactDetails);
        //                            }
        //                            else if (OptinType == "withoutoptin" && visitorDetails.MailBrandOptIn.HasValue && !visitorDetails.MailBrandOptIn.Value)
        //                            {
        //                                AddToGroup(GroupId, ContactDetails);
        //                            }

        //                            break;
        //                        case "smsspecific":

        //                            if (OptinType == "optin" && visitorDetails.SmsBrandOptIn.HasValue && visitorDetails.SmsBrandOptIn.Value)
        //                            {
        //                                AddToGroup(GroupId, ContactDetails);
        //                            }
        //                            else if (OptinType == "withoutoptin" && visitorDetails.SmsBrandOptIn.HasValue && !visitorDetails.SmsBrandOptIn.Value)
        //                            {
        //                                AddToGroup(GroupId, ContactDetails);
        //                            }

        //                            break;
        //                        case "mailoverall":

        //                            if (OptinType == "optin" && visitorDetails.MailOverallOptIn.HasValue && visitorDetails.MailOverallOptIn.Value)
        //                            {
        //                                AddToGroup(GroupId, ContactDetails);
        //                            }
        //                            else if (OptinType == "withoutoptin" && visitorDetails.MailOverallOptIn.HasValue && !visitorDetails.MailOverallOptIn.Value)
        //                            {
        //                                AddToGroup(GroupId, ContactDetails);
        //                            }

        //                            break;
        //                        case "smsoverall":

        //                            if (OptinType == "optin" && visitorDetails.SmsOverallOptIn.HasValue && visitorDetails.SmsOverallOptIn.Value)
        //                            {
        //                                AddToGroup(GroupId, ContactDetails);
        //                            }
        //                            else if (OptinType == "withoutoptin" && visitorDetails.SmsOverallOptIn.HasValue && !visitorDetails.SmsOverallOptIn.Value)
        //                            {
        //                                AddToGroup(GroupId, ContactDetails);
        //                            }

        //                            break;
        //                        case "mailsmsspecific":

        //                            if (OptinType == "optin" && visitorDetails.Mail_SmsBrandOptIn.HasValue && visitorDetails.Mail_SmsBrandOptIn.Value)
        //                            {
        //                                AddToGroup(GroupId, ContactDetails);
        //                            }
        //                            else if (OptinType == "withoutoptin" && visitorDetails.Mail_SmsBrandOptIn.HasValue && !visitorDetails.Mail_SmsBrandOptIn.Value)
        //                            {
        //                                AddToGroup(GroupId, ContactDetails);
        //                            }
        //                            break;
        //                        case "mailsmsoverall":

        //                            if (OptinType == "optin" && visitorDetails.Mail_SmsOverallOptIn.HasValue && visitorDetails.Mail_SmsOverallOptIn.Value)
        //                            {
        //                                AddToGroup(GroupId, ContactDetails);
        //                            }
        //                            else if (OptinType == "withoutoptin" && visitorDetails.Mail_SmsOverallOptIn.HasValue && !visitorDetails.Mail_SmsOverallOptIn.Value)
        //                            {
        //                                AddToGroup(GroupId, ContactDetails);
        //                            }
        //                            break;
        //                    }
        //                }
        //            }
        //        }

        //        catch (Exception ex)
        //        {
        //            Helper.SendMailOnMajorError("AutoAssignToGroupBasedOnOptin ==> Account " + AdsId.ToString() + "", "CaptureForm", ex.ToString());
        //        }
        //    }
        //}

        public async Task AddToGroup(int GroupId, int[] ContactDetails)
        {
            if (GroupId > 0)
            {
                int[] Groups = { GroupId };
                using (GeneralAddToGroups generalAddToGroups = new GeneralAddToGroups(AdsId, sqlVendor: sQlVendor))
                {
                    await generalAddToGroups.AddToGroupMemberAndRespectiveModule(0, 0, Groups.ToArray(), ContactDetails);
                }
            }
        }

        //public Contact SaveUpdateGetContact(string Name, string EmailId, string PhoneNumber, Object[] answer, List<FormFields> fieldList, string SourceType, string UTMTagSource, VisitorDetails visitorDetails, string LastName, string Project, string CountryCode, int Score)
        //{
        //    Contact contact = new Contact() { Name = Name, LastName = LastName, EmailId = EmailId, PhoneNumber = PhoneNumber, ContactSource = "FormChatDetails_SaveUpdateGetContact_" + visitorDetails.FormId.ToString(), LeadType = 1, ReferType = SourceType, UtmTagSource = visitorDetails.UtmTagSource, FirstUtmMedium = visitorDetails.UtmMedium, FirstUtmCampaign = visitorDetails.UtmCampaign, FirstUtmContent = visitorDetails.UtmContent, FirstUtmTerm = visitorDetails.UtmTerm, Project = Project, CountryCode = CountryCode, Place = visitorDetails.City, PageUrl = visitorDetails.PageUrl, ReferrerUrl = !String.IsNullOrEmpty(visitorDetails.RefferDomain) ? visitorDetails.RefferDomain : "Direct", SearchKeyword = visitorDetails.SearchKeyword, LmsGroupId = 1, FormId = visitorDetails.FormId, AllFormIds = Convert.ToString(visitorDetails.FormId), Score = Score };

        //    if (!string.IsNullOrEmpty(Project))
        //        contact.ProjectDate = DateTime.Now;

        //    if (visitorDetails.SmsBrandOptIn != null)
        //    {
        //        contact.IsSmsUnsubscribe = !visitorDetails.SmsBrandOptIn;
        //        contact.SmsSubscribedDate = DateTime.Now;
        //    }

        //    if (visitorDetails.SmsOverallOptIn != null)
        //    {
        //        if (visitorDetails.SmsOverallOptIn == true)
        //            contact.IsSmsUnsubscribe = false;
        //        contact.SmsSubscribedDate = DateTime.Now;
        //        contact.SmsOptInOverAllNewsLetter = Convert.ToByte(visitorDetails.SmsOverallOptIn);
        //    }

        //    if (visitorDetails.MailBrandOptIn != null)
        //    {
        //        contact.Unsubscribe = visitorDetails.MailBrandOptIn == true ? Convert.ToByte(0) : Convert.ToByte(1);
        //        contact.SubscribedDate = DateTime.Now;
        //    }

        //    if (visitorDetails.MailOverallOptIn != null)
        //    {
        //        if (visitorDetails.MailOverallOptIn == true)
        //            contact.Unsubscribe = Convert.ToByte(0);
        //        contact.SubscribedDate = DateTime.Now;
        //        contact.OptInOverAllNewsLetter = Convert.ToByte(visitorDetails.MailOverallOptIn);
        //    }

        //    if (visitorDetails.Mail_SmsBrandOptIn != null)
        //    {
        //        contact.Unsubscribe = visitorDetails.Mail_SmsBrandOptIn == true ? Convert.ToByte(0) : Convert.ToByte(1);
        //        contact.SubscribedDate = DateTime.Now;

        //        contact.IsSmsUnsubscribe = !visitorDetails.Mail_SmsBrandOptIn;
        //        contact.SmsSubscribedDate = DateTime.Now;
        //    }

        //    if (visitorDetails.Mail_SmsOverallOptIn != null)
        //    {
        //        if (visitorDetails.Mail_SmsOverallOptIn == true)
        //        {
        //            contact.Unsubscribe = Convert.ToByte(0);
        //            contact.IsSmsUnsubscribe = false;
        //        }

        //        contact.SubscribedDate = DateTime.Now;
        //        contact.OptInOverAllNewsLetter = Convert.ToByte(visitorDetails.Mail_SmsOverallOptIn);

        //        contact.SmsSubscribedDate = DateTime.Now;
        //        contact.SmsOptInOverAllNewsLetter = Convert.ToByte(visitorDetails.Mail_SmsOverallOptIn);
        //    }

        //    List<FormFields> formFields = fieldList.Where(x => x.FieldType > 3 && x.FieldType < 15).ToList();

        //    EmailVerifyProviderSetting EmailVerifierSettings = new EmailVerifyProviderSetting();
        //    using (DLEmailVerifyProviderSetting objDL = new DLEmailVerifyProviderSetting(AdsId))
        //    {
        //        EmailVerifierSettings = objDL.GetActiveprovider();
        //    }


        //    using (DLContact objContact = new DLContact(AdsId))
        //    {
        //        if (formFields != null && formFields.Count > 0)
        //        {
        //            //this function is to map static contact table fieds like age,gender,location etc..
        //            for (int i = 0; i < formFields.Count; i++)
        //            {
        //                string fieldName = formFields[i].Name.ToLower();

        //                int AnswerIndex = fieldList.Select((field, index) => new { field, index }).First(x => x.field.Id == formFields[i].Id).index;

        //                if (contact.GetType().GetProperty(fieldName, BindingFlags.SetProperty | BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance) != null)
        //                {
        //                    if (fieldName == "age")
        //                    {
        //                        try
        //                        {
        //                            int Age = 0;
        //                            if (int.TryParse(answer[AnswerIndex].ToString(), out Age))
        //                            {
        //                                contact.Age = DateTime.Now.AddYears(-Age);
        //                            }
        //                            else
        //                            {
        //                                Nullable<DateTime> date = Helper.ConvertStringToDateFormat(answer[AnswerIndex].ToString());
        //                                if (date != null)
        //                                    contact.Age = date;
        //                            }
        //                        }
        //                        catch { }
        //                    }
        //                    else
        //                    {
        //                        try
        //                        {
        //                            contact.GetType().GetProperty(fieldName, BindingFlags.SetProperty | BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).SetValue(contact, answer[AnswerIndex], null);
        //                        }
        //                        catch { }
        //                    }
        //                }
        //            }
        //        }

        //        if (EmailVerifierSettings == null)
        //        {
        //            contact.IsVerifiedMailId = 1;
        //        }

        //        contact.ContactId = objContact.Save(contact);
        //    }


        //    if (EmailVerifierSettings != null)
        //    {
        //        if (!string.IsNullOrEmpty(EmailId) && contact.ContactId > 0)
        //        {
        //            Task.Run(() =>
        //            {
        //                int ContactId = contact.ContactId;
        //                VerifyEmail objVerifyEmail = new VerifyEmail(AdsId);
        //                objVerifyEmail.VerifyEmailId(EmailId);
        //                int IsVerifiedMailId = ((bool)objVerifyEmail.ValidationStatus ? 1 : 0);
        //                objVerifyEmail.UpdateContactStatus(ContactId, IsVerifiedMailId, objVerifyEmail.ProviderName);
        //            }); ;
        //        }
        //    }

        //    if (contact.ContactId > 0)
        //    {
        //        using (DLContact objDLContact = new DLContact(AdsId))
        //        {
        //            Contact Newcontact = objDLContact.GetContactDetails(contact);

        //            if (Newcontact != null && Newcontact.ContactId > 0)
        //            {
        //                return Newcontact;
        //            }
        //        }
        //    }
        //    return contact;
        //}

        //public void SaveInLMS(Contact contact, Object[] answer, List<FormFields> fieldList, FormResponseReportToSetting responseSetting, VisitorDetails visitorDetails)
        //{
        //    List<ContactExtraField> contactExtraFields = new List<ContactExtraField>();
        //    AutoMailSmsAlertToLead objAutoAlerts = new AutoMailSmsAlertToLead(AdsId);
        //    LmsUpdateStageNotification obj = new LmsUpdateStageNotification();
        //    LmsStageNotification lmsStageNotification = new LmsStageNotification();
        //    List<LeadNotificationToSalesRules> leadNotificationToSalesRules = null;

        //    DLContactExtraField bLContactExtraField = new DLContactExtraField(AdsId);
        //    DLContact bLContact = new DLContact(AdsId);
        //    contactExtraFields = bLContactExtraField.GetList();

        //    //this code because if not assigned then assignemnet will start
        //    if (contact.UserInfoUserId <= 0)
        //    {
        //        if (!String.IsNullOrEmpty(responseSetting.AccesLeadToUserId) && responseSetting.AccesLeadToUserId != "0")
        //        {
        //            if (responseSetting.ReportToAssignLeadToUserIdFieldId > 0)
        //            {
        //                var eachField = fieldList.FirstOrDefault(x => x.Id == responseSetting.ReportToAssignLeadToUserIdFieldId);
        //                var answerIndex = fieldList.FindIndex(x => x.Id == responseSetting.ReportToAssignLeadToUserIdFieldId);

        //                if (eachField != null && answerIndex > -1)
        //                {
        //                    string[] fieldAllAnswerList = eachField.SubFields.Split(',');
        //                    string[] eachUserIdDetails = responseSetting.AccesLeadToUserId.Split(new string[] { "@$" }, StringSplitOptions.RemoveEmptyEntries);

        //                    for (int aAssign = 0; aAssign < fieldAllAnswerList.Length; aAssign++)
        //                    {
        //                        if (answer[answerIndex].ToString().Trim() == fieldAllAnswerList[aAssign].Trim())
        //                        {
        //                            contact.UserInfoUserId = Convert.ToInt32(eachUserIdDetails[aAssign]);
        //                            break;
        //                        }
        //                    }
        //                }
        //            }
        //            else
        //            {
        //                contact.UserInfoUserId = Convert.ToInt32(responseSetting.AccesLeadToUserId);
        //            }
        //            bLContact.AssignSalesPerson(contact.ContactId, contact.UserInfoUserId);
        //        }
        //        else
        //        {
        //            using (DLLeadNotificationToSalesRules LmsStageNotification = new DLLeadNotificationToSalesRules(AdsId))
        //            {
        //                leadNotificationToSalesRules = LmsStageNotification.GetLeadNotificationToSales();
        //            }

        //            if (leadNotificationToSalesRules != null && leadNotificationToSalesRules.Count > 0 && contact.ContactId > 0)
        //            {
        //                LeadNotificationToSalesBasedOnRule objrule = new LeadNotificationToSalesBasedOnRule(visitorDetails.AdsId);
        //                objrule.CheckLeadNotificationRules(leadNotificationToSalesRules, contact, answer, fieldList, contactExtraFields);
        //                contact.UserInfoUserId = objrule.AssignedUserId;
        //                LeadNotificationToSalesMailSendingSettingId = objrule.MailSendingSettingId;
        //                LeadNotificationToSalesSmsSendingSettingId = objrule.SmsSendingSettingId;
        //            }
        //            else
        //            {
        //                using (DLLmsStageNotification objLms = new DLLmsStageNotification(AdsId))
        //                {
        //                    lmsStageNotification = objLms.GET(contact.Score);
        //                }

        //                if (lmsStageNotification != null && (lmsStageNotification.AssignUserInfoUserId > 0 || lmsStageNotification.AssignUserGroupId > 0) && contact.ContactId > 0)
        //                {
        //                    MLContact mLContact = new MLContact();
        //                    Helper.Copy(contact, mLContact);
        //                    obj.AssignDependingUponStage(AdsId, mLContact, lmsStageNotification);
        //                    contact.UserInfoUserId = obj.AssignedUserInfoUserId;
        //                }
        //            }
        //        }
        //    }

        //    if (contact.UserInfoUserId <= 0 && contact.ContactId > 0)
        //    {
        //        Account accountDetails = new Account();
        //        using (DLAccount objDLAccount = new DLAccount())
        //        {
        //            accountDetails = objDLAccount.GetAccountDetails(AdsId);
        //        }
        //        if (accountDetails != null && accountDetails.AccountId > 0)
        //        {
        //            contact.UserInfoUserId = accountDetails.UserInfoUserId;
        //        }
        //        bLContact.AssignSalesPerson(contact.ContactId, contact.UserInfoUserId);
        //    }

        //    objAutoAlerts.SendMailSmsAlertToLead(contact.UserInfoUserId, contact.ContactId, "Form");
        //}

        #region Private Method For storing Data

        public void ReportThroughMail(string reportToMailId, FormDetails formBasicDetails, Object[] answerList, List<FormFields> formFields, FormResponses formResponse, P5GenralML.VisitorDetails visitorDetails)
        {

            string MailContent = "";
            MailContent = "<tr><td style='width:23%;padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:bold; padding-left:10px; background-color:#ebf2d8;'>Form title</td><td style='width:77%;padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:normal; padding-left:10px; background-color:#f4f8e7;'>" + formBasicDetails.Heading + "</td></tr>";
            MailContent += "<tr><td style='width:23%;padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:bold; padding-left:10px; background-color:#ebf2d8;'>Form description</td><td style='width:77%;padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:normal; padding-left:10px; background-color:#f4f8e7;'>" + (formBasicDetails.SubHeading == null ? "" : formBasicDetails.SubHeading) + "</td></tr>";

            for (int i = 0; i < answerList.Length; i++)
            {
                if (formBasicDetails.FormType == 16)
                    MailContent += "<tr><td style='width:23%;padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:bold; padding-left:10px; background-color:#ebf2d8;'>Ratted Value</td><td style='width:77%;padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:normal; padding-left:10px; background-color:#f4f8e7;'>" + answerList[i].ToString() + "</td></tr>";
                else
                    MailContent += "<tr><td style='width:23%;padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:bold; padding-left:10px; background-color:#ebf2d8;'>" + formFields[i].Name + "</td><td style='width:77%;padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:normal; padding-left:10px; background-color:#f4f8e7;'>" + answerList[i].ToString() + "</td></tr>";

            }
            if (String.IsNullOrEmpty(formResponse.Referrer)) formResponse.Referrer = "Direct";
            MailContent += "<tr><td style='padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:bold; padding-left:10px; background-color:#fff;'>Session Info</td><td style='width:77%;padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:normal; padding-left:10px; background-color:#fff;'> </td></tr>";
            MailContent += "<tr><td style='width:23%;padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:bold; padding-left:10px; background-color:#ebf2d8;'>Activity Page</td><td style='width:77%;padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:normal; padding-left:10px; background-color:#f4f8e7;'>" + formResponse.PageUrl + "</td></tr>";
            MailContent += "<tr><td style='width:23%;padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:bold; padding-left:10px; background-color:#ebf2d8;'>Source</td><td style='width:77%;padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:normal; padding-left:10px; background-color:#f4f8e7;'>" + formResponse.Referrer + "</td></tr>";
            MailContent += "<tr><td style='width:23%;padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:bold; padding-left:10px; background-color:#ebf2d8;'>Location</td><td style='width:77%;padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:normal; padding-left:10px; background-color:#f4f8e7;'>" + formResponse.City + "</td></tr>";
            MailContent += "<tr><td style='width:23%;padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:bold; padding-left:10px; background-color:#ebf2d8;'>Search keyword</td><td style='width:77%;padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:normal; padding-left:10px; background-color:#f4f8e7;'>" + formResponse.SearchKeyword + "</td></tr>";
            MailContent += "<tr><td style='width:23%;padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:bold; padding-left:10px; background-color:#ebf2d8;'>Time</td><td style='width:77%;padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:normal; padding-left:10px; background-color:#f4f8e7;'>" + DateTime.Now.ToString() + " *</td></tr>";
            MailContent += "<tr><td style='width:23%;padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:bold; padding-left:10px; background-color:#ebf2d8;'>Domain</td><td style='width:77%;padding:8px; font-family:Arial, Helvetica, sans-serif; font-size:14px; font-weight:normal; padding-left:10px; background-color:#f4f8e7;'>" + visitorDetails.Domain + "</td></tr>";

            string subject = "Plumb5 Campaign Leads (" + visitorDetails.Domain + ")";
            string MailBody = "<table width=\"720\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"border:1px solid #ccc;\"><tr><td width=\"163\" height=\"76\" style=\"font-family:Arial, Helvetica, sans-serif; font-size:15px; padding:10px; font-weight:bold;\"><img src=\"http://www.plumb5.com/images/plumb5_logo.jpg\" width=\"151\" height=\"42\" /></td>    <td width=\"557\" style=\"font-family:Arial, Helvetica, sans-serif; font-size:15px; padding:10px; font-weight:bold; padding-right:30px;\"><div align=\"right\"><a href=\"" + AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "\" style=\"color:#333333; \">View All Leads  </a></div></td>" +
                           "</tr><tr><td colspan=\"2\" style=\"font-family:Arial, Helvetica, sans-serif; font-size:32px; padding:10px; font-weight:bold; padding-left:17px;\">You have a new lead request </td>" +
                           "</tr><tr><td colspan=\"2\" style=\"font-family:Arial, Helvetica, sans-serif; font-size:20px; padding:10px;\">" +
                           "<table width=\"100%\" border=\"0\" cellspacing=\"2\" cellpadding=\"2\">" + MailContent + "</table><br /><br /></td></tr></table>";

            //SendPriorityMail SendMail = new SendPriorityMail(AdsId);
            //foreach (string MailId in reportToMailId.Split(','))
            //{
            //    string emailId = MailId.Trim();
            //    if (!String.IsNullOrEmpty(emailId) && Helper.IsValidEmailAddress(emailId))
            //    {
            //        MailMessage mailMsg = new MailMessage();
            //        mailMsg.Subject = subject;
            //        mailMsg.Body = MailBody;
            //        mailMsg.IsBodyHtml = true;
            //        mailMsg.To.Add(emailId);
            //        Helper.SendMail(mailMsg);
            //    }
            //}

            //UpdatePricingCount("EmailAlerts", reportToMailId.Split(',').Count());
        }

        //public void ReportThroughSMS(string ReportToNumber, FormDetails formBasicDetails, Object[] answerList, List<FormFields> formFields, VisitorDetails visitorDetails)
        //{
        //    StringBuilder SMSContent = new StringBuilder("Domain:" + visitorDetails.Domain + "");
        //    if (formBasicDetails.FormType == 12)
        //    {
        //        for (int i = 0; i < answerList.Length; i++)
        //            SMSContent.Append(" " + formFields[i].Name + "-" + answerList[i].ToString());
        //    }
        //    else
        //    {
        //        SMSContent.Append("Answer value -" + answerList[0].ToString());
        //    }
        //    #region DLT Notification SMS
        //    SmsNotificationTemplate smsNotificationTemplate;
        //    using (DLSmsNotificationTemplate obj = new DLSmsNotificationTemplate(AdsId))
        //    {

        //        smsNotificationTemplate = obj.GetByIdentifier("captureformlead");
        //    }
        //    #endregion DLT Notification SMS
        //    string LeadDetailsMessageContent = smsNotificationTemplate.MessageContent.Replace("[{*SMSContent*}]", SMSContent.ToString());
        //    //SMSContent = new StringBuilder("Dear Customer, Please find below the Lead Details. " + SMSContent.ToString() + "");

        //    SmsConfiguration smsConfiguration = new SmsConfiguration();

        //    using (DLSmsConfiguration objGetSMSConfigration = new DLSmsConfiguration(AdsId))
        //    {
        //        smsConfiguration = objGetSMSConfigration.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);
        //    }

        //    if (smsConfiguration != null && smsConfiguration.Id > 0 && smsNotificationTemplate.IsSmsNotificationEnabled)
        //    {
        //        //SmsSetting smsSetting = new SmsSetting()
        //        //{
        //        //    IsPromotionalOrTransactionalType = smsConfiguration.IsPromotionalOrTransactionalType,
        //        //    IsSchedule = false,
        //        //    MessageContent = SMSContent.ToString(),
        //        //    SmsTemplateId = 0
        //        //};

        //        //SmsSentSavingDetials smsSentSavingDetials = new SmsSentSavingDetials()
        //        //{
        //        //    ConfigurationId = 0,
        //        //    GroupId = 0,
        //        //    SmsCampaignId = 0
        //        //};

        //        //using (SendSmsGeneral sendSMS = new SendSmsGeneral(AdsId, smsSetting, smsConfiguration, "CAMPAIGN", true, smsSentSavingDetials))
        //        //{
        //        //    foreach (string contactNumber in ReportToNumber.Split(','))
        //        //    {
        //        //        Contact contact = new Contact() { PhoneNumber = contactNumber.Trim() };
        //        //        sendSMS.SendSms(contact, Guid.NewGuid().ToString());
        //        //    }
        //        //}
        //        List<SmsSent> smsSentList = null;
        //        //SmsSent objsmsSent = null;
        //        IBulkSmsSending SmsGeneralBaseFactory = Plumb5GenralFunction.SmsGeneralBaseFactory.GetSMSVendor(AdsId, smsConfiguration, "campaign");
        //        foreach (string contactNumber in ReportToNumber.Split(','))
        //        {
        //            SmsSent objsmsSent = new SmsSent();
        //            objsmsSent.MessageContent = SMSContent.ToString();
        //            objsmsSent.SmsTemplateId = 0;
        //            objsmsSent.GroupId = 0;
        //            objsmsSent.PhoneNumber = contactNumber.Trim();
        //            objsmsSent.VendorTemplateId = smsNotificationTemplate.VendorTemplateId;
        //            smsSentList.Add(objsmsSent);
        //            SmsGeneralBaseFactory.SendBulkSms(smsSentList);
        //        }
        //    }

        //    //UpdatePricingCount("SMSAlerts", ReportToNumber.Split(',').Count());
        //}

        public void UpdatePricingCount(string FeatureActionName, int IncrementCounter)
        {
            //using (BLPurchase objpurchase = new BLPurchase())
            //{
            //    objpurchase.UpdatePricingCount(AdsId, FeatureActionName, IncrementCounter);
            //}
        }

        public void ReportThroughCall(string PhoneNumber, int FormId, FormResponseReportToSetting responseSetting, List<FormFields> formFields, Object[] answerList, string FormHeading)
        {
            string AgentPhoneNumber = "";

            if (responseSetting.ReportToDetailsByPhoneCall != null && responseSetting.ReportToDetailsByPhoneCall.Length > 0)
            {
                try
                {
                    JObject jObject = JObject.Parse(responseSetting.ReportToDetailsByPhoneCall);
                    int DependencyFieldId = Convert.ToInt32((string)jObject["DependencyFieldId"]);

                    //UnConditional
                    if (DependencyFieldId <= 0)
                    {
                        AgentPhoneNumber = (string)jObject["UnconditionalPhoneNumber"];
                    }
                    else if (DependencyFieldId > 0)
                    {
                        JToken[] SubFieldList = jObject["Subfields"].ToArray();

                        //Conditional
                        if (SubFieldList != null && SubFieldList.Length > 0)
                        {
                            var answerIndex = formFields.FindIndex(x => x.Id == DependencyFieldId);

                            if (answerIndex > -1)
                            {
                                string AnswerdValue = answerList[answerIndex].ToString().Trim();

                                if (!string.IsNullOrEmpty(AnswerdValue))
                                {
                                    for (int i = 0; i < SubFieldList.Length; i++)
                                    {
                                        var values = JObject.Parse(SubFieldList[i].ToString()).ToObject<Dictionary<string, string>>();

                                        if (values.ContainsKey(AnswerdValue))
                                        {
                                            AgentPhoneNumber = values[AnswerdValue];
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    //Final Calling Part
                    if (!String.IsNullOrEmpty(AgentPhoneNumber))
                    {
                        PhonecallCalling phoneDetails = new PhonecallCalling(AdsId, PhoneNumber, AgentPhoneNumber);
                        phoneDetails.Call(FormId);
                    }
                }
                catch (Exception ex)
                {
                    Helper.SendMailOnMajorError("Report Through Call ==> Account " + AdsId.ToString() + "", "CaptureForm", ex.ToString());
                }
            }
        }

        #endregion Private Method For storing Data


        #endregion Response Action

        public async Task<Tuple<string, string, string, string, string, string, string, Tuple<string, string, string>>> GetVisitorDetails(string MachineId)
        {
            using (var obj = DLCustomDetailsFormTracking.GetDLCustomDetailsFormTracking(AdsId, sQlVendor))
            {
                return await obj.GetVisitorDetails(MachineId);
            }
        }
    }
}
