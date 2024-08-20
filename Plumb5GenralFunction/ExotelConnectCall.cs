using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Plumb5GenralFunction
{

    public class ExotelConnectCall : IClickToCallVendor
    {
        private int AdsId = 0;
        private string from = String.Empty;
        private string to = String.Empty;
        private string AccountSid = String.Empty;
        private string ApiKey = String.Empty;
        private string ApiToken = String.Empty;
        private string SubDomain = String.Empty;
        private string CallerId = String.Empty;
        private string ConfigurationUrl = String.Empty; 

        private readonly MLCallApiConfiguration mLCallApiConfiguration;
        public string ErrorMessage { get; set; }
        public MLCallVendorResponse VendorResponses { get; set; }

        public ExotelConnectCall(int AdsId, string from, string to, string AccountSid, string ApiKey, string ApiToken, string SubDomain, string CallerId, string ConfigurationUrl)
        {
            this.AdsId = AdsId;
            this.from = from;
            this.to = to;
            this.AccountSid = AccountSid;
            this.ApiKey = ApiKey;
            this.ApiToken = ApiToken;
            this.SubDomain = SubDomain;
            this.CallerId = CallerId;
            this.ConfigurationUrl = ConfigurationUrl;
        }

        public ExotelConnectCall(int adsId, MLCallApiConfiguration callApiConfiguration)
        {
            AdsId = adsId;
            mLCallApiConfiguration = callApiConfiguration;
        } 
        public async Task<bool> ConnectAgentToCustomer(string AgentPhoneNumber, string CustomerPhoneNumber, string SQLProvider)
        {
            bool result = await CallInitiate(AgentPhoneNumber, CustomerPhoneNumber,SQLProvider);

            var MLCallVendorResponse = new MLCallVendorResponse();

            if (result)
            {
                MLCallVendorResponse.Called_Sid = "";
                MLCallVendorResponse.CalledDate = DateTime.Now;
                MLCallVendorResponse.PhoneNumber = CustomerPhoneNumber;
                MLCallVendorResponse.CalledNumber = AgentPhoneNumber;
                MLCallVendorResponse.P5UniqueId = Guid.NewGuid().ToString();
                MLCallVendorResponse.ErrorMessage = ErrorMessage;
                MLCallVendorResponse.SendStatus = 1;

            }
            else
            {
                MLCallVendorResponse.Called_Sid = "";
                MLCallVendorResponse.CalledDate = DateTime.Now;
                MLCallVendorResponse.PhoneNumber = CustomerPhoneNumber;
                MLCallVendorResponse.CalledNumber = AgentPhoneNumber;
                MLCallVendorResponse.P5UniqueId = Guid.NewGuid().ToString();
                MLCallVendorResponse.ErrorMessage = ErrorMessage;
                MLCallVendorResponse.SendStatus = 0;
                ErrorMessage = MLCallVendorResponse.ErrorMessage = ErrorMessage;
            }

            VendorResponses = MLCallVendorResponse;

            return result;
        }

        private async Task<bool> CallInitiate(string AgentPhoneNumber, string CustomerPhoneNumber,string SQLProvider)
        {
            bool Status = false;
            try
            {
                String postString = "?From=" + AgentPhoneNumber + "&To=" + CustomerPhoneNumber + "&CallerId=" + mLCallApiConfiguration.CallerId + "&CallType=trans&Record=true&RecordingChannels=single&CustomField=" + AdsId + "&StatusCallback=" + HttpUtility.UrlEncode(AllConfigURLDetails.KeyValueForConfig["EXOTELCALLBACKPATH"].ToString()) + "&StatusCallbackEvents[0]=terminal&StatusCallbackContentType=application/json";

                var resetClient = new RestClient("https://" + mLCallApiConfiguration.ApiKey + ":" + mLCallApiConfiguration.ApiToken + "" + mLCallApiConfiguration.SubDomain + "/v1/Accounts/" + mLCallApiConfiguration.AccountName + "/Calls/connect.json" + postString);
                //var resetClient = new RestClient(postString);
                var request = new RestRequest(Method.POST);
                var AuthKey = Helper.Base64Encode("" + ApiKey + ":" + ApiToken + "");
                request.AddHeader("authorization", "Basic " + AuthKey);
                request.AddParameter("application/json", ParameterType.RequestBody);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                IRestResponse response = resetClient.Execute(request);

                if (response != null)
                {
                    string res = Convert.ToString(response.Content);

                    if (!String.IsNullOrEmpty(res))
                    {
                        dynamic obj = JsonConvert.DeserializeObject(res);
                        if (obj != null)
                        {
                            //Previously made table
                            PhoneCallResponses phoneCallResponses = new PhoneCallResponses() { Called_Sid = (obj.Call.Sid.Value).ToString(), CalledDate = DateTime.ParseExact((obj.Call.DateCreated.Value).ToString(), "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture), PhoneNumber = to, CalledNumber = from, CalledStatus = (obj.Call.Status.Value).ToString(), DownLoadStatus = false };
                            using (var objDLPhoneCallResponses =   DLPhoneCallResponses.GetDLPhoneCallResponses(AdsId, SQLProvider))
                                phoneCallResponses.Id =await objDLPhoneCallResponses.Save(phoneCallResponses);

                            if (phoneCallResponses.Id > 0)
                                Status = true;
                            else
                                ErrorMessage = "Call not Initated";
                        }
                    }
                }
                return Status;
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
                using (ErrorUpdation objError = new ErrorUpdation("ExotelConnectCall"))
                {
                    objError.AddError(ex.ToString(), "", DateTime.Now.ToString(), "Error", ex.StackTrace.ToString());
                }
                return Status;
            }
        }
    }
}
