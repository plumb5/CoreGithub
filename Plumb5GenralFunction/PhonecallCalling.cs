using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class PhonecallCalling
    {
        int AdsId;
        MLCallApiConfiguration callApiConfiguration;
        string _AgentPhoneNumberWithoutCC;
        string _VisitorPhoneNumber;
        string _AgentPhoneNumber;
        public string ErrorMessage;
        private int LmsGroupId;
        private int Score;
        private string Leadlabel;
        private int ContactId;
        private int UserInfoUserId;
        private string CampaignJobName;
        private string Publisher;
        private int LmsGroupMemberId;
        private string SQLProvider;
        private Task _dataTask;
        public PhonecallCalling(int adsId, string VisitorPhoneNumber, string AgentPhoneNumber, int contactId = 0, int lmsGroupId = 0, int score = -1, string leadlabel = "", string AgentPhoneNumberWithoutCC = null, int userInfoUserId = 0, string campaignJobName = null, string publisher = null, int lmsGroupMemberId = 0, string SqlProvider = null)
        {

            AdsId = adsId;
            _VisitorPhoneNumber = VisitorPhoneNumber;
            _AgentPhoneNumber = AgentPhoneNumber;
            _AgentPhoneNumberWithoutCC = AgentPhoneNumberWithoutCC;
            LmsGroupId = lmsGroupId;
            Score = score;
            Leadlabel = leadlabel;
            ContactId = contactId;
            UserInfoUserId = userInfoUserId;
            CampaignJobName = campaignJobName;
            Publisher = publisher;
            LmsGroupMemberId = lmsGroupMemberId;
            SQLProvider = SqlProvider;
            _dataTask = FetchDataAsync();
        }
        
        public async Task GetDataAsync()
        {
            await _dataTask;
        }
        private async Task FetchDataAsync()
        {
            using (var objApiConfig =   DLCallApiConfiguration.GetDLCallApiConfiguration(AdsId,SQLProvider))
                callApiConfiguration =await  objApiConfig.GetCallConfigurationDetails();
        }
        public async Task <bool> Call(int formId = 0)
        {
            if (callApiConfiguration != null)
            {
                IClickToCallVendor callInitiate = CallGeneralBaseFactory.GetCallVendor(AdsId, callApiConfiguration, _AgentPhoneNumberWithoutCC);
                bool result = await callInitiate.ConnectAgentToCustomer(_AgentPhoneNumber, _VisitorPhoneNumber,SQLProvider);
                ErrorMessage = callInitiate.ErrorMessage;

                if (result && callInitiate.VendorResponses != null)
                {
                    PhoneCallResponses phoneCallResponses = new PhoneCallResponses()
                    {
                        Called_Sid = callInitiate.VendorResponses.Called_Sid,
                        CalledDate = callInitiate.VendorResponses.CalledDate,
                        PhoneNumber = callInitiate.VendorResponses.PhoneNumber,
                        CalledNumber = callInitiate.VendorResponses.CalledNumber,
                        LmsGroupId = LmsGroupId,
                        Score = Score,
                        LeadLabel = Leadlabel,
                        ContactId = ContactId,
                        P5UniqueId = callInitiate.VendorResponses.P5UniqueId,
                        ErrorMessage = callInitiate.VendorResponses.ErrorMessage,
                        SendStatus = callInitiate.VendorResponses.SendStatus,
                        UserInfoUserId = UserInfoUserId,
                        CampaignJobName = CampaignJobName,
                        Publisher = Publisher,
                        LmsGroupMemberId = LmsGroupMemberId

                    };

                    using (var objDLPhoneCallResponses =   DLPhoneCallResponses.GetDLPhoneCallResponses(AdsId, SQLProvider))
                        await objDLPhoneCallResponses.Save(phoneCallResponses);
                }
                else
                {
                    PhoneCallResponses phoneCallResponses = new PhoneCallResponses()
                    {
                        Called_Sid = "",
                        CalledDate = DateTime.Now,
                        PhoneNumber = callInitiate.VendorResponses.PhoneNumber,
                        CalledNumber = callInitiate.VendorResponses.CalledNumber,
                        LmsGroupId = LmsGroupId,
                        Score = Score,
                        LeadLabel = Leadlabel,
                        ContactId = ContactId,
                        P5UniqueId = Guid.NewGuid().ToString(),
                        ErrorMessage = callInitiate.ErrorMessage,
                        SendStatus = 0,
                        UserInfoUserId = UserInfoUserId,
                        CampaignJobName = CampaignJobName,
                        Publisher = Publisher,
                        LmsGroupMemberId = LmsGroupMemberId
                    };

                    using (var objDLPhoneCallResponses = DLPhoneCallResponses.GetDLPhoneCallResponses(AdsId, SQLProvider))
                        await objDLPhoneCallResponses.Save(phoneCallResponses);
                }

                return result;
            }
            else
            {
                ErrorMessage = "Call setting not found";
                return false;
            }

        }
    }
}