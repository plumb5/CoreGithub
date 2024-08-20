using P5GenralDL;
using P5GenralML;
using Plumb5GenralFunction;
using Google.Ads.GoogleAds.Config;
using Google.Ads.GoogleAds.Lib;
using Google.Ads.GoogleAds.V16.Services;
using Google.Ads.GoogleAds;
using Google.Ads.Gax.Examples;
using Google.Ads.GoogleAds.V16.Common;
using static Google.Ads.GoogleAds.V16.Enums.CustomerMatchUploadKeyTypeEnum.Types;
using Google.Ads.GoogleAds.V16.Resources;
using Google.Ads.GoogleAds.V14.Errors;

namespace Plumb5.Areas.GoogleAds.Models
{
    public class GoogleAdsConnector
    {
        public async Task<CreateGooglList> CreateList(int AccountId, string CustomerId, string Name, string Description,string DbType)
        {
            CustomerId = CustomerId.Replace("-", "");
            GoogleAdsClient client =await getGoogleClient(AccountId, CustomerId, DbType);
            long customerId = long.Parse(CustomerId);

            if (client != null && customerId > 0)
            {
                return CreateCustomerMatchUserList(client, customerId, Name, Description);
            }
            else
            {
                CreateGooglList list_result = new CreateGooglList();
                list_result.Sucess = false;
                list_result.List = "Something goes wrong";

                return list_result;
            }
        }
        public async Task<List<GooglList>> GetAllList(int AccountId, string CustomerId, string DbType)
        {
            CustomerId = CustomerId.Replace("-", "");
            List<GooglList> g_list = new List<GooglList>();
            try
            {
                long customerId = long.Parse(CustomerId);
                GoogleAdsClient client =await getGoogleClient(AccountId, CustomerId, DbType);
                if (client != null && customerId > 0)
                {

                    GoogleAdsServiceClient googleAdsService = client.GetService(Services.V16.GoogleAdsService);

                    string query = "SELECT  user_list.id, user_list.name,user_list.size_for_display,user_list.size_for_search  FROM user_list";// WHERE user_list.similar_user_list.seed_user_list = SEED_LIST_RESOURCE_NAME; 

                    googleAdsService.SearchStream(customerId.ToString(), query,
                               delegate (SearchGoogleAdsStreamResponse resp)
                               {
                                   foreach (GoogleAdsRow googleAdsRow in resp.Results)
                                   {
                                       GooglList list = new GooglList();
                                       list.Id = googleAdsRow.UserList.Id;
                                       list.Name = googleAdsRow.UserList.Name;
                                       g_list.Add(list);
                                   }

                               }
                           );
                }
            }
            catch { }
            return g_list;
        }
        private CreateGooglList CreateCustomerMatchUserList(GoogleAdsClient client, long customerId, string name, string description)
        {
            try
            {
                // Get the UserListService.
                UserListServiceClient service = client.GetService(Services.V16.UserListService);

                // Creates the user list.
                UserList userList = new UserList()
                {
                    Name = name,
                    Description = description,
                    //Name = $"Customer Match list# {ExampleUtilities.GetShortRandomString()}",
                    //Description = "A list of customers that originated from email and physical" +
                    //    " addresses",
                    // Customer Match user lists can use a membership life span of 10000 to
                    // indicate unlimited; otherwise normal values apply.
                    // Sets the membership life span to 30 days.
                    MembershipLifeSpan = 30,
                    CrmBasedUserList = new CrmBasedUserListInfo()
                    {
                        UploadKeyType = CustomerMatchUploadKeyType.ContactInfo
                    }
                };
                // Creates the user list operation.
                UserListOperation operation = new UserListOperation()
                {
                    Create = userList
                };

                // Issues a mutate request to add the user list and prints some information.
                MutateUserListsResponse response = service.MutateUserLists(
                    customerId.ToString(), new[] { operation });
                string userListResourceName = response.Results[0].ResourceName;
                //Console.WriteLine($"User list with resource name '{userListResourceName}' " +
                //    $"was created.");

                var listSpl = userListResourceName.Split('/');

                string listid = "";
                if ((listSpl != null) && listSpl.Length > 3)
                    listid = listSpl[3].ToString();


                CreateGooglList list_result = new CreateGooglList();
                list_result.Sucess = true;
                list_result.List = listid;

                return list_result;
            }
            catch
            {
                CreateGooglList list_result = new CreateGooglList();
                list_result.Sucess = false;
                list_result.List = "Something goes wrong";

                return list_result;
            }
        }
        public async Task<GoogleAdsClient> getGoogleClient(int AccountId, string CustomerId,string DbType)
        {
            GoogleAdsClient client = null;
            try
            {
                CustomerId = CustomerId.Replace("-", "");
                GoogleToken googleToken = null;
                using (var obj = DLGoogleToken.GetDLGoogleToken(AccountId, DbType))
                    googleToken =await obj.Get();

                if (googleToken != null)
                {
                    //var GTM_client_id = "683399030434-tstdhpf4ohto4g3hr1gsc5lins2kbjm5.apps.googleusercontent.com";
                    //var GTM_client_secret = "loPoTyn1JQWnH6f5FxaC9SkU";           
                    //var Google_developer_token = "ZEFzEHyOyaZh2ri_2mA7wg";
                    //var customerId = "8414445544";
                    //var Google_refresh_token = "1//0gVSLfak_wEmWCgYIARAAGBASNwF-L9Ir5-_4sq2m9R0vktFWaHE-cUiWTrj5Ts-E21BCv7vLsGg72LMm8uMyEhlqsMYdIMbKisU";

                    var GTM_client_id = AllConfigURLDetails.KeyValueForConfig["GAPI_CLIENT_ID"].ToString();
                    var GTM_client_secret = AllConfigURLDetails.KeyValueForConfig["GTM_CLIENT_SECRET"].ToString();
                    var Google_developer_token = AllConfigURLDetails.KeyValueForConfig["GOOGLE_DEVELOPER_TOKEN"].ToString();

                    var customerId = CustomerId;
                    var Google_refresh_token = googleToken.RefreshToken;

                    GoogleAdsConfig config = new GoogleAdsConfig()
                    {
                        Timeout = 2000,
                        DeveloperToken = Google_developer_token,
                        OAuth2Mode = Google.Ads.Gax.Config.OAuth2Flow.APPLICATION,
                        OAuth2ClientId = GTM_client_id,
                        OAuth2ClientSecret = GTM_client_secret,
                        OAuth2RefreshToken = Google_refresh_token,
                        LoginCustomerId = customerId
                    };

                    client = new GoogleAdsClient(config);
                }
            }
            catch { }
            return client;
        }

