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
    public class HelperForMail
    {
        readonly int AdsId;
        readonly string CampaignClickLink;
        readonly string OnlinePath;
        readonly string ImageOnlinepath = "https://" + Convert.ToString(AllConfigURLDetails.KeyValueForConfig["BUCKETPATH"]) + "/" + Convert.ToString(AllConfigURLDetails.KeyValueForConfig["TEMPLATEBUCKETMAINFOLDER"]) + "/";

        public string? SqlVendor { get; }

        public HelperForMail(int adsId, int MailSendingSettingId, int DripSequence, int DripConditionType, string onlinePath, string? sqlVendor)
        {
            AdsId = adsId;
            OnlinePath = onlinePath;
            SqlVendor = sqlVendor;
            CampaignClickLink = "MailTrack/Click?AdsId=" + AdsId + "&MailSendingSettingId=" + MailSendingSettingId + "&ContactId=<$ContactId$>&DripSequence=" + DripSequence + "&DripConditionType=" + DripConditionType + "&RedirectUrl=";
        }

        public HelperForMail(int adsId, int TriggerMailSMSId, int TriggerDripsId, string onlinePath)
        {
            AdsId = adsId;
            OnlinePath = onlinePath;
            CampaignClickLink = "TriggerTrack/Click?AdsId=" + AdsId + "&TriggerMailSMSId=" + TriggerMailSMSId + "&TriggerDripsId=" + TriggerDripsId + "&ContactId=<$ContactId$>&RedirectUrl=";
        }

        public HelperForMail(int adsId, string ClickUrl, string onlinePath)
        {
            AdsId = adsId;
            OnlinePath = onlinePath;
            CampaignClickLink = ClickUrl;
        }

        public void CleanMailBodyContentForTriggerMail(StringBuilder MainContentOftheMail)
        {
            try
            {
                if (MainContentOftheMail.ToString().Contains("href=\"") == true || MainContentOftheMail.ToString().Contains("href='") == true)
                {
                    if (MainContentOftheMail.ToString().Contains("href='mailto:") == true || MainContentOftheMail.ToString().Contains("href=\"mailto:") == true)
                    {
                        MainContentOftheMail = MainContentOftheMail.Replace("href='mailto:", "$mailto:$");
                        MainContentOftheMail = MainContentOftheMail.Replace("href=\"mailto:", "$mailto1:$");
                    }

                    if (MainContentOftheMail.ToString().Contains("$mailto:$") == true || MainContentOftheMail.ToString().Contains("$mailto1:$") == true)
                    {
                        MainContentOftheMail = MainContentOftheMail.Replace("$mailto:$", "href='mailto:");
                        MainContentOftheMail = MainContentOftheMail.Replace("$mailto1:$", "href=\"mailto:");
                    }
                    if (MainContentOftheMail.Length > 0)
                        MainContentOftheMail = MainContentOftheMail.Replace("&lt;", "<").Replace("&gt;", ">").Replace("&amp;", "&");
                }
            }
            catch
            {
                //
            }
        }

        public void ReplaceContactDetails(StringBuilder Body, Contact contactDetails)
        {
            StringBuilder data = new StringBuilder();

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
                data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*ContactNumber\*\}\]", "", RegexOptions.IgnoreCase));
                Body.Clear().Append(data);
            }

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
                    else if (string.IsNullOrEmpty(ReplacingValue))
                    {
                        data.Clear().Append(Regex.Replace(Body.ToString(), "<!--" + Name + "-->", "[{*" + Name + "*}]", RegexOptions.IgnoreCase));
                        Body.Clear().Append(data);

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

        public string ChangeUrlToPlumb(StringBuilder MailBody, string ClickLinkControllerToAction = null)
        {
            string Body = MailBody.ToString();
            string ClkUrlText = "";

            if (Body.ToString().Contains("</a") == true)
            {
                string[] spit = Regex.Split(Body, "<a ");
                Body = "";
                foreach (string spits in spit)
                {
                    if (spits != "")
                    {
                        if (spits.Contains("</a") == true)    //if (spits.Contains("href=\"") == true || spits.Contains("href='") == true)
                        {
                            try
                            {
                                String title1 = spits.Substring(spits.IndexOf(">"));
                                if (title1.Contains("<img") == true)
                                {
                                    string searchSrc = title1.Substring(title1.IndexOf("src="));
                                    string GetSrc = searchSrc.Substring(5);
                                    int Srcleng = GetSrc.IndexOf("\"");
                                    ClkUrlText = searchSrc.Substring(5, Srcleng);
                                }
                                else
                                {
                                    string name = title1.Substring(title1.IndexOf(">"));
                                    int len = name.IndexOf("</a>");
                                    name = name.Substring(0, len + 5);
                                    len = name.IndexOf("</a>");
                                    ClkUrlText = HTMLToText(name.Substring(0, len));
                                    ClkUrlText = ClkUrlText.Replace(">", "");
                                    ClkUrlText = ClkUrlText.Replace(" ", "+");
                                }

                                if (String.IsNullOrEmpty(ClickLinkControllerToAction))
                                    ClickLinkControllerToAction = CampaignClickLink;

                                string HashedUrl = "";
                                string OriginalUrl = "";

                                if (spits.Contains("href=\"") == true)
                                {
                                    string Url = spits.Substring(spits.IndexOf("href=\""));
                                    string GetSrc = Url.Substring(6);
                                    int Srcleng = GetSrc.IndexOf("\"");
                                    OriginalUrl = Url.Substring(6, Srcleng);
                                    HashedUrl = Helper.GetHashedShortenUrl(OriginalUrl);

                                    if (HashedUrl.Contains("#"))
                                    {
                                        HashedUrl = HashedUrl.Replace("#", "~ph~");
                                    }

                                }

                                Body += "<a ";

                                if (spits.Contains("mailto:") == false && !spits.Contains("mailresponses.plumb5.com") && !spits.Contains("mailtrack.plumb5.com"))
                                {
                                    if (spits.Contains("href=\"") == true && !spits.Contains(OnlinePath))
                                    {
                                        if (!string.IsNullOrEmpty(OriginalUrl))
                                            Body += spits.Replace("href=\"", "href=\"" + OnlinePath + ClickLinkControllerToAction).Replace(OriginalUrl, HashedUrl);
                                        else
                                            Body += spits.Replace("href=\"", "href=\"" + OnlinePath + ClickLinkControllerToAction);
                                    }
                                    else if (!spits.Contains(OnlinePath))
                                    {
                                        if (!string.IsNullOrEmpty(OriginalUrl))
                                            Body += spits.Replace("href='", "href='" + OnlinePath + ClickLinkControllerToAction).Replace(OriginalUrl, HashedUrl);
                                        else
                                            Body += spits.Replace("href='", "href='" + OnlinePath + ClickLinkControllerToAction);
                                    }
                                    else
                                    {
                                        Body += spits;
                                    }
                                }
                                else
                                {
                                    Body += spits;
                                }
                            }
                            catch
                            {
                            }
                        }
                        else
                        {
                            Body += spits;
                        }
                    }
                }
            }

            MailBody.Clear().Append(Body);
            return MailBody.ToString();
        }
        private string HTMLToText(string HTMLCode)
        {
            // Remove new lines since they are not visible in HTML
            HTMLCode = HTMLCode.Replace("\n", " ");

            // Remove tab spaces
            HTMLCode = HTMLCode.Replace("\t", " ");

            // Remove multiple white spaces from HTML
            HTMLCode = Regex.Replace(HTMLCode, "\\s+", " ");

            // Remove HEAD tag
            HTMLCode = Regex.Replace(HTMLCode, "<head.*?</head>", ""
                                , RegexOptions.IgnoreCase | RegexOptions.Singleline);

            // Remove any JavaScript
            HTMLCode = Regex.Replace(HTMLCode, "<script.*?</script>", "", RegexOptions.IgnoreCase | RegexOptions.Singleline);

            // Replace special characters like &, <, >, " etc.
            StringBuilder sbHTML = new StringBuilder(HTMLCode);
            // Note: There are many more special characters, these are just
            // most common. You can add new characters in this arrays if needed
            string[] OldWords = { "&nbsp;", "&amp;", "&quot;", "&lt;", "&gt;", "&reg;", "&copy;", "&bull;", "&trade;" };
            string[] NewWords = { " ", "&", "\"", "<", ">", "®", "©", "•", "™" };
            for (int i = 0; i < OldWords.Length; i++)
            {
                sbHTML.Replace(OldWords[i], NewWords[i]);
            }

            // Check if there are line breaks (<br>) or paragraph (<p>)
            sbHTML.Replace("<br>", "\n<br>");
            sbHTML.Replace("<br ", "\n<br ");
            sbHTML.Replace("<p ", "\n<p ");

            // Finally, remove all HTML tags and return plain text
            return Regex.Replace(sbHTML.ToString(), "<[^>]*>", "");
        }

        public string ChangeImageToOnlineUrl(StringBuilder MailBody, MailTemplate template)
        {
            string Body = MailBody.ToString();
            List<string> AllImages = new List<string>();

            //foreach (Match m in Regex.Matches(Body, "<img.+?src=[\"'](.+?)[\"'].+?>", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace))
            foreach (Match m in Regex.Matches(Body, "<img.*?src=[\"'](.+?)[\"'].*?>", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace))
            {
                try
                {
                    string getImg = Regex.Match(m.Value, "<img.*?src=[\"'](.+?)[\"'].*?>", RegexOptions.IgnoreCase).Groups[1].Value;
                    if (!getImg.Contains("http"))
                    {
                        if (getImg.Contains(".jpg") == true || getImg.Contains(".gif") == true || getImg.Contains(".JPG") == true || getImg.Contains(".GIF") == true || getImg.Contains(".png") == true || getImg.Contains(".PNG") == true || getImg.Contains(".bmp") == true || getImg.Contains(".BMP") == true)
                        {
                            if (!AllImages.Contains(getImg, StringComparer.CurrentCultureIgnoreCase))
                            {
                                AllImages.Add(getImg);
                            }
                        }
                    }
                }
                catch
                {
                    //
                }
            }

            for (int i = 0; i < AllImages.Count; i++)
            {
                string strsplit2 = ImageOnlinepath + "Campaign-" + AdsId + "-" + template.Id + @"/" + AllImages[i];
                Body = Body.Replace(AllImages[i], strsplit2);
            }

            MailBody.Clear().Append(Body);
            return MailBody.ToString();
        }

        #region Product Grouping
        public async Task<List<string>> ReplaceProductGrouping(StringBuilder Body, Contact contactDetails, string ProductGroupName, StringBuilder notSentProductIds)
        {
            List<string> listproducts = new List<string>();
            string[] GroupName = ProductGroupName.Split(',');
            List<Product> listproduct = new List<Product>();
            List<Product> products = new List<Product>();
            using (var objDL = DLProduct.GetDLProduct(AdsId, SqlVendor))
            {
                foreach (var item in GroupName)
                {
                    products = (await objDL.ExecuteFilterQuery(Convert.ToInt32(item), contactDetails.ContactId)).ToList();
                    listproduct = listproduct.Union(products).ToList();
                }
            }
            if (listproduct.Count > 0)
            {
                listproduct = listproduct.GroupBy(x => x.Id).Select(x => x.First()).ToList();

                #region Product round robin
                //using (DLProductSendToContact objproduct = new DLProductSendToContact(AdsId))
                //{
                //    List<ProductSendToContact> listProductSendToContact = new List<ProductSendToContact>();
                //    ProductSendToContact objProductSendToContact = new ProductSendToContact();
                //    objProductSendToContact.ContactId = contactDetails.ContactId;
                //    objProductSendToContact.SentType = "MAIL";
                //    listProductSendToContact = objproduct.GetProductList(objProductSendToContact);
                //    if (listProductSendToContact.Count > 0)
                //    {
                //        List<Product> lstmatchproduct = new List<Product>();
                //        lstmatchproduct = (from a in listproduct
                //                           join b in listProductSendToContact on a.Id equals b.ProductId
                //                           select a
                //                           ).ToList();
                //        //remove matched product
                //        listproduct = listproduct.Where(c => listProductSendToContact.All(w => w.ProductId != c.Id)).ToList();
                //        //insert matched record to bottom of list
                //        if (listproduct.Count < 2)
                //        {
                //            //move all product from productsent to productsenttocontact history table and delete from productsenttocontact
                //            objproduct.MoveAndDelete(objProductSendToContact);

                //        }
                //        listproduct.InsertRange(listproduct.Count, lstmatchproduct);
                //        listproduct = listproduct.GroupBy(x => x.Id).Select(x => x.First()).ToList();
                //    }
                //}
                #endregion

                Product objProduct = default(Product);
                objProduct = Activator.CreateInstance<Product>();
                StringBuilder data = new StringBuilder();
                foreach (var item in listproduct.Take(8).Select((value, i) => new { i, value }))
                {

                    var index = item.i + 1;
                    if (Body.ToString().Contains("[{*"))
                    {
                        foreach (PropertyInfo prop in objProduct.GetType().GetProperties())
                        {
                            if (Body.ToString().IndexOf("[{*" + prop.Name + "_" + index + "*}]", StringComparison.InvariantCultureIgnoreCase) > -1)
                            {
                                string DataType = (prop.PropertyType.IsGenericType && prop.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>) ? prop.PropertyType.GetGenericArguments()[0].Name.ToString() : prop.PropertyType.Name).ToLower();

                                var OriginalValue = item.value.GetType().GetProperty(prop.Name, BindingFlags.SetProperty | BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(item.value);
                                string values = (OriginalValue == null || string.IsNullOrEmpty(OriginalValue.ToString())) ? "" : OriginalValue.ToString();

                                if (DataType == "decimal" && !string.IsNullOrEmpty(values))
                                {
                                    values = Math.Round(Convert.ToDecimal(values), 1).ToString();
                                }
                                else if (DataType == "double" && !string.IsNullOrEmpty(values))
                                {
                                    values = Math.Round(Convert.ToDouble(values), 1).ToString();
                                }
                                else if (DataType == "datetime")
                                {
                                    values = "";
                                }
                                if (!string.IsNullOrEmpty(values))
                                {

                                    data.Clear();
                                    data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*" + prop.Name + "_" + index + @"\*\}\]", values.ToString().Trim(), RegexOptions.IgnoreCase));
                                    Body.Clear().Append(data);
                                    if (!listproducts.Any(x => x == item.value.Id))
                                        listproducts.Add(item.value.Id);
                                }
                                else
                                {
                                    if (!notSentProductIds.ToString().Contains(item.value.Id))
                                        notSentProductIds.Append(item.value.Id).Append(",");
                                }
                            }
                        }
                    }
                    else
                    {
                        break;
                    }

                }
                data.Clear();
                data.Clear().Append(notSentProductIds.ToString().Trim(','));
                notSentProductIds.Clear().Append(data);
                data = null;
            }
            return listproducts;
        }
        #endregion Product Grouping

        public void SaveProductSendToContact(List<string> listproducts, int ContactId)
        {
            if (listproducts.Count > 0)
            {
                //using (DLProductSendToContact objproduct = new DLProductSendToContact(AdsId))
                //{
                //    ProductSendToContact objProductSendToContact = new ProductSendToContact();
                //    for (int i = 0; i < listproducts.Count; i++)
                //    {
                //        objProductSendToContact.ContactId = ContactId;
                //        objProductSendToContact.ProductId = listproducts[i];
                //        objProductSendToContact.SentType = "MAIL";
                //        objproduct.Save(objProductSendToContact);
                //    }
                //}
            }
        }
    }
}
