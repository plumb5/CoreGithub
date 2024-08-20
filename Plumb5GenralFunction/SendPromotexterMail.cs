using IP5GenralDL;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class SendPromotexterMail : IDisposable, IBulkMailSending
    {
        private readonly IDistributedCache _cache;

        private readonly string? SQLProvider;
        public SendPromotexterMail(IConfiguration _configuration, IDistributedCache cache)
        {
            SQLProvider = _configuration["SqlProvider"];
            _cache = cache;
        }

        readonly MailSetting MailSetting;
        readonly MailConfiguration mailConfigration;
        readonly MailTemplate templateDetails;
        readonly StringBuilder MainContentOftheMail = new StringBuilder();
        StringBuilder Body = new StringBuilder();
        public PromotexterResponse promotexterResponse;
        public PromotexterErrorResponse promotexterErrorResponse;
        readonly int AccountId;
        public int MailCampaignId = 0;

        public List<MLMailVendorResponse> VendorResponses { get; set; }
        private readonly string JobTagName;
        public string ErrorMessage { get; set; }

        HelperForMail HelpMail;

        public SendPromotexterMail(int accountId, MailSetting mailSetting, MailConfiguration mailConfig, string jobTagName = "campaign", string? SqlProvider = null)
        {
            try
            {
                AccountId = accountId;
                mailConfigration = mailConfig;
                MailSetting = mailSetting;
                VendorResponses = new List<MLMailVendorResponse>();
                templateDetails = new MailTemplate { Id = MailSetting.MailTemplateId };
                JobTagName = jobTagName;
                promotexterResponse = new PromotexterResponse();
                promotexterErrorResponse = new PromotexterErrorResponse();
                HelpMail = new HelperForMail(AccountId, "", "");
                SQLProvider = SqlProvider;

                if (templateDetails.Id > 0 && String.IsNullOrEmpty(mailSetting.MessageBodyText))
                {
                    using (var objBLTemplate = DLMailTemplate.GetDLMailTemplate(accountId, SQLProvider))
                    {
                        templateDetails = objBLTemplate.GETDetails(templateDetails);
                        MailCampaignId = templateDetails.MailCampaignId;
                    }

                    AppendMailTemplate();

                    Body.Clear().Append(Helper.ChangeUrlToAnalyticTrackUrl(MainContentOftheMail));
                    HelpMail.ChangeImageToOnlineUrl(Body, templateDetails);
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
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "SendPromotexterMail->SendPromotexterMail", ex.ToString());
                }
                throw;
            }
        }

        public bool SendSingleMail(MLMailSent mailSent)
        {
            bool result = false;
            result = PromotexterMailSingleContactApiCall(mailSent);

            //Put the response data in VendorResponses
            #region Response Ready
            string TransactionId = string.Empty;
            if (result)
            {
                TransactionId = promotexterResponse.message.transactionId;
            }
            else
            {
                ErrorMessage = promotexterErrorResponse.code + ":" + promotexterErrorResponse.message;
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
            mailSentList = mailSentList.OrderBy(s => s.ContactId).ToList();
            bool result = false;
            try
            {
                List<string> BodyMergingFields = GetReplaceFieldList(Body);

                List<string> fieldNames = new List<string>() { "ContactId", "EmailId" };
                foreach (string field in BodyMergingFields)
                {
                    fieldNames.Add(field.Replace("[{*", "").Replace("*}]", ""));
                }

                fieldNames = fieldNames.Distinct().ToList();

                DataTable ContactIdDataTable = new DataTable();
                ContactIdDataTable.Columns.Add("ContactId", typeof(int));
                foreach (MLMailSent contacts in mailSentList)
                {
                    ContactIdDataTable.Rows.Add(contacts.ContactId);
                }

                List<Contact> contactsList;
                using (var objDL = DLContact.GetContactDetails(AccountId, SQLProvider))
                {
                    contactsList = objDL.GetListByContactIdTable(ContactIdDataTable, fieldNames).OrderBy(x => x.ContactId).ToList();
                }

                for (int i = 0; i < contactsList.Count; i++)
                {
                    result = false;
                    promotexterResponse = new PromotexterResponse();
                    promotexterErrorResponse = new PromotexterErrorResponse();
                    ErrorMessage = "";
                    MLMailSent LocalMailSent = mailSentList.Where(x => x.ContactId == contactsList[i].ContactId).FirstOrDefault();
                    MLMailVendorResponse VendorResponse = new MLMailVendorResponse();
                    string TransactionId = string.Empty;
                    try
                    {
                        result = PromotexterMailContactApiCall(contactsList[i]);

                        if (result)
                        {
                            TransactionId = promotexterResponse.message.transactionId;
                        }
                        else
                        {
                            ErrorMessage = promotexterErrorResponse.code + ":" + promotexterErrorResponse.message;
                        }

                        VendorResponse.Id = LocalMailSent.Id;
                        VendorResponse.MailTemplateId = MailSetting.MailTemplateId;
                        VendorResponse.MailCampaignId = MailCampaignId;
                        VendorResponse.MailSendingSettingId = LocalMailSent.MailSendingSettingId;
                        VendorResponse.GroupId = LocalMailSent.GroupId;
                        VendorResponse.ContactId = LocalMailSent.ContactId;
                        VendorResponse.EmailId = LocalMailSent.EmailId;
                        VendorResponse.ResponseId = TransactionId;
                        VendorResponse.SendStatus = result ? 1 : 0;
                        VendorResponse.ProductIds = "";
                        VendorResponse.P5MailUniqueID = LocalMailSent.P5MailUniqueID;
                        VendorResponse.ErrorMessage = ErrorMessage;
                        VendorResponse.WorkFlowId = LocalMailSent.WorkFlowId;
                        VendorResponse.WorkFlowDataId = LocalMailSent.WorkFlowDataId;
                        VendorResponse.CampaignJobName = JobTagName;
                        VendorResponse.TriggerMailSmsId = LocalMailSent.TriggerMailSmsId;
                        VendorResponse.IsMailSplitTest = LocalMailSent.IsMailSplitTest;
                    }
                    catch (Exception ex)
                    {
                        VendorResponse.Id = LocalMailSent.Id;
                        VendorResponse.MailTemplateId = MailSetting.MailTemplateId;
                        VendorResponse.MailCampaignId = MailCampaignId;
                        VendorResponse.MailSendingSettingId = LocalMailSent.MailSendingSettingId;
                        VendorResponse.GroupId = LocalMailSent.GroupId;
                        VendorResponse.ContactId = LocalMailSent.ContactId;
                        VendorResponse.EmailId = LocalMailSent.EmailId;
                        VendorResponse.ResponseId = TransactionId;
                        VendorResponse.SendStatus = 4;
                        VendorResponse.ProductIds = "";
                        VendorResponse.P5MailUniqueID = LocalMailSent.P5MailUniqueID;
                        VendorResponse.ErrorMessage = ex.Message.ToString();
                        VendorResponse.WorkFlowId = LocalMailSent.WorkFlowId;
                        VendorResponse.WorkFlowDataId = LocalMailSent.WorkFlowDataId;
                        VendorResponse.CampaignJobName = JobTagName;
                        VendorResponse.TriggerMailSmsId = LocalMailSent.TriggerMailSmsId;
                        VendorResponse.IsMailSplitTest = LocalMailSent.IsMailSplitTest;

                        using (ErrorUpdation objError = new ErrorUpdation("BulkMailWindowsService"))
                        {
                            objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "SendPromotexterMail->SendBulkMail->InResponse", ex.ToString());
                        }
                    }
                    VendorResponses.Add(VendorResponse);
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message.ToString();
                promotexterErrorResponse.code = "-1";
                promotexterErrorResponse.message = ErrorMessage;
                result = false;

                using (ErrorUpdation objError = new ErrorUpdation("BulkMailWindowsService"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "SendPromotexterMail->SendBulkMail", ex.ToString());
                }
            }

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
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var client = new RestClient(mailConfigration.ConfigurationUrl);
                var request = new RestRequest(Method.POST);
                request.AddParameter("apiKey", mailConfigration.ApiKey);
                request.AddParameter("apiSecret", mailConfigration.ApiSecretKey);
                request.AddParameter("fromEmail", MailSetting.FromEmailId);
                request.AddParameter("to", ToMailAddress);
                request.AddParameter("subject", MailSetting.Subject);
                request.AddParameter("html", "1");
                request.AddParameter("body", (Convert.ToString(BodyContent) + "<a href='%Unsubscribe_Link%' target='_blank' name='Unsubscribe'>Unsubscribe</a>"));
                request.AddParameter("dlrReport", "1");
                request.AddParameter("dlrCallback", AllConfigURLDetails.KeyValueForConfig["PROMOTEXTER_EMAIL_DELIVERY"].ToString().Replace("{{AdsId}}", AccountId.ToString()));
                request.AddHeader("cache-control", "no-cache");
                IRestResponse response = client.Execute(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    promotexterResponse = JsonConvert.DeserializeObject<PromotexterResponse>(response.Content);
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SpamCheck"))
                    objError.AddError(ex.Message.ToString(), mailConfigration != null ? mailConfigration.ProviderName : "", DateTime.Now.ToString(), "Plumb5.Areas.Mail.Models-CheckSpamAssassinDetails-SendMail", ex.ToString());
                return false;
            }


        }

        private bool PromotexterMailContactApiCall(Contact mailContact)
        {
            bool result = false;
            try
            {
                HelpMail.ReplaceContactDetails(Body, mailContact);

                if ((Body.ToString().Contains("[{*")) && (Body.ToString().Contains("*}]")))
                {
                    ErrorMessage = "Template dynamic content not replaced";
                    promotexterErrorResponse.code = "-1";
                    promotexterErrorResponse.message = ErrorMessage;
                    result = false;
                }
                else
                {
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                    var client = new RestClient(mailConfigration.ConfigurationUrl);
                    var request = new RestRequest(Method.POST);
                    request.AddParameter("apiKey", mailConfigration.ApiKey);
                    request.AddParameter("apiSecret", mailConfigration.ApiSecretKey);
                    request.AddParameter("fromEmail", MailSetting.FromEmailId);
                    request.AddParameter("to", mailContact.EmailId);
                    request.AddParameter("subject", MailSetting.Subject);
                    request.AddParameter("html", "1");
                    request.AddParameter("body", (Convert.ToString(Body) + "<a href='%Unsubscribe_Link%' target='_blank' name='Unsubscribe'>Unsubscribe</a>"));
                    request.AddParameter("dlrReport", "1");
                    request.AddParameter("dlrCallback", AllConfigURLDetails.KeyValueForConfig["PROMOTEXTER_EMAIL_DELIVERY"].ToString().Replace("{{AdsId}}", AccountId.ToString()));
                    request.AddHeader("cache-control", "no-cache");
                    IRestResponse response = client.Execute(request);

                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        promotexterResponse = JsonConvert.DeserializeObject<PromotexterResponse>(response.Content);
                        result = true;
                    }
                    else if (response.StatusCode == (HttpStatusCode)422)
                    {
                        promotexterErrorResponse = JsonConvert.DeserializeObject<PromotexterErrorResponse>(response.Content);
                        result = false;
                    }
                    else
                    {
                        ErrorMessage = response.Content;
                        promotexterErrorResponse.code = response.StatusCode.ToString();
                        promotexterErrorResponse.message = ErrorMessage;
                        result = false;
                    }
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message.ToString();
                promotexterErrorResponse.code = "-1";
                promotexterErrorResponse.message = ErrorMessage;
                result = false;

                using (ErrorUpdation objError = new ErrorUpdation("BulkMailWindowsService"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "SendPromotexterMail->PromotexterMailApiCall", ex.ToString());
                }
            }
            return result;
        }

        private bool PromotexterMailSingleContactApiCall(MLMailSent mailSent)
        {
            bool result = false;
            try
            {
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                var client = new RestClient(mailConfigration.ConfigurationUrl + "email");
                var request = new RestRequest(Method.POST);
                request.AddParameter("apiKey", mailConfigration.ApiKey);
                request.AddParameter("apiSecret", mailConfigration.ApiSecretKey);
                request.AddParameter("fromEmail", MailSetting.FromEmailId);
                request.AddParameter("to", mailSent.EmailId);
                request.AddParameter("subject", MailSetting.Subject);
                request.AddParameter("html", "1");
                request.AddParameter("body", Convert.ToString(Body) + "%Unsubscribe_Link%");
                request.AddParameter("dlrReport", "1");
                request.AddParameter("dlrCallback", AllConfigURLDetails.KeyValueForConfig["PROMOTEXTER_EMAIL_DELIVERY"].ToString());
                request.AddHeader("cache-control", "no-cache");
                IRestResponse response = client.Execute(request);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    promotexterResponse = JsonConvert.DeserializeObject<PromotexterResponse>(response.Content);
                    result = true;
                }
                else if (response.StatusCode == (HttpStatusCode)422)
                {
                    promotexterErrorResponse = JsonConvert.DeserializeObject<PromotexterErrorResponse>(response.Content);
                    result = false;
                }
                else
                {
                    ErrorMessage = response.Content;
                    promotexterErrorResponse.code = response.StatusCode.ToString();
                    promotexterErrorResponse.message = ErrorMessage;
                    result = false;
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message.ToString();
                promotexterErrorResponse.code = "-1";
                promotexterErrorResponse.message = ErrorMessage;
                result = false;

                using (ErrorUpdation objError = new ErrorUpdation("BulkMailWindowsService"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "SendPromotexterMail->PromotexterMailApiCall", ex.ToString());
                }
            }
            return result;
        }

        public class PromotexterErrorResponse
        {
            public string code { get; set; }
            public string message { get; set; }
        }

        public class PromotexterResponse
        {
            public string status { get; set; }
            public PromotexterSubResponse message { get; set; }
        }

        public class PromotexterSubResponse
        {
            public string transactionId { get; set; }
            public string transactionCost { get; set; }
            public string fromEmail { get; set; }
            public string to { get; set; }
            public string subject { get; set; }
            public string groupName { get; set; }
            public string remainingBalance { get; set; }
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

        private List<string> GetReplaceFieldList(StringBuilder htmlContent)
        {
            List<string> allMergingField = new List<string>();

            foreach (Match m in Regex.Matches(htmlContent.ToString(), "\\[{.*?}\\]", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace))
            {
                allMergingField.Add(m.Value);
            }
            return allMergingField;
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
