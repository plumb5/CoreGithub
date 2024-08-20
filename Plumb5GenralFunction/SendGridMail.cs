using IP5GenralDL;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.Http.Headers;
using System.Net;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;

namespace Plumb5GenralFunction
{
    public class SendGridEmailRequest
    {
        public List<Personalization> Personalizations { get; set; }
        public Sender From { get; set; }
        public Sender ReplyTo { get; set; }
        public List<Content> Content { get; set; }
        public List<Attachment> Attachments { get; set; }
    }

    public class Personalization
    {
        public List<Recipient> To { get; set; }
        public string Subject { get; set; }
        public Dictionary<string, dynamic> Substitutions { get; set; }
    }

    public class Recipient
    {
        public string Email { get; set; }
        public string Name { get; set; }
    }
    public class Attachment
    {
        public string Content { get; set; }
        public string FileName { get; set; }
        public string Type { get; set; }
        public string Disposition { get; set; }
    }

    public class Sender
    {
        public string Email { get; set; }
        public string Name { get; set; }
    }

    public class Content
    {
        public string Type { get; set; }
        public string Value { get; set; }
    }

    public class SendGridResponse
    {
        public string code { get; set; }
        public bool status { get; set; }
        public string errormessage { get; set; }
        public string transactionId { get; set; }
    }


    public class SendGridMail : IDisposable, IBulkMailSending
    {
        private readonly IDistributedCache _cache;

        private readonly string? SQLProvider;
        public SendGridMail(IConfiguration _configuration, IDistributedCache cache)
        {
            SQLProvider = _configuration["SqlProvider"];
            _cache = cache;
        }

        readonly MailSetting MailSetting;
        readonly MailConfiguration mailConfigration;
        readonly MailTemplate templateDetails;
        readonly List<MailTemplateAttachment> mailTemplateAttachment;
        readonly StringBuilder MainContentOftheMail = new StringBuilder();
        StringBuilder Body = new StringBuilder();
        public SendGridResponse sendgridResponse;
        readonly int AccountId;
        public int MailCampaignId = 0;

        public List<MLMailVendorResponse> VendorResponses { get; set; }
        public MLMailVendorResponse VendorSingleResponse { get; set; }

        private readonly string JobTagName;
        public string ErrorMessage { get; set; }

        List<MLMailSent> mailNotSentList;
        private int Lmsgroupmemberid;
        public SendGridMail(int accountId, MailSetting mailSetting, MailConfiguration mailConfig, string jobTagName = "campaign", int lmsgroupmemberid = 0, string? SqlProvider = null)
        {
            try
            {
                AccountId = accountId;
                mailConfigration = mailConfig;
                MailSetting = mailSetting;
                VendorResponses = new List<MLMailVendorResponse>();
                VendorSingleResponse = new MLMailVendorResponse();
                templateDetails = new MailTemplate { Id = MailSetting.MailTemplateId };
                JobTagName = jobTagName;
                Lmsgroupmemberid = lmsgroupmemberid;
                SQLProvider = SqlProvider;

                if (templateDetails.Id > 0 && String.IsNullOrEmpty(mailSetting.MessageBodyText))
                {
                    using (var objBLTemplate = DLMailTemplate.GetDLMailTemplate(accountId, SQLProvider))
                    {
                        templateDetails = objBLTemplate.GETDetails(templateDetails);
                        MailCampaignId = templateDetails.MailCampaignId;
                    }

                    using (var objBLAttachment = DLMailTemplateAttachment.GetDLMailTemplateAttachment(accountId, SQLProvider))
                    {
                        mailTemplateAttachment = objBLAttachment.GetAttachments(templateDetails.Id);
                    }

                    AppendMailTemplate();

                    Body.Clear().Append(Helper.ChangeUrlToAnalyticTrackUrl(MainContentOftheMail));
                }
                else
                {
                    MainContentOftheMail.Append(mailSetting.MessageBodyText);
                    Body.Clear().Append(Helper.ChangeUrlToAnalyticTrackUrl(MainContentOftheMail));
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SendGridMail"))
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "SendGridMail", ex.ToString());

                throw;
            }
        }

