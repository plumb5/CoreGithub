using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Plumb5GenralFunction;
using System.Net;
using System.Text;

namespace Plumb5.Areas.GoogleAds.Models
{
    public class GoogleTagManagerAccessToken
    {
        public string access_token { get; set; }
        public string token_type { get; set; }
        public int expires_in { get; set; }
        public string id_token { get; set; }
        public string refresh_token { get; set; }
    }

    public class P5GAPIManager : IDisposable
    {
        private readonly string GTM_client_id = string.Empty;
        private readonly string GTM_client_secret = string.Empty;
        private readonly string GTM_APIKey = string.Empty;
        private readonly string GTM_redirect_url = string.Empty;
        private readonly string Google_Accounts_url = string.Empty;


        public P5GAPIManager()
        {
            GTM_client_id = AllConfigURLDetails.KeyValueForConfig["GAPI_CLIENT_ID"].ToString();//
            GTM_client_secret = AllConfigURLDetails.KeyValueForConfig["GTM_CLIENT_SECRET"].ToString();//
            GTM_APIKey = AllConfigURLDetails.KeyValueForConfig["GTM_APIKEY"].ToString();//
            GTM_redirect_url = AllConfigURLDetails.KeyValueForConfig["GTM_REDIRECT_URL"].ToString();//
            Google_Accounts_url = AllConfigURLDetails.KeyValueForConfig["GOOGLE_ACCOUNTS_URL"].ToString(); //https://accounts.google.com/o/oauth2/token
        }