        public string GetGoogleAccessToken(int accountId, string googleresponsesname, string CustomerId)
        {
            string status = "";
            try
            {

                var GTM_client_id = "683399030434-tstdhpf4ohto4g3hr1gsc5lins2kbjm5.apps.googleusercontent.com";
                var GTM_client_secret = "loPoTyn1JQWnH6f5FxaC9SkU";//
                var GTM_redirect_url = "http://localhost:12347";
                var Google_Accounts_url = "https://accounts.google.com/o/oauth2/token";


                var Google_refresh_token = "1//0g9YzrSosO5ErCgYIARAAGBASNwF-L9IrUJToR8v_DAsv9eNfOZoOpWml3oLNQHZdhthGuGMiTq7HvqTPrTEBpulqhxZL6g9txiY";

                //GoogleTagManagerAccessToken GTMAccTkn = null;
                //string retval = string.Empty;
                //HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(Google_Accounts_url);
                //webRequest.Method = "POST";
                //string Parameters = "code=" + code + "&client_id=" + GTM_client_id + "&client_secret=" + GTM_client_secret + "&redirect_uri=" + GTM_redirect_url + "&grant_type=authorization_code";
                //byte[] byteArray = Encoding.UTF8.GetBytes(Parameters);
                //webRequest.ContentType = "application/x-www-form-urlencoded";
                //webRequest.ContentLength = byteArray.Length;
                //Stream postStream = webRequest.GetRequestStream();
                //// Add the post data to the web request
                //postStream.Write(byteArray, 0, byteArray.Length);
                //postStream.Close();

                //WebResponse response = webRequest.GetResponse();
                //postStream = response.GetResponseStream();
                //StreamReader reader = new StreamReader(postStream);
                //string responseFromServer = reader.ReadToEnd();

                //GTMAccTkn = JsonConvert.DeserializeObject<GoogleTagManagerAccessToken>(responseFromServer);

                //// Detailed logs.
                ////TraceUtilities.Configure(TraceUtilities.DETAILED_REQUEST_LOGS_SOURCE,
                ////    "C:\\logs\\details.txt", System.Diagnostics.SourceLevels.All);

                ////// Summary logs.
                ////TraceUtilities.Configure(TraceUtilities.SUMMARY_REQUEST_LOGS_SOURCE,
                ////    "C:\\logs\\details1.txt", System.Diagnostics.SourceLevels.All);

                var customerId = CustomerId;//8414445544 "2295722405"
                                            //7822558078
                GoogleAdsConfig config = new GoogleAdsConfig()
                {
                    Timeout = 2000,
                    DeveloperToken = "ZEFzEHyOyaZh2ri_2mA7wg",
                    OAuth2Mode = Google.Ads.Gax.Config.OAuth2Flow.APPLICATION,
                    OAuth2ClientId = GTM_client_id,
                    OAuth2ClientSecret = GTM_client_secret,
                    OAuth2RefreshToken = Google_refresh_token,
                    LoginCustomerId = customerId
                };

                GoogleAdsClient client = new GoogleAdsClient(config);

                //TargetAdsInAdGroupToUserList(client, long.Parse(customerId), long.Parse("333"), "customers/"+ customerId + "/userLists/333");

                //CreateCustomerMatchUserList(client, long.Parse(customerId));

                // AddUsersToCustomerMatchUserList(client, long.Parse(customerId), "customers/8414445544/userLists/8606928652", true, null, null, null);

                try
                {
                    GoogleAdsServiceClient googleAdsService = client.GetService(Services.V16.GoogleAdsService);

                    // Retrieve all campaigns.//campaign.network_settings.target_content_network
                    //string query = @"SELECT campaign.id,campaign.name FROM campaign ORDER BY campaign.id";

                    //string query = "SELECT  user_list.id,  user_list.name,user_list.size_for_display,user_list.size_for_search  FROM user_list";// WHERE user_list.similar_user_list.seed_user_list = SEED_LIST_RESOURCE_NAME; 

                    //string query = "SELECT  * FROM user_list";

                    string query = "SELECT offline_user_data_job.resource_name, offline_user_data_job.id, offline_user_data_job.status, offline_user_data_job.type, offline_user_data_job.failure_reason FROM offline_user_data_job WHERE offline_user_data_job.resource_name IN ('" + googleresponsesname + "')";

                    //string query = "SELECT offline_user_data_job.failure_reason FROM offline_user_data_job";

                    //string query = "SELECT  audience.id,  audience.resource_name,  audience.name,  audience.status,  audience.description,  audience.dimensions,  audience.exclusion_dimension FROM audience";

                    //string query = "SELECT * FROM user_list";

                    //String query = "SELECT customer_client.id,customer_client.descriptive_name, customer_client.client_customer,customer_client.status FROM customer_client where customer_client.id="+ customerId; //customer_client.descriptive_name, customer_client.client_customer,customer_client.status

                    // var customerId = "8414445544";
                    //Issue a search request.
                    googleAdsService.SearchStream(customerId.ToString(), query,
                        delegate (SearchGoogleAdsStreamResponse resp)
                        {
                            // Extract the request ID from the response.
                            //string requestId = resp.RequestId;
                            foreach (GoogleAdsRow googleAdsRow in resp.Results)
                            {

                                status = googleAdsRow.OfflineUserDataJob.Status.ToString();
                            }

                        }
                    );
                }
                catch (GoogleAdsException e)
                {
                    string requestId = e.RequestId;
                }

            }
            catch (Exception ex)
            {
                var error = ex.Message;
            }
            return status;
        }
    }



    public class GooglList
    {
        public long Id { get; set; }
        public string Name { get; set; }

    }

    public class CreateGooglList
    {
        public bool Sucess { get; set; }
        public string List { get; set; }

    }
}
