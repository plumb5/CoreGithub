using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using RestSharp.Extensions;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;

namespace Plumb5GenralFunction
{
    #region SendGrid Object 

    public class SendGrid_To
    {
        public string email { get; set; }
        public string name { get; set; }
    }

    public class SendGrid_Personalization
    {
        public List<SendGrid_To> to { get; set; }
        public string subject { get; set; }
    }

    public class SendGrid_From
    {
        public string email { get; set; }
        public string name { get; set; }
    }

    public class SendGrid_ReplyTo
    {
        public string email { get; set; }
        public string name { get; set; }
    }

    public class SendGrid_Content
    {
        public string type { get; set; }
        public string value { get; set; }
    }

    public class SendGrid_RootObject
    {
        public List<SendGrid_Personalization> personalizations { get; set; }
        public SendGrid_From from { get; set; }
        public SendGrid_ReplyTo reply_to { get; set; }
        public string subject { get; set; }
        public List<SendGrid_Content> content { get; set; }
    }


    #endregion SendGrid Object 

    #region Juvlon Object

    public class Juvlon_Body
    {
        public string subject { get; set; }
        public string from { get; set; }
        public string fromName { get; set; }
        public string replyto { get; set; }
        public string to { get; set; }
        public string cc { get; set; }
        public string bcc { get; set; }
        public string body { get; set; }
        public string customField { get; set; }
        public string trackOpens { get; set; } = "1";
        public string trackClicks { get; set; } = "1";
    }

    public class Juvlon_RootObject
    {
        public string ApiKey { get; set; }
        public List<Juvlon_Body> requests { get; set; }
    }
    #endregion Juvlon Object

    public class SendMailGeneral : IDisposable
    {
        private readonly IDistributedCache _cache;

        private readonly string? SQLProvider;
        public SendMailGeneral(IConfiguration _configuration, IDistributedCache cache)
        {
            SQLProvider = _configuration["SqlProvider"];
            _cache = cache;
        }


        #region Declearation
        int AccountId;
        public StringBuilder MainContentOftheMail = new StringBuilder();
        MailTemplate templateDetails;
        List<MailTemplateAttachment> mailTemplateAttachment;
        string attachments;
        public string ErrorMessage;
        MailSetting mailSending; MailConfiguration mailConfigration;
        Dictionary<string, string> falconideAttachment;
        HelperForMail HelpMail;
        string UnSubscribePath = null;
        string MailTrackController = "USSDTrack";// Please don't change default value, this will it will effect in tracking
        public string SingleMailReponseIdByVendor = "";
        public List<string> listproducts = new List<string>();
        public string notsentproducts = "";

        string onlinePath = AllConfigURLDetails.KeyValueForConfig["MAILTRACK"].ToString();
        public string body = "";
        bool SaveReportInSideClassBecauseAsnycCall;
        public MailSentSavingDetials mailSentSavingDetials;

        public int MailCampaignId;
        public List<MailSent> P5MailSentMailUniqueID = new List<MailSent>();
        #endregion Declearation

        public SendMailGeneral(int accountId, MailSetting mailsending, MailConfiguration mailConfig, string mailTrackController = null, string SqlProvider = null, bool saveReportInSideClassBecauseAsnycCall = false, MailSentSavingDetials _mailSentSavingDetials = null)
        {
            AccountId = accountId;
            mailConfigration = mailConfig;
            UnSubscribePath = AllConfigURLDetails.KeyValueForConfig["MAILTRACKPATH"] + "\\TempFiles\\UnSubscribeTemplate-" + AccountId + "\\";
            templateDetails = new MailTemplate { Id = mailsending.MailTemplateId };
            mailSending = mailsending;
            MailTrackController = mailTrackController;
            SaveReportInSideClassBecauseAsnycCall = saveReportInSideClassBecauseAsnycCall;
            mailSentSavingDetials = _mailSentSavingDetials;
            if (!string.IsNullOrEmpty(mailConfigration.DomainForTracking) && !string.IsNullOrEmpty(mailConfigration.DomainForImage))
            {
                onlinePath = mailConfigration.DomainForTracking;
            }

            string ClickUrl = MailTrackController + "/Click/" + AccountId + "/<$P5MailUniqueID$>?RedirectUrl=";
            HelpMail = new HelperForMail(AccountId, ClickUrl, onlinePath);

            using (var objDLTemplate = DLMailTemplate.GetDLMailTemplate(AccountId, SqlProvider))
            {
                try
                {
                    templateDetails = objDLTemplate.GETDetails(templateDetails);
                }
                catch (Exception ex)
                {
                    using (ErrorUpdation objError = new ErrorUpdation("TemplateCallingError"))
                    {
                        objError.AddError(ex.Message.ToString(), "Exception in->" + accountId, DateTime.Now.ToString(), "SendMailGeneral->SendMailGeneral", ex.ToString());
                    }
                    templateDetails = objDLTemplate.GETDetails(templateDetails);
                }
                MailCampaignId = templateDetails.MailCampaignId;
            }


            //This is taking here values so that I can use for saving
            if (SaveReportInSideClassBecauseAsnycCall)
            {
                var objDLMailSent = DLMailSent.GetDLMailSent(accountId, SqlProvider);
                if (mailSentSavingDetials != null && templateDetails != null)
                {
                    mailSentSavingDetials.MailCampaignId = templateDetails.MailCampaignId;
                }
            }

            using (var objDLAttachment = DLMailTemplateAttachment.GetDLMailTemplateAttachment(AccountId, SqlProvider))
            {
                try
                {
                    mailTemplateAttachment = objDLAttachment.GetAttachments(templateDetails.Id);
                }
                catch (Exception ex)
                {
                    using (ErrorUpdation objError = new ErrorUpdation("TemplateAttachmentCallingError"))
                    {
                        objError.AddError(ex.Message.ToString(), "Exception in->" + accountId, DateTime.Now.ToString(), "SendMailGeneral->SendMailGeneral", ex.ToString());
                    }
                    mailTemplateAttachment = objDLAttachment.GetAttachments(templateDetails.Id);
                }
            }

            try
            {
                AppendMailTemplate(SqlProvider);

                HelpMail.CleanMailBodyContentForTriggerMail(MainContentOftheMail);
                HelpMail.ChangeUrlToPlumb(MainContentOftheMail);
                HelpMail.ChangeImageToOnlineUrl(MainContentOftheMail, templateDetails);
            }
            catch (Exception ex)
            {
                throw ex;
            }

            if (mailTemplateAttachment.Count > 0)
            {
                falconideAttachment = new Dictionary<string, string>();
                SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(AccountId, templateDetails.Id);
                for (int i = 0; i < mailTemplateAttachment.Count; i++)
                {
                    if (mailConfigration.ProviderName == "Elastic Mail")
                    {
                        attachments += ";" + awsUpload.GetFileContentString(mailTemplateAttachment[i].AttachmentFileName, awsUpload.bucketname);
                    }
                    else if (mailConfigration.ProviderName == "NetCore Falconide")
                    {
                        if (!falconideAttachment.ContainsKey(mailTemplateAttachment[i].AttachmentFileName))
                        {
                            Stream fileStream = awsUpload.GetFileContentStream(mailTemplateAttachment[i].AttachmentFileName, awsUpload.bucketname);
                            string fileString = Convert.ToString(fileStream.ReadAsBytes());
                            falconideAttachment.Add(mailTemplateAttachment[i].AttachmentFileName, fileString);
                        }
                    }
                }
            }
            if (!String.IsNullOrEmpty(attachments))
                attachments = attachments.TrimStart(';');

        }

        public async Task<bool> SendMail(Contact contact, string P5MailUniqueID)
        {
            StringBuilder Body = new StringBuilder();
            StringBuilder SubjectBody = new StringBuilder();
            listproducts = new List<string>();
            StringBuilder notSentProductIds = new StringBuilder();

            string unsubsUrl = "", forwardUrl = "", mailOpen = "", OrginalUnsubsUrl = "";
            Body.Clear().Append(MainContentOftheMail);
            SubjectBody.Clear().Append(mailSending.Subject);
            try
            {
                if (mailSending.Subscribe)
                {
                    if (mailConfigration.UnsubscribeUrl != null && !string.IsNullOrEmpty(mailConfigration.UnsubscribeUrl) && mailConfigration.UnsubscribeUrl.Length > 0)
                        OrginalUnsubsUrl = mailConfigration.UnsubscribeUrl;
                    else if (templateDetails.RequireCustomisedUnSububscribe && mailSending.Subscribe && Directory.Exists(UnSubscribePath))
                        OrginalUnsubsUrl = onlinePath + "TempFiles/UnSubscribeTemplate-" + AccountId.ToString() + "/UnSubscribeFinalTemplate.html?AccountId=" + AccountId + "&P5MailUniqueID=" + P5MailUniqueID + "";
                    else
                        OrginalUnsubsUrl = onlinePath + MailTrackController + "/Unsubscribe/" + AccountId + "/" + P5MailUniqueID + "";
                }

                if ((Body.ToString().IndexOf("[unsubscribe]", StringComparison.InvariantCultureIgnoreCase) > -1) || (Body.ToString().IndexOf("<!--unsubscribe-->", StringComparison.InvariantCultureIgnoreCase) > -1) || (Body.ToString().IndexOf("[{*unsubscribe*}]", StringComparison.InvariantCultureIgnoreCase) > -1))
                {
                    unsubsUrl = string.Empty;
                }
                else
                {
                    unsubsUrl = OrginalUnsubsUrl;
                }

                if (mailSending.Forward)
                    forwardUrl = onlinePath + MailTrackController + "/Forward/" + AccountId + "/" + P5MailUniqueID + "";

                mailOpen = onlinePath + MailTrackController + "/Index/" + AccountId + "/" + P5MailUniqueID + "";

                if (Body.ToString().Contains("<$P5MailUniqueID$>") == true) Body.Replace("<$P5MailUniqueID$>", P5MailUniqueID);
                if (Body.ToString().Contains("<$ContactId$>") == true) Body.Replace("<$ContactId$>", contact.ContactId.ToString());
            }
            catch { }

            string footerContent = "";

            if (!String.IsNullOrEmpty(unsubsUrl))
            {
                if (mailConfigration.ProviderName == "Elastic Mail")
                    unsubsUrl = @"<br/>If you believe this has been sent to you by mistake, please <a style='color:#999999;' href='{unsubscribe:" + unsubsUrl + @"}' >Unsubscribe</a>*";
                else
                    unsubsUrl = @"<br/>If you believe this has been sent to you by mistake, please <a style='color:#999999;' href='" + unsubsUrl + @"' target='_blank'>Unsubscribe</a>*";
            }
            if (!String.IsNullOrEmpty(forwardUrl))
            {
                forwardUrl = @"<br /> If you wish to forward this email, <a style='color:#999999;' href='" + forwardUrl + @"' target='_blank'>forward</a>";
            }

            string footerUrl = @"<table cellpadding='0' cellspacing='0' border='0' width='100%' style='font-size:80%;'>
                                    <tbody>
                                        <tr>
                                            <td width='510' align='left' style='font-family: \'Segoe UI\',Helvetica,Arial,sans-serif; font-size: 10px; line-height: 16px; color: #505050; padding-bottom: 13px'>
                                                " + unsubsUrl + @"
                                                <br />
                                                " + forwardUrl + @"
                                                <br />
                                                <br />
                                                " + footerContent + @"
                                                <br />
                                                <br />
                                            </td>
                                            <td width='45' valign='top' align='left' style='padding-bottom: 13px'>&nbsp;</td>
                                        </tr>
                                    </tbody>
                                </table>";

            Body.Append("<img height=\"0px\" width=\"0px\" style=\"display:none\" src=\"" + mailOpen + "\" alt='' />");
            Body.Replace("</body>", "").Replace("</html>", "").Append(footerUrl).Append("</body></html>");

            StringBuilder data = new StringBuilder();
            data.Append(Regex.Replace(Body.ToString(), @"\[unsubscribe\]", OrginalUnsubsUrl, RegexOptions.IgnoreCase));
            Body.Clear().Append(data.ToString());

            data.Clear();
            data.Clear().Append(Regex.Replace(Body.ToString(), "<!--unsubscribe-->", OrginalUnsubsUrl, RegexOptions.IgnoreCase));
            Body.Clear().Append(data.ToString());

            data.Clear();
            data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*unsubscribe\*\}\]", OrginalUnsubsUrl, RegexOptions.IgnoreCase));
            Body.Clear().Append(data.ToString());

            HelpMail.ReplaceContactDetails(Body, contact);
            HelpMail.ReplaceContactDetails(SubjectBody, contact);

            if (!string.IsNullOrEmpty(templateDetails.ProductGroupName))
            {
                listproducts = await HelpMail.ReplaceProductGrouping(Body, contact, templateDetails.ProductGroupName, notSentProductIds);
            }

            var objDLMailSent = DLMailSent.GetDLMailSent(AccountId, SQLProvider);

            if ((Body.ToString().Contains("[{*")) && (Body.ToString().Contains("*}]")))
            {
                body = Helper.Base64Encode(Body.ToString());
                notsentproducts = notSentProductIds.ToString();
                ErrorMessage = "Template dynamic content not replaced";

                if (SaveReportInSideClassBecauseAsnycCall)
                {
                    MailSent mailSent = new MailSent();
                    mailSent.MailTemplateId = templateDetails.Id;
                    mailSent.MailCampaignId = templateDetails.MailCampaignId;
                    mailSent.MailSendingSettingId = mailSentSavingDetials.ConfigurationId;
                    mailSent.GroupId = mailSentSavingDetials.GroupId;
                    mailSent.ContactId = contact.ContactId;
                    mailSent.EmailId = contact.EmailId;
                    mailSent.DripSequence = Convert.ToInt16(mailSentSavingDetials.DripSequence);
                    mailSent.DripConditionType = Convert.ToInt16(mailSentSavingDetials.DripConditionType);
                    mailSent.SendStatus = 0;
                    mailSent.ProductIds = notSentProductIds.ToString();
                    mailSent.ErrorMessage = ErrorMessage;
                    mailSent.MailConfigurationNameId = mailConfigration.MailConfigurationNameId;
                    objDLMailSent.Send(mailSent);
                }
                return false;
            }
            else if ((SubjectBody.ToString().Contains("[{*")) && (SubjectBody.ToString().Contains("*}]")))
            {
                body = Helper.Base64Encode(Body.ToString());
                notsentproducts = notSentProductIds.ToString();
                ErrorMessage = "Subject dynamic content not replaced";

                if (SaveReportInSideClassBecauseAsnycCall)
                {
                    MailSent mailSent = new MailSent();
                    mailSent.MailTemplateId = templateDetails.Id;
                    mailSent.MailCampaignId = templateDetails.MailCampaignId;
                    mailSent.MailSendingSettingId = mailSentSavingDetials.ConfigurationId;
                    mailSent.GroupId = mailSentSavingDetials.GroupId;
                    mailSent.ContactId = contact.ContactId;
                    mailSent.EmailId = contact.EmailId;
                    mailSent.DripSequence = Convert.ToInt16(mailSentSavingDetials.DripSequence);
                    mailSent.DripConditionType = Convert.ToInt16(mailSentSavingDetials.DripConditionType);
                    mailSent.SendStatus = 0;
                    mailSent.ProductIds = notSentProductIds.ToString();
                    mailSent.ErrorMessage = ErrorMessage;
                    mailSent.MailConfigurationNameId = mailConfigration.MailConfigurationNameId;
                    objDLMailSent.Send(mailSent);
                }
                return false;
            }
            else
            {
                return await SendMailByDecidingProvider(Body, contact, SubjectBody, P5MailUniqueID);
            }
        }

        private async Task<bool> SendMailByDecidingProvider(StringBuilder Body, Contact contact, StringBuilder subjectBody, string P5MailUniqueID)
        {
            NameValueCollection mailValues = null;
            if (mailConfigration.ProviderName == "Elastic Mail")
            {
                mailValues = ElasticMailParameters(Body, contact, subjectBody);

                return await ElastiAPICall(mailValues, contact, Body, P5MailUniqueID);
            }
            else if (mailConfigration.ProviderName == "NetCore Falconide")
            {
                mailValues = NetCoreFalonide(Body, contact, subjectBody);
                return await NetcoreAPICall(mailValues, contact, Body, P5MailUniqueID);
            }
            else if (mailConfigration.ProviderName == "SendGrid")
            {
                JObject SendGridObject = SendGridParameters(Body, contact, subjectBody);
                return await SendGridAPICall(mailConfigration.ApiKey, SendGridObject, contact, Body, P5MailUniqueID);
            }
            else if (mailConfigration.ProviderName == "Everlytic" && !String.IsNullOrEmpty(mailConfigration.ConfigurationUrl))
            {
                JObject EverlyticObject = EverlyticParameters(Body, contact, subjectBody);
                return await EverlyticAPICall(EverlyticObject, contact, Body, P5MailUniqueID);
            }
            else if (mailConfigration.ProviderName.ToLower() == "plumb5")
            {
                return await PlumbAPICall(contact, Body, P5MailUniqueID);
            }
            else if (mailConfigration.ProviderName == "Juvlon")
            {
                JObject JuvlonObject = JuvlonParameters(Body, contact, subjectBody);
                return await JuvlonAPICall(mailConfigration.ApiKey, JuvlonObject, contact, Body, P5MailUniqueID);
            }
            return false;
        }

        private NameValueCollection ElasticMailParameters(StringBuilder Body, Contact contact, StringBuilder subjectBody)
        {
            NameValueCollection mailValues = new NameValueCollection();
            mailValues.Add("api_key", mailConfigration.ApiKey);
            mailValues.Add("from", mailSending.FromEmailId);
            mailValues.Add("from_name", mailSending.FromName);
            mailValues.Add("subject", subjectBody.ToString());

            if (!String.IsNullOrEmpty(mailSending.ReplyTo))
                mailValues.Add("reply_to", mailSending.ReplyTo);

            if (Body != null)
            {
                mailValues.Add("body_html", Body.ToString());
            }
            if (!String.IsNullOrEmpty(attachments) && attachments.Length > 0)
                mailValues.Add("attachments", attachments);

            mailValues.Add("to", contact.EmailId);
            if (mailSending.IsTransaction)
                mailValues.Add("isTransactional", "true");

            return mailValues;
        }

        private JObject SendGridParameters(StringBuilder Body, Contact contact, StringBuilder subjectBody)
        {
            SendGrid_To to = new SendGrid_To();
            to.email = contact.EmailId;
            if (!String.IsNullOrEmpty(contact.Name))
                to.name = contact.Name;


            SendGrid_Personalization Personalization = new SendGrid_Personalization();
            Personalization.to = new List<SendGrid_To>();
            Personalization.to.Add(to);
            Personalization.subject = subjectBody.ToString();


            SendGrid_From From = new SendGrid_From()
            {
                email = mailSending.FromEmailId,
                name = mailSending.FromName
            };

            SendGrid_ReplyTo ReplyTo = new SendGrid_ReplyTo()
            {
                email = mailSending.ReplyTo,
                name = ""
            };

            SendGrid_Content Content = new SendGrid_Content()
            {
                type = "text/html",
                value = Body.ToString()
            };
            SendGrid_RootObject RootObject = new SendGrid_RootObject();
            RootObject.content = new List<SendGrid_Content>();
            RootObject.content.Add(Content);
            RootObject.from = From;
            RootObject.personalizations = new List<SendGrid_Personalization>();
            RootObject.personalizations.Add(Personalization);
            RootObject.reply_to = ReplyTo;
            RootObject.subject = subjectBody.ToString();

            JObject jObj = JObject.FromObject(RootObject);
            return jObj;
        }

        private NameValueCollection NetCoreFalonide(StringBuilder Body, Contact contact, StringBuilder subjectBody)
        {
            NameValueCollection mailValues = new NameValueCollection();
            mailValues.Add("api_key", mailConfigration.ApiKey);
            mailValues.Add("from", mailSending.FromEmailId);
            mailValues.Add("fromname", mailSending.FromName);
            mailValues.Add("subject", subjectBody.ToString());

            if (!String.IsNullOrEmpty(mailSending.ReplyTo))
                mailValues.Add("replytoid", mailSending.ReplyTo);

            if (Body != null)
            {
                mailValues.Add("content", Body.ToString());
            }
            mailValues.Add("recipients", contact.EmailId);

            // Attachment Pending
            if (falconideAttachment != null && falconideAttachment.Count > 0)
            {
                mailValues.Add("encoding_type", "base64");
                foreach (var eachData in falconideAttachment)
                    mailValues.Add("files[" + eachData.Key + "]", eachData.Value);
            }
            return mailValues;
        }

        private JObject EverlyticParameters(StringBuilder Body, Contact contact, StringBuilder subjectBody)
        {
            Everlytic_RootObject RootObject = new Everlytic_RootObject();

            Everlytic_Body everlytic_Body = new Everlytic_Body();
            everlytic_Body.html = Body.ToString();
            everlytic_Body.text = "";

            RootObject.body = everlytic_Body;

            Everlytic_Headers everlytic_Headers = new Everlytic_Headers();
            everlytic_Headers.subject = subjectBody.ToString();

            var toEmail = new Dictionary<string, string>();
            toEmail.Add(contact.EmailId, contact.Name);

            everlytic_Headers.to = toEmail;

            var fromEmail = new Dictionary<string, string>();
            fromEmail.Add(mailSending.FromEmailId, mailSending.FromName);

            everlytic_Headers.from = fromEmail;

            var replyToEmail = new Dictionary<string, string>();
            replyToEmail.Add(mailSending.ReplyTo, mailSending.ReplyTo);

            everlytic_Headers.reply_to = replyToEmail;

            RootObject.headers = everlytic_Headers;

            JObject jObj = JObject.FromObject(RootObject);
            return jObj;
        }

        private JObject JuvlonParameters(StringBuilder Body, Contact contact, StringBuilder subjectBody)
        {
            Juvlon_Body bodyObj = new Juvlon_Body();
            {
                bodyObj.subject = mailSending.Subject;
                bodyObj.from = mailSending.FromEmailId;
                bodyObj.fromName = mailSending.FromName;
                if (!String.IsNullOrEmpty(mailSending.ReplyTo))
                    bodyObj.replyto = mailSending.ReplyTo;
                bodyObj.to = contact.EmailId;
                if (Body != null)
                {
                    bodyObj.body = Body.ToString();
                }
            };

            Juvlon_RootObject content = new Juvlon_RootObject();
            content.ApiKey = mailConfigration.ApiKey;
            content.requests = new List<Juvlon_Body>();
            content.requests.Add(bodyObj);

            JObject jobj = JObject.FromObject(content);
            return jobj;
        }

        #region API Call

        private async Task<bool> ElastiAPICall(NameValueCollection mailValues, Contact contact, StringBuilder Body, string P5MailUniqueID)
        {
            try
            {
                using (WebClient client = new WebClient())
                {
                    byte[] response = client.UploadValues(mailConfigration.ConfigurationUrl, mailValues);
                    string data = Encoding.UTF8.GetString(response);

                    if (!string.IsNullOrEmpty(data))
                    {
                        SingleMailReponseIdByVendor = "";
                        JObject itemObject = JObject.Parse(data.ToString());
                        var Message = itemObject["success"].ToString();
                        if (Message == "True")
                        {
                            SingleMailReponseIdByVendor = itemObject["data"]["transactionid"].ToString();
                        }
                        else
                        {
                            ErrorMessage = itemObject["error"].ToString();
                        }

                        if (SaveReportInSideClassBecauseAsnycCall && !string.IsNullOrEmpty(SingleMailReponseIdByVendor) && !string.IsNullOrEmpty(Body.ToString()))
                        {
                            if (listproducts != null && listproducts.Count > 0 && contact != null && contact.ContactId > 0)
                                HelpMail.SaveProductSendToContact(listproducts, contact.ContactId);
                            return SaveTheSentDetails(contact, Body.ToString(), P5MailUniqueID, SingleMailReponseIdByVendor);
                        }
                        else if (!string.IsNullOrEmpty(SingleMailReponseIdByVendor) && !string.IsNullOrEmpty(Body.ToString()))
                        {
                            body = Helper.Base64Encode(Body.ToString());

                            if (listproducts != null && listproducts.Count > 0 && contact != null && contact.ContactId > 0)
                                HelpMail.SaveProductSendToContact(listproducts, contact.ContactId);
                            return true;
                        }
                    }
                    else
                    {
                        ErrorMessage = "No Response Id found";
                    }
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SendMailGenral_Error_elastic"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "SendThat Function", "");
                }
                ErrorMessage = ex.Message.ToString();
                return false;
            }
            return false;
        }

        private async Task<bool> NetcoreAPICall(NameValueCollection mailValues, Contact contact, StringBuilder Body, string P5MailUniqueID)
        {
            try
            {
                using (WebClient client = new WebClient())
                {

                    string guidId = MailTrackController.ToLower() == "triggertrack" ? (P5MailUniqueID + "@@@trigger-" + AccountId.ToString()) : (P5MailUniqueID + "@@@campaign-" + AccountId.ToString());
                    mailValues.Add("X-APIHEADER", guidId);

                    byte[] response = client.UploadValues(mailConfigration.ConfigurationUrl, mailValues);

                    string data = Encoding.UTF8.GetString(response).ToLower();
                    JObject stuff = JObject.Parse(data);

                    if (stuff["message"].ToString().ToLower() == "success")
                    {
                        SingleMailReponseIdByVendor = P5MailUniqueID;

                        if (SaveReportInSideClassBecauseAsnycCall && !string.IsNullOrEmpty(SingleMailReponseIdByVendor) && !string.IsNullOrEmpty(Body.ToString()))
                        {
                            if (listproducts != null && listproducts.Count > 0 && contact != null && contact.ContactId > 0)
                                HelpMail.SaveProductSendToContact(listproducts, contact.ContactId);
                            return SaveTheSentDetails(contact, Body.ToString(), P5MailUniqueID, SingleMailReponseIdByVendor);
                        }
                        else if (!string.IsNullOrEmpty(SingleMailReponseIdByVendor) && !string.IsNullOrEmpty(Body.ToString()))
                        {
                            body = Helper.Base64Encode(Body.ToString());

                            if (listproducts != null && listproducts.Count > 0 && contact != null && contact.ContactId > 0)
                                HelpMail.SaveProductSendToContact(listproducts, contact.ContactId);
                            return true;
                        }
                    }
                    else if (stuff["message"].ToString().ToLower() == "error")
                    {
                        ErrorMessage = stuff["errormessage"].ToString().ToLower();
                    }
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SendMailGenral_Error_Netcore"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "SendThat Function", "");
                }
                return false;
            }
            return false;
        }

        private async Task<bool> SendGridAPICall(string ApiKey, JObject SendGridObject, Contact contact, StringBuilder Body, string P5MailUniqueID)
        {
            var resetClient = new RestClient(mailConfigration.ConfigurationUrl);
            var request = new RestRequest(Method.POST);
            request.AddHeader("content-type", "application/json");
            request.AddHeader("authorization", "Bearer " + ApiKey);
            request.AddParameter("application/json", JsonConvert.SerializeObject(SendGridObject), ParameterType.RequestBody);
            IRestResponse response = resetClient.Execute(request);
            if (response.StatusCode == HttpStatusCode.Accepted)
            {
                SingleMailReponseIdByVendor = P5MailUniqueID;

                if (SaveReportInSideClassBecauseAsnycCall && !string.IsNullOrEmpty(SingleMailReponseIdByVendor) && !string.IsNullOrEmpty(Body.ToString()))
                {
                    if (listproducts != null && listproducts.Count > 0 && contact != null && contact.ContactId > 0)
                        HelpMail.SaveProductSendToContact(listproducts, contact.ContactId);
                    return SaveTheSentDetails(contact, Body.ToString(), P5MailUniqueID, SingleMailReponseIdByVendor);
                }
                else if (!string.IsNullOrEmpty(SingleMailReponseIdByVendor) && !string.IsNullOrEmpty(Body.ToString()))
                {
                    body = Helper.Base64Encode(Body.ToString());

                    if (listproducts != null && listproducts.Count > 0 && contact != null && contact.ContactId > 0)
                        HelpMail.SaveProductSendToContact(listproducts, contact.ContactId);
                    return true;
                }

                return true;
            }
            else
            {
                ErrorMessage = response.ErrorMessage;
            }
            return false;
        }

        private async Task<bool> EverlyticAPICall(JObject EverlyticObject, Contact contact, StringBuilder Body, string P5MailUniqueID)
        {
            try
            {
                string jsonString = JsonConvert.SerializeObject(EverlyticObject);

                var resetClient = new RestClient(mailConfigration.ConfigurationUrl);
                var request = new RestRequest(Method.POST);
                request.AddHeader("content-type", "application/json");
                var AuthKey = Helper.Base64Encode("" + mailConfigration.AccountName + ":" + mailConfigration.ApiKey + "");
                request.AddHeader("authorization", "Basic " + AuthKey);
                request.AddParameter("application/json", jsonString, ParameterType.RequestBody);
                IRestResponse response = resetClient.Execute(request);
                var stuff = JObject.Parse(response.Content);
                if (response.StatusCode == HttpStatusCode.Created)
                {
                    if (stuff["collection"]["transaction_id"]["data"] != null && stuff["collection"]["transaction_id"]["data"].First != null)
                    {
                        var responseId = stuff["collection"]["transaction_id"]["data"][contact.EmailId];
                        if (responseId != null && !string.IsNullOrEmpty(responseId.ToString()))
                            SingleMailReponseIdByVendor = responseId.ToString();
                        else
                            SingleMailReponseIdByVendor = P5MailUniqueID;

                        if (SaveReportInSideClassBecauseAsnycCall && !string.IsNullOrEmpty(SingleMailReponseIdByVendor) && !string.IsNullOrEmpty(Body.ToString()))
                        {
                            if (listproducts != null && listproducts.Count > 0 && contact.ContactId > 0)
                                HelpMail.SaveProductSendToContact(listproducts, contact.ContactId);
                            return SaveTheSentDetails(contact, Body.ToString(), P5MailUniqueID, SingleMailReponseIdByVendor);
                        }
                        else if (!string.IsNullOrEmpty(SingleMailReponseIdByVendor))
                        {
                            body = "";
                            if (listproducts != null && listproducts.Count > 0 && contact.ContactId > 0)
                                HelpMail.SaveProductSendToContact(listproducts, contact.ContactId);
                            return true;
                        }

                        return true;
                    }
                    else
                    {
                        ErrorMessage = "Success but empty response.";
                    }
                }
                else
                {
                    var responseMessage = stuff["error"]["code"] + " : " + stuff["error"]["message"];
                    if (responseMessage != null && !string.IsNullOrEmpty(responseMessage.ToString()))
                    {
                        ErrorMessage = responseMessage;
                        if (stuff["error"]["code"].ToString() == "10900")
                        {
                            try
                            {
                                using (var objDL = DLContact.GetContactDetails(AccountId, SQLProvider))
                                {
                                    await objDL.MakeItNotVerified(contact.ContactId, 0);
                                }
                            }
                            catch
                            {
                                //Ignore
                            }
                        }
                    }
                    else
                        ErrorMessage = "Everlytic response not found";
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SendMailGenral_Error_Everlytic"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "SendThat Function->EverlyticAPICall", ex.ToString());
                }
                ErrorMessage = ex.Message.ToString();
                return false;
            }
            return false;
        }

        private async Task<bool> PlumbAPICall(Contact contact, StringBuilder Body, string P5MailUniqueID)
        {
            try
            {
                body = Helper.Base64Encode(Body.ToString());
                //Please create a url in confuguration with plumb5 Api url..code present in P5API->Controllers->MailsController->SendPlumb5TestMail
                //var client = new RestClient("http://localhost:1330/Mails/SendPlumb5TestMail?ContactId=" + contact.ContactId + "&EmailId=" + contact.EmailId + "&MailConfigurationId=" + mailSentSavingDetials.ConfigurationId + "&P5MailUniqueID=" + P5MailUniqueID + "");
                var client = new RestClient(mailConfigration.ConfigurationUrl + "?ContactId=" + contact.ContactId + "&EmailId=" + contact.EmailId + "&MailConfigurationId=" + mailSentSavingDetials.ConfigurationId + "&P5MailUniqueID=" + P5MailUniqueID + "");
                var request = new RestRequest(Method.POST);
                request.AddHeader("cache-control", "no-cache");
                IRestResponse response = client.Execute(request);
                var responseJson = JObject.Parse(response.Content);
                if (responseJson["Status"].ToString().ToLower() == "true")
                {
                    SingleMailReponseIdByVendor = responseJson["Message"].ToString();
                    return true;
                }
                else
                {
                    ErrorMessage = responseJson["Message"].ToString();
                    return false;
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SendMailGenral_Error_plumb5"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "SendThat Function", "");
                }
                ErrorMessage = ex.Message.ToString();
                return false;
            }
        }

        private async Task<bool> JuvlonAPICall(string ApiKey, JObject JuvlonObject, Contact contact, StringBuilder Body, string P5MailUniqueID)
        {
            try
            {
                string jsonString = JsonConvert.SerializeObject(JuvlonObject);

                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                var restClient = new RestClient(mailConfigration.ConfigurationUrl);
                var request = new RestRequest(Method.POST);
                request.AddHeader("content-type", "application/json");
                request.AddParameter("application/json", jsonString, ParameterType.RequestBody);
                IRestResponse response = restClient.Execute(request);
                var stuff = JObject.Parse(response.Content);

                if (stuff["status"].ToString().ToLower() == "success")
                {
                    var responseId = (string)stuff["transactionId"];
                    if (responseId != null && !string.IsNullOrEmpty(responseId.ToString()))
                        SingleMailReponseIdByVendor = responseId.ToString();
                    else
                        SingleMailReponseIdByVendor = P5MailUniqueID;

                    if (SaveReportInSideClassBecauseAsnycCall && !string.IsNullOrEmpty(SingleMailReponseIdByVendor) && !string.IsNullOrEmpty(Body.ToString()))
                    {
                        if (listproducts != null && listproducts.Count > 0 && contact != null && contact.ContactId > 0)
                            HelpMail.SaveProductSendToContact(listproducts, contact.ContactId);
                        return SaveTheSentDetails(contact, Body.ToString(), P5MailUniqueID, SingleMailReponseIdByVendor);
                    }
                    else if (!string.IsNullOrEmpty(SingleMailReponseIdByVendor) && !string.IsNullOrEmpty(Body.ToString()))
                    {
                        body = Helper.Base64Encode(Body.ToString());

                        if (listproducts != null && listproducts.Count > 0 && contact != null && contact.ContactId > 0)
                            HelpMail.SaveProductSendToContact(listproducts, contact.ContactId);
                        return true;
                    }

                    return true;
                }
                else
                {
                    var responseMessage = stuff["code"].ToString() + ":" + stuff["status"].ToString();
                    if (responseMessage != null && !String.IsNullOrEmpty(responseMessage.ToString()))
                    {
                        ErrorMessage = responseMessage;
                    }
                    else
                        ErrorMessage = "Juvlon response not found";
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SendMailGenral_Error_Juvlon"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "SendThat Function->JuvlonAPICall", ex.ToString());
                }
                ErrorMessage = ex.Message.ToString();
                return false;
            }
            return false;
        }

        #endregion API Call

        private bool SaveTheSentDetails(Contact contact, string Body, string P5MailUniqueID, string ResponseId)
        {
            try
            {
                var objDLMailSent = DLMailSent.GetDLMailSent(AccountId, SQLProvider);
                MailSent mailSent = new MailSent();
                mailSent.MailTemplateId = templateDetails.Id;
                mailSent.MailCampaignId = templateDetails.MailCampaignId;
                mailSent.MailSendingSettingId = mailSentSavingDetials.ConfigurationId;
                mailSent.GroupId = mailSentSavingDetials.GroupId;
                mailSent.ContactId = contact.ContactId;
                mailSent.ResponseId = P5MailUniqueID;//swapping bcz of index problem
                mailSent.EmailId = contact.EmailId;
                mailSent.DripSequence = Convert.ToInt16(mailSentSavingDetials.DripSequence);
                mailSent.DripConditionType = Convert.ToInt16(mailSentSavingDetials.DripConditionType);
                mailSent.SendStatus = 1;
                mailSent.P5MailUniqueID = ResponseId;//swapping bcz of index problem
                mailSent.MailConfigurationNameId = mailConfigration.MailConfigurationNameId;
                bool result = objDLMailSent.Send(mailSent).Result > 0;
                if (!result)
                    ErrorMessage = "Not saved in system";
                return result;
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message.ToString();
                return false;
            }
        }

        #region Privat Method

        private async void AppendMailTemplate(string SqlProvider)
        {
            MailTemplateFile mailTemplateFile;
            using (var objDL = DLMailTemplateFile.GetDLMailTemplateFile(AccountId, SqlProvider))
            {
                mailTemplateFile = await objDL.GetSingleFileType(new MailTemplateFile() { TemplateId = templateDetails.Id, TemplateFileType = ".HTML" });
            }
            SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(AccountId, templateDetails.Id);
            string fileString = awsUpload.GetFileContentString(mailTemplateFile.TemplateFileName, awsUpload.bucketname);
            MainContentOftheMail.Append(fileString);
        }

        #endregion Privat Method

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
            //dispose unmanaged ressources
            _disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