        public virtual bool SendSingleMail(MLMailSent mailSent)
        {
            bool result = false;
            try
            {
                //var mailSentList = new List<MLMailSent>();
                //mailSentList.Add(mailSent);
                //result = SendBulkMail(mailSentList);
                List<Recipient> emailTo = new List<Recipient>() { new Recipient { Email = mailSent.EmailId } };
                List<Personalization> sendGridRequestss = new List<Personalization>();
                Dictionary<string, dynamic> Substitutions = new Dictionary<string, dynamic>();
                StringBuilder bodyContent = new StringBuilder();
                bodyContent.Append(Body);

                sendGridRequestss.Add(new Personalization { To = emailTo, Subject = MailSetting.Subject.Replace("[{*", "-").Replace("*}]", "-"), Substitutions = Substitutions });
                SendGridEmailRequest mailValues = SendGridParameters(bodyContent, sendGridRequestss);
                result = SendGridBulkMailAPICall(mailValues);
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SendGridMail"))
                    objError.AddError(ex.Message.ToString(), "outfile to stream issue", DateTime.Now.ToString(), "SendGridMail-->SendBulkMail", ex.ToString(), true);
            }

            //Put the response data in VendorResponses
            #region Response Ready

            string TransactionId = string.Empty;

            if (result)
            {
                TransactionId = sendgridResponse.transactionId.ToString();
            }
            else
            {
                ErrorMessage = sendgridResponse.code + ":" + sendgridResponse.status;
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
                VendorResponse.ResponseId = TransactionId;
                VendorResponse.SendStatus = result ? 1 : 0;
                VendorResponse.ProductIds = "";
                VendorResponse.P5MailUniqueID = mailSent.P5MailUniqueID;
                VendorResponse.ErrorMessage = ErrorMessage;
                VendorResponse.WorkFlowId = mailSent.WorkFlowId;
                VendorResponse.WorkFlowDataId = mailSent.WorkFlowDataId;
                VendorResponse.CampaignJobName = JobTagName;
                VendorResponse.TriggerMailSmsId = mailSent.TriggerMailSmsId;
                VendorResponse.IsMailSplitTest = mailSent.IsMailSplitTest;
                VendorResponse.Subject = mailSent.Subject;
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
                VendorResponse.ResponseId = TransactionId;
                VendorResponse.SendStatus = 4;
                VendorResponse.ProductIds = "";
                VendorResponse.P5MailUniqueID = mailSent.P5MailUniqueID;
                VendorResponse.ErrorMessage = ex.Message.ToString();
                VendorResponse.WorkFlowId = mailSent.WorkFlowId;
                VendorResponse.WorkFlowDataId = mailSent.WorkFlowDataId;
                VendorResponse.CampaignJobName = JobTagName;
                VendorResponse.TriggerMailSmsId = mailSent.TriggerMailSmsId;
                VendorResponse.IsMailSplitTest = mailSent.IsMailSplitTest;
                VendorResponse.Subject = mailSent.Subject;
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

        public bool SendBulkMail(List<MLMailSent> mailSentList)
        {
            StringBuilder mailSubject = new StringBuilder();
            List<Personalization> sendGridRequests = new List<Personalization>();
            mailSentList = mailSentList.OrderBy(s => s.ContactId).ToList();
            mailNotSentList = new List<MLMailSent>();
            bool result = false;
            HelperForMail objMail = new HelperForMail(AccountId, "", "");
            objMail.ChangeImageToOnlineUrl(Body, templateDetails);

            //Check dynamic filed values present or not Begin
            Tuple<List<string>, List<KeyValuePair<string, string>>, string, List<KeyValuePair<string, string>>> BodyMergingFields = GetReplaceFieldList(Body, MailSetting.Subject);
            List<string> fieldNames = new List<string>() { "EmailId", "ContactId" };

            mailSubject.Clear().Append(MailSetting.Subject);
            MailSetting.Subject = BodyMergingFields.Item3;

            for (int i = 0; i < mailSentList.Count; i++)
            {
                mailSentList[i].Subject = MailSetting.Subject;
            }

            foreach (string field in BodyMergingFields.Item1)
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


            List<LmsGroupMembers> lmsDetails = null;
            List<UserInfo> userDetails = null;

            if (Lmsgroupmemberid == 0)
            {
                using (var objDL = DLLmsGroupMembers.GetDLLmsGroupMembers(AccountId, SQLProvider))
                {
                    lmsDetails = objDL.GetLmsDetailsList(ContactIdDataTable);
                }


                if (lmsDetails != null && lmsDetails.Count > 0)
                {
                    IEnumerable<int> userinfoIds = lmsDetails.Select(x => x.UserInfoUserId).ToArray();
                    using (var objDL = DLUserInfo.GetDLUserInfo(SQLProvider))
                        userDetails = objDL.GetDetail(userinfoIds);
                }
            }

            fieldNames.Reverse();
            fieldNames.Add("ToEmail");
            fieldNames.Reverse();

            /* Custom Events Data Replacing*/
            try
            {
                if (contactsList != null && contactsList.Count > 0)
                {
                    if (Body.ToString().Contains("{{*") && Body.ToString().Contains("*}}"))
                    {
                        Tuple<StringBuilder, List<Contact>, List<string>> tuple = null;
                        tuple = Helper.GetCustomEventReplaceFieldList(AccountId, Body, contactsList, fieldNames, SQLProvider);
                        Body = tuple.Item1;
                        contactsList = tuple.Item2;
                        fieldNames = tuple.Item3;
                    }

                    if (mailSubject.ToString().Contains("{{*") && mailSubject.ToString().Contains("*}}"))
                    {
                        Tuple<StringBuilder, List<Contact>, List<string>> tuple = null;
                        tuple = Helper.GetCustomEventReplaceFieldList(AccountId, mailSubject, contactsList, fieldNames, SQLProvider);
                        MailSetting.Subject = tuple.Item1.ToString();
                        contactsList = tuple.Item2;
                        fieldNames = tuple.Item3;
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorUpdation.AddErrorLog("SendGridMail", ex.Message, "CustomEvent Data Replace issue", DateTime.Now, "SendGridMail-->SendBulkMail", ex.StackTrace);
            }

            /* Custom Events Data Replacing*/

            fieldNames.Add("p5uniqueid");


            for (int i = 0; i < contactsList.Count; i++)
            {
                Dictionary<string, dynamic> substitutions = new Dictionary<string, dynamic>();
                bool isAllFieldExists = true;

                for (int j = 1; j < fieldNames.Count; j++)
                {
                    if (fieldNames[j].Contains("p5uniqueid"))
                    {
                        string P5MailUniqueID = mailSentList.Where(x => x.ContactId == contactsList[i].ContactId).ToList()[0].P5MailUniqueID;
                        substitutions.Add("-p5uniqueid-", P5MailUniqueID);
                    }
                    else if (fieldNames[j].Contains("lmscustomfield"))
                    {
                        if (lmsDetails != null && lmsDetails.Count > 0)
                        {
                            var lmscustomfield = lmsDetails.Where(x => x.ContactId == contactsList[i].ContactId).ToList();
                            if (lmscustomfield != null && lmscustomfield.Count > 0)
                            {
                                var OriginalValue = lmscustomfield[0].GetType().GetProperty(fieldNames[j], BindingFlags.SetProperty | BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(lmscustomfield[0]);
                                string ReplacingValue = (OriginalValue == null) ? null : Convert.ToString(OriginalValue);

                                substitutions.Add("-" + fieldNames[j] + "-", ReplacingValue);
                            }
                            else
                            {
                                isAllFieldExists = false;
                                break;
                            }
                        }
                    }
                    else if (fieldNames[j].ToString().ToLower().Contains("userinfo_"))
                    {
                        if (userDetails != null)
                        {
                            var lmscustomfield = lmsDetails.Where(x => x.ContactId == contactsList[i].ContactId).ToList();

                            if (lmscustomfield != null && lmscustomfield.Count > 0)
                            {
                                var userReplaceDetails = userDetails.Where(u => u.UserId == lmscustomfield[0].UserInfoUserId).ToList();

                                var OriginalValue = userReplaceDetails[0].GetType().GetProperty(fieldNames[j].Split('_')[1], BindingFlags.SetProperty | BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(userReplaceDetails[0]);
                                string ReplacingValue = (OriginalValue == null) ? null : Convert.ToString(OriginalValue);

                                substitutions.Add("-" + fieldNames[j] + "-", ReplacingValue);
                            }
                            else
                            {
                                isAllFieldExists = false;
                                break;
                            }
                        }
                    }
                    else
                    {
                        var OriginalValue = contactsList[i].GetType().GetProperty(fieldNames[j], BindingFlags.SetProperty | BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(contactsList[i]);
                        string ReplacingValue = (OriginalValue == null) ? null : Convert.ToString(OriginalValue);


                        if (ReplacingValue == null)
                        {
                            if (BodyMergingFields != null && BodyMergingFields.Item4.Count > 0)
                            {
                                string OptionalColumnName = BodyMergingFields.Item4.FirstOrDefault(p => p.Key == fieldNames[j]).Value;
                                var OptionalOriginalValue = contactsList[i].GetType().GetProperty(OptionalColumnName, BindingFlags.SetProperty | BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(contactsList[i]);
                                string OptionalReplacingValue = (OptionalOriginalValue == null) ? null : Convert.ToString(OptionalOriginalValue);

                                if (OptionalReplacingValue != null || OptionalReplacingValue == "")
                                {
                                    ReplacingValue = OptionalReplacingValue;
                                }
                            }

                            if (ReplacingValue == null)
                            {
                                if (BodyMergingFields != null && BodyMergingFields.Item2.Count > 0)
                                {
                                    string keypairvalue = BodyMergingFields.Item2.FirstOrDefault(p => p.Key == fieldNames[j]).Value;

                                    if (keypairvalue != null || keypairvalue == "")
                                    {
                                        substitutions.Add("-" + fieldNames[j] + "-", keypairvalue);
                                    }
                                    else
                                    {
                                        isAllFieldExists = false;
                                        break;
                                    }
                                }
                                else
                                {
                                    isAllFieldExists = false;
                                    break;
                                }
                            }
                            else
                            {
                                substitutions.Add("-" + fieldNames[j] + "-", ReplacingValue);
                            }
                        }
                        else if (ReplacingValue == "[NA]")
                        {
                            isAllFieldExists = false;
                            break;
                        }
                        else
                        {
                            substitutions.Add("-" + fieldNames[j] + "-", ReplacingValue);
                        }
                    }
                }

                if (!isAllFieldExists)
                {
                    mailNotSentList.Add(mailSentList.Where(x => x.ContactId == contactsList[i].ContactId).First());
                    mailSentList.Remove(mailSentList.Where(x => x.ContactId == contactsList[i].ContactId).First());
                }

                var emailTo = new List<Recipient> { new Recipient { Email = contactsList[i].EmailId } };

                sendGridRequests.Add(new Personalization { To = emailTo, Subject = MailSetting.Subject.Replace("[{*", "-").Replace("*}]", "-"), Substitutions = substitutions });
            }

            //Check dynamic filed values present or not End

            if (mailSentList != null && mailSentList.Count > 0)
            {
                SendGridEmailRequest mailValues = SendGridParameters(Body, sendGridRequests);

                try
                {
                    result = SendGridBulkMailAPICall(mailValues);
                }
                catch (Exception ex)
                {
                    using (ErrorUpdation objError = new ErrorUpdation("SendGridMail"))
                        objError.AddError(ex.Message.ToString(), "SendGridMailBulkMailAPICall", DateTime.Now.ToString(), "SendGridMail-->SendBulkMail", ex.ToString(), true);
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
                    VendorResponse.ResponseId = "";
                    VendorResponse.SendStatus = 0;
                    VendorResponse.ProductIds = "";
                    VendorResponse.P5MailUniqueID = mailNotSentList[i].P5MailUniqueID;
                    VendorResponse.ErrorMessage = "Template dynamic content not replaced";
                    VendorResponse.WorkFlowId = mailNotSentList[i].WorkFlowId;
                    VendorResponse.WorkFlowDataId = mailNotSentList[i].WorkFlowDataId;
                    VendorResponse.CampaignJobName = JobTagName;
                    VendorResponse.TriggerMailSmsId = mailNotSentList[i].TriggerMailSmsId;
                    VendorResponse.IsMailSplitTest = mailNotSentList[i].IsMailSplitTest;
                    VendorResponse.Subject = mailNotSentList[i].Subject;

                    VendorResponses.Add(VendorResponse);
                }
            }

            if (mailSentList != null && mailSentList.Count > 0)
            {
                string TransactionId = string.Empty;

                if (result)
                {
                    TransactionId = sendgridResponse.transactionId.ToString();
                }
                else
                {
                    ErrorMessage = sendgridResponse.errormessage;
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
                        VendorResponse.ResponseId = TransactionId;
                        VendorResponse.SendStatus = result ? 1 : 0;
                        VendorResponse.ProductIds = "";
                        VendorResponse.P5MailUniqueID = mailSentList[i].P5MailUniqueID;
                        VendorResponse.ErrorMessage = ErrorMessage;
                        VendorResponse.WorkFlowId = mailSentList[i].WorkFlowId;
                        VendorResponse.WorkFlowDataId = mailSentList[i].WorkFlowDataId;
                        VendorResponse.CampaignJobName = JobTagName;
                        VendorResponse.TriggerMailSmsId = mailSentList[i].TriggerMailSmsId;
                        VendorResponse.IsMailSplitTest = mailSentList[i].IsMailSplitTest;
                        VendorResponse.Subject = mailSentList[i].Subject;
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
                        VendorResponse.ResponseId = TransactionId;
                        VendorResponse.SendStatus = 4;
                        VendorResponse.ProductIds = "";
                        VendorResponse.P5MailUniqueID = mailSentList[i].P5MailUniqueID;
                        VendorResponse.ErrorMessage = ex.Message.ToString();
                        VendorResponse.WorkFlowId = mailSentList[i].WorkFlowId;
                        VendorResponse.WorkFlowDataId = mailSentList[i].WorkFlowDataId;
                        VendorResponse.CampaignJobName = JobTagName;
                        VendorResponse.TriggerMailSmsId = mailSentList[i].TriggerMailSmsId;
                        VendorResponse.IsMailSplitTest = mailSentList[i].IsMailSplitTest;
                        VendorResponse.Subject = mailSentList[i].Subject;
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

        public bool SendSpamScoreMail(string ToMailAddress, string BodyContent)
        {
            try
            {
                List<Recipient> emailTo = new List<Recipient>() { new Recipient { Email = ToMailAddress } };
                List<Personalization> sendGridRequestss = new List<Personalization>();
                Dictionary<string, dynamic> Substitutions = new Dictionary<string, dynamic>();
                StringBuilder bodyContent = new StringBuilder();
                bodyContent.Append(BodyContent);

                sendGridRequestss.Add(new Personalization { To = emailTo, Subject = MailSetting.Subject.Replace("[{*", "-").Replace("*}]", "-"), Substitutions = Substitutions });
                SendGridEmailRequest mailValues = SendGridParameters(bodyContent, sendGridRequestss);
                bool result = SendGridBulkMailAPICall(mailValues);
                return result;
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SpamCheck"))
                    objError.AddError(ex.Message.ToString(), mailConfigration != null ? mailConfigration.ProviderName : "", DateTime.Now.ToString(), "Plumb5.Areas.Mail.Models-CheckSpamAssassinDetails-SendMail", ex.ToString());

                return false;
            }
        }

        private async void AppendMailTemplate()
        {
            MailTemplateFile mailTemplateFile;
            using (var objBL = DLMailTemplateFile.GetDLMailTemplateFile(AccountId, SQLProvider))
            {
                mailTemplateFile = await objBL.GetSingleFileType(new MailTemplateFile() { TemplateId = templateDetails.Id, TemplateFileType = ".HTML" });
            }
            SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(AccountId, templateDetails.Id);
            string fileString = awsUpload.GetFileContentString(mailTemplateFile.TemplateFileName, awsUpload.bucketname);
            MainContentOftheMail.Append(fileString);
        }
        private Tuple<List<string>, List<KeyValuePair<string, string>>, string, List<KeyValuePair<string, string>>> GetReplaceFieldList(StringBuilder htmlContent, string MailSubject)
        {
            string Bodys = htmlContent.ToString();
            List<string> allMergingField = new List<string>();
            List<KeyValuePair<string, string>> fallbackdata = new List<KeyValuePair<string, string>>();
            List<KeyValuePair<string, string>> optionfields = new List<KeyValuePair<string, string>>();

            foreach (Match m in Regex.Matches(htmlContent.ToString(), "\\[{.*?}\\]", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace))
            {
                if (m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('^').Length == 2)
                {
                    var feildName = "[{*" + m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~')[0] + "*}]";
                    allMergingField.Add(feildName.Replace("^", "_"));

                    if (m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~').Length == 2)
                        fallbackdata.Add(new KeyValuePair<string, string>(m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~')[0].Replace("^", "_"), m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~')[1]));
                    else
                        fallbackdata.Add(new KeyValuePair<string, string>(m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~')[0].Replace("^", "_"), null));

                    Bodys = Bodys.Replace(m.Value, "[{*" + m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~')[0].Replace("^", "_") + "*}]");
                    htmlContent.Clear().Append(Bodys);
                }
                else if (m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~').Length == 2)
                {
                    string FieldName = "";
                    string OptionalFieldName = "";
                    string FallBackValue = "";

                    var datas = m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Replace("&amp;", "&").Split('~');
                    FallBackValue = datas[1];

                    if (datas[0].ToString().Split('&').Length == 2)
                    {
                        FieldName = datas[0].ToString().Split('&')[0];
                        OptionalFieldName = datas[0].ToString().Split('&')[1];
                        optionfields.Add(new KeyValuePair<string, string>(FieldName, OptionalFieldName));
                    }
                    else
                    {
                        FieldName = datas[0];
                    }

                    var feildName = "[{*" + FieldName + "*}]";
                    allMergingField.Add(feildName);
                    fallbackdata.Add(new KeyValuePair<string, string>(FieldName, FallBackValue));
                    Bodys = Bodys.Replace(m.Value, "[{*" + FieldName + "*}]");
                    htmlContent.Clear().Append(Bodys);
                }
                else
                {
                    string FieldName = "";
                    string OptionalFieldName = "";
                    string FallBackValue = "";

                    var datas = m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Replace("&amp;", "&").Split('&');

                    if (datas.Length == 2)
                    {
                        FieldName = datas[0].ToString();
                        OptionalFieldName = datas[1].ToString();
                        optionfields.Add(new KeyValuePair<string, string>(FieldName, OptionalFieldName));
                    }
                    else
                    {
                        FieldName = datas[0];
                    }

                    var feildName = "[{*" + FieldName + "*}]";
                    allMergingField.Add(feildName);
                    fallbackdata.Add(new KeyValuePair<string, string>(FieldName, null));
                    Bodys = Bodys.Replace(m.Value, "[{*" + FieldName + "*}]");
                    htmlContent.Clear().Append(Bodys);
                }
            }

            foreach (Match m in Regex.Matches(MailSubject.ToString(), "\\[{.*?}\\]", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace))
            {
                if (m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('^').Length == 2)
                {
                    var feildName = "[{*" + m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~')[0] + "*}]";
                    allMergingField.Add(feildName.Replace("^", "_"));

                    if (m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~').Length == 2)
                        fallbackdata.Add(new KeyValuePair<string, string>(m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~')[0].Replace("^", "_"), m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~')[1]));
                    else
                        fallbackdata.Add(new KeyValuePair<string, string>(m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~')[0].Replace("^", "_"), null));

                    MailSubject = MailSubject.Replace(m.Value, "[{*" + m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~')[0].Replace("^", "_") + "*}]");

                }
                else if (m.Value.ToString().Split('~').Length == 2)
                {
                    string FieldName = "";
                    string OptionalFieldName = "";
                    string FallBackValue = "";

                    var datas = m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~');
                    FallBackValue = datas[1];

                    if (datas[0].ToString().Split('&').Length == 2)
                    {
                        FieldName = datas[0].ToString().Split('&')[0];
                        OptionalFieldName = datas[0].ToString().Split('&')[1];
                        optionfields.Add(new KeyValuePair<string, string>(FieldName, OptionalFieldName));
                    }
                    else
                    {
                        FieldName = datas[0];
                    }


                    var feildName = "[{*" + FieldName + "*}]";
                    allMergingField.Add(feildName);
                    fallbackdata.Add(new KeyValuePair<string, string>(FieldName, FallBackValue));

                    MailSubject = MailSubject.Replace(m.Value, "[{*" + FieldName + "*}]");
                }
                else
                {
                    string FieldName = "";
                    string OptionalFieldName = "";
                    string FallBackValue = "";

                    var datas = m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Replace("&amp;", "&").Split('&');

                    if (datas.Length == 2)
                    {
                        FieldName = datas[0].ToString();
                        OptionalFieldName = datas[1].ToString();
                        optionfields.Add(new KeyValuePair<string, string>(FieldName, OptionalFieldName));
                    }
                    else
                    {
                        FieldName = datas[0];
                    }

                    var feildName = "[{*" + FieldName + "*}]";
                    allMergingField.Add(feildName);
                    fallbackdata.Add(new KeyValuePair<string, string>(FieldName, null));
                    MailSubject = MailSubject.Replace(m.Value, "[{*" + FieldName + "*}]");
                }
            }

            allMergingField = (allMergingField != null && allMergingField.Count > 0) ? allMergingField.Distinct().ToList() : allMergingField;

            return new Tuple<List<string>, List<KeyValuePair<string, string>>, string, List<KeyValuePair<string, string>>>(allMergingField, fallbackdata, MailSubject, optionfields);
        }
        private SendGridEmailRequest SendGridParameters(StringBuilder Body, List<Personalization> sendgridRequests)
        {

            var FromEmail = new Sender { Email = MailSetting.FromEmailId, Name = MailSetting.FromName };
            var ReplyEmail = new Sender { Email = MailSetting.ReplyTo };
            Body.Replace("{p5uniqueid}", "-p5uniqueid-");
            Body.Replace("[{*", "-").Replace("*}]", "-");
            var contents = new List<Content> { new Content { Type = "text/html", Value = Body.ToString() } };

            SendGridEmailRequest mailValues = new SendGridEmailRequest();
            mailValues.Personalizations = sendgridRequests;
            mailValues.From = FromEmail;
            mailValues.ReplyTo = ReplyEmail;
            mailValues.Content = contents;

            if (mailTemplateAttachment != null && mailTemplateAttachment.Count > 0)
            {
                var attachments = new List<Attachment>();
                for (var i = 0; i < mailTemplateAttachment.Count; i++)
                {
                    var attach = new Attachment();
                    SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(AccountId, templateDetails.Id);
                    byte[] attachmentbyte = awsUpload.GetFileContentStringBytes(mailTemplateAttachment[i].AttachmentFileName, awsUpload.bucketname);

                    attach.Content = Convert.ToBase64String(attachmentbyte);
                    attach.FileName = mailTemplateAttachment[i].AttachmentFileName;

                    attachments.Add(attach);
                }

                if (attachments != null && attachments.Count > 0)
                    mailValues.Attachments = attachments;
            }

            return mailValues;
        }
        private bool SendGridBulkMailAPICall(SendGridEmailRequest values)
        {
            bool responseStatus = false;
            try
            {
                sendgridResponse = new SendGridResponse();

                using (var HttpClientRequest = new HttpRequestMessage(new HttpMethod("POST"), mailConfigration.ConfigurationUrl))
                {
                    HttpClientRequest.Content = new StringContent(JsonConvert.SerializeObject(values));
                    HttpClientRequest.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                    HttpClientRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", mailConfigration.ApiKey);

                    using (HttpClient HttpClient = new HttpClient())
                    {
                        HttpResponseMessage Response = HttpClient.SendAsync(HttpClientRequest).Result;
                        if (Response.StatusCode == HttpStatusCode.Accepted)
                        {
                            if (Response.Headers.Contains("X-Message-Id"))
                            {
                                sendgridResponse = new SendGridResponse()
                                {
                                    transactionId = Response.Headers.GetValues("X-Message-Id").FirstOrDefault(),
                                    status = true
                                };
                            }
                            else
                            {
                                sendgridResponse = new SendGridResponse()
                                {
                                    status = false,
                                    errormessage = "X-Message-Id or transactional id not found"
                                };
                            }
                            return true;
                        }
                        else
                        {
                            string ResponseContent = Response.Content.ReadAsStringAsync().Result;
                            JObject itemObject = JObject.Parse(ResponseContent.ToString());
                            JArray errors = (JArray)itemObject["errors"];
                            JObject firstError = (JObject)errors[0];
                            var Message = (string)firstError["message"];

                            sendgridResponse = new SendGridResponse()
                            {
                                status = false,
                                errormessage = Message
                            };

                            return false;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                sendgridResponse = new SendGridResponse()
                {
                    code = "-1",
                    errormessage = ex.Message.ToString(),
                    status = false
                };
            }
            return responseStatus;
        }

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