        public GoogleTagManagerAccessToken getAccessToken(string authorizationCode)
        {
            GoogleTagManagerAccessToken GTMAccTkn = null;
            string retval = string.Empty;
            try
            {
                //get the access token 
                HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(Google_Accounts_url);
                webRequest.Method = "POST";
                string Parameters = "code=" + authorizationCode + "&client_id=" + GTM_client_id + "&client_secret=" + GTM_client_secret + "&redirect_uri=" + GTM_redirect_url + "&grant_type=authorization_code";
                byte[] byteArray = Encoding.UTF8.GetBytes(Parameters);
                webRequest.ContentType = "application/x-www-form-urlencoded";
                webRequest.ContentLength = byteArray.Length;
                Stream postStream = webRequest.GetRequestStream();
                // Add the post data to the web request
                postStream.Write(byteArray, 0, byteArray.Length);
                postStream.Close();

                WebResponse response = webRequest.GetResponse();
                postStream = response.GetResponseStream();
                StreamReader reader = new StreamReader(postStream);
                string responseFromServer = reader.ReadToEnd();

                GTMAccTkn = JsonConvert.DeserializeObject<GoogleTagManagerAccessToken>(responseFromServer);
                return GTMAccTkn;
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("GoogleTagManagerAccessToken"))
                    objError.AddError(ex.Message.ToString(), "Get google access token details error", DateTime.Now.ToString(), "getAccessToken", ex.ToString());
            }
            return GTMAccTkn;
        }
        public string getGTMAccounts(string access_token)
        {
            string responseFromServer = string.Empty;
            try
            {

                string APIString = AllConfigURLDetails.KeyValueForConfig["GOOGLE_API_BASE_URL"].ToString() + "/accounts?access_token=" + access_token + "&key=" + GTM_APIKey;
                HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(APIString);
                webRequest.Method = "GET";
                webRequest.ContentType = "application/json";
                WebResponse response = webRequest.GetResponse();
                StreamReader reader = new StreamReader(response.GetResponseStream());
                responseFromServer = reader.ReadToEnd();


                string APIString1 = AllConfigURLDetails.KeyValueForConfig["GOOGLE_API_BASE_URL"].ToString() + "/client_customer?access_token=" + access_token + "&key=" + GTM_APIKey;
                HttpWebRequest webRequest1 = (HttpWebRequest)WebRequest.Create(APIString1);
                webRequest1.Method = "GET";
                webRequest1.ContentType = "application/json";
                WebResponse response1 = webRequest1.GetResponse();
                StreamReader reader1 = new StreamReader(response1.GetResponseStream());
                responseFromServer = reader1.ReadToEnd();
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("GoogleTagManagerAccessToken"))
                    objError.AddError(ex.Message.ToString(), "get google tag manager accounts", DateTime.Now.ToString(), "getGTMAccounts", ex.ToString());
            }
            return responseFromServer;
        }
        public string getGTMContainers(string accountpath, string access_token)
        {
            string responseFromServer = string.Empty;
            try
            {

                string APIString = AllConfigURLDetails.KeyValueForConfig["GOOGLE_API_BASE_URL"].ToString() + "/" + accountpath + "/containers?access_token=" + access_token;
                HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(APIString);
                webRequest.Method = "GET";
                webRequest.ContentType = "application/json";
                WebResponse response = webRequest.GetResponse();
                StreamReader reader = new StreamReader(response.GetResponseStream());
                responseFromServer = reader.ReadToEnd();

            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("GoogleTagManagerAccessToken"))
                    objError.AddError(ex.Message.ToString(), "get google tag manager containers", DateTime.Now.ToString(), "getGTMContainers", ex.ToString());
            }
            return responseFromServer;
        }
        public string getGTMWorkSpace(string containerpath, string access_token)
        {
            string responseFromServer = string.Empty;
            try
            {

                string APIString = AllConfigURLDetails.KeyValueForConfig["GOOGLE_API_BASE_URL"].ToString() + "/" + containerpath + "/workspaces?access_token=" + access_token;
                HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(APIString);
                webRequest.Method = "GET";
                webRequest.ContentType = "application/json";
                WebResponse response = webRequest.GetResponse();
                StreamReader reader = new StreamReader(response.GetResponseStream());
                responseFromServer = reader.ReadToEnd();

            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("GoogleTagManagerAccessToken"))
                    objError.AddError(ex.Message.ToString(), "get google tag manager workspace", DateTime.Now.ToString(), "getGTMWorkSpace", ex.ToString());
            }
            return responseFromServer;
        }
        public string getGTMTags(string workspcpath, string access_token)
        {
            string responseFromServer = string.Empty;
            try
            {

                string APIString = AllConfigURLDetails.KeyValueForConfig["GOOGLE_API_BASE_URL"].ToString() + "/" + workspcpath + "/tags?access_token=" + access_token;
                HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(APIString);
                webRequest.Method = "GET";
                webRequest.ContentType = "application/json";
                WebResponse response = webRequest.GetResponse();
                StreamReader reader = new StreamReader(response.GetResponseStream());
                responseFromServer = reader.ReadToEnd();

            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("GoogleTagManagerAccessToken"))
                    objError.AddError(ex.Message.ToString(), "get gtm tags", DateTime.Now.ToString(), "getGTMTags", ex.ToString());
            }
            return responseFromServer;
        }
        public string addPlumb5Tag(string workspcpath, string sTagName, string p5Script, string access_token)
        {
            string result = "{}";
            try
            {
                //create trigger
                string APIString = AllConfigURLDetails.KeyValueForConfig["GOOGLE_API_BASE_URL"].ToString() + "/" + workspcpath + "/triggers?access_token=" + access_token;
                HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(APIString);
                webRequest.Method = "POST";
                webRequest.ContentType = "application/json";
                webRequest.Accept = "application/json";
                string Parameters = "{ \"name\": \"trg_" + sTagName + "\", \"type\":\"pageview\"}";
                byte[] byteArray = Encoding.UTF8.GetBytes(Parameters);
                webRequest.ContentLength = byteArray.Length;
                Stream postStream = webRequest.GetRequestStream();
                postStream.Write(byteArray, 0, byteArray.Length);
                postStream.Close();
                WebResponse response = webRequest.GetResponse();
                StreamReader reader = new StreamReader(response.GetResponseStream());
                JToken responseFromServer = JObject.Parse(reader.ReadToEnd());
                string striggerID = Convert.ToString(responseFromServer.SelectToken("triggerId"));

                ////create tag
                APIString = AllConfigURLDetails.KeyValueForConfig["GOOGLE_API_BASE_URL"].ToString() + "/" + workspcpath + "/tags?access_token=" + access_token;
                webRequest = (HttpWebRequest)WebRequest.Create(APIString);
                webRequest.Method = "POST";
                webRequest.ContentType = "application/json";
                webRequest.Accept = "application/json";
                Parameters = "{\"name\": \"" + sTagName + "\",\"type\": \"html\",\"firingTriggerId\": [\"" + striggerID + "\"],\"parameter\": [{\"type\": \"template\",\"value\":\"" + p5Script + "\",\"key\":\"html\"}]}";
                byteArray = Encoding.UTF8.GetBytes(Parameters);
                webRequest.ContentLength = byteArray.Length;
                postStream = webRequest.GetRequestStream();
                postStream.Write(byteArray, 0, byteArray.Length);
                postStream.Close();
                response = webRequest.GetResponse();
                result = reader.ReadToEnd();

            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("GoogleTagManagerAccessToken"))
                    objError.AddError(ex.Message.ToString(), "add plumb5 tags", DateTime.Now.ToString(), "AddPlumb5Tag", ex.ToString());
            }
            return result;
        }
        public string deletePlumb5Tag(string Tagpath, string access_token)
        {
            string responseFromServer = string.Empty;
            try
            {
                string APIString = AllConfigURLDetails.KeyValueForConfig["GOOGLE_API_BASE_URL"].ToString() + "/" + Tagpath + "?access_token=" + access_token;
                HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(APIString);
                webRequest.Method = "DELETE";
                webRequest.ContentType = "application/json";
                WebResponse response = webRequest.GetResponse();
                StreamReader reader = new StreamReader(response.GetResponseStream());
                responseFromServer = reader.ReadToEnd();
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("GoogleTagManagerAccessToken"))
                    objError.AddError(ex.Message.ToString(), "delete plumb5 tags", DateTime.Now.ToString(), "DeletePlumb5Tag", ex.ToString());
            }
            return responseFromServer;
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


