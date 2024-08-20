using IP5GenralDL;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;


namespace Plumb5GenralFunction
{
    public class SendElasticMail : IDisposable, IBulkMailSending
    {

        private readonly string? SQLProvider;
        readonly MailSetting MailSetting;
        readonly MailConfiguration mailConfigration;
        readonly MailTemplate templateDetails;
        readonly List<MailTemplateAttachment> mailTemplateAttachment;
        readonly StringBuilder MainContentOftheMail = new StringBuilder();
        StringBuilder Body = new StringBuilder();
        public ElasticResponse elasticResponse;
        readonly int AccountId;
        public int MailCampaignId = 0;
        string attachments;

        public List<MLMailVendorResponse> VendorResponses { get; set; }
        public MLMailVendorResponse VendorSingleResponse { get; set; }

        private readonly string JobTagName;
        public string ErrorMessage { get; set; }

        List<MLMailSent> mailNotSentList;
        private int Lmsgroupmemberid;

        public SendElasticMail(int accountId, MailSetting mailSetting, MailConfiguration mailConfig, string jobTagName = "campaign", int lmsgroupmemberid = 0, string? SqlProvider = null)
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
                    using (var objBLTemplate = DLMailTemplate.GetDLMailTemplate(accountId, SqlProvider))
                    {
                        templateDetails = objBLTemplate.GETDetails(templateDetails);
                        MailCampaignId = templateDetails.MailCampaignId;
                    }

                    using (var objBLAttachment = DLMailTemplateAttachment.GetDLMailTemplateAttachment(accountId, SqlProvider))
                    {
                        mailTemplateAttachment = objBLAttachment.GetAttachments(templateDetails.Id);
                    }

