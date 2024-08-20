using IP5GenralDL;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5GenralFunction;
using RestSharp;
using System.Collections.Specialized;
using System.Net;
using System.Text;

namespace Plumb5.Areas.Mail.Models
{
    public class CheckSpamAssassinDetails : IDisposable
    {
        private readonly string? sqlVendor;

        public CheckSpamAssassinDetails(string? sqlVendor)
        {
            this.sqlVendor = sqlVendor;
        }

        public Tuple<string, string> GetSpamScore(string FromName, string FromEmailId, string Subject, string BodyContent, int Id, int AdsId, string ProviderName, MailConfiguration mailconfig)
        {
            ProviderName = ProviderName.ToLower().Trim().Replace(" ", "");
            Tuple<string, string> result = null;
            try
            {
                if (ProviderName == "mailtester")
                {
                    result = MailTester(ProviderName, FromName, FromEmailId, Subject, BodyContent, Id, AdsId, mailconfig);
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SpamCheck"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "Plumb5.Areas.Mail.Models-CheckSpamAssassinDetails-GetSpamScore", ex.ToString());
                }
            }
            return result;
        }

        public string Interval(string ToMailAddress)
        {
            string responseFromServer = "";
            try
            {
                ServicePointManager.Expect100Continue = true;
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

                string url = AllConfigURLDetails.KeyValueForConfig["MAILTESTERACCOUNTURL"] + ToMailAddress + "&format=json";
                WebRequest request = WebRequest.Create(url);
                request.Method = "GET";
                request.Timeout = 60000;//1 Minute
                WebResponse response = request.GetResponse();
                Stream dataStream = response.GetResponseStream();
                StreamReader reader = new StreamReader(dataStream);
                responseFromServer = reader.ReadToEnd();
                return responseFromServer;
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SpamCheck"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "Plumb5.Areas.Mail.Models-CheckSpamAssassinDetails-Interval", ex.ToString());
                }
                responseFromServer = "";
            }
            return responseFromServer;
        }

