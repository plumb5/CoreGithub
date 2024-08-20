using IP5GenralDL;
using Newtonsoft.Json;
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
    public class MillionVerifierResponse
    {
        public string email { get; set; }
        public string result { get; set; }
        public int resultcode { get; set; }
        public string subresult { get; set; }
        public bool free { get; set; }
        public bool role { get; set; }
        public string didyoumean { get; set; }
        public int credits { get; set; }
        public int executiontime { get; set; }
        public string error { get; set; }
    }

    public class VerifyMillionVerifierEmailContact : IDisposable, IBulkVerifyEmailContact
    {
        EmailVerifyProviderSetting verifyProvider;
        public List<MLEmailVerifierVendorResponse> VendorResponses { get; set; }

        string ApiUrl;
        public VerifyMillionVerifierEmailContact(EmailVerifyProviderSetting currentverifiedConfiguration)
        {
            verifyProvider = currentverifiedConfiguration;
            VendorResponses = new List<MLEmailVerifierVendorResponse>();
            ApiUrl = $"{AllConfigURLDetails.KeyValueForConfig["EMAIL_MILLIONVERIFIER_API_URL"].ToString()}?api={AllConfigURLDetails.KeyValueForConfig["EMAIL_MILLIONVERIFIER_APIKEY"].ToString()}";
        }

        public void VerifyBulkContact(List<Contact> contactList)
        {

            foreach (var contact in contactList)
            {
                MLEmailVerifierVendorResponse mLEmailVerifierVendorResponse = new MLEmailVerifierVendorResponse();
                try
                {

                    string url = $"{ApiUrl}&email={contact.EmailId}&timeout=10";
                    Tuple<string, bool> result = VerifySingleEmailIdByUrl(url);
                    MillionVerifierResponse response = JsonConvert.DeserializeObject<MillionVerifierResponse>(result.Item1);
                    if (response != null && result.Item2)
                    {
                        mLEmailVerifierVendorResponse.ContactId = contact.ContactId;
                        mLEmailVerifierVendorResponse.EmailId = contact.EmailId;
                        mLEmailVerifierVendorResponse.Result = result.Item2;
                        mLEmailVerifierVendorResponse.Message = response.result;
                        mLEmailVerifierVendorResponse.IsVerifiedMailId = GetStatus(response.result);
                    }
                    else
                    {
                        mLEmailVerifierVendorResponse.ContactId = contact.ContactId;
                        mLEmailVerifierVendorResponse.EmailId = contact.EmailId;
                        mLEmailVerifierVendorResponse.Result = result.Item2;
                        mLEmailVerifierVendorResponse.Message = "Response not found from vendor side";
                        mLEmailVerifierVendorResponse.IsVerifiedMailId = null;
                    }
                    VendorResponses.Add(mLEmailVerifierVendorResponse);
                }
                catch (Exception ex)
                {
                    mLEmailVerifierVendorResponse.ContactId = contact.ContactId;
                    mLEmailVerifierVendorResponse.EmailId = contact.EmailId;
                    mLEmailVerifierVendorResponse.Result = false;
                    mLEmailVerifierVendorResponse.Message = ex.Message;
                    mLEmailVerifierVendorResponse.IsVerifiedMailId = null;
                    VendorResponses.Add(mLEmailVerifierVendorResponse);
                }
            }
        }

        private short GetStatus(string result)
        {
            short IsVerifiedMailId = -1;
            switch (result.ToLower())
            {
                case "ok":
                    IsVerifiedMailId = 1;
                    break;
                case "catch_all":
                    IsVerifiedMailId = 0;
                    break;
                case "unknown":
                    IsVerifiedMailId = 0;
                    break;
                case "error":
                    IsVerifiedMailId = 0;
                    break;
                case "disposable":
                    IsVerifiedMailId = 0;
                    break;
                case "invalid":
                    IsVerifiedMailId = 0;
                    break;
                default:
                    IsVerifiedMailId = -1;
                    break;
            }

            return IsVerifiedMailId;
        }

        private Tuple<string, bool> VerifySingleEmailIdByUrl(string url)
        {
            bool Result = false;
            string resonseMessage = string.Empty;
            try
            {
                var client = new RestClient(url);
                var request = new RestRequest(Method.GET);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                IRestResponse response = client.Execute(request);
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    resonseMessage = response.Content;
                    Result = true;
                }
                else
                {
                    resonseMessage = response.Content;
                    Result = false;
                }
            }
            catch (Exception ex)
            {
                Result = false;
                resonseMessage = ex.Message.ToString();
            }
            return Tuple.Create(resonseMessage, Result);
        }

        #region Dispose Method

        bool _disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {

                }
            }
            //dispose unmanaged resources
            _disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
