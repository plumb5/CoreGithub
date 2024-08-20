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
    public class HelperForSMS
    {
        readonly int AdsId;
        private readonly string sqlVendor;

        public HelperForSMS(int adsId, string sqlVendor)
        {
            AdsId = adsId;
            this.sqlVendor = sqlVendor;
        }
        #region SMS Url Shorten

        public string URLfromID(long ID)
        {
            //ID should be converted to base 62 format

            char[] map = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".ToCharArray();
            StringBuilder shortURL = new StringBuilder();
            while (ID > 0)
            {
                shortURL.Append(map[ID % 62]);
                ID /= 62;

            }

            return ReverseString(shortURL.ToString());
        }
        public string ReverseString(string s)
        {
            char[] arr = s.ToCharArray();
            Array.Reverse(arr);
            return new string(arr);
        }
        public static long URLtoID(String url)
        {
            long id = 0;
            char[] arr = url.ToCharArray();
            for (int i = 0; i < arr.Length; i++)
            {
                if ('a' <= arr[i] && arr[i] <= 'z')
                    id = id * 62 + arr[i] - 'a';
                if ('A' <= arr[i] && arr[i] <= 'Z')
                    id = id * 62 + arr[i] - 'A' + 26;
                if ('0' <= arr[i] && arr[i] <= '9')
                    id = id * 62 + arr[i] - '0' + 52;
            }
            return id;
        }

        #endregion SMS Url Shorten

        #region Replace SMS Content

        public async Task ReplaceMessageWithSMSUrl(string CampaignTypeIs, StringBuilder Body, int smsId, int ContactId, List<SmsTemplateUrl> smsUrlList, string P5UniqueID = "", int WorkFlowId = 0, string? sqlVendor = null)
        {
            try
            {
                if (smsUrlList != null && smsUrlList.Count > 0)
                {
                    StringBuilder Bodydata = new StringBuilder();
                    for (int i = 0; i < smsUrlList.Count; i++)
                    {
                        if (Body.ToString().Contains("<!-" + smsUrlList[i].Id + "->") || Body.ToString().Contains("<!--" + smsUrlList[i].Id + "-->") || Body.ToString().Contains("[{*" + smsUrlList[i].Id + "*}]"))
                        {
                            string trackingCode = "";
                            if (CampaignTypeIs.ToLower() == "ussd")
                            {
                                trackingCode = "up";
                                trackingCode += P5UniqueID.ToString() + "p";
                                trackingCode += NumericToAlphabet.ConvertNumricToAlphbet(smsUrlList[i].Id.ToString());

                                string Url;
                                using (var objParameter = DLSmsUrlParameter.GetDLSmsUrlParameter(AdsId, sqlVendor))
                                {
                                    SmsUrlParameter data = new SmsUrlParameter() { UrlParameter = trackingCode };
                                    Url = URLfromID(await objParameter.Save(data));
                                }

                                trackingCode = AdsId.ToString() + "p" + Url;
                            }
                            else
                            {
                                long SavedShortUrlId = 0;
                                if (CampaignTypeIs.ToLower() == "campaign")
                                {
                                    SavedShortUrlId = await SaveSmsShortUrl(new SmsShortUrl() { AccountId = AdsId, CampaignType = "campaign", URLId = smsUrlList[i].Id, SMSSendingSettingId = smsId, TriggerSMSDripsId = 0, WorkflowId = 0, P5SMSUniqueID = P5UniqueID });
                                }
                                else if (CampaignTypeIs.ToLower() == "trigger")
                                {
                                    SavedShortUrlId = await SaveSmsShortUrl(new SmsShortUrl() { AccountId = AdsId, CampaignType = "trigger", URLId = smsUrlList[i].Id, SMSSendingSettingId = 0, TriggerSMSDripsId = smsId, WorkflowId = 0, P5SMSUniqueID = P5UniqueID });
                                }
                                else if (CampaignTypeIs.ToLower() == "workflow")
                                {
                                    SavedShortUrlId = await SaveSmsShortUrl(new SmsShortUrl() { AccountId = AdsId, CampaignType = "workflow", URLId = smsUrlList[i].Id, SMSSendingSettingId = smsId, TriggerSMSDripsId = 0, WorkflowId = WorkFlowId, P5SMSUniqueID = P5UniqueID });
                                }
                                else if (CampaignTypeIs.ToLower() == "lms")
                                {
                                    SavedShortUrlId = await SaveSmsShortUrl(new SmsShortUrl() { AccountId = AdsId, CampaignType = "LMS", URLId = smsUrlList[i].Id, SMSSendingSettingId = smsId, TriggerSMSDripsId = 0, WorkflowId = WorkFlowId, P5SMSUniqueID = P5UniqueID });
                                }
                                if (SavedShortUrlId > 0)
                                {
                                    string SmsShortUrlString = URLfromID(SavedShortUrlId);
                                    string ContactIdString = URLfromID(ContactId);
                                    trackingCode = SmsShortUrlString + "-" + ContactIdString;
                                }
                            }

                            trackingCode = AllConfigURLDetails.KeyValueForConfig["SMSCLICKURL"] + trackingCode;

                            Bodydata.Clear().Append(Regex.Replace(Body.ToString(), "<!-" + smsUrlList[i].Id + "->", trackingCode, RegexOptions.IgnoreCase));
                            Body.Clear().Append(Bodydata);

                            Bodydata.Clear().Append(Regex.Replace(Body.ToString(), "<!--" + smsUrlList[i].Id + "-->", trackingCode, RegexOptions.IgnoreCase));
                            Body.Clear().Append(Bodydata);

                            Bodydata.Clear();
                            Bodydata.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*" + smsUrlList[i].Id + @"\*\}\]", trackingCode, RegexOptions.IgnoreCase));
                            Body.Clear().Append(Bodydata);
                        }
                    }
                    Bodydata = null;
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("ReplaceMessageWithSMSUrl"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "HelperForSMS->ReplaceMessageWithSMSUrl->Inner", ex.ToString());
                }
            }
        }

        public void ReplaceSepicalCharacter(StringBuilder Body)
        {
            StringBuilder data = new StringBuilder();

            data.Clear().Append(Body.Replace("&", "%26").Replace("#", "%23").Replace("!", "%21").Replace("@", "%40"));

            data.Clear().Append(Body.Replace("$", "%24").Replace("'", "%27").Replace("(", "%28").Replace(")", "%29").Replace("*", "%2A"));

            data.Clear().Append(Body.Replace("+", "%2B").Replace(",", "%2C").Replace("-", "%2D"));

            data.Clear().Append(Body.Replace("?", "%3F").Replace("=", "%3D"));

            data.Clear().Append(Body.Replace(";", "%3B"));

            Body.Clear().Append(data);

            data = null;
        }

        public static string ReplaceOnlyXMLEncoding(string MessageContent)
        {
            StringBuilder Body = new StringBuilder(MessageContent);

            StringBuilder data = new StringBuilder();

            data.Clear().Append(Body.Replace("&", "&amp;"));
            //.Replace("'", "&apos;").Replace("-", "&quot;").Replace("\n", "&#010;")
            //data.Clear().Append(Body.Replace("%", "&#37;").Replace(">", "&gt;").Replace("<", "&lt;").Replace("\f", "&#012;"));

            //data.Clear().Append(Body.Replace("\t", "&#009;"));

            data.Clear().Append(Body.Replace("\n", "&#010;"));

            Body.Clear().Append(data);

            return Body.ToString();
        }


        public async Task ReplaceContactDetails(StringBuilder Body, Contact contactDetails = null, int accountid = 0, string MachineId = null, int TemplateId = 0, int SendingSettingId = 0, string P5UniqueID = null, string channeltype = null, bool IsConvertURLToShortUrl = false)
        {
            StringBuilder data = new StringBuilder();
            List<KeyValuePair<string, string>> keyValuePairs = new List<KeyValuePair<string, string>>();
            string Message = Body.ToString();
            string Pattern = @"(?<=\[\{\*).*?(?=\*\}\])";
            MatchCollection matches = Regex.Matches(Body.ToString(), Pattern);
            foreach (var eachFieldName in matches)
            {
                try
                {
                    string FieldName = "";
                    string OptionalFieldName = "";
                    string FallBackValue = "";

                    if (eachFieldName.ToString().Split('~').Length == 2)
                    {
                        var datas = eachFieldName.ToString().Split('~');
                        FallBackValue = datas[1];

                        if (datas[0].ToString().Split('&').Length == 2)
                        {
                            FieldName = datas[0].ToString().Split('&')[0];
                            OptionalFieldName = datas[0].ToString().Split('&')[1];
                        }
                        else
                        {
                            FieldName = datas[0];
                        }

                        Message = Message.Replace(Convert.ToString(eachFieldName), Convert.ToString(FieldName));
                        Body.Clear().Append(Message);
                    }
                    else if (eachFieldName.ToString().Split('&').Length == 2)
                    {
                        var datas = eachFieldName.ToString().Split('&');
                        FieldName = datas[0];
                        OptionalFieldName = datas[1];
                        Message = Message.Replace(Convert.ToString(eachFieldName), Convert.ToString(FieldName));
                        Body.Clear().Append(Message);
                    }
                    else
                    {
                        FieldName = eachFieldName.ToString();
                    }

                    if (contactDetails != null)
                    {
                        var OriginalValue = contactDetails.GetType().GetProperty(FieldName, BindingFlags.SetProperty | BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(contactDetails);

                        if (String.IsNullOrEmpty(Convert.ToString(OriginalValue)))
                        {
                            if (!String.IsNullOrEmpty(OptionalFieldName))
                            {
                                OriginalValue = contactDetails.GetType().GetProperty(OptionalFieldName, BindingFlags.SetProperty | BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(contactDetails);

                                if (String.IsNullOrEmpty(Convert.ToString(OriginalValue)))
                                {
                                    if (!String.IsNullOrEmpty(Convert.ToString(FallBackValue)))
                                        keyValuePairs.Add(new KeyValuePair<string, string>(FieldName, FallBackValue));
                                    else
                                        keyValuePairs.Add(new KeyValuePair<string, string>(FieldName, null));
                                }
                                else
                                {
                                    keyValuePairs.Add(new KeyValuePair<string, string>(FieldName, Convert.ToString(OriginalValue)));
                                }
                            }
                            else if (!String.IsNullOrEmpty(FallBackValue))
                            {
                                keyValuePairs.Add(new KeyValuePair<string, string>(FieldName, Convert.ToString(FallBackValue)));
                            }
                        }
                        else if (!String.IsNullOrEmpty(FallBackValue))
                        {
                            keyValuePairs.Add(new KeyValuePair<string, string>(FieldName, Convert.ToString(FallBackValue)));
                        }
                    }

                    //if (eachFieldName.ToString().Split('~').Length == 2)
                    //{
                    //    keyValuePairs.Add(new KeyValuePair<string, string>(eachFieldName.ToString().Split('~')[0], Convert.ToString(eachFieldName.ToString().Split('~')[1])));
                    //    Message = Message.Replace(Convert.ToString(eachFieldName), Convert.ToString(eachFieldName.ToString().Split('~')[0]));
                    //    Body.Clear().Append(Message);
                    //}
                    //else
                    //{
                    //    keyValuePairs.Add(new KeyValuePair<string, string>(Convert.ToString(eachFieldName), null));
                    //}
                }
                catch
                {
                    keyValuePairs.Add(new KeyValuePair<string, string>(Convert.ToString(eachFieldName), null));
                }
            }

            if (contactDetails != null)
            {
                if ((Body.ToString().IndexOf("<!--ContactNumber-->", StringComparison.InvariantCultureIgnoreCase) > -1) || (Body.ToString().IndexOf("[{*ContactNumber*}]", StringComparison.InvariantCultureIgnoreCase) > -1))
                {
                    if (!String.IsNullOrEmpty(contactDetails.PhoneNumber))
                    {
                        data.Clear().Append(Regex.Replace(Body.ToString(), "<!--ContactNumber-->", contactDetails.PhoneNumber, RegexOptions.IgnoreCase));
                        Body.Clear().Append(data);

                        data.Clear();
                        data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*ContactNumber\*\}\]", contactDetails.PhoneNumber, RegexOptions.IgnoreCase));
                        Body.Clear().Append(data);
                    }
                    else
                    {
                        data.Clear().Append(Regex.Replace(Body.ToString(), "<!--ContactNumber-->", "[{*ContactNumber*}]", RegexOptions.IgnoreCase));
                        Body.Clear().Append(data);
                    }
                }

                var contactMemberList = contactDetails.GetType().GetProperties().Select(x => new { Name = x.Name }).ToList();

                for (int i = 0; i < contactMemberList.Count && (Body.ToString().Contains("<!--") || Body.ToString().Contains("[{*")); i++)
                {
                    var Name = contactMemberList[i].Name;

                    if ((Body.ToString().IndexOf("<!--" + Name + "-->", StringComparison.InvariantCultureIgnoreCase) > -1) || (Body.ToString().IndexOf("[{*" + Name + "*}]", StringComparison.InvariantCultureIgnoreCase) > -1))
                    {
                        var OriginalValue = contactDetails.GetType().GetProperty(Name, BindingFlags.SetProperty | BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(contactDetails);
                        string ReplacingValue = (OriginalValue == null) ? null : Convert.ToString(OriginalValue);

                        //this is done because if the custom field value is null then we are storing it as NA
                        if (!string.IsNullOrEmpty(ReplacingValue) && ReplacingValue == "[NA]")
                        {
                            data.Clear().Append(Regex.Replace(Body.ToString(), "<!--" + Name + "-->", "[{*" + Name + "*}]", RegexOptions.IgnoreCase));
                            Body.Clear().Append(data);
                        }
                        else if (ReplacingValue != null || ReplacingValue == "")
                        {
                            try
                            {
                                //custmized for tyme account- But it is genral. I think no issues.
                                if (Name.ToString().ToLower() == "CustomerScore".ToLower() && ReplacingValue.Contains('.'))
                                    ReplacingValue = ReplacingValue.Split('.')[0];
                            }
                            catch { }

                            try
                            {
                                bool result = ValidHttpURL(ReplacingValue);

                                if (result)
                                {
                                    ReplacingValue = await Helper.Getshortlinkbyvalue(accountid, contactDetails, ReplacingValue, TemplateId, SendingSettingId, P5UniqueID, channeltype, IsConvertURLToShortUrl);

                                    if (!string.IsNullOrEmpty(ReplacingValue))
                                    {
                                        data.Clear().Append(Regex.Replace(Body.ToString(), "<!--" + Name + "-->", ReplacingValue, RegexOptions.IgnoreCase));
                                        Body.Clear().Append(data);

                                        data.Clear();
                                        data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*" + Name + @"\*\}\]", ReplacingValue, RegexOptions.IgnoreCase));
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
                            catch (Exception ex)
                            {
                                ErrorUpdation.AddErrorLog("ReplaceLinkUrl", ex.Message, "ReplaceLinkUrl", DateTime.Now, "HelperForSMS-->ReplaceContactDetails", ex.StackTrace);
                            }

                            if (keyValuePairs != null && keyValuePairs.Count > 0)
                            {
                                string keypairvalue = keyValuePairs.FirstOrDefault(p => p.Key == Name).Value;

                                data.Clear();
                                data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*" + Name + "~" + keypairvalue + @"\*\}\]", ReplacingValue, RegexOptions.IgnoreCase));
                                Body.Clear().Append(data);
                            }
                        }
                        else if (ReplacingValue == null)
                        {
                            if (keyValuePairs != null && keyValuePairs.Count > 0)
                            {
                                string keypairvalue = keyValuePairs.FirstOrDefault(p => p.Key == Name).Value;

                                if (keypairvalue != null || keypairvalue == "")
                                {
                                    data.Clear().Append(Regex.Replace(Body.ToString(), "<!--" + Name + "-->", keypairvalue, RegexOptions.IgnoreCase));
                                    Body.Clear().Append(data);

                                    data.Clear();
                                    data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*" + Name + @"\*\}\]", keypairvalue, RegexOptions.IgnoreCase));
                                    Body.Clear().Append(data);

                                    data.Clear();
                                    data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*" + Name + "~" + keypairvalue + @"\*\}\]", keypairvalue, RegexOptions.IgnoreCase));
                                    Body.Clear().Append(data);
                                }
                                else
                                {
                                    data.Clear().Append(Regex.Replace(Body.ToString(), "<!--" + Name + "-->", "[{*" + Name + "*}]", RegexOptions.IgnoreCase));
                                    Body.Clear().Append(data);

                                    data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*" + Name + "~" + keypairvalue + @"\*\}\]", "[{*" + Name + "*}]", RegexOptions.IgnoreCase));
                                    Body.Clear().Append(data);
                                }
                            }
                            else
                            {
                                data.Clear().Append(Regex.Replace(Body.ToString(), "<!--" + Name + "-->", "[{*" + Name + "*}]", RegexOptions.IgnoreCase));
                                Body.Clear().Append(data);
                            }

                            //if (Name != "Name")
                            //{
                            //    data.Clear().Append(Regex.Replace(Body.ToString(), "<!--" + Name + "-->", "[{*" + Name + "*}]", RegexOptions.IgnoreCase));
                            //    Body.Clear().Append(data);
                            //}
                            //else if (Name == "Name")
                            //{
                            //    data.Clear().Append(Regex.Replace(Body.ToString(), "<!--" + Name + "-->", ReplacingValue, RegexOptions.IgnoreCase));
                            //    Body.Clear().Append(data);

                            //    data.Clear();
                            //    data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*" + Name + @"\*\}\]", ReplacingValue, RegexOptions.IgnoreCase));
                            //    Body.Clear().Append(data);
                            //}
                        }
                    }
                }
            }
            else if (!String.IsNullOrEmpty(MachineId))
            {
                foreach (Match m in Regex.Matches(Message, @"(?<=\[\{\*).*?(?=\*\}\])", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace))
                {
                    string Name = "";
                    if (keyValuePairs != null && keyValuePairs.Count > 0)
                    {
                        Name = m.Value.ToString().Replace("{{*", "").Replace("*}}", "");

                        string keypairvalue = keyValuePairs.FirstOrDefault(p => p.Key == Name).Value;

                        if (keypairvalue != null || keypairvalue == "")
                        {
                            data.Clear().Append(Regex.Replace(Body.ToString(), "<!--" + Name + "-->", keypairvalue, RegexOptions.IgnoreCase));
                            Body.Clear().Append(data);

                            data.Clear();
                            data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*" + Name + @"\*\}\]", keypairvalue, RegexOptions.IgnoreCase));
                            Body.Clear().Append(data);

                            data.Clear();
                            data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*" + Name + "~" + keypairvalue + @"\*\}\]", keypairvalue, RegexOptions.IgnoreCase));
                            Body.Clear().Append(data);
                        }
                        else
                        {
                            data.Clear().Append(Regex.Replace(Body.ToString(), "<!--" + Name + "-->", "[{*" + Name + "*}]", RegexOptions.IgnoreCase));
                            Body.Clear().Append(data);

                            data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*" + Name + "~" + keypairvalue + @"\*\}\]", "[{*" + Name + "*}]", RegexOptions.IgnoreCase));
                            Body.Clear().Append(data);
                        }
                    }
                    else
                    {
                        data.Clear().Append(Regex.Replace(Body.ToString(), "<!--" + Name + "-->", "[{*" + Name + "*}]", RegexOptions.IgnoreCase));
                        Body.Clear().Append(data);
                    }
                }
            }

            /*Custome Events Replace Data*/
            try
            {
                if (Body.ToString().Contains("{{*") && Body.ToString().Contains("*}}") && accountid > 0)
                {
                    if (contactDetails != null || !String.IsNullOrEmpty(MachineId))
                    {
                        if (!string.IsNullOrEmpty(channeltype) && channeltype.ToLower().Contains("webpush"))
                        {
                            if (contactDetails != null && contactDetails.ContactId > 0)
                                contactDetails.ContactId = 0;
                        }

                        string Eventdata = await Helper.ReplaceCustomEventDetails(accountid, Body, contactDetails, MachineId, TemplateId, SendingSettingId, P5UniqueID, channeltype, IsConvertURLToShortUrl, SQLVendor: this.sqlVendor);
                        Body.Clear().Append(Eventdata);
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorUpdation.AddErrorLog("CustomEventFieldReplace", ex.Message, "CustomEvent Data Replace issue", DateTime.Now, "HelperForSMS-->ReplaceContactDetails", ex.StackTrace);
            }
            /*Custome Events Replace Data*/

            data = null;
        }

        public void ReplaceLmsDetails(StringBuilder Body, LmsGroupMembers contactDetails)
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

                    if (!string.IsNullOrEmpty(ReplacingValue))
                    {
                        data.Clear().Append(Regex.Replace(Body.ToString(), "<!--" + Name + "-->", ReplacingValue, RegexOptions.IgnoreCase));
                        Body.Clear().Append(data);

                        data.Clear();
                        data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*" + Name + @"\*\}\]", ReplacingValue, RegexOptions.IgnoreCase));
                        Body.Clear().Append(data);
                    }

                }
            }
            data = null;
        }

        public void ReplaceUserInfoDetails(StringBuilder Body, UserInfo userInfoDetails)
        {
            StringBuilder data = new StringBuilder();

            var userinfoList = userInfoDetails.GetType().GetProperties().Select(x => new { Name = x.Name }).ToList();

            for (int i = 0; i < userinfoList.Count && (Body.ToString().Contains("<!--") || Body.ToString().Contains("[{*")); i++)
            {
                var Name = userinfoList[i].Name;

                if ((Body.ToString().IndexOf("<!--UserInfo~" + Name + "-->", StringComparison.InvariantCultureIgnoreCase) > -1) || (Body.ToString().IndexOf("[{*UserInfo~" + Name + "*}]", StringComparison.InvariantCultureIgnoreCase) > -1))
                {
                    var OriginalValue = userInfoDetails.GetType().GetProperty(Name, BindingFlags.SetProperty | BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(userInfoDetails);
                    string ReplacingValue = (OriginalValue == null || string.IsNullOrEmpty(OriginalValue.ToString())) ? "" : OriginalValue.ToString();

                    if (!string.IsNullOrEmpty(ReplacingValue))
                    {
                        data.Clear().Append(Regex.Replace(Body.ToString(), "<!--UserInfo~" + Name + "-->", ReplacingValue, RegexOptions.IgnoreCase));
                        Body.Clear().Append(data);

                        data.Clear();
                        data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*UserInfo~" + Name + @"\*\}\]", ReplacingValue, RegexOptions.IgnoreCase));
                        Body.Clear().Append(data);
                    }
                }
            }
            data = null;
        }

        public void ReplaceCounselorDetails(StringBuilder Body, UserInfo userDetails)
        {
            StringBuilder data = new StringBuilder();

            if (Body.ToString().IndexOf("[{*Signatory_Name*}]", StringComparison.InvariantCultureIgnoreCase) > -1)
            {
                if (!String.IsNullOrEmpty(userDetails.FirstName))
                {
                    data.Clear();
                    data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*Signatory_Name\*\}\]", userDetails.FirstName, RegexOptions.IgnoreCase));
                    Body.Clear().Append(data);
                }
            }

            if (Body.ToString().IndexOf("[{*Signatory_EmailId*}]", StringComparison.InvariantCultureIgnoreCase) > -1)
            {
                if (!String.IsNullOrEmpty(userDetails.EmailId))
                {
                    data.Clear();
                    data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*Signatory_EmailId\*\}\]", userDetails.EmailId, RegexOptions.IgnoreCase));
                    Body.Clear().Append(data);
                }
            }

            if (Body.ToString().IndexOf("[{*Signatory_PhoneNumber*}]", StringComparison.InvariantCultureIgnoreCase) > -1)
            {
                if (!String.IsNullOrEmpty(userDetails.MobilePhone))
                {
                    data.Clear();
                    data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*Signatory_PhoneNumber\*\}\]", userDetails.MobilePhone, RegexOptions.IgnoreCase));
                    Body.Clear().Append(data);
                }
            }

            if (Body.ToString().IndexOf("[{*Signatory_BusinessPhoneNumber*}]", StringComparison.InvariantCultureIgnoreCase) > -1)
            {
                if (!String.IsNullOrEmpty(userDetails.BusinessPhone))
                {
                    data.Clear();
                    data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*Signatory_BusinessPhoneNumber\*\}\]", userDetails.BusinessPhone, RegexOptions.IgnoreCase));
                    Body.Clear().Append(data);
                }
            }
            data = null;
        }


        #region Replace Coupon
        //public List<CouponConsumed> ReplaceCouponList(StringBuilder Body, Contact contactDetails)
        //{
        //    List<CouponConsumed> couponlist = new List<CouponConsumed>();
        //    CouponConsumed consumed = new CouponConsumed();
        //    StringBuilder messagedata = new StringBuilder();
        //    try
        //    {
        //        int count = Body.ToString().Count(x => x == '[');
        //        for (int i = 1; i <= count; i++)
        //        {
        //            if (Body.ToString().IndexOf("[{*Coup", StringComparison.InvariantCultureIgnoreCase) > -1)
        //            {
        //                int startindex = Body.ToString().IndexOf("[{*Coup");
        //                int endindex = Body.ToString().IndexOf("*}]");
        //                string MessageContent = Body.ToString().Substring(startindex, endindex - startindex);
        //                if (MessageContent.ToString().IndexOf("[{*Coup", StringComparison.InvariantCultureIgnoreCase) > -1)
        //                {
        //                    MessageContent = MessageContent.Split('-')[0].ToString();
        //                    if (MessageContent.ToString().IndexOf("[{*Coup", StringComparison.InvariantCultureIgnoreCase) > -1)
        //                    {
        //                        MessageContent = MessageContent.Substring(MessageContent.IndexOf("Coup")).Replace("Coup", "");
        //                        if (!string.IsNullOrEmpty(MessageContent))
        //                        {
        //                            int CouponId = Convert.ToInt32(MessageContent);
        //                            if (CouponId > 0)
        //                            {
        //                                Coupon coupon = new Coupon();
        //                                using (DLCoupon obj = new DLCoupon(AdsId))
        //                                {
        //                                    coupon.Id = CouponId;
        //                                    coupon = obj.Get(coupon);
        //                                    if (coupon != null)
        //                                    {
        //                                        CouponConsumption consum = new CouponConsumption();
        //                                        using (DLCouponConsumption consumption = new DLCouponConsumption(AdsId))
        //                                        {
        //                                            consum.CouponId = CouponId;
        //                                            consum.ContactId = contactDetails.ContactId;
        //                                            consum.Channel = "SMS";
        //                                            consum = consumption.GetNotConsumedData(consum);
        //                                            if (consum != null)
        //                                            {
        //                                                messagedata.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*Coup" + consum.CouponId + "-" + consum.CouponIdentifier + @"\*\}\]", consum.CouponCode.ToString().Trim(), RegexOptions.IgnoreCase));
        //                                                Body.Clear().Append(messagedata);
        //                                                consumed.ContactId = contactDetails.ContactId;
        //                                                consumed.Id = consum.Id;
        //                                                couponlist.Add(consumed);
        //                                            }
        //                                        }
        //                                    }
        //                                }
        //                            }
        //                        }
        //                    }
        //                }
        //            }
        //        }
        //    }
        //    catch
        //    {
        //        //
        //    }
        //    messagedata = null;
        //    return couponlist;
        //}
        #endregion

        #endregion Replace SMS Content



        public async Task<long> SaveSmsShortUrl(SmsShortUrl SmsShortUrlDetails)
        {
            long SavedShortUrlId = 0;
            try
            {
                using (var objDL = DLSmsShortUrl.GetDLSmsShortUrl(this.sqlVendor))
                {
                    SavedShortUrlId = await objDL.Save(new SmsShortUrl()
                    {
                        AccountId = SmsShortUrlDetails.AccountId,
                        SMSSendingSettingId = SmsShortUrlDetails.SMSSendingSettingId,
                        URLId = SmsShortUrlDetails.URLId,
                        WorkflowId = SmsShortUrlDetails.WorkflowId,
                        TriggerSMSDripsId = SmsShortUrlDetails.TriggerSMSDripsId,
                        CampaignType = SmsShortUrlDetails.CampaignType,
                        P5SMSUniqueID = SmsShortUrlDetails.P5SMSUniqueID
                    });
                }
            }
            catch (Exception ex)
            {
                SavedShortUrlId = 0;
                using (ErrorUpdation objError = new ErrorUpdation("ReplaceMessageWithSMSUrl"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "HelperForSMS->SaveSmsShortUrl", ex.ToString());
                }
            }
            return SavedShortUrlId;
        }

        public async Task<long> SaveWhatsAppShortUrl(WhatsappShortUrl whatsappShortUrlDetails)
        {
            long SavedShortUrlId = 0;
            try
            {
                using (var objBL = DLWhatsappShortUrl.GetDLWhatsappShortUrl(this.sqlVendor))
                {
                    SavedShortUrlId = await objBL.Save(new WhatsappShortUrl()
                    {
                        AccountId = whatsappShortUrlDetails.AccountId,
                        WhatsappSendingSettingId = whatsappShortUrlDetails.WhatsappSendingSettingId,
                        URLId = whatsappShortUrlDetails.URLId,
                        WorkflowId = whatsappShortUrlDetails.WorkflowId,
                        CampaignType = whatsappShortUrlDetails.CampaignType,
                        P5WhatsappUniqueID = whatsappShortUrlDetails.P5WhatsappUniqueID
                    });
                }
            }
            catch (Exception ex)
            {
                SavedShortUrlId = 0;
                using (ErrorUpdation objError = new ErrorUpdation("ReplaceMessageWithWhatsAppUrl"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "HelperForSMS->SaveWhatsAppShortUrl", ex.ToString());
                }
            }
            return SavedShortUrlId;
        }

        public static bool ValidHttpURL(string s)
        {
            string Pattern = @"^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$";
            Regex Rgx = new(Pattern, RegexOptions.Compiled | RegexOptions.IgnoreCase);
            return Rgx.IsMatch(s);
        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                }
            }
            //dispose unmanaged ressources
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
