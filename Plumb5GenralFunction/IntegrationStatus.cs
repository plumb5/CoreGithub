using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class IntegrationStatus
    {
        public bool WebTracking { get; set; }
        public bool EventTracking { get; set; }
        public bool EmailSetup { get; set; }
        public bool SiteSearch { get; set; }
        public bool EmailVerification { get; set; }
        public bool SpamTester { get; set; }
        public bool SmsSetup { get; set; }
        public bool WebPushTracking { get; set; }
        public bool MobileSdkTracking { get; set; }
        public bool ClickToCallSetup { get; set; }
        public bool WhatsAppSetup { get; set; }
        public string SqlProvider { get; } 
        readonly int AdsId = 0;


        public IntegrationStatus(int adsid, string sqlProvider)
        {
            AdsId = adsid;
            SqlProvider = sqlProvider;
        }
         
        public async Task<IntegrationStatus> GetIntegrationStatus(int AccountId)
        {
            IntegrationStatus objStatus = new IntegrationStatus(AccountId, SqlProvider);
            objStatus.WebTracking =await GetWebTracking(AccountId);
            objStatus.EventTracking = await GetEventTracking(AccountId);
            objStatus.EmailSetup = await GetEmailSetup(AccountId);
            objStatus.SiteSearch = await GetSiteSearch(AccountId);
            objStatus.EmailVerification = await GetEmailVerification(AccountId);
            objStatus.SpamTester = await GetSpamTester(AccountId);
            objStatus.SmsSetup = await  GetSmsSetup(AccountId);
            objStatus.WebPushTracking = await GetWebPushTracking(AccountId);
            objStatus.MobileSdkTracking = await GetMobileTracking(AccountId);
            objStatus.ClickToCallSetup = await GetClickToCallSetup(AccountId);
            objStatus.WhatsAppSetup = await GetWhatsAppSetup(AccountId);

            return objStatus;
        }

        public async Task<bool> GetWebTracking(int AccountId)
        {
            var result = false;
            using (var objStatus =   DLIntegrationStatus.GetDLIntegrationStatus(AccountId, SqlProvider))
            {
                if (await objStatus.GetWebTracking() > 0)
                {
                    //using (DLAccount objAccount = new DLAccount())
                    //{
                    //    var Account = objAccount.GetAccountDetails(AccountId);
                    //    var domain = Account.DomainName.ToLower().IndexOf("http") > -1 ? Account.DomainName : "http://" + Account.DomainName;

                    //    //VerifyingScript script = new VerifyingScript();
                    //    //result = script.IsScriptExistsInThePage(domain, Account.TrackerDomain);//"https://src.plumb5.com/"
                    //}
                    result = true;
                }
            }
            return result;
        }

        public async Task<bool> GetEventTracking(int AccountId)
        {
            var result = false;
            using (var objStatus =   DLIntegrationStatus.GetDLIntegrationStatus(AccountId,SqlProvider))
            {
                result = await objStatus.GetEventTracking() > 0 ? true : false;
            }
            return result;
        }

        public async Task<bool> GetEmailSetup(int AccountId)
        {
            var result = false;
            using (var objStatus = DLIntegrationStatus.GetDLIntegrationStatus(AccountId, SqlProvider))
            {
                if (await objStatus.GetEmailSetup() > 0)
                {
                    List<MailConfiguration> mailConfigurationDetails = null;

                    using (var objmailconfig =   DLMailConfiguration.GetDLMailConfiguration(AccountId,SqlProvider))
                    {
                        string ProviderName = "elastic mail";
                        mailConfigurationDetails = await objmailconfig.GetDetailsByProviderName(ProviderName);

                        if (mailConfigurationDetails != null && mailConfigurationDetails.Count > 0)
                        {
                            if (mailConfigurationDetails.Any(x => x.ActiveStatus))
                            {
                                List<MLMailAutheintication> DomainDetailsList = null;
                                using (var objDL =   DLMailAutheintication.GetMailAutheintication(AccountId,SqlProvider))
                                {
                                    DomainDetailsList = await objDL.GET(new MLMailAutheintication());
                                    if (DomainDetailsList != null && DomainDetailsList.Count > 0)
                                    {
                                        if (DomainDetailsList[0].SPF == 1 && DomainDetailsList[0].DMKI == 1)
                                        {
                                            result = true;
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            result = true;
                        }
                    }
                }
            }
            return result;
        }

        public async Task<bool> GetSiteSearch(int AccountId)
        {
            var result = false;
            using (  var objStatus =   DLIntegrationStatus.GetDLIntegrationStatus(AccountId,SqlProvider))
            {
                result = await objStatus.GetSiteSearch() > 0 ? true : false;
            }
            return result;
        }

        public async Task<bool> GetEmailVerification(int AccountId)
        {
            var result = false;
            using (var objStatus = DLIntegrationStatus.GetDLIntegrationStatus(AccountId, SqlProvider))
            {
                result = await objStatus.GetEmailVerification() > 0 ? true : false;
            }
            return result;
        }

        public async Task<bool> GetSpamTester(int AccountId)
        {
            var result = false;
            using (var objStatus = DLIntegrationStatus.GetDLIntegrationStatus(AccountId, SqlProvider))
            {
                result = await objStatus.GetSpamTester() > 0 ? true : false;
            }
            return result;
        }

        public async Task<bool> GetSmsSetup(int AccountId)
        {
            var result = false;
            using (var objStatus = DLIntegrationStatus.GetDLIntegrationStatus(AccountId, SqlProvider))
            {
                result = await objStatus.GetSmsSetup() > 0 ? true : false;
            }
            return result;
        }
        public async Task<bool> GetWebPushTracking(int AccountId)
        {

            var result = false;
            using (var objStatus =   DLIntegrationStatus.GetDLIntegrationStatus(AccountId,SqlProvider))
            {
                var webpushSettings = await objStatus.GetWebPushTracking();
                if ((webpushSettings != null) && webpushSettings.HttpOrHttpsPush != null)
                {
                    result = true;
                    //var httppushdomain = Plumb5GenralFunction.AllConfigURLDetails.KeyValueForConfig["PUSH_MAIN_DOMAIN"].ToString();
                    //string geturl = "";

                    //if(httppushdomain == "HTTP")
                    //{
                    //    geturl= webpushSettings.Step2ConfigurationSubDomain + "." + httppushdomain;
                    //}
                    //else
                    //{
                    //    using (DLAccount objAccount = new DLAccount())
                    //    {
                    //        var Account = objAccount.GetAccountDetails(AccountId);
                    //        var domain = Account.DomainName.ToLower().Replace("http://","").IndexOf("https://") > -1 ? Account.DomainName : "https://" + Account.DomainName;
                    //        geturl = domain+ "/p5_Sw_Direct.js";
                    //    }
                    //}

                    //if (IsValidURL(geturl))
                    //{
                    //    result = true;
                    //}
                }
            }
            return result;
        }

        public async Task<bool> GetMobileTracking(int AccountId)
        {
            var result = false;
            using (var objStatus =  DLIntegrationStatus.GetDLIntegrationStatus(AccountId,SqlProvider))
            {
                result = await objStatus.GetMobileSdkTracking() > 0 ? true : false;
            }
            return result;
        }

        public async Task<bool> GetClickToCallSetup(int AccountId)
        {
            var result = false;
            using (var objStatus = DLIntegrationStatus.GetDLIntegrationStatus(AccountId, SqlProvider))
            {
                result = await objStatus.GetClickToCallSetup() > 0 ? true : false;
            }
            return result;
        }

        public async Task<bool> GetWhatsAppSetup(int AccountId)
        {
            var result = false;
            using (var objStatus = DLIntegrationStatus.GetDLIntegrationStatus(AccountId, SqlProvider))
            {
                result =await objStatus.GetWhatsAppSetup() > 0 ? true : false;
            }
            return result;
        }

        public async Task<bool> IsValidURL(string URL)
        {
            try
            {
                WebClient wc = new WebClient();
                string HTMLSource = wc.DownloadString(URL);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