                    AppendMailTemplate(SqlProvider);

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
                using (ErrorUpdation objError = new ErrorUpdation("BulkMailWindowsService"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "SendBulkMailGeneral->SendBulkMailGeneral", ex.ToString());
                }
                throw;
            }
        }

        public virtual bool SendSingleMail(MLMailSent mailSent)
        {
            bool result = false;

            NameValueCollection mailValues = ElasticMailParameters(mailSent);

            try
            {
                result = ElasticBulkMailAPICall(mailValues);
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SendElasticMail"))
                    objError.AddError(ex.Message.ToString(), "outfile to stream issue", DateTime.Now.ToString(), "SendElasticMail-->SendBulkMail", ex.ToString(), true);
            }

            //Put the response data in VendorResponses
            #region Response Ready

            string TransactionId = string.Empty;

            if (result)
            {
                TransactionId = elasticResponse.TransactionId.ToString();
            }
            else
            {
                ErrorMessage = elasticResponse.message + ":" + elasticResponse.error_info.error_message;
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

            mailSentList = mailSentList.OrderBy(s => s.ContactId).ToList();
            mailNotSentList = new List<MLMailSent>();
            bool result = false;
            string FileName = "ElasticBulkMail_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + ".csv";
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
                ErrorUpdation.AddErrorLog("CustomEventFieldReplace", ex.Message, "CustomEvent Data Replace issue", DateTime.Now, "SendElasticMail-->SendBulkMail", ex.StackTrace);
            }

            /* Custom Events Data Replacing*/

            fieldNames.Add("p5uniqueid");


            string contactListCsv = string.Join(",", fieldNames.Select(p => '\"' + p + '\"'));

            for (int i = 0; i < contactsList.Count; i++)
            {
                object[] values = new object[fieldNames.Count];
                bool isAllFieldExists = true;
                for (int j = 1; j < fieldNames.Count; j++)
                {
                    if (fieldNames[j].Contains("p5uniqueid"))
                    {
                        string P5MailUniqueID = mailSentList.Where(x => x.ContactId == contactsList[i].ContactId).ToList()[0].P5MailUniqueID;
                        values[j] = P5MailUniqueID;
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

                                values[j] = ReplacingValue;
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

                                values[j] = ReplacingValue;
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
                        //string ReplacingValue = (OriginalValue == null || string.IsNullOrEmpty(Convert.ToString(OriginalValue))) ? "" : Convert.ToString(OriginalValue);

                        //if (string.IsNullOrEmpty(ReplacingValue))

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
                                        ReplacingValue = keypairvalue;
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
                        }
                        else if (ReplacingValue == "[NA]")
                        {
                            isAllFieldExists = false;
                            break;
                        }

                        values[j] = ReplacingValue;
                    }
                }

                if (!isAllFieldExists)
                {
                    mailNotSentList.Add(mailSentList.Where(x => x.ContactId == contactsList[i].ContactId).First());
                    mailSentList.Remove(mailSentList.Where(x => x.ContactId == contactsList[i].ContactId).First());
                }
                else
                {
                    values[0] = contactsList[i].EmailId;
                    contactListCsv += Environment.NewLine + string.Join(",", values.ToList().Select(p => '\"' + Convert.ToString(p) + '\"'));
                }
            }

            //Check dynamic filed values present or not End

            if (mailSentList != null && mailSentList.Count > 0)
            {
                NameValueCollection mailValues = ElasticMailParameters(FileName, Body);

                try
                {
                    var outfile = contactListCsv;
                    var filesStream = new Stream[] { outfile.ToStream() };
                    var filenames = new string[] { FileName };
                    result = ElasticBulkMailAPICall(mailValues, filesStream, filenames);
                }
                catch (Exception ex)
                {
                    using (ErrorUpdation objError = new ErrorUpdation("SendElasticMail"))
                        objError.AddError(ex.Message.ToString(), "outfile to stream issue", DateTime.Now.ToString(), "SendElasticMail-->SendBulkMail", ex.ToString(), true);
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
                    TransactionId = elasticResponse.TransactionId.ToString();
                }
                else
                {
                    ErrorMessage = elasticResponse.message + ":" + elasticResponse.error_info.error_message;
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
        public async Task<bool> SendBulkMailAsync(List<MLMailSent> mailSentList, string SqlProvider)
        {
            return await Task.Run(() => SendBulkMail(mailSentList));
        }

        public bool SendSpamScoreMail(string ToMailAddress, string BodyContent)
        {
            try
            {
                NameValueCollection mailValues = new NameValueCollection();
                mailValues.Add("username", mailConfigration.AccountName);
                mailValues.Add("api_key", mailConfigration.ApiKey);
                mailValues.Add("from", MailSetting.FromEmailId);
                mailValues.Add("from_name", MailSetting.FromName);
                mailValues.Add("subject", MailSetting.Subject);
                mailValues.Add("body_html", BodyContent);
                mailValues.Add("to", ToMailAddress);

                using (WebClient client = new WebClient())
                    client.UploadValues(AllConfigURLDetails.KeyValueForConfig["ELASTICEMAIL"].ToString(), mailValues);

                return true;
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SpamCheck"))
                    objError.AddError(ex.Message.ToString(), mailConfigration != null ? mailConfigration.ProviderName : "", DateTime.Now.ToString(), "Plumb5.Areas.Mail.Models-CheckSpamAssassinDetails-SendMail", ex.ToString());

                return false;
            }
        }

        public virtual NameValueCollection ElasticMailParameters(MLMailSent mailSent)
        {
            NameValueCollection mailValues = new NameValueCollection();
            mailValues.Add("apikey", mailConfigration.ApiKey);
            mailValues.Add("from", MailSetting.FromEmailId);
            mailValues.Add("fromName", MailSetting.FromName);
            mailValues.Add("subject", MailSetting.Subject.ToString());
            mailValues.Add("postBack", AccountId.ToString());
            mailValues.Add("replyTo", MailSetting.ReplyTo);
            mailValues.Add("bodyHtml", Body.ToString());
            if (MailSetting.IsTransaction)
                mailValues.Add("isTransactional", "false");
            mailValues.Add("to", mailSent.EmailId);
            return mailValues;
        }

        private NameValueCollection ElasticMailParameters(string FileName, StringBuilder Body)
        {
            NameValueCollection mailValues = new NameValueCollection();
            mailValues.Add("apikey", mailConfigration.ApiKey);
            mailValues.Add("from", MailSetting.FromEmailId);
            mailValues.Add("fromName", MailSetting.FromName);
            MailSetting.Subject = MailSetting.Subject.Replace("[{*", "{").Replace("*}]", "}");
            mailValues.Add("subject", MailSetting.Subject.ToString());
            mailValues.Add("postBack", AccountId.ToString());
            mailValues.Add("mergesourcefilename", FileName);
            mailValues.Add("replyTo", MailSetting.ReplyTo);

            Body.Replace("[{*", "{").Replace("*}]", "}");
            mailValues.Add("bodyHtml", Body.ToString());

            if (mailTemplateAttachment != null && mailTemplateAttachment.Count > 0)
            {
                for (var i = 0; i < mailTemplateAttachment.Count; i++)
                {
                    SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(AccountId, templateDetails.Id);
                    attachments += ";" + awsUpload.GetFileContentString(mailTemplateAttachment[i].AttachmentFileName, awsUpload.bucketname);
                }
            }

            if (!string.IsNullOrEmpty(attachments) && attachments.Length > 0)
            {
                attachments = attachments.TrimStart(';');
                mailValues.Add("attachments", attachments);
            }

            if (MailSetting.IsTransaction)
                mailValues.Add("isTransactional", "false");

            return mailValues;
        }

        private bool ElasticBulkMailAPICall(NameValueCollection values)
        {
            using (var client = new HttpClient())
            {
                using (var formData = new MultipartFormDataContent())
                {
                    try
                    {
                        foreach (string key in values)
                        {
                            HttpContent stringContent = new StringContent(values[key]);
                            formData.Add(stringContent, key);
                        }

                        var response = client.PostAsync(mailConfigration.ConfigurationUrl, formData).Result;

                        if (!response.IsSuccessStatusCode)
                        {
                            throw new Exception(response.Content.ReadAsStringAsync().Result);
                        }

                        string data = response.Content.ReadAsStringAsync().Result;
                        JObject itemObject = JObject.Parse(data.ToString());
                        var Message = itemObject["success"].ToString();

                        if (Message == "True")
                        {
                            elasticResponse = new ElasticResponse();
                            elasticResponse.TransactionId = itemObject["data"]["transactionid"].ToString();
                            return true;
                        }
                        else
                        {
                            elasticResponse = new ElasticResponse()
                            {
                                error_info = new ElasticError() { error_code = "-1", error_message = itemObject["error"].ToString() },
                                message = "exception"
                            };
                            return false;
                        }
                    }
                    catch (Exception ex)
                    {
                        elasticResponse = new ElasticResponse()
                        {
                            error_info = new ElasticError() { error_code = "-1", error_message = ex.Message.ToString() },
                            message = "exception"
                        };
                        using (ErrorUpdation objError = new ErrorUpdation("BulkMailWindowsService"))
                        {
                            objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "ElasticBulkMailAPICall-Error", ex.ToString());
                        }
                        return false;
                    }
                }
            }
        }

        private bool ElasticBulkMailAPICall(NameValueCollection values, Stream[] paramFileStream, string[] filenames)
        {
            using (var client = new HttpClient())
            {
                using (var formData = new MultipartFormDataContent())
                {
                    try
                    {
                        foreach (string key in values)
                        {
                            HttpContent stringContent = new StringContent(values[key]);
                            formData.Add(stringContent, key);
                        }

                        for (int i = 0; i < paramFileStream.Length; i++)
                        {
                            HttpContent fileStreamContent = new StreamContent(paramFileStream[i]);
                            formData.Add(fileStreamContent, "file" + i, filenames[i]);
                        }

                        var response = client.PostAsync(mailConfigration.ConfigurationUrl, formData).Result;
                        if (!response.IsSuccessStatusCode)
                        {
                            throw new Exception(response.Content.ReadAsStringAsync().Result);
                        }
                        string data = response.Content.ReadAsStringAsync().Result;
                        JObject itemObject = JObject.Parse(data.ToString());
                        var Message = itemObject["success"].ToString();

                        if (Message == "True")
                        {
                            elasticResponse = new ElasticResponse();
                            elasticResponse.TransactionId = itemObject["data"]["transactionid"].ToString();
                            return true;
                        }
                        else
                        {
                            elasticResponse = new ElasticResponse()
                            {
                                error_info = new ElasticError() { error_code = "-1", error_message = itemObject["error"].ToString() },
                                message = "exception"
                            };
                            return false;
                        }
                    }
                    catch (Exception ex)
                    {
                        elasticResponse = new ElasticResponse()
                        {
                            error_info = new ElasticError() { error_code = "-1", error_message = ex.Message.ToString() },
                            message = "exception"
                        };
                        using (ErrorUpdation objError = new ErrorUpdation("BulkMailWindowsService"))
                        {
                            objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "ElasticBulkMailAPICall-Error", ex.ToString());
                        }
                        return false;
                    }
                }
            }
        }

        private void AppendMailTemplate(string SqlProvider)
        {
            MailTemplateFile? mailTemplateFile;
            using (var objBL = DLMailTemplateFile.GetDLMailTemplateFile(AccountId, SqlProvider))
            {
                mailTemplateFile = objBL.GetSingleFileTypeSync(new MailTemplateFile() { TemplateId = templateDetails.Id, TemplateFileType = ".HTML" });
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

        public class ElasticResponse
        {
            public ElasticError error_info { get; set; }
            public string message { get; set; }
            public string TransactionId { get; set; }
        }

        public class ElasticError
        {
            public string error_message { get; set; }
            public string error_code { get; set; }
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
