using Google.Ads.GoogleAds.Lib;
using Google.Ads.GoogleAds;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.GoogleAds.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Net;
using System.Text;
using Google.Ads.GoogleAds.V16.Errors;
using Google.Ads.GoogleAds.V16.Services;
using Plumb5.Areas.GoogleAds.Dto;

namespace Plumb5.Areas.GoogleAds.Controllers
{
    [Area("GoogleAds")]
    public class SettingsController : BaseController
    {
        public SettingsController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("Settings");
        }
        [HttpPost]
        public async Task<JsonResult> InsertDetails([FromBody] Settings_InsertDetailsDto objDto)
        {
            int result = 0;
            using (var objDL = DLGooglAccountSettings.GetDLGooglAccountSettings(objDto.AdsId, SQLProvider))
            {
                result =await objDL.Save(objDto.googlAccountsettings);
            }
            return Json(result);

        }
        [HttpPost]
        public async Task<JsonResult> UpdateDetails([FromBody] Settings_UpdateDetailsDto objDto)
        {
            bool result = false;

            using (var objDL = DLGooglAccountSettings.GetDLGooglAccountSettings(objDto.AdsId,SQLProvider))
            {
                result =await objDL.Update(objDto.googlAccountsettings);
            }
            return Json(result);


        }
        [HttpPost]
        public async Task<JsonResult> GetGooglAccountSettingsDetails([FromBody] Settings_GetGooglAccountSettingsDetailsDto objDto)
        {
            List<GooglAccountSettings> GooglAccountSettingsData = null;


            using (var objDL = DLGooglAccountSettings.GetDLGooglAccountSettings(objDto.AdsId,SQLProvider))
            {
                GooglAccountSettingsData =await objDL.GetDetails(objDto.Id);
            }
            return Json(GooglAccountSettingsData);

        }
        [HttpPost]
        public async Task<JsonResult> Delete([FromBody] Settings_DeleteDto objDto)
        {
            using (var objDL = DLGooglAccountSettings.GetDLGooglAccountSettings(objDto.AdsId,SQLProvider))
            {
                return Json(await objDL.Delete(objDto.Id));
            }
        }


        [HttpPost]
        public async Task<JsonResult> GetGoogleAccessToken([FromBody] Settings_GetGoogleAccessTokenDto objDto)
        {
            bool Result = false;
            try
            {
                var getCustomerId = objDto.CustomerId.Replace("-", "");
                var GTM_client_id = AllConfigURLDetails.KeyValueForConfig["GAPI_CLIENT_ID"].ToString();
                var GTM_client_secret = AllConfigURLDetails.KeyValueForConfig["GTM_CLIENT_SECRET"].ToString();
                var GTM_redirect_url = AllConfigURLDetails.KeyValueForConfig["GTM_REDIRECT_URL"].ToString();

                //var GTM_client_id = "683399030434-tstdhpf4ohto4g3hr1gsc5lins2kbjm5.apps.googleusercontent.com";
                //var GTM_client_secret = "loPoTyn1JQWnH6f5FxaC9SkU";//
                //var GTM_redirect_url = "http://localhost:12000";
                var Google_Accounts_url = "https://accounts.google.com/o/oauth2/token";


                Plumb5GenralFunction.GoogleTagManagerAccessToken GTMAccTkn = null;
                string retval = string.Empty;
                HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(Google_Accounts_url);
                webRequest.Method = "POST";
                string Parameters = "code=" + objDto.code + "&client_id=" + GTM_client_id + "&client_secret=" + GTM_client_secret + "&redirect_uri=" + GTM_redirect_url + "&grant_type=authorization_code";
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

                GTMAccTkn = JsonConvert.DeserializeObject<Plumb5GenralFunction.GoogleTagManagerAccessToken>(responseFromServer);

                if (GTMAccTkn != null)
                {

                    using (var obj = DLGoogleToken.GetDLGoogleToken(objDto.accountId,SQLProvider))
                    {
                       await obj.Save(new GoogleToken { AccessToken = GTMAccTkn.access_token, RefreshToken = GTMAccTkn.refresh_token });
                    }

                    List<GooglList> g_list = new List<GooglList>();
                    long customerId = long.Parse(getCustomerId);
                    GoogleAdsConnector gac = new GoogleAdsConnector();
                    GoogleAdsClient client =await gac.getGoogleClient(objDto.accountId, objDto.CustomerId,SQLProvider);
                    if (client != null && customerId > 0)
                    {

                        GoogleAdsServiceClient googleAdsService = client.GetService(Services.V16.GoogleAdsService);

                        //string query = "SELECT  user_list.id, user_list.name,user_list.size_for_display,user_list.size_for_search  FROM user_list";// WHERE user_list.similar_user_list.seed_user_list = SEED_LIST_RESOURCE_NAME; 
                        String query = "SELECT customer_client.id,customer_client.descriptive_name, customer_client.client_customer,customer_client.status FROM customer_client where customer_client.id=" + customerId;

                        try
                        {
                            googleAdsService.SearchStream(customerId.ToString(), query,
                                       async delegate (SearchGoogleAdsStreamResponse resp)
                                       {
                                           if (resp.Results.Count > 0)
                                           {
                                               using (var objDL = DLGooglAccountSettings.GetDLGooglAccountSettings(objDto.accountId,SQLProvider))
                                               {
                                                   await objDL.ChangeStatusadwords(objDto.GetId, true);
                                                   Result = true;
                                               }
                                           }

                                       }
                                   );
                        }
                        catch (GoogleAdsException e)
                        {
                            using (var objDL = DLGooglAccountSettings.GetDLGooglAccountSettings(objDto.accountId,SQLProvider))
                            {
                               await objDL.ChangeStatusadwords(objDto.GetId, false);
                            }

                            string requestId = e.RequestId;
                        }
                    }


                }

            }
            catch (GoogleAdsException e)
            {
                using (var objDL = DLGooglAccountSettings.GetDLGooglAccountSettings(objDto.accountId,SQLProvider))
                {
                   await objDL.ChangeStatusadwords(objDto.GetId, false);
                }

                string requestId = e.RequestId;
            }

            return Json(Result);
        }
    }
}
