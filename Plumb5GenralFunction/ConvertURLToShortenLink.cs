using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class ConvertURLToShortenLink
    {
        int AdsId;
        string Sqlvendor;
        public ConvertURLToShortenLink(int AccountId,string Sqlvendor)
        {
            AdsId = AccountId;
            Sqlvendor = Sqlvendor;
        }

        public async void GenerateShortenLinkByUrl(StringBuilder Body, Contact contactDetails, int SmsTemplateId, int SMSSendingSettingId, string P5SMSUniqueID = null)
        {
            StringBuilder data = new StringBuilder();

            var contactMemberList = contactDetails.GetType().GetProperties().Select(x => new { Name = x.Name }).ToList();

            for (int i = 0; i < contactMemberList.Count && (Body.ToString().Contains("<!--") || Body.ToString().Contains("[{*")); i++)
            {
                var Name = contactMemberList[i].Name;

                if ((Body.ToString().IndexOf("<!--" + Name + "-->", StringComparison.InvariantCultureIgnoreCase) > -1) || (Body.ToString().IndexOf("[{*" + Name + "*}]", StringComparison.InvariantCultureIgnoreCase) > -1))
                {
                    var OriginalValue = contactDetails.GetType().GetProperty(Name, BindingFlags.SetProperty | BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(contactDetails);
                    string ReplacingValue = (OriginalValue == null || string.IsNullOrEmpty(OriginalValue.ToString())) ? "" : OriginalValue.ToString();

                    //this is done because if the custom field value is null then we are storing it as NA
                    if (!string.IsNullOrEmpty(ReplacingValue) && ReplacingValue == "[NA]")
                    {
                        data.Clear().Append(Regex.Replace(Body.ToString(), "<!--" + Name + "-->", "[{*" + Name + "*}]", RegexOptions.IgnoreCase));
                        Body.Clear().Append(data);
                    }
                    else if (!string.IsNullOrEmpty(ReplacingValue))
                    {
                        bool result = ValidHttpURL(ReplacingValue);
                        string shortenlink = "";

                        if (result)
                        {
                            SmsTemplateUrl smsTemplateUrl = new SmsTemplateUrl();
                            smsTemplateUrl.SmsTemplateId = SmsTemplateId;
                            smsTemplateUrl.UrlContent = ReplacingValue;

                            using (var objBL =   DLSmsTemplateUrl.GetDLSmsTemplateUrl(AdsId,Sqlvendor))
                            {
                                smsTemplateUrl.Id = await objBL.SaveSmsTemplateUrl(smsTemplateUrl);

                                if (smsTemplateUrl.Id <= 0)
                                    smsTemplateUrl = await objBL.GetDetailByUrl(smsTemplateUrl.UrlContent);

                                if (smsTemplateUrl.Id > 0)
                                    shortenlink = await Getshortenlink(contactDetails.ContactId, smsTemplateUrl.Id, SMSSendingSettingId, P5SMSUniqueID);
                            }

                            if (!string.IsNullOrEmpty(shortenlink))
                            {
                                data.Clear().Append(Regex.Replace(Body.ToString(), "<!--" + Name + "-->", shortenlink, RegexOptions.IgnoreCase));
                                Body.Clear().Append(data);

                                data.Clear();
                                data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*" + Name + @"\*\}\]", shortenlink, RegexOptions.IgnoreCase));
                                Body.Clear().Append(data);
                            }
                        }
                        else
                        {
                            data.Clear().Append(Regex.Replace(Body.ToString(), "<!--" + Name + "-->", ReplacingValue, RegexOptions.IgnoreCase));
                            Body.Clear().Append(data);

                            data.Clear();
                            data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*" + Name + @"\*\}\]", ReplacingValue, RegexOptions.IgnoreCase));
                            Body.Clear().Append(data);
                        }
                    }
                    else if (string.IsNullOrEmpty(ReplacingValue))
                    {
                        data.Clear().Append(Regex.Replace(Body.ToString(), "<!--" + Name + "-->", "[{*" + Name + "*}]", RegexOptions.IgnoreCase));
                        Body.Clear().Append(data);
                    }
                }
            }
            data = null;
        }

        public static bool ValidHttpURL(string s)
        {
            string Pattern = @"^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$";
            Regex Rgx = new Regex(Pattern, RegexOptions.Compiled | RegexOptions.IgnoreCase);
            return Rgx.IsMatch(s);
        }

        public async Task<string> Getshortenlink(int ContactId, int smsid, int SMSSendingSettingId, string P5SMSUniqueID)
        {
            HelperForSMS helpsms = new HelperForSMS(AdsId, Sqlvendor);
            string trackingCode = "";
            long SavedShortUrlId = await helpsms.SaveSmsShortUrl(new SmsShortUrl() { AccountId = AdsId, CampaignType = "campaign", URLId = smsid, SMSSendingSettingId = SMSSendingSettingId, TriggerSMSDripsId = 0, WorkflowId = 0, P5SMSUniqueID = P5SMSUniqueID });

            if (SavedShortUrlId > 0)
            {
                string SmsShortUrlString = helpsms.URLfromID(SavedShortUrlId);
                string ContactIdString = helpsms.URLfromID(ContactId);
                trackingCode = SmsShortUrlString + "-" + ContactIdString;
            }

            trackingCode = AllConfigURLDetails.KeyValueForConfig["SMSCLICKURL"] + trackingCode;

            return trackingCode;
        }
    }
}
