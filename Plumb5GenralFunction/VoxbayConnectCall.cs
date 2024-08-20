using P5GenralDL;
using P5GenralML;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class VoxbayConnectCall : IClickToCallVendor
    {
        private string from = String.Empty;
        private string to = String.Empty;
        private string ApiKey = String.Empty;
        private string ApiToken = String.Empty;
        private string CallerId = String.Empty;
        private string Extension = String.Empty;
        private string ConfigurationUrl = String.Empty;

        private readonly int AdsId;
        private readonly MLCallApiConfiguration mLCallApiConfiguration;
        private string AgentPhoneNumberWithoutCC;
        public string ErrorMessage { get; set; }
        public MLCallVendorResponse VendorResponses { get; set; }
        private Guid guid;

        public VoxbayConnectCall(string from, string to, string ApiKey, string ApiToken, string CallerId, string Extension, string ConfigurationUrl)
        {
            this.from = from.Substring(0, 2).Contains("91") && from.Length > 10 ? from : "91" + from;
            this.to = to.Substring(0, 2).Contains("91") && to.Length > 10 ? to : "91" + to;
            this.ApiKey = ApiKey;
            this.ApiToken = ApiToken;
            this.CallerId = CallerId;
            this.Extension = Extension;
            this.ConfigurationUrl = ConfigurationUrl;
        }

        public VoxbayConnectCall(int adsId, MLCallApiConfiguration callApiConfiguration, string agentPhoneNumberWithoutCC)
        {
            AdsId = adsId;
            guid = Guid.NewGuid();
            mLCallApiConfiguration = callApiConfiguration;
            AgentPhoneNumberWithoutCC = agentPhoneNumberWithoutCC;
        }

        public async Task<bool> ConnectAgentToCustomer(string AgentPhoneNumber, string CustomerPhoneNumber,string SQLProvider)
        {
            bool result =await CallInitiate(AgentPhoneNumber, CustomerPhoneNumber, SQLProvider);

            var MLCallVendorResponse = new MLCallVendorResponse();

            if (result)
            {
                MLCallVendorResponse.Called_Sid = Convert.ToString(guid);
                MLCallVendorResponse.CalledDate = DateTime.Now;
                MLCallVendorResponse.PhoneNumber = CustomerPhoneNumber;
                MLCallVendorResponse.CalledNumber = AgentPhoneNumber;
                MLCallVendorResponse.P5UniqueId = guid.ToString();
                MLCallVendorResponse.ErrorMessage = ErrorMessage;
                MLCallVendorResponse.SendStatus = 1;

            }
            else
            {
                MLCallVendorResponse.Called_Sid = "";
                MLCallVendorResponse.CalledDate = DateTime.Now;
                MLCallVendorResponse.PhoneNumber = CustomerPhoneNumber;
                MLCallVendorResponse.CalledNumber = AgentPhoneNumber;
                MLCallVendorResponse.P5UniqueId = guid.ToString();
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
                PhoneCallCallerIdExtension phoneCallCallerIdExtension = new PhoneCallCallerIdExtension();
                using ( var objDL =  DLPhoneCallCallerIdExtension.GetDLPhoneCallCallerIdExtension(AdsId, SQLProvider))
                {
                    if (AgentPhoneNumberWithoutCC != null)
                        phoneCallCallerIdExtension = await objDL.GetByPhone(AgentPhoneNumberWithoutCC);
                    else
                        phoneCallCallerIdExtension = await objDL.GetByPhone(AgentPhoneNumber);
                }

                if (phoneCallCallerIdExtension is null)
                {
                    ErrorMessage = "No caller id or extension found";
                    return Status;
                }

                String postString = mLCallApiConfiguration.ConfigurationUrl + "?uid=" + mLCallApiConfiguration.ApiKey + "&pin=" + mLCallApiConfiguration.ApiToken + "&source=" + AgentPhoneNumber + "&destination=" + CustomerPhoneNumber + "&ext=" + phoneCallCallerIdExtension.Extension + "&callerid=" + phoneCallCallerIdExtension.CallerId + "&param1=" + guid.ToString();
                var resetClient = new RestClient(postString);
                var request = new RestRequest(Method.POST);
                var AuthKey = Helper.Base64Encode("" + ApiKey + ":" + ApiToken + "");
                request.AddHeader("authorization", "Basic " + AuthKey);
                request.AddParameter("application/json", ParameterType.RequestBody);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                IRestResponse response = resetClient.Execute(request);
                if (response is null)
                {
                    ErrorMessage = "Response not found";
                    return Status;
                }

                string res = Convert.ToString(response.Content);
                if (!String.IsNullOrEmpty(res) && res.Contains("success"))
                    Status = true;
                else
                    ErrorMessage = "Call not Initated error from";


                return Status;

            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
                using (ErrorUpdation objError = new ErrorUpdation("VoxbayConnectCall"))
                    objError.AddError(ex.ToString(), "", DateTime.Now.ToString(), "Error", ex.StackTrace.ToString());
                return false;
            }
        }


        public bool connectCustomerToAgent()
        {
            bool Status = false;
            try
            {
                //postString = String.Empty;

                //Skyline Customisation
                //extension = from.Contains("9061261777") ? "777" : from.Contains("7356920111") ? "111" : from.Contains("7356920222") ? "222" : "";
                //CallerId = from.Contains("9061261777") ? "914844224801" : from.Contains("7356920111") ? "914844224802" : from.Contains("7356920222") ? "914844224803" : "";

                String postString = ConfigurationUrl + "?uid=" + ApiKey + "&pin=" + ApiToken + "&source=" + this.from + "&destination=" + this.to + "&ext=" + Extension + "&callerid=" + CallerId;
                //var resetClient = new RestClient("http://182.74.2.93/api/clicktocall.php" + postString);
                //var resetClient = new RestClient("https://pbx.voxbaysolutions.com/api/clicktocall.php" + postString);
                var resetClient = new RestClient(postString);
                var request = new RestRequest(Method.POST);
                var AuthKey = Helper.Base64Encode("" + ApiKey + ":" + ApiToken + "");
                request.AddHeader("authorization", "Basic " + AuthKey);
                request.AddParameter("application/json", ParameterType.RequestBody);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                IRestResponse response = resetClient.Execute(request);
                if (response != null)
                {
                    string res = Convert.ToString(response.Content);
                    if (!String.IsNullOrEmpty(res) && res.Contains("success"))
                        Status = true;
                }
                return Status;
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("VoxbayConnectCall"))
                {
                    objError.AddError(ex.ToString(), "", DateTime.Now.ToString(), "Error", ex.StackTrace.ToString());
                }
                return false;
            }
        }
    }
}