        public bool SendMail(MailConfiguration mailConfigration, string ToMailAddress, string FromEmailId, string FromName, string Subject, string BodyContent, int AdsId, bool IsHtml = true)
        {
            try
            {
                if (mailConfigration != null && mailConfigration.ProviderName.ToLower() == "elastic mail")
                {
                    NameValueCollection mailValues = new NameValueCollection();

                    mailValues.Add("username", mailConfigration.AccountName);
                    mailValues.Add("api_key", mailConfigration.ApiKey);
                    mailValues.Add("from", FromEmailId);
                    mailValues.Add("from_name", FromName);
                    mailValues.Add("subject", Subject);

                    if (BodyContent != null && IsHtml)
                    {
                        mailValues.Add("body_html", BodyContent);
                    }
                    else
                    {
                        mailValues.Add("body_text", BodyContent);
                    }
                    mailValues.Add("to", ToMailAddress);

                    using (WebClient client = new WebClient())
                    {
                        client.UploadValues(AllConfigURLDetails.KeyValueForConfig["ELASTICEMAIL"].ToString(), mailValues);
                    }
                    return true;
                }
                else if (mailConfigration != null && mailConfigration.ProviderName.ToLower() == "netcore falconide")
                {
                    NameValueCollection mailValues = new NameValueCollection();
                    mailValues.Add("api_key", mailConfigration.ApiKey);
                    mailValues.Add("from", FromEmailId);
                    mailValues.Add("fromname", FromName);
                    mailValues.Add("subject", Subject);
                    mailValues.Add("content", BodyContent);
                    mailValues.Add("recipients", ToMailAddress);
                    using (WebClient client = new WebClient())
                    {
                        byte[] response = client.UploadValues(AllConfigURLDetails.KeyValueForConfig["NETCOREFALCONIDE"].ToString(), mailValues);

                        string data = Encoding.UTF8.GetString(response).ToLower();
                        JObject stuff = JObject.Parse(data);

                        if (stuff["message"].ToString().ToLower() == "success")
                            return true;
                    }
                }
                else if (mailConfigration != null && mailConfigration.ProviderName.ToLower() == "everlytic" && !string.IsNullOrEmpty(mailConfigration.ConfigurationUrl))
                {
                    JObject EverlyticObject = EverlyticParameters(BodyContent, ToMailAddress, Subject, FromEmailId);
                    string jsonString = JsonConvert.SerializeObject(EverlyticObject);

                    var resetClient = new RestClient(mailConfigration.ConfigurationUrl);
                    var request = new RestRequest(Method.POST);
                    request.AddHeader("content-type", "application/json");
                    var AuthKey = Helper.Base64Encode("" + mailConfigration.AccountName + ":" + mailConfigration.ApiKey + "");
                    request.AddHeader("authorization", "Basic " + AuthKey);
                    request.AddParameter("application/json", jsonString, ParameterType.RequestBody);
                    IRestResponse response = resetClient.Execute(request);
                    if (response.StatusCode == HttpStatusCode.Created)
                    {
                        return true;
                    }
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SpamCheck"))
                {
                    objError.AddError(ex.Message.ToString(), mailConfigration != null ? mailConfigration.ProviderName : "", DateTime.Now.ToString(), "Plumb5.Areas.Mail.Models-CheckSpamAssassinDetails-SendMail", ex.ToString());
                }
                return false;
            }
            return false;
        }
        private JObject EverlyticParameters(string Body, string ToEmailId, string subjectBody, string FromEmailId)
        {
            Everlytic_RootObject RootObject = new Everlytic_RootObject();

            Everlytic_Body everlytic_Body = new Everlytic_Body();
            everlytic_Body.html = Body.ToString();
            everlytic_Body.text = "";

            RootObject.body = everlytic_Body;

            Everlytic_Headers everlytic_Headers = new Everlytic_Headers();
            everlytic_Headers.subject = subjectBody.ToString();

            var toEmail = new Dictionary<string, string>();
            toEmail.Add(ToEmailId, "");

            everlytic_Headers.to = toEmail;

            var fromEmail = new Dictionary<string, string>();
            fromEmail.Add(FromEmailId, "");

            everlytic_Headers.from = fromEmail;

            var replyToEmail = new Dictionary<string, string>();
            replyToEmail.Add(FromEmailId, FromEmailId);

            everlytic_Headers.reply_to = replyToEmail;

            RootObject.headers = everlytic_Headers;

            JObject jObj = JObject.FromObject(RootObject);
            return jObj;
        }

        public Tuple<string, string> MailTester(string ProviderName, string FromName, string FromEmailId, string Subject, string BodyContent, int Id, int AdsId, MailConfiguration mailconfig)
        {
            string MailtestAccount = AllConfigURLDetails.KeyValueForConfig["MAILTESTERACCOUNTNAME"].ToString();
            bool result = false;
            Tuple<string, string> responseData = null;
            if (MailtestAccount != null && MailtestAccount != string.Empty)
            {
                BodyContent = BodyContent.Replace("<$P5MailUniqueID$>", "Test");
                string dateTime = DateTime.Now.ToString("ddMMyyyyHHmmssfff");
                string ToEmail = dateTime + "@mail-tester.com";
                string ToMailAddress = MailtestAccount + "-" + ToEmail;

                MailSetting mailSetting = new MailSetting { Subject = Subject, FromEmailId = FromEmailId, FromName = FromName, MessageBodyText = BodyContent };
                IBulkMailSending MailGeneralBaseFactory = Plumb5GenralFunction.MailGeneralBaseFactory.GetMailVendor(AdsId, mailSetting, null, mailconfig, "MailTrack", "campaign");
                result = MailGeneralBaseFactory.SendSpamScoreMail(ToMailAddress, BodyContent);

                //result = SendMail(mailconfig, ToMailAddress, FromEmailId, FromName, Subject, BodyContent, AdsId);

                if (result)
                {
                    string data = "";
                    for (int i = 1; i <= 10; i++)
                    {
                        data = Interval(ToMailAddress);
                        if (!string.IsNullOrEmpty(data))
                        {
                            dynamic jobj = JObject.Parse(data);
                            string score = jobj.displayedMark;
                            if (score == null || score == string.Empty)
                            {
                                Thread.Sleep(20000);
                            }
                            else
                            {
                                double CurrentScore = 0;
                                if (score.IndexOf("/") > -1)
                                {
                                    CurrentScore = Convert.ToDouble(score.Split('/')[0]);
                                }

                                using (var obj = DLMailTemplate.GetDLMailTemplate(AdsId, this.sqlVendor))
                                {
                                    MailTemplate details = new MailTemplate { Id = Id, SpamScore = CurrentScore, ContentFromSpamAssassin = Convert.ToString(JObject.Parse(data)) };
                                    obj.UpdateSpamScore(details);
                                }
                                responseData = new Tuple<string, string>(data, ToMailAddress);
                                break;
                            }
                        }
                    }
                    responseData = new Tuple<string, string>(data, ToMailAddress);
                }
            }
            return responseData;
        }

        #region Dispose Method
        private bool _disposed = false;
        protected void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                _disposed = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
        }
        #endregion End of Dispose Method
    }
}
