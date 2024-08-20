using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class MCubeResponses
    {
        public string status { get; set; }
        public string msg { get; set; }
        public string callid { get; set; }
    }


    public class MCubeClickToCall : IClickToCallVendor
    {
        private readonly MLCallApiConfiguration _callApiConfiguration;
        private readonly int AccountId;
        private MCubeResponses mcubbeResponses = null;
        public string ErrorMessage { get; set; }
        public MLCallVendorResponse VendorResponses { get; set; }

        public MCubeClickToCall(int adsId, MLCallApiConfiguration callApiConfiguration)
        {
            AccountId = adsId;
            _callApiConfiguration = callApiConfiguration;

        }

        public async Task<bool> ConnectAgentToCustomer(string AgentPhoneNumber, string CustomerPhoneNumber, string SQLProvider)
        {
            if (AgentPhoneNumber.Length > 10)
                AgentPhoneNumber = AgentPhoneNumber.Remove(0, 2);


            if (CustomerPhoneNumber.Length > 10)
                CustomerPhoneNumber = CustomerPhoneNumber.Remove(0, 2);

            bool result = await CallInitiate(AgentPhoneNumber, CustomerPhoneNumber, SQLProvider);

            var MLCallVendorResponse = new MLCallVendorResponse();

            if (result)
            {
                MLCallVendorResponse.Called_Sid = mcubbeResponses.callid;
                MLCallVendorResponse.CalledDate = DateTime.Now;
                MLCallVendorResponse.PhoneNumber = CustomerPhoneNumber;
                MLCallVendorResponse.CalledNumber = AgentPhoneNumber;
                MLCallVendorResponse.P5UniqueId = Guid.NewGuid().ToString();
                MLCallVendorResponse.ErrorMessage = mcubbeResponses.msg;
                MLCallVendorResponse.SendStatus = 1;

            }
            else
            {
                if (mcubbeResponses != null)
                {
                    MLCallVendorResponse.Called_Sid = mcubbeResponses.callid;
                    MLCallVendorResponse.CalledDate = DateTime.Now;
                    MLCallVendorResponse.PhoneNumber = CustomerPhoneNumber;
                    MLCallVendorResponse.CalledNumber = AgentPhoneNumber;
                    MLCallVendorResponse.P5UniqueId = Guid.NewGuid().ToString();
                    MLCallVendorResponse.SendStatus = 0;
                    ErrorMessage = MLCallVendorResponse.ErrorMessage = mcubbeResponses.msg;
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
                }
            }

            VendorResponses = MLCallVendorResponse;

            return result;
        }

        private async Task<bool> CallInitiate(string AgentPhoneNumber, string CustomerPhoneNumber,string SQLProvider)
        {
            bool result = false;
            try
            {
                PhoneCallCallerIdExtension phoneCallCallerIdExtension = new PhoneCallCallerIdExtension();
                using (var objBL =   DLPhoneCallCallerIdExtension.GetDLPhoneCallCallerIdExtension(AccountId, SQLProvider))
                    phoneCallCallerIdExtension = await objBL.GetByPhone(AgentPhoneNumber);

                if (phoneCallCallerIdExtension is null)
                {
                    ErrorMessage = "No caller id or extension found";
                    return result;
                }

                var client = new HttpClient();
                var request = new HttpRequestMessage(HttpMethod.Post, _callApiConfiguration.ConfigurationUrl);
                request.Headers.Add("Authorization", $"Bearer {_callApiConfiguration.ApiToken}");
                var content = new MultipartFormDataContent();
                content.Add(new StringContent(AgentPhoneNumber), "exenumber");
                content.Add(new StringContent(CustomerPhoneNumber), "custnumber");
                content.Add(new StringContent(phoneCallCallerIdExtension.CallerId), "gid");
                request.Content = content;
                var task = client.SendAsync(request);
                task.Wait();

                var response = task.Result;
                var responseString = response.Content.ReadAsStringAsync();
                responseString.Wait();
                mcubbeResponses = JsonConvert.DeserializeObject<MCubeResponses>(responseString.Result);
                ErrorMessage = mcubbeResponses.status;

                if (mcubbeResponses.status == "false") { result = false; ErrorMessage = mcubbeResponses.msg; }
                else { result = true; }

            }
            catch (Exception ex)
            {
                mcubbeResponses = new MCubeResponses { msg = ex.Message };
                ErrorMessage = ex.Message;
                using (ErrorUpdation objError = new ErrorUpdation("MCubeClickToCall"))
                    objError.AddError(ex.Message.ToString(), "Call Initiated", DateTime.Now.ToString(), "MCubeClickToCall-->CallInitiated", ex.ToString(), false);
            }

            return result;
        }
    }
}