using IP5GenralDL;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;

namespace Plumb5GenralFunction
{
    public class SendEverlyticMail : IDisposable, IBulkMailSending
    {
        private readonly IDistributedCache _cache;

        private readonly string? SQLProvider;
        public SendEverlyticMail(IConfiguration _configuration, IDistributedCache cache)
        {
            SQLProvider = _configuration["SqlProvider"];
            _cache = cache;
        }

        readonly MailSetting MailSetting;
        readonly MailConfiguration mailConfigration;
        readonly MailTemplate templateDetails;
        readonly StringBuilder MainContentOftheMail = new StringBuilder();
        StringBuilder Body = new StringBuilder();
        readonly int AccountId;
        public EverlyticResponse everlyticResponse;
        public int MailCampaignId = 0;
        string UnSubscribePath = null;
        string onlinePath = "";
        string MailTrackController = "MailTrack";
        readonly MailSentSavingDetials MailSentSavingDetials;
        private readonly string JobTagName;

        public List<MLMailVendorResponse> VendorResponses { get; set; }
        public string ErrorMessage { get; set; }

        List<MLMailSent> mailNotSentList;

        public SendEverlyticMail(int accountId, MailSetting mailSetting, MailSentSavingDetials mailSentSavingDetials, MailConfiguration mailConfig, string mailTrackController, string campaignType, string? SqlProvider = null)
        {
            try
            {
                AccountId = accountId;
                mailConfigration = mailConfig;
                MailSetting = mailSetting;
                MailSentSavingDetials = mailSentSavingDetials;
                MailTrackController = mailTrackController;
                JobTagName = campaignType;
                VendorResponses = new List<MLMailVendorResponse>();
                templateDetails = new MailTemplate { Id = MailSetting.MailTemplateId };
                SQLProvider = SqlProvider;
                if (templateDetails.Id > 0 && String.IsNullOrEmpty(mailSetting.MessageBodyText))
                {
                    using (var objBLTemplate = DLMailTemplate.GetDLMailTemplate(accountId, SQLProvider))
                    {
                        templateDetails = objBLTemplate.GETDetails(templateDetails);
                        MailCampaignId = templateDetails.MailCampaignId;
                    }

                    AppendMailTemplate();

                    Body.Clear().Append(MainContentOftheMail);
                    UnSubscribePath = AllConfigURLDetails.KeyValueForConfig["MAILTRACKPATH"].ToString() + "\\TempFiles\\UnSubscribeTemplate-" + AccountId + "\\";
                    onlinePath = AllConfigURLDetails.KeyValueForConfig["MAILTRACK"].ToString();

                    if (!string.IsNullOrEmpty(mailConfigration.DomainForTracking) && !string.IsNullOrEmpty(mailConfigration.DomainForImage))
                    {
                        onlinePath = mailConfigration.DomainForTracking;
                    }
                }
                else
                {
                    MainContentOftheMail.Append(mailSetting.MessageBodyText);
                    Body.Clear().Append(Helper.ChangeUrlToAnalyticTrackUrl(MainContentOftheMail));
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("BulkMailWindowsService"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "SendEverlyticMail->SendEverlyticMail", ex.ToString());
                }
            }
        }

        private void MakeTemplateReady()
        {
            string OrginalUnsubsUrl = "", unsubsUrl = "", forwardUrl = "";
            if (MailSetting.Subscribe)
            {
                if (mailConfigration.UnsubscribeUrl != null && !string.IsNullOrEmpty(mailConfigration.UnsubscribeUrl) && mailConfigration.UnsubscribeUrl.Length > 0)
                    OrginalUnsubsUrl = mailConfigration.UnsubscribeUrl;
                else if (templateDetails.RequireCustomisedUnSububscribe && MailSetting.Subscribe && Directory.Exists(UnSubscribePath))
                    OrginalUnsubsUrl = onlinePath + "TempFiles/UnSubscribeTemplate-" + AccountId.ToString() + "/UnSubscribeFinalTemplate.html?AccountId=" + AccountId + "&P5MailUniqueID={{P5MailUniqueID}}";
                else
                    OrginalUnsubsUrl = onlinePath + MailTrackController + "/Unsubscribe/" + AccountId + "/{{P5MailUniqueID}}";
            }

            if ((Body.ToString().IndexOf("[unsubscribe]", StringComparison.InvariantCultureIgnoreCase) > -1) || (Body.ToString().IndexOf("<!--unsubscribe-->", StringComparison.InvariantCultureIgnoreCase) > -1) || (Body.ToString().IndexOf("[{*unsubscribe*}]", StringComparison.InvariantCultureIgnoreCase) > -1))
            {
                unsubsUrl = string.Empty;
            }
            else
            {
                unsubsUrl = OrginalUnsubsUrl;
            }

            if (MailSetting.Forward)
                forwardUrl = onlinePath + MailTrackController + "/Forward/" + AccountId + "/{{P5MailUniqueID}}";

            if (!string.IsNullOrEmpty(unsubsUrl))
            {
                unsubsUrl = @"<br/>If you believe this has been sent to you by mistake, please <a style='color:#999999;' href='" + unsubsUrl + @"' target='_blank'>Unsubscribe</a>*";
            }

            if (!string.IsNullOrEmpty(forwardUrl))
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
                                                <br />
                                                <br />
                                            </td>
                                            <td width='45' valign='top' align='left' style='padding-bottom: 13px'>&nbsp;</td>
                                        </tr>
                                    </tbody>
                                </table>";

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

            if (templateDetails.Id > 0)
            {
                HelperForMail objMail = new HelperForMail(AccountId, "", "");
                objMail.ChangeImageToOnlineUrl(Body, templateDetails);
            }
        }

        public bool SendSingleMail(MLMailSent mailSent)
        {
            bool result = false;
            MakeTemplateReady();
            EverlyticSchema EverlyticBulkMailObject = EverlyticBulkMailParameter(mailSent);
            result = EverlyticeBulkMailAPICall(EverlyticBulkMailObject);

            //Put the response data in VendorResponses
            #region Response Ready
            if (result)
            {
                foreach (var eachResponse in everlyticResponse.transaction_id)
                {
                    if (mailSent.EmailId == eachResponse.Key)
                    {
                        mailSent.ResponseId = eachResponse.Value;
                        break;
                    }
                }
            }
            else
            {
                ErrorMessage = everlyticResponse.Error;
            }

            MLMailVendorResponse VendorResponse = new MLMailVendorResponse();
            try
            {
                VendorResponse.Id = mailSent.Id;
                VendorResponse.MailTemplateId = MailSetting.MailTemplateId;
                VendorResponse.MailCampaignId = MailCampaignId;
                VendorResponse.MailSendingSettingId = mailSent.MailSendingSettingId;
                VendorResponse.GroupId = mailSent.GroupId;
                VendorResponse.ContactId = mailSent.ContactId;
                VendorResponse.EmailId = mailSent.EmailId;
                VendorResponse.ResponseId = mailSent.ResponseId;
                VendorResponse.SendStatus = result ? 1 : 0;
                VendorResponse.ProductIds = "";
                VendorResponse.P5MailUniqueID = mailSent.P5MailUniqueID;
                VendorResponse.ErrorMessage = ErrorMessage;
                VendorResponse.WorkFlowId = mailSent.WorkFlowId;
                VendorResponse.WorkFlowDataId = mailSent.WorkFlowDataId;
                VendorResponse.CampaignJobName = JobTagName;
                VendorResponse.TriggerMailSmsId = mailSent.TriggerMailSmsId;
                VendorResponse.IsMailSplitTest = mailSent.IsMailSplitTest;
            }
            catch (Exception ex)
            {
                VendorResponse.Id = mailSent.Id;
                VendorResponse.MailTemplateId = MailSetting.MailTemplateId;
                VendorResponse.MailCampaignId = MailCampaignId;
                VendorResponse.MailSendingSettingId = mailSent.MailSendingSettingId;
                VendorResponse.GroupId = mailSent.GroupId;
                VendorResponse.ContactId = mailSent.ContactId;
                VendorResponse.EmailId = mailSent.EmailId;
                VendorResponse.ResponseId = mailSent.ResponseId;
                VendorResponse.SendStatus = 4;
                VendorResponse.ProductIds = "";
                VendorResponse.P5MailUniqueID = mailSent.P5MailUniqueID;
                VendorResponse.ErrorMessage = ex.Message.ToString();
                VendorResponse.WorkFlowId = mailSent.WorkFlowId;
                VendorResponse.WorkFlowDataId = mailSent.WorkFlowDataId;
                VendorResponse.CampaignJobName = JobTagName;
                VendorResponse.TriggerMailSmsId = mailSent.TriggerMailSmsId;
                VendorResponse.IsMailSplitTest = mailSent.IsMailSplitTest;
            }
            VendorResponses.Add(VendorResponse);

            #endregion Response Ready

            return result;
        }

        //Need to implement this method is wrong
        public async Task<bool> SendSingleMailAsync(MLMailSent mailSent)
        {
            return await Task.Run(() => SendSingleMail(mailSent));
        }

        public bool SendSpamScoreMail(string ToMailAddress, string BodyContent)
        {

            try
            {
                JObject EverlyticObject = EverlyticParameters(BodyContent, ToMailAddress, MailSetting.Subject, MailSetting.FromEmailId);
                string jsonString = JsonConvert.SerializeObject(EverlyticObject);

                var resetClient = new RestClient(mailConfigration.ConfigurationUrl);
                var request = new RestRequest(Method.POST);
                request.AddHeader("content-type", "application/json");
                var AuthKey = Helper.Base64Encode("" + mailConfigration.AccountName + ":" + mailConfigration.ApiKey + "");
                request.AddHeader("authorization", "Basic " + AuthKey);
                request.AddParameter("application/json", jsonString, ParameterType.RequestBody);
                IRestResponse response = resetClient.Execute(request);
                if (response.StatusCode == HttpStatusCode.Created)
                    return true;
                else
                    return false;
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SpamCheck"))
                    objError.AddError(ex.Message.ToString(), mailConfigration != null ? mailConfigration.ProviderName : "", DateTime.Now.ToString(), "Plumb5.Areas.Mail.Models-CheckSpamAssassinDetails-SendMail", ex.ToString());

                return false;
            }
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

        public bool SendBulkMail(List<MLMailSent> mailSentList)
        {
            mailSentList = mailSentList.OrderBy(s => s.ContactId).ToList();
            mailNotSentList = new List<MLMailSent>();
            bool result = false;

            MakeTemplateReady();
            string imageOnlinepath = AllConfigURLDetails.KeyValueForConfig["MAXCDNALTERNATEIMGPATH"].ToString();
            if (imageOnlinepath != null && imageOnlinepath != string.Empty)
            {
                //Check dynamic filed values present or not Begin
                List<string> BodyMergingFields = GetReplaceFieldList(Body);
                List<string> fieldNames = new List<string>() { "EmailId", "ContactId" };

                foreach (string field in BodyMergingFields)
                {
                    fieldNames.Add(field.Replace("[{*", "").Replace("*}]", ""));
                }

                fieldNames = fieldNames.Distinct().ToList();

                DataTable ContactIdDataTable = new DataTable();
                ContactIdDataTable.Columns.Add("ContactId", typeof(int));
                foreach (MLMailSent contact in mailSentList)
                {
                    ContactIdDataTable.Rows.Add(contact.ContactId);
                }

                List<Contact> contactsList;
                using (var objDL = DLContact.GetContactDetails(AccountId, SQLProvider))
                {
                    contactsList = objDL.GetListByContactIdTable(ContactIdDataTable, fieldNames).OrderBy(x => x.ContactId).ToList();
                }

                Dictionary<string, string> recipientsList = new Dictionary<string, string>();
                Dictionary<string, object> unique_tagsList = new Dictionary<string, object>();
                for (int i = 0; i < contactsList.Count; i++)
                {
                    var mergingField = new Dictionary<string, string>();
                    bool isAllFieldExists = true;
                    for (int j = 0; j < fieldNames.Count; j++)
                    {
                        var OriginalValue = contactsList[i].GetType().GetProperty(fieldNames[j], BindingFlags.SetProperty | BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(contactsList[i]);
                        string ReplacingValue = (OriginalValue == null || string.IsNullOrEmpty(Convert.ToString(OriginalValue))) ? "" : Convert.ToString(OriginalValue);

                        if (string.IsNullOrEmpty(ReplacingValue))
                        {
                            isAllFieldExists = false;
                            break;
                        }

                        mergingField.Add(fieldNames[j], ReplacingValue);
                    }

                    if (!isAllFieldExists)
                    {
                        mailNotSentList.Add(mailSentList.Where(x => x.ContactId == contactsList[i].ContactId).First());
                        mailSentList.Remove(mailSentList.Where(x => x.ContactId == contactsList[i].ContactId).First());
                    }
                    else
                    {
                        recipientsList.Add(contactsList[i].EmailId, (!string.IsNullOrEmpty(contactsList[i].Name) ? contactsList[i].Name : ""));
                        mergingField.Add("P5MailUniqueID", mailSentList.FirstOrDefault(x => x.ContactId == contactsList[i].ContactId).P5MailUniqueID);
                        //mergingField.Add("trans_P5Custom_CampaignType", JobTagName);
                        unique_tagsList.Add(contactsList[i].EmailId, mergingField);
                    }
                }

                //Check dynamic filed values present or not End
                if (mailSentList != null && mailSentList.Count > 0)
                {
                    EverlyticSchema EverlyticBulkMailObject = EverlyticBulkMailParameter(recipientsList, unique_tagsList);
                    result = EverlyticeBulkMailAPICall(EverlyticBulkMailObject);
                }
            }

            //Put the response data in VendorResponses
            #region Response Ready

            if (mailNotSentList != null && mailNotSentList.Count > 0)
            {
                for (int i = 0; i < mailNotSentList.Count; i++)
                {
                    MLMailVendorResponse VendorResponse = new MLMailVendorResponse();
                    VendorResponse.Id = mailNotSentList[i].Id;
                    VendorResponse.MailTemplateId = MailSetting.MailTemplateId;
                    VendorResponse.MailCampaignId = MailCampaignId;
                    VendorResponse.MailSendingSettingId = mailNotSentList[i].MailSendingSettingId;
                    VendorResponse.GroupId = mailNotSentList[i].GroupId;
                    VendorResponse.ContactId = mailNotSentList[i].ContactId;
                    VendorResponse.EmailId = mailNotSentList[i].EmailId;
                    VendorResponse.ResponseId = mailNotSentList[i].ResponseId;
                    VendorResponse.SendStatus = 0;
                    VendorResponse.ProductIds = "";
                    VendorResponse.P5MailUniqueID = mailNotSentList[i].P5MailUniqueID;
                    VendorResponse.ErrorMessage = "Template dynamic content not replaced";
                    VendorResponse.WorkFlowId = mailNotSentList[i].WorkFlowId;
                    VendorResponse.WorkFlowDataId = mailNotSentList[i].WorkFlowDataId;
                    VendorResponse.CampaignJobName = JobTagName;
                    VendorResponse.TriggerMailSmsId = mailNotSentList[i].TriggerMailSmsId;
                    VendorResponse.IsMailSplitTest = mailNotSentList[i].IsMailSplitTest;

                    VendorResponses.Add(VendorResponse);
                }
            }

            if (mailSentList != null && mailSentList.Count > 0)
            {
                if (result)
                {
                    foreach (var eachResponse in everlyticResponse.transaction_id)
                    {
                        for (int i = 0; i < mailSentList.FindAll(x => string.IsNullOrEmpty(x.ResponseId)).Count; i++)
                        {
                            if (mailSentList[i].EmailId == eachResponse.Key)
                            {
                                mailSentList[i].ResponseId = eachResponse.Value;
                                break;
                            }
                        }
                    }
                }
                else
                {
                    ErrorMessage = everlyticResponse.Error;
                }

                for (int i = 0; i < mailSentList.Count; i++)
                {
                    MLMailVendorResponse VendorResponse = new MLMailVendorResponse();
                    try
                    {
                        VendorResponse.Id = mailSentList[i].Id;
                        VendorResponse.MailTemplateId = MailSetting.MailTemplateId;
                        VendorResponse.MailCampaignId = MailCampaignId;
                        VendorResponse.MailSendingSettingId = mailSentList[i].MailSendingSettingId;
                        VendorResponse.GroupId = mailSentList[i].GroupId;
                        VendorResponse.ContactId = mailSentList[i].ContactId;
                        VendorResponse.EmailId = mailSentList[i].EmailId;
                        VendorResponse.ResponseId = mailSentList[i].ResponseId;
                        VendorResponse.SendStatus = result ? 1 : 0;
                        VendorResponse.ProductIds = "";
                        VendorResponse.P5MailUniqueID = mailSentList[i].P5MailUniqueID;
                        VendorResponse.ErrorMessage = ErrorMessage;
                        VendorResponse.WorkFlowId = mailSentList[i].WorkFlowId;
                        VendorResponse.WorkFlowDataId = mailSentList[i].WorkFlowDataId;
                        VendorResponse.CampaignJobName = JobTagName;
                        VendorResponse.TriggerMailSmsId = mailSentList[i].TriggerMailSmsId;
                        VendorResponse.IsMailSplitTest = mailSentList[i].IsMailSplitTest;
                    }
                    catch (Exception ex)
                    {
                        VendorResponse.Id = mailSentList[i].Id;
                        VendorResponse.MailTemplateId = MailSetting.MailTemplateId;
                        VendorResponse.MailCampaignId = MailCampaignId;
                        VendorResponse.MailSendingSettingId = mailSentList[i].MailSendingSettingId;
                        VendorResponse.GroupId = mailSentList[i].GroupId;
                        VendorResponse.ContactId = mailSentList[i].ContactId;
                        VendorResponse.EmailId = mailSentList[i].EmailId;
                        VendorResponse.ResponseId = mailSentList[i].ResponseId;
                        VendorResponse.SendStatus = 4;
                        VendorResponse.ProductIds = "";
                        VendorResponse.P5MailUniqueID = mailSentList[i].P5MailUniqueID;
                        VendorResponse.ErrorMessage = ex.Message.ToString();
                        VendorResponse.WorkFlowId = mailSentList[i].WorkFlowId;
                        VendorResponse.WorkFlowDataId = mailSentList[i].WorkFlowDataId;
                        VendorResponse.CampaignJobName = JobTagName;
                        VendorResponse.TriggerMailSmsId = mailSentList[i].TriggerMailSmsId;
                        VendorResponse.IsMailSplitTest = mailSentList[i].IsMailSplitTest;
                    }
                    VendorResponses.Add(VendorResponse);
                }
            }
            #endregion Response Ready

            return result;
        }

        //Need to implement this method is wrong
        public async Task<bool> SendBulkMailAsync(List<MLMailSent> mailSentList)
        {
            return await Task.Run(() => SendBulkMail(mailSentList));
        }

        private EverlyticSchema EverlyticBulkMailParameter(MLMailSent mailSent)
        {
            try
            {
                var schema = new EverlyticSchema();

                var from = new Dictionary<string, string>();
                from.Add(MailSetting.FromEmailId, MailSetting.FromName);
                schema.headers.from = from;

                var ReplyEmailDetails = new Dictionary<string, string>();
                ReplyEmailDetails.Add(MailSetting.ReplyTo, "");

                schema.headers.reply_to = ReplyEmailDetails;
                schema.headers.subject = MailSetting.Subject;
                schema.headers.trans_P5Custom_CampaignType = JobTagName;
                schema.headers.trans_P5Custom_ConfigurationId = MailSentSavingDetials.ConfigurationId.ToString();
                schema.headers.trans_P5Custom_AccountId = AccountId.ToString();

                schema.settings.batch_send = "yes";//Default
                schema.settings.track_links = "yes";//Default
                schema.settings.track_opens = "yes";//Default

                var recipientsList = new Dictionary<string, string>();
                var unique_tagsList = new Dictionary<string, object>();

                Body.Replace("[{*", "{{").Replace("*}]", "}}");
                schema.content = Body.ToString();

                recipientsList.Add(mailSent.EmailId, "");
                var mergingField = new Dictionary<string, string>();

                mergingField.Add("P5MailUniqueID", mailSent.P5MailUniqueID);
                //mergingField.Add("trans_P5Custom_CampaignType", JobTagName);
                unique_tagsList.Add(mailSent.EmailId, mergingField);

                schema.unique_tags = unique_tagsList;
                schema.emails = recipientsList;

                return schema;

            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("BulkMailWindowsService"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "EverlyticBulkMailParameter-Error", ex.ToString());
                }
            }
            return null;
        }

        private EverlyticSchema EverlyticBulkMailParameter(Dictionary<string, string> recipientsList, Dictionary<string, object> unique_tagsList)
        {
            try
            {
                var schema = new EverlyticSchema();

                var from = new Dictionary<string, string>();
                from.Add(MailSetting.FromEmailId, MailSetting.FromName);
                schema.headers.from = from;

                var ReplyEmailDetails = new Dictionary<string, string>();
                ReplyEmailDetails.Add(MailSetting.ReplyTo, "");

                schema.headers.reply_to = ReplyEmailDetails;
                schema.headers.subject = MailSetting.Subject;
                schema.headers.trans_P5Custom_CampaignType = JobTagName;
                schema.headers.trans_P5Custom_ConfigurationId = MailSentSavingDetials.ConfigurationId.ToString();
                schema.headers.trans_P5Custom_AccountId = AccountId.ToString();

                schema.settings.batch_send = "yes";//Default
                schema.settings.track_links = "yes";//Default
                schema.settings.track_opens = "yes";//Default

                Body.Replace("[{*", "{{").Replace("*}]", "}}");
                schema.content = Body.ToString();

                schema.unique_tags = unique_tagsList;
                schema.emails = recipientsList;

                return schema;
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("BulkMailWindowsService"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "EverlyticBulkMailParameter-Error", ex.ToString());
                }
            }
            return null;
        }

        private List<string> GetReplaceFieldList(StringBuilder htmlContent)
        {
            List<string> allMergingField = new List<string>();

            foreach (Match m in Regex.Matches(htmlContent.ToString(), "\\[{.*?}\\]", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace))
            {
                allMergingField.Add(m.Value);
            }
            return (allMergingField != null && allMergingField.Count > 0) ? allMergingField.Distinct().ToList() : allMergingField;
        }

        private bool EverlyticeBulkMailAPICall(EverlyticSchema MailObject)
        {
            try
            {
                StringBuilder jsonString = new StringBuilder(JsonConvert.SerializeObject(MailObject));
                jsonString.Replace("trans_P5Custom_CampaignType", "trans-CampaignType").Replace("trans_P5Custom_ConfigurationId", "trans-ConfigurationId").Replace("trans_P5Custom_AccountId", "trans-AccountId");

                var client = new RestClient(mailConfigration.ConfigurationUrl);
                var request = new RestRequest(Method.POST);
                var AuthKey = Helper.Base64Encode("" + mailConfigration.AccountName + ":" + mailConfigration.ApiKey + "");
                request.AddHeader("authorization", "Basic " + AuthKey);
                request.AddHeader("Content-Type", "application/json");
                request.AddParameter("application/json", jsonString.ToString(), ParameterType.RequestBody);

                IRestResponse response = client.Execute(request);
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    everlyticResponse = JsonConvert.DeserializeObject<EverlyticResponse>(response.Content.ToString());
                    return true;
                }
                else
                {
                    everlyticResponse = new EverlyticResponse() { Error = response.Content };
                    return false;
                }
            }
            catch (Exception ex)
            {
                everlyticResponse = new EverlyticResponse()
                {
                    Error = ex.Message.ToString()
                };

                using (ErrorUpdation objError = new ErrorUpdation("BulkMailWindowsService"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "EverlyticeBulkMailAPICall-Error", ex.ToString());
                }
                return false;
            }
        }

        private void AppendMailTemplate()
        {
            MailTemplateFile mailTemplateFile;
            using (var objBL = DLMailTemplateFile.GetDLMailTemplateFile(AccountId, SQLProvider))
            {
                mailTemplateFile = objBL.GetSingleFileTypeSync(new MailTemplateFile() { TemplateId = templateDetails.Id, TemplateFileType = ".HTML" });
            }
            SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(AccountId, templateDetails.Id);
            string fileString = awsUpload.GetFileContentString(mailTemplateFile.TemplateFileName, awsUpload._bucketName).ConfigureAwait(false).GetAwaiter().GetResult();
            MainContentOftheMail.Append(fileString);
        }

        #region Response Schema

        public class EverlyticResponse
        {
            public Dictionary<string, string> transaction_id { get; set; }
            public string Error { get; set; }
        }

        #endregion Response Schema

        #region Sending Schema

        public class EverlyticSchema
        {
            public EverlyticSchema()
            {
                headers = new Headers();
                headers.from = new KeyValuePair<string, string>();
                headers.reply_to = new KeyValuePair<string, string>();
                settings = new Settings();
                tags = new Tags();
                attachments = new Attachments();
            }

            [JsonProperty("content")]
            public string content { get; set; }

            [JsonProperty("headers")]
            public Headers headers { get; set; }

            [JsonProperty("settings")]
            public Settings settings { get; set; }

            [JsonProperty("tags")]
            public Tags tags { get; set; }

            [JsonProperty("emails")]
            public object emails { get; set; }

            [JsonProperty("unique_tags")]
            public object unique_tags { get; set; }

            [JsonProperty("attachments")]
            public Attachments attachments { get; set; }
        }

        public partial class Headers
        {
            [JsonProperty("from")]
            public object from { get; set; }

            [JsonProperty("reply_to")]
            public object reply_to { get; set; }

            [JsonProperty("subject")]
            public string subject { get; set; }

            [JsonProperty("trans-CampaignType")]
            public string trans_P5Custom_CampaignType { get; set; }

            [JsonProperty("trans-ConfigurationId")]
            public string trans_P5Custom_ConfigurationId { get; set; }

            [JsonProperty("trans-AccountId")]
            public string trans_P5Custom_AccountId { get; set; }
        }

        public partial class Settings
        {
            [JsonProperty("track_opens")]
            public string track_opens { get; set; }

            [JsonProperty("track_links")]
            public string track_links { get; set; }

            [JsonProperty("batch_send")]
            public string batch_send { get; set; }
        }

        public partial class Attachments
        {
        }

        public partial class Tags
        {
        }

        #endregion Sending Schema

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
