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
    public class ConvertWhatsAppURLToShortenCode
    {
        int AdsId;
        readonly string SqlVendor;

        public ConvertWhatsAppURLToShortenCode(int AccountId, string sqlvendor)
        {
            AdsId = AccountId;
            SqlVendor = sqlvendor;

        }

        public async void GenerateShortenLinkByUrl(StringBuilder Body, Contact contactDetails, int WhatsAppTemplateId, int WhatsAppSendingSettingId, string P5WhatsappUniqueID = null)
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
                            WhatsAppTemplateUrl whatsappTemplateUrl = new WhatsAppTemplateUrl();
                            whatsappTemplateUrl.WhatsAppTemplatesId = WhatsAppTemplateId;
                            whatsappTemplateUrl.UrlContent = ReplacingValue;

                            using (var objBL =   DLWhatsappTemplateUrl.GetDLWhatsappTemplateUrl(AdsId,SqlVendor))
                            {
                                whatsappTemplateUrl.Id =await  objBL.SaveWhatsappTemplateUrl(whatsappTemplateUrl);

                                if (whatsappTemplateUrl.Id <= 0)
                                    whatsappTemplateUrl = await objBL.GetDetailByUrl(whatsappTemplateUrl.UrlContent);

                                if (whatsappTemplateUrl.Id > 0)
                                    shortenlink = await Getshortenlink(contactDetails.ContactId, whatsappTemplateUrl.Id, WhatsAppSendingSettingId, P5WhatsappUniqueID);
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

        public async Task<string> GenerateShortenLinkByUrlValue(StringBuilder Body, Contact contactDetails, int WhatsAppTemplateId, int WhatsAppSendingSettingId, string P5WhatsappUniqueID = null)
        {
            StringBuilder data = new StringBuilder();

            string finalvalues = "";

            if (Body != null)
            {
                if (Body.ToString().IndexOf("$@$") > -1)
                {
                    string[] userattr = Body.ToString().Split(new[] { "$@$" }, StringSplitOptions.None);

                    if (userattr != null && userattr.Length > 0)
                    {
                        for (int i = 0; i < userattr.Length; i++)
                        {
                            if (!string.IsNullOrEmpty(userattr[i]))
                            {
                                if (userattr[i].IndexOf(Convert.ToString(AllConfigURLDetails.KeyValueForConfig["WHATSAPP_RESPONSES"])) <= -1)
                                {
                                    bool result = ValidHttpURL(userattr[i]);
                                    string shortenlink = "";

                                    if (result)
                                    {
                                        WhatsAppTemplateUrl whatsappTemplateUrl = new WhatsAppTemplateUrl();
                                        whatsappTemplateUrl.WhatsAppTemplatesId = WhatsAppTemplateId;
                                        whatsappTemplateUrl.UrlContent = userattr[i];

                                        using (var objBL = DLWhatsappTemplateUrl.GetDLWhatsappTemplateUrl(AdsId,SqlVendor))
                                        {
                                            whatsappTemplateUrl.Id = await objBL.SaveWhatsappTemplateUrl(whatsappTemplateUrl);

                                            if (whatsappTemplateUrl.Id <= 0)
                                                whatsappTemplateUrl = await objBL.GetDetailByUrl(whatsappTemplateUrl.UrlContent);

                                            if (whatsappTemplateUrl.Id > 0)
                                                shortenlink = await Getshortenlink(contactDetails.ContactId, whatsappTemplateUrl.Id, WhatsAppSendingSettingId, P5WhatsappUniqueID);

                                            shortenlink = Convert.ToString(AllConfigURLDetails.KeyValueForConfig["WHATSAPP_RESPONSES"]) + shortenlink;
                                        }

                                        if (!string.IsNullOrEmpty(shortenlink))
                                            finalvalues += shortenlink + "$@$";
                                    }
                                    else
                                    {
                                        finalvalues += userattr[i] + "$@$";
                                    }
                                }
                                else
                                {
                                    finalvalues += userattr[i] + "$@$";
                                }
                            }
                        }
                    }
                }
                else
                {
                    if (!string.IsNullOrEmpty(Body.ToString()))
                    {
                        string value = Body.ToString();
                        if (value.IndexOf(Convert.ToString(AllConfigURLDetails.KeyValueForConfig["WHATSAPP_RESPONSES"])) <= -1)
                        {
                            bool result = ValidHttpURL(value);
                            string shortenlink = "";

                            if (result)
                            {
                                WhatsAppTemplateUrl whatsappTemplateUrl = new WhatsAppTemplateUrl();
                                whatsappTemplateUrl.WhatsAppTemplatesId = WhatsAppTemplateId;
                                whatsappTemplateUrl.UrlContent = value;

                                using (var objBL =  DLWhatsappTemplateUrl.GetDLWhatsappTemplateUrl(AdsId,SqlVendor))
                                {
                                    whatsappTemplateUrl.Id = await objBL.SaveWhatsappTemplateUrl(whatsappTemplateUrl);

                                    if (whatsappTemplateUrl.Id <= 0)
                                        whatsappTemplateUrl = await objBL.GetDetailByUrl(whatsappTemplateUrl.UrlContent);

                                    if (whatsappTemplateUrl.Id > 0)
                                        shortenlink = await Getshortenlink(contactDetails.ContactId, whatsappTemplateUrl.Id, WhatsAppSendingSettingId, P5WhatsappUniqueID);

                                    shortenlink = Convert.ToString(AllConfigURLDetails.KeyValueForConfig["WHATSAPP_RESPONSES"]) + shortenlink;
                                }

                                if (!string.IsNullOrEmpty(shortenlink))
                                    finalvalues += shortenlink + "$@$";
                            }
                            else
                            {
                                finalvalues += value + "$@$";
                            }
                        }
                        else
                        {
                            finalvalues += value + "$@$";
                        }
                    }
                }
            }

            if (!string.IsNullOrEmpty(finalvalues))
                finalvalues = finalvalues.Remove(finalvalues.Length - 3);

            return finalvalues;
        }

        public static bool ValidHttpURL(string s)
        {
            string Pattern = @"^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$";
            Regex Rgx = new Regex(Pattern, RegexOptions.Compiled | RegexOptions.IgnoreCase);
            return Rgx.IsMatch(s);
        }

        public async Task<string> Getshortenlink(int ContactId, int whatsappid, int WhatsAppSendingSettingId, string P5WhatsappUniqueID)
        {
            HelperForSMS helpsms = new HelperForSMS(AdsId,SqlVendor);
            string trackingCode = "";
            long SavedShortUrlId = await helpsms.SaveWhatsAppShortUrl(new WhatsappShortUrl() { AccountId = AdsId, CampaignType = "campaign", URLId = whatsappid, WhatsappSendingSettingId = WhatsAppSendingSettingId, WorkflowId = 0, P5WhatsappUniqueID = P5WhatsappUniqueID });

            if (SavedShortUrlId > 0)
            {
                string whatsappShortUrlString = helpsms.URLfromID(SavedShortUrlId);
                string ContactIdString = helpsms.URLfromID(ContactId);
                trackingCode = whatsappShortUrlString + "-" + ContactIdString;
            }

            //trackingCode = AllConfigURLDetails.KeyValueForConfig["SMS_CLICKURL"] + trackingCode;

            return trackingCode;
        }
    }
}
