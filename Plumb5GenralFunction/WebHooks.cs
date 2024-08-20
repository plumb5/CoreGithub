using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class WebHooks
    {
        int AdsId;
        string Result = "";
        string Referrer, PageUrl, Domain, Heading, City = "", SourceKey, CallingSource;
        private readonly string SqlVendor;

        public WebHooks(int adsId, string referrer, string pageUrl, string domain, string heading, string city, string sourcekey, string callingSource, string sqlVendor)
        {
            AdsId = adsId;
            Referrer = referrer;
            PageUrl = pageUrl;
            Domain = domain;
            Heading = heading;
            City = city;
            SourceKey = sourcekey;
            CallingSource = callingSource;
            SqlVendor = sqlVendor;
        }

        public async void UrlData(Object[] answer, List<FormFields> fieldList, string WebHookFinalUrl)
        {
            try
            {
                Contact contact = new Contact();
                if (fieldList != null && fieldList.Count > 0 && fieldList.Any(item => (item.FieldType == 2 || item.FieldType == 3)))
                {
                    int emailIndex = fieldList.FindIndex(item => item.FieldType == 2);
                    int phoneIndex = fieldList.FindIndex(item => item.FieldType == 3);
                    if (emailIndex > -1 && phoneIndex > -1 && answer.Length > emailIndex && answer[emailIndex] != null && answer.Length > phoneIndex && answer[phoneIndex] != null && !string.IsNullOrEmpty(answer[emailIndex].ToString()) && !string.IsNullOrEmpty(answer[phoneIndex].ToString()))
                    {
                        contact.EmailId = answer[emailIndex].ToString();
                        contact.PhoneNumber = answer[phoneIndex].ToString();
                    }
                    else if (emailIndex > -1 && answer.Length > emailIndex && answer[emailIndex] != null && !string.IsNullOrEmpty(answer[emailIndex].ToString()))
                    {
                        contact.EmailId = answer[emailIndex].ToString();
                    }
                    else if (phoneIndex > -1 && answer.Length > phoneIndex && answer[phoneIndex] != null && !string.IsNullOrEmpty(answer[phoneIndex].ToString()))
                    {
                        contact.PhoneNumber = answer[phoneIndex].ToString();
                    }
                    using (var ObjBl = DLContact.GetContactDetails(AdsId, SqlVendor))
                    {
                        contact = await ObjBl.GetDetails(contact);
                    }
                }

                if (WebHookFinalUrl.IndexOf("||") > -1)
                {
                    string[] WebhookFinalUrlSplitted = WebHookFinalUrl.Split(new string[] { "||" }, StringSplitOptions.None);

                    for (int i = 0; i < WebhookFinalUrlSplitted.Length; i++)
                    {
                        ReplaceAndPost(WebhookFinalUrlSplitted[i], fieldList, answer, contact);
                    }
                }
                else
                {
                    ReplaceAndPost(WebHookFinalUrl, fieldList, answer, contact);
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation err = new ErrorUpdation("WebhookErrorLogWhileSplitingUrl" + AdsId.ToString()))
                {
                    err.AddError(ex.ToString(), "", DateTime.Now.ToString(), "", ex.InnerException.ToString());
                }
            }
        }

        private void ReplaceAndPost(string FinalUrl, List<FormFields> fieldList, Object[] answer, Contact contact)
        {
            string replacedWebHookContent = FinalUrl.Replace("[", "").Replace("]", "");

            int count = replacedWebHookContent.Count(x => x == '{');

            if (count > 0)
            {
                if (replacedWebHookContent.IndexOf("referrer", StringComparison.InvariantCultureIgnoreCase) > -1)
                    replacedWebHookContent = Regex.Replace(replacedWebHookContent, "{referrer}", Referrer != null && Referrer.Length > 1 ? Referrer : "", RegexOptions.IgnoreCase);
                if (replacedWebHookContent.IndexOf("pageurl", StringComparison.InvariantCultureIgnoreCase) > -1)
                    replacedWebHookContent = Regex.Replace(replacedWebHookContent, "{pageurl}", PageUrl, RegexOptions.IgnoreCase);
                if (replacedWebHookContent.IndexOf("ticker", StringComparison.InvariantCultureIgnoreCase) > -1)
                    replacedWebHookContent = Regex.Replace(replacedWebHookContent, "{ticker}", "Got Lead Form " + Domain + "", RegexOptions.IgnoreCase);
                if (replacedWebHookContent.IndexOf("city", StringComparison.InvariantCultureIgnoreCase) > -1)
                    replacedWebHookContent = Regex.Replace(replacedWebHookContent, "{city}", City != null && City.Length > 1 ? City : "", RegexOptions.IgnoreCase);
                if (replacedWebHookContent.IndexOf("title", StringComparison.InvariantCultureIgnoreCase) > -1)
                    replacedWebHookContent = Regex.Replace(replacedWebHookContent, "{title}", "Got Lead Form " + Domain + "", RegexOptions.IgnoreCase);
                if (replacedWebHookContent.IndexOf("heading", StringComparison.InvariantCultureIgnoreCase) > -1)
                    replacedWebHookContent = Regex.Replace(replacedWebHookContent, "{heading}", Heading, RegexOptions.IgnoreCase);
                if (replacedWebHookContent.IndexOf("domainname", StringComparison.InvariantCultureIgnoreCase) > -1)
                    replacedWebHookContent = Regex.Replace(replacedWebHookContent, "{domainname}", Domain != null && Domain.Length > 1 ? Domain : "", RegexOptions.IgnoreCase);
                if (replacedWebHookContent.IndexOf("sourcekey", StringComparison.InvariantCultureIgnoreCase) > -1)
                    replacedWebHookContent = Regex.Replace(replacedWebHookContent, "{sourcekey}", SourceKey != null && SourceKey.Length > 1 ? SourceKey : "", RegexOptions.IgnoreCase);


                for (int i = 0; i < answer.Count() && replacedWebHookContent.Count(x => x == '{') > 0; i++)
                {
                    if (replacedWebHookContent.IndexOf(fieldList[i].Name.ToLower(), StringComparison.InvariantCultureIgnoreCase) > -1)
                    {
                        if (answer[i] != null && !string.IsNullOrEmpty(answer[i].ToString()))
                            replacedWebHookContent = Regex.Replace(replacedWebHookContent, "{" + fieldList[i].Name.ToLower() + "}", answer[i].ToString(), RegexOptions.IgnoreCase);
                    }
                }

                if (contact != null && contact.ContactId > 0 && replacedWebHookContent.Count(x => x == '{') > 0)
                {
                    var contactMemberList = contact.GetType().GetProperties().Select(x => new { Name = x.Name }).ToList();

                    for (int i = 0; i < contactMemberList.Count && replacedWebHookContent.Count(x => x == '{') > 0; i++)
                    {
                        var Name = contactMemberList[i].Name;

                        if (replacedWebHookContent.IndexOf(Name.ToLower(), StringComparison.InvariantCultureIgnoreCase) > -1)
                        {
                            var OriginalValue = contact.GetType().GetProperty(Name, BindingFlags.SetProperty | BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(contact);
                            string Value = (OriginalValue == null || string.IsNullOrEmpty(OriginalValue.ToString())) ? "" : OriginalValue.ToString();
                            if (!((Name == "Name" || Name == "EmailId" || Name == "PhoneNumber") && string.IsNullOrEmpty(Value)))
                                replacedWebHookContent = Regex.Replace(replacedWebHookContent, "{" + Name.ToLower() + "}", Value, RegexOptions.IgnoreCase);
                        }
                    }
                }

            }
            if (replacedWebHookContent.Count(x => x == '{') == 0)
                PostWebHookUrl(replacedWebHookContent);
        }

        public virtual async Task PostWebHookUrl(string url)
        {
            if (!String.IsNullOrEmpty(url))
            {
                if (!url.Contains("http"))
                    url = "http://" + url;

                try
                {
                    WebRequest request = WebRequest.Create(url);
                    using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                    {
                        Stream dataStream = response.GetResponseStream();
                        if (dataStream != null)
                        {
                            using (StreamReader reader = new StreamReader(dataStream))
                            {
                                Result = reader.ReadToEnd();
                                await SaveWebHookTrack(url, response, Result);
                                reader.Close();
                                dataStream.Close();
                                response.Close();
                            }
                        }
                    }
                }
                catch (WebException we)
                {
                    await SaveWebHookTrack(url, (HttpWebResponse)we.Response, "No Response");
                }
                catch (Exception ex)
                {
                    await SaveWebHookTrack(url, null, ex.ToString());
                    using (ErrorUpdation objError = new ErrorUpdation("WebHooks-PostUrl" + AdsId.ToString()))
                    {
                        objError.AddError(ex.ToString(), "", DateTime.Now.ToString(), "Error", ex.StackTrace.ToString());
                    }
                }
            }
        }

        public virtual async Task SaveWebHookTrack(string url, HttpWebResponse response, string Result, string error = null)
        {
            using (var objDLWebHookTracker = DLWebHookTracker.GetDLWebHookTracker(AdsId, SqlVendor))
            {
                WebHookTracker webHookTracker = new WebHookTracker();
                webHookTracker.PostedUrl = url;
                webHookTracker.CallingSource = CallingSource;
                if (response == null)
                {
                    webHookTracker.ResponseCode = 500;
                    webHookTracker.Response = "Plumb5 server error";
                    webHookTracker.ResponseFromServer = error;
                }
                else
                {
                    webHookTracker.ResponseCode = Convert.ToDouble(response.StatusCode);
                    webHookTracker.Response = response.StatusDescription;
                    Stream dataStream = response.GetResponseStream();
                    StreamReader reader = new StreamReader(dataStream);
                    webHookTracker.ResponseFromServer = Result;
                    dataStream.Close();
                    reader.Close();
                }
                await objDLWebHookTracker.Save(webHookTracker);
            }
        }

        public void UrlData(Contact contact, string WebHookFinalUrl, bool IsMandatory, bool IsEmailId, bool IsPhoneNumber)
        {
            try
            {
                if (WebHookFinalUrl.IndexOf("||") > -1)
                {
                    string[] WebhookFinalUrlSplitted = WebHookFinalUrl.Split(new string[] { "||" }, StringSplitOptions.None);

                    for (int i = 0; i < WebhookFinalUrlSplitted.Length; i++)
                    {
                        ReplaceAndPost(WebhookFinalUrlSplitted[i], contact, IsMandatory, IsEmailId, IsPhoneNumber);
                    }
                }
                else
                {
                    ReplaceAndPost(WebHookFinalUrl, contact, IsMandatory, IsEmailId, IsPhoneNumber);
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation err = new ErrorUpdation("WebhookErrorLogWhileSplitingUrl" + AdsId.ToString()))
                {
                    err.AddError(ex.ToString(), "", DateTime.Now.ToString(), "", ex.InnerException.ToString());
                }
            }
        }

        private void ReplaceAndPost(string FinalUrl, Contact contact, bool IsMandatory, bool IsEmailId, bool IsPhoneNumber)
        {
            string replacedWebHookContent = FinalUrl.Replace("[", "").Replace("]", "");

            int count = replacedWebHookContent.Count(x => x == '{');

            if (count > 0)
            {
                if (replacedWebHookContent.IndexOf("referrer", StringComparison.InvariantCultureIgnoreCase) > -1)
                    replacedWebHookContent = Regex.Replace(replacedWebHookContent, "{referrer}", Referrer != null && Referrer.Length > 1 ? Referrer : "", RegexOptions.IgnoreCase);
                if (replacedWebHookContent.IndexOf("pageurl", StringComparison.InvariantCultureIgnoreCase) > -1)
                    replacedWebHookContent = Regex.Replace(replacedWebHookContent, "{pageurl}", PageUrl, RegexOptions.IgnoreCase);
                if (replacedWebHookContent.IndexOf("ticker", StringComparison.InvariantCultureIgnoreCase) > -1)
                    replacedWebHookContent = Regex.Replace(replacedWebHookContent, "{ticker}", "Got Lead Form " + Domain + "", RegexOptions.IgnoreCase);
                if (replacedWebHookContent.IndexOf("city", StringComparison.InvariantCultureIgnoreCase) > -1)
                    replacedWebHookContent = Regex.Replace(replacedWebHookContent, "{city}", City != null && City.Length > 1 ? City : "", RegexOptions.IgnoreCase);
                if (replacedWebHookContent.IndexOf("title", StringComparison.InvariantCultureIgnoreCase) > -1)
                    replacedWebHookContent = Regex.Replace(replacedWebHookContent, "{title}", "Got Lead Form " + Domain + "", RegexOptions.IgnoreCase);
                if (replacedWebHookContent.IndexOf("heading", StringComparison.InvariantCultureIgnoreCase) > -1)
                    replacedWebHookContent = Regex.Replace(replacedWebHookContent, "{heading}", Heading, RegexOptions.IgnoreCase);
                if (replacedWebHookContent.IndexOf("domainname", StringComparison.InvariantCultureIgnoreCase) > -1)
                    replacedWebHookContent = Regex.Replace(replacedWebHookContent, "{domainname}", Domain != null && Domain.Length > 1 ? Domain : "", RegexOptions.IgnoreCase);
                if (replacedWebHookContent.IndexOf("sourcekey", StringComparison.InvariantCultureIgnoreCase) > -1)
                    replacedWebHookContent = Regex.Replace(replacedWebHookContent, "{sourcekey}", SourceKey != null && SourceKey.Length > 1 ? SourceKey : "", RegexOptions.IgnoreCase);

                var contactMemberList = contact.GetType().GetProperties().Select(x => new { Name = x.Name }).ToList();

                for (int i = 0; i < contactMemberList.Count && replacedWebHookContent.Count(x => x == '{') > 0; i++)
                {
                    var Name = contactMemberList[i].Name;

                    if (replacedWebHookContent.IndexOf(Name.ToLower(), StringComparison.InvariantCultureIgnoreCase) > -1)
                    {
                        var OriginalValue = contact.GetType().GetProperty(Name, BindingFlags.SetProperty | BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(contact);
                        string Value = (OriginalValue == null || string.IsNullOrEmpty(OriginalValue.ToString())) ? "" : OriginalValue.ToString();

                        if (!IsMandatory || !string.IsNullOrEmpty(Value))
                        {
                            replacedWebHookContent = Regex.Replace(replacedWebHookContent, "{" + Name.ToLower() + "}", Value, RegexOptions.IgnoreCase);
                        }
                        else
                        {
                            if (!(IsEmailId && Name == "EmailId") && !(IsPhoneNumber && Name == "PhoneNumber"))
                            {
                                replacedWebHookContent = Regex.Replace(replacedWebHookContent, "{" + Name.ToLower() + "}", Value, RegexOptions.IgnoreCase);
                            }
                        }
                    }
                }
            }
            if (replacedWebHookContent.Count(x => x == '{') == 0)
                PostWebHookUrl(replacedWebHookContent);
        }
    }
}
