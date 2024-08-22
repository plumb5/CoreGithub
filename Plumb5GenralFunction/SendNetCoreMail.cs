using IP5GenralDL;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using RestSharp.Extensions;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;

namespace Plumb5GenralFunction
{
    public class SendNetCoreMail : IDisposable, IBulkMailSending
    {
        private readonly IDistributedCache _cache;

        private readonly string? SQLProvider;
        public SendNetCoreMail(IConfiguration _configuration, IDistributedCache cache)
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
        readonly int AccountId;
        public NetCoreResponse netCoreResponse;
        public int MailCampaignId = 0;

        public List<MLMailVendorResponse> VendorResponses { get; set; }
        private readonly string JobTagName;

        public string ErrorMessage { get; set; }

        List<MLMailSent> mailNotSentList;
        private int Lmsgroupmemberid;

        public SendNetCoreMail(int accountId, MailSetting mailSetting, MailConfiguration mailConfig, string jobTagName = "campaign", int lmsgroupmemberid = 0, string? SqlProvider = null)
        {
            try
            {
                AccountId = accountId;
                mailConfigration = mailConfig;
                MailSetting = mailSetting;
                JobTagName = jobTagName;
                VendorResponses = new List<MLMailVendorResponse>();
                templateDetails = new MailTemplate { Id = MailSetting.MailTemplateId };
                Lmsgroupmemberid = lmsgroupmemberid;

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
                using (ErrorUpdation objError = new ErrorUpdation("BulkMailWindowsService"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "SendBulkMailGeneral->SendBulkMailGeneral", ex.ToString());
                }
                throw;
            }
            SQLProvider = SqlProvider;
        }

        public bool SendSingleMail(MLMailSent mailSent)
        {
            bool result = false;

            JObject NetCoreBulkMailObject = NetCoreFalonideBulkMailParameter(mailSent);
            result = NetCoreBulkMailAPICall(NetCoreBulkMailObject);

            //Put the response data in VendorResponses
            #region Response Ready

            if (!result && netCoreResponse != null)
            {
                ErrorMessage = netCoreResponse.message + ":" + netCoreResponse.error_info.error_message;
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
                VendorResponse.P5MailUniqueID = mailSent.ResponseId;  //swapping bcz of index problem
                VendorResponse.SendStatus = result ? 1 : 0;
                VendorResponse.ProductIds = "";
                VendorResponse.ResponseId = mailSent.P5MailUniqueID;  //swapping bcz of index problem
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
                VendorResponse.P5MailUniqueID = mailSent.ResponseId; //swapping bcz of index problem
                VendorResponse.SendStatus = 4;
                VendorResponse.ProductIds = "";
                VendorResponse.ResponseId = mailSent.P5MailUniqueID; //swapping bcz of index problem
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

        public async Task<bool> SendSingleMailAsync(MLMailSent mailSent)
        {
            bool result = false;

            JObject NetCoreBulkMailObject = await NetCoreFalonideBulkMailParameterAsync(mailSent);
            result = await NetCoreBulkMailAPICallAsync(NetCoreBulkMailObject);

            //Put the response data in VendorResponses
            #region Response Ready

            if (!result && netCoreResponse != null)
            {
                ErrorMessage = netCoreResponse.message + ":" + netCoreResponse.error_info.error_message;
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
                VendorResponse.P5MailUniqueID = mailSent.ResponseId;  //swapping bcz of index problem
                VendorResponse.SendStatus = result ? 1 : 0;
                VendorResponse.ProductIds = "";
                VendorResponse.ResponseId = mailSent.P5MailUniqueID;  //swapping bcz of index problem
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
                VendorResponse.P5MailUniqueID = mailSent.ResponseId; //swapping bcz of index problem
                VendorResponse.SendStatus = 4;
                VendorResponse.ProductIds = "";
                VendorResponse.ResponseId = mailSent.P5MailUniqueID; //swapping bcz of index problem
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

        public bool SendBulkMail(List<MLMailSent> mailSentList)
        {
            StringBuilder mailSubject = new StringBuilder();

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

            if (Lmsgroupmemberid == 0)
            {
                using (var objDL = DLLmsGroupMembers.GetDLLmsGroupMembers(AccountId, SQLProvider))
                {
                    lmsDetails = objDL.GetLmsDetailsList(ContactIdDataTable);
                }
            }

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
                ErrorUpdation.AddErrorLog("CustomEventFieldReplace", ex.Message, "CustomEvent Data Replace issue", DateTime.Now, "SendNetCoreMail-->SendBulkMail", ex.StackTrace);
            }

            fieldNames.Add("p5uniqueid");

            /* Custom Events Data Replacing*/

            List<NetCorePersonalization> PersonalizeVarinfo = new List<NetCorePersonalization>();
            for (int i = 0; i < contactsList.Count; i++)
            {
                bool isAllFieldExists = true;

                NetCorePersonalization objpersonalizeinfo = new NetCorePersonalization();
                objpersonalizeinfo.recipient = contactsList[i].EmailId;
                objpersonalizeinfo.x_apiheader = mailSentList.Where(x => x.ContactId == contactsList[i].ContactId).First().P5MailUniqueID + "@@@BulkMail";
                objpersonalizeinfo.attributes = new Dictionary<string, string>();
                for (int j = 0; j < fieldNames.Count; j++)
                {
                    if (fieldNames[j].Contains("p5uniqueid"))
                    {
                        string P5MailUniqueID = mailSentList.Where(x => x.ContactId == contactsList[i].ContactId).ToList()[0].P5MailUniqueID;
                        objpersonalizeinfo.attributes.Add(fieldNames[j], P5MailUniqueID);
                    }
                    else if (fieldNames[j].Contains("lmscustomfield"))
                    {
                        if (lmsDetails != null)
                        {
                            var lmscustomfield = lmsDetails.Where(x => x.ContactId == contactsList[i].ContactId).ToList();
                            var OriginalValue = lmscustomfield[0].GetType().GetProperty(fieldNames[j], BindingFlags.SetProperty | BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(lmscustomfield[0]);
                            string ReplacingValue = (OriginalValue == null) ? null : Convert.ToString(OriginalValue);

                            objpersonalizeinfo.attributes.Add(fieldNames[j], ReplacingValue);
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

                                objpersonalizeinfo.attributes.Add(fieldNames[j], ReplacingValue);
                            }
                        }
                    }
                    else
                    {
                        var OriginalValue = contactsList[i].GetType().GetProperty(fieldNames[j], BindingFlags.SetProperty | BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(contactsList[i]);
                        //string ReplacingValue = (OriginalValue == null || string.IsNullOrEmpty(Convert.ToString(OriginalValue))) ? "" : Convert.ToString(OriginalValue);
                        string ReplacingValue = (OriginalValue == null) ? null : Convert.ToString(OriginalValue);

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
                                        objpersonalizeinfo.attributes.Add(fieldNames[j], keypairvalue);
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
                                objpersonalizeinfo.attributes.Add(fieldNames[j], ReplacingValue);
                            }
                        }
                        else
                        {
                            objpersonalizeinfo.attributes.Add(fieldNames[j], ReplacingValue);
                        }
                    }
                }

                if (!isAllFieldExists)
                {
                    mailNotSentList.Add(mailSentList.Where(x => x.ContactId == contactsList[i].ContactId).First());
                    mailSentList.Remove(mailSentList.Where(x => x.ContactId == contactsList[i].ContactId).First());
                }
                else
                {
                    PersonalizeVarinfo.Add(objpersonalizeinfo);
                }
            }

            //Check dynamic filed values present or not End
            if (mailSentList != null && mailSentList.Count > 0)
            {
                JObject NetCoreBulkMailObject = NetCoreFalonideBulkMailParameter(Body, PersonalizeVarinfo);
                result = NetCoreBulkMailAPICall(NetCoreBulkMailObject);
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
                    VendorResponse.P5MailUniqueID = mailNotSentList[i].ResponseId;  //swapping bcz of index problem
                    VendorResponse.SendStatus = 0;
                    VendorResponse.ProductIds = "";
                    VendorResponse.ResponseId = mailNotSentList[i].P5MailUniqueID;  //swapping bcz of index problem
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
                if (!result && netCoreResponse != null)
                {
                    ErrorMessage = netCoreResponse.message + ":" + netCoreResponse.error_info.error_message;
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
                        VendorResponse.P5MailUniqueID = mailSentList[i].ResponseId;  //swapping bcz of index problem
                        VendorResponse.SendStatus = result ? 1 : 0;
                        VendorResponse.ProductIds = "";
                        VendorResponse.ResponseId = mailSentList[i].P5MailUniqueID;  //swapping bcz of index problem
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
                        VendorResponse.P5MailUniqueID = mailSentList[i].ResponseId; //swapping bcz of index problem
                        VendorResponse.SendStatus = 4;
                        VendorResponse.ProductIds = "";
                        VendorResponse.ResponseId = mailSentList[i].P5MailUniqueID; //swapping bcz of index problem
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
        public async Task<bool> SendBulkMailAsync(List<MLMailSent> mailSentList)
        {
            mailSentList = mailSentList.OrderBy(s => s.ContactId).ToList();
            mailNotSentList = new List<MLMailSent>();
            bool result = false;
            HelperForMail objMail = new HelperForMail(AccountId, "", "");
            objMail.ChangeImageToOnlineUrl(Body, templateDetails);

            //Check dynamic filed values present or not Begin
            Tuple<List<string>, List<KeyValuePair<string, string>>, string, List<KeyValuePair<string, string>>> BodyMergingFields = GetReplaceFieldList(Body, MailSetting.Subject);
            List<string> fieldNames = new List<string>() { "EmailId", "ContactId" };

            MailSetting.Subject = BodyMergingFields.Item3;

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

            List<NetCorePersonalization> PersonalizeVarinfo = new List<NetCorePersonalization>();
            for (int i = 0; i < contactsList.Count; i++)
            {
                bool isAllFieldExists = true;

                NetCorePersonalization objpersonalizeinfo = new NetCorePersonalization();
                objpersonalizeinfo.recipient = contactsList[i].EmailId;
                objpersonalizeinfo.x_apiheader = mailSentList.Where(x => x.ContactId == contactsList[i].ContactId).First().P5MailUniqueID + "@@@BulkMail";
                objpersonalizeinfo.attributes = new Dictionary<string, string>();
                for (int j = 0; j < fieldNames.Count; j++)
                {
                    var OriginalValue = contactsList[i].GetType().GetProperty(fieldNames[j], BindingFlags.SetProperty | BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(contactsList[i]);
                    string ReplacingValue = (OriginalValue == null || string.IsNullOrEmpty(Convert.ToString(OriginalValue))) ? "" : Convert.ToString(OriginalValue);

                    if (ReplacingValue != null || ReplacingValue == "")
                    {
                        if (BodyMergingFields != null && BodyMergingFields.Item2.Count > 0)
                        {
                            string keypairvalue = BodyMergingFields.Item2.FirstOrDefault(p => p.Key == fieldNames[j]).Value;

                            if (keypairvalue != null || keypairvalue == "")
                            {
                                objpersonalizeinfo.attributes.Add(fieldNames[j], keypairvalue);
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
                        objpersonalizeinfo.attributes.Add(fieldNames[j], ReplacingValue);
                    }
                }

                if (!isAllFieldExists)
                {
                    mailNotSentList.Add(mailSentList.Where(x => x.ContactId == contactsList[i].ContactId).First());
                    mailSentList.Remove(mailSentList.Where(x => x.ContactId == contactsList[i].ContactId).First());
                }
                else
                {
                    PersonalizeVarinfo.Add(objpersonalizeinfo);
                }
            }

            //Check dynamic filed values present or not End
            if (mailSentList != null && mailSentList.Count > 0)
            {
                JObject NetCoreBulkMailObject = await NetCoreFalonideBulkMailParameterAsync(Body, PersonalizeVarinfo);
                result = await NetCoreBulkMailAPICallAsync(NetCoreBulkMailObject);
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
                    VendorResponse.P5MailUniqueID = mailNotSentList[i].ResponseId;  //swapping bcz of index problem
                    VendorResponse.SendStatus = 0;
                    VendorResponse.ProductIds = "";
                    VendorResponse.ResponseId = mailNotSentList[i].P5MailUniqueID;  //swapping bcz of index problem
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
                if (!result && netCoreResponse != null)
                {
                    ErrorMessage = netCoreResponse.message + ":" + netCoreResponse.error_info.error_message;
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
                        VendorResponse.P5MailUniqueID = mailSentList[i].ResponseId;  //swapping bcz of index problem
                        VendorResponse.SendStatus = result ? 1 : 0;
                        VendorResponse.ProductIds = "";
                        VendorResponse.ResponseId = mailSentList[i].P5MailUniqueID;  //swapping bcz of index problem
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
                        VendorResponse.P5MailUniqueID = mailSentList[i].ResponseId; //swapping bcz of index problem
                        VendorResponse.SendStatus = 4;
                        VendorResponse.ProductIds = "";
                        VendorResponse.ResponseId = mailSentList[i].P5MailUniqueID; //swapping bcz of index problem
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
        public bool SendSpamScoreMail(string ToMailAddress, string BodyContent)
        {
            try
            {
                NameValueCollection mailValues = new NameValueCollection();
                mailValues.Add("api_key", mailConfigration.ApiKey);
                mailValues.Add("from", MailSetting.FromEmailId);
                mailValues.Add("fromname", MailSetting.FromName);
                mailValues.Add("subject", MailSetting.Subject);
                mailValues.Add("content", BodyContent);
                mailValues.Add("recipients", ToMailAddress);
                using (WebClient client = new WebClient())
                {
                    byte[] response = client.UploadValues(AllConfigURLDetails.KeyValueForConfig["NETCOREFALCONIDE"].ToString(), mailValues);

                    string data = Encoding.UTF8.GetString(response).ToLower();
                    JObject stuff = JObject.Parse(data);

                    if (stuff["message"].ToString().ToLower() == "success")
                        return true;
                    else
                        return false;
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SpamCheck"))
                    objError.AddError(ex.Message.ToString(), mailConfigration != null ? mailConfigration.ProviderName : "", DateTime.Now.ToString(), "Plumb5.Areas.Mail.Models-CheckSpamAssassinDetails-SendMail", ex.ToString());

                return false;
            }
        }
        private JObject NetCoreFalonideBulkMailParameter(MLMailSent mailSent)
        {
            JObject jobj = new JObject();
            try
            {
                var objMain = new NetCoreBulkMailMain();
                NetCoreFrom fromvariableInfo = new NetCoreFrom();
                NetCoreSettings SettingvariableInfo = new NetCoreSettings();
                List<NetCorePersonalization> PersonalizeVarinfo = new List<NetCorePersonalization>();
                List<NetCoreAttachments> attachmentVarinfo = new List<NetCoreAttachments>();

                NetCorePersonalization objpersonalizeinfo = new NetCorePersonalization();
                objpersonalizeinfo.recipient = mailSent.EmailId;
                objpersonalizeinfo.x_apiheader = mailSent.P5MailUniqueID + "@@@BulkMail";

                PersonalizeVarinfo.Add(objpersonalizeinfo);

                objMain.personalizations = PersonalizeVarinfo;
                objMain.tags = AccountId;
                fromvariableInfo.fromEmail = MailSetting.FromEmailId;
                fromvariableInfo.fromName = MailSetting.FromName;
                objMain.from = fromvariableInfo;

                objMain.subject = MailSetting.Subject;
                objMain.content = Body.ToString();

                objMain.attachments = attachmentVarinfo;

                SettingvariableInfo.footer = 1;
                SettingvariableInfo.clicktrack = 1;
                SettingvariableInfo.opentrack = 1;
                SettingvariableInfo.unsubscribe = 1;
                objMain.settings = SettingvariableInfo;

                jobj = JObject.FromObject(objMain);
                return jobj;
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("BulkMailWindowsService"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "NetCoreFalonideBulkMailParameter-Error", ex.ToString());
                }
            }
            return jobj;
        }

        private async Task<JObject> NetCoreFalonideBulkMailParameterAsync(MLMailSent mailSent)
        {
            JObject jobj = new JObject();
            try
            {
                var objMain = new NetCoreBulkMailMain();
                NetCoreFrom fromvariableInfo = new NetCoreFrom();
                NetCoreSettings SettingvariableInfo = new NetCoreSettings();
                List<NetCorePersonalization> PersonalizeVarinfo = new List<NetCorePersonalization>();
                List<NetCoreAttachments> attachmentVarinfo = new List<NetCoreAttachments>();

                NetCorePersonalization objpersonalizeinfo = new NetCorePersonalization();
                objpersonalizeinfo.recipient = mailSent.EmailId;
                objpersonalizeinfo.x_apiheader = mailSent.P5MailUniqueID + "@@@BulkMail";

                PersonalizeVarinfo.Add(objpersonalizeinfo);

                objMain.personalizations = PersonalizeVarinfo;
                objMain.tags = AccountId;
                fromvariableInfo.fromEmail = MailSetting.FromEmailId;
                fromvariableInfo.fromName = MailSetting.FromName;
                objMain.from = fromvariableInfo;

                objMain.subject = MailSetting.Subject;
                objMain.content = Body.ToString();

                objMain.attachments = attachmentVarinfo;

                SettingvariableInfo.footer = 1;
                SettingvariableInfo.clicktrack = 1;
                SettingvariableInfo.opentrack = 1;
                SettingvariableInfo.unsubscribe = 1;
                objMain.settings = SettingvariableInfo;

                jobj = JObject.FromObject(objMain);
                return jobj;
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("BulkMailWindowsService"))
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "NetCoreFalonideBulkMailParameter-Error", ex.ToString());
            }
            return jobj;
        }

        private JObject NetCoreFalonideBulkMailParameter(StringBuilder Body, List<NetCorePersonalization> PersonalizeVarinfo)
        {
            JObject jobj = new JObject();
            try
            {
                var objMain = new NetCoreBulkMailMain();
                NetCoreFrom fromvariableInfo = new NetCoreFrom();
                NetCoreSettings SettingvariableInfo = new NetCoreSettings();
                List<NetCoreAttachments> attachmentVarinfo = new List<NetCoreAttachments>();

                Body.Replace("[{*", "[%").Replace("*}]", "%]").Replace("{p5uniqueid}", "[%p5uniqueid%]");

                objMain.personalizations = PersonalizeVarinfo;
                objMain.tags = AccountId;
                fromvariableInfo.fromEmail = MailSetting.FromEmailId;
                fromvariableInfo.fromName = MailSetting.FromName;
                objMain.from = fromvariableInfo;

                MailSetting.Subject = MailSetting.Subject.Replace("[{*", "[%").Replace("*}]", "%]");
                objMain.subject = MailSetting.Subject;
                objMain.content = Body.ToString();

                if (mailTemplateAttachment != null && mailTemplateAttachment.Count > 0)
                {
                    SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(AccountId, templateDetails.Id);
                    for (var i = 0; i < mailTemplateAttachment.Count; i++)
                    {
                        NetCoreAttachments attachmentsinfo = new NetCoreAttachments();
                        Stream fileStream = awsUpload.GetFileContentStream(mailTemplateAttachment[i].AttachmentFileName, awsUpload.bucketname).ConfigureAwait(false).GetAwaiter().GetResult();
                        attachmentsinfo.fileContent = Convert.ToString(fileStream.ReadAsBytes());
                        attachmentsinfo.fileName = mailTemplateAttachment[i].AttachmentFileName;
                        attachmentVarinfo.Add(attachmentsinfo);
                    }
                }

                objMain.attachments = attachmentVarinfo;

                SettingvariableInfo.footer = 1;
                SettingvariableInfo.clicktrack = 1;
                SettingvariableInfo.opentrack = 1;
                SettingvariableInfo.unsubscribe = 1;
                objMain.settings = SettingvariableInfo;

                jobj = JObject.FromObject(objMain);
                return jobj;
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("BulkMailWindowsService"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "NetCoreFalonideBulkMailParameter-Error", ex.ToString());
                }
            }
            return jobj;
        }

        private async Task<JObject> NetCoreFalonideBulkMailParameterAsync(StringBuilder Body, List<NetCorePersonalization> PersonalizeVarinfo)
        {
            JObject jobj = new JObject();
            try
            {
                var objMain = new NetCoreBulkMailMain();
                NetCoreFrom fromvariableInfo = new NetCoreFrom();
                NetCoreSettings SettingvariableInfo = new NetCoreSettings();
                List<NetCoreAttachments> attachmentVarinfo = new List<NetCoreAttachments>();

                Body.Replace("[{*", "[%").Replace("*}]", "%]");

                objMain.personalizations = PersonalizeVarinfo;
                objMain.tags = AccountId;
                fromvariableInfo.fromEmail = MailSetting.FromEmailId;
                fromvariableInfo.fromName = MailSetting.FromName;
                objMain.from = fromvariableInfo;

                objMain.subject = MailSetting.Subject;
                objMain.content = Body.ToString();

                if (mailTemplateAttachment != null && mailTemplateAttachment.Count > 0)
                {
                    SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(AccountId, templateDetails.Id);
                    for (var i = 0; i < mailTemplateAttachment.Count; i++)
                    {
                        NetCoreAttachments attachmentsinfo = new NetCoreAttachments();
                        Stream fileStream = awsUpload.GetFileContentStream(mailTemplateAttachment[i].AttachmentFileName, awsUpload.bucketname).ConfigureAwait(false).GetAwaiter().GetResult(); ;
                        attachmentsinfo.fileContent = Convert.ToString(fileStream.ReadAsBytes());
                        attachmentsinfo.fileName = mailTemplateAttachment[i].AttachmentFileName;
                        attachmentVarinfo.Add(attachmentsinfo);
                    }
                }

                objMain.attachments = attachmentVarinfo;

                SettingvariableInfo.footer = 1;
                SettingvariableInfo.clicktrack = 1;
                SettingvariableInfo.opentrack = 1;
                SettingvariableInfo.unsubscribe = 1;
                objMain.settings = SettingvariableInfo;

                jobj = JObject.FromObject(objMain);
                return jobj;
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("BulkMailWindowsService"))
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "NetCoreFalonideBulkMailParameter-Error", ex.ToString());

            }
            return jobj;
        }

        private bool NetCoreBulkMailAPICall(JObject NetCoreBulkMailObject)
        {
            try
            {
                string jsonString = JsonConvert.SerializeObject(NetCoreBulkMailObject);
                jsonString = jsonString.Replace("x_apiheader", "x-apiheader");
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                var restClient = new RestClient(mailConfigration.ConfigurationUrl);
                var request = new RestRequest(Method.POST);
                request.AddHeader("content-type", "application/json");
                request.AddHeader("api_key", mailConfigration.ApiKey);
                request.AddParameter("application/json", jsonString, ParameterType.RequestBody);
                IRestResponse response = restClient.Execute(request);

                if (response.StatusCode == HttpStatusCode.Accepted)
                {
                    var msg = JToken.Parse(response.Content);

                    if (msg["message"].ToString().ToLower() == "success")
                    {
                        return true;
                    }
                    else
                    {
                        netCoreResponse = JsonConvert.DeserializeObject<NetCoreResponse>(response.Content.ToString());
                        return false;
                    }
                }
                else if (response.StatusCode == HttpStatusCode.BadRequest || response.StatusCode == HttpStatusCode.Unauthorized || response.StatusCode == HttpStatusCode.Forbidden)
                {
                    netCoreResponse = JsonConvert.DeserializeObject<NetCoreResponse>(response.Content.ToString());
                    return false;
                }
                else
                {
                    netCoreResponse = new NetCoreResponse()
                    {
                        error_info = new NetCoreError() { error_code = response.StatusCode.ToString(), error_message = response.StatusDescription },
                        message = "Request Not Passed"
                    };
                    return false;
                }
            }
            catch (Exception ex)
            {
                netCoreResponse = new NetCoreResponse()
                {
                    error_info = new NetCoreError() { error_code = "-1", error_message = ex.Message.ToString() },
                    message = "exception"
                };

                using (ErrorUpdation objError = new ErrorUpdation("BulkMailWindowsService"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "NetCoreBulkMailAPICall-Error", ex.ToString());
                }
                return false;
            }
        }

        private async Task<bool> NetCoreBulkMailAPICallAsync(JObject NetCoreBulkMailObject)
        {
            try
            {
                string jsonString = JsonConvert.SerializeObject(NetCoreBulkMailObject);
                jsonString = jsonString.Replace("x_apiheader", "x-apiheader");
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                var restClient = new RestClient(mailConfigration.ConfigurationUrl);
                var request = new RestRequest(Method.POST);
                request.AddHeader("content-type", "application/json");
                request.AddHeader("api_key", mailConfigration.ApiKey);
                request.AddParameter("application/json", jsonString, ParameterType.RequestBody);
                IRestResponse response = await restClient.ExecuteTaskAsync(request);

                if (response.StatusCode == HttpStatusCode.Accepted)
                {
                    var msg = JToken.Parse(response.Content);

                    if (msg["message"].ToString().ToLower() == "success")
                    {
                        return true;
                    }
                    else
                    {
                        netCoreResponse = JsonConvert.DeserializeObject<NetCoreResponse>(response.Content.ToString());
                        return false;
                    }
                }
                else if (response.StatusCode == HttpStatusCode.BadRequest || response.StatusCode == HttpStatusCode.Unauthorized || response.StatusCode == HttpStatusCode.Forbidden)
                {
                    netCoreResponse = JsonConvert.DeserializeObject<NetCoreResponse>(response.Content.ToString());
                    return false;
                }
                else
                {
                    netCoreResponse = new NetCoreResponse()
                    {
                        error_info = new NetCoreError() { error_code = response.StatusCode.ToString(), error_message = response.StatusDescription },
                        message = "Request Not Passed"
                    };
                    return false;
                }
            }
            catch (Exception ex)
            {
                netCoreResponse = new NetCoreResponse()
                {
                    error_info = new NetCoreError() { error_code = "-1", error_message = ex.Message.ToString() },
                    message = "exception"
                };

                using (ErrorUpdation objError = new ErrorUpdation("BulkMailWindowsService"))
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "NetCoreBulkMailAPICall-Error", ex.ToString());

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

        private Tuple<List<string>, List<KeyValuePair<string, string>>, string, List<KeyValuePair<string, string>>> GetReplaceFieldList(StringBuilder htmlContent, string MailSubject)
        {
            string Bodys = htmlContent.ToString();
            List<string> allMergingField = new List<string>();
            List<KeyValuePair<string, string>> fallbackdata = new List<KeyValuePair<string, string>>();
            List<KeyValuePair<string, string>> optionfields = new List<KeyValuePair<string, string>>();

            foreach (Match m in Regex.Matches(htmlContent.ToString(), "\\[{.*?}\\]", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace))
            {
                if (m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~').Length == 2)
                {
                    var feildName = "[{*" + m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~')[0] + "*}]";
                    allMergingField.Add(feildName);
                    fallbackdata.Add(new KeyValuePair<string, string>(m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~')[0], m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~')[1]));

                    Bodys = Bodys.Replace(m.Value, "[{*" + m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~')[0] + "*}]");
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
                if (m.Value.ToString().Split('~').Length == 2)
                {
                    var feildName = "[{*" + m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~')[0] + "*}]";
                    allMergingField.Add(feildName);
                    fallbackdata.Add(new KeyValuePair<string, string>(m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~')[0], m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~')[1]));

                    MailSubject = MailSubject.Replace(m.Value, "[{*" + m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~')[0] + "*}]");
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

        public class NetCoreBulkMailMain
        {
            public List<NetCorePersonalization> personalizations { get; set; }
            public NetCoreFrom from { get; set; }
            public string subject { get; set; }
            public string content { get; set; }
            public List<NetCoreAttachments> attachments { get; set; }
            public NetCoreSettings settings { get; set; }
            public int tags { get; set; }
        }

        public class NetCoreFrom
        {
            public string fromEmail { get; set; }
            public string fromName { get; set; }
        }

        public class NetCorePersonalization
        {
            public string recipient { get; set; }
            public string x_apiheader { get; set; }
            public Dictionary<string, string> attributes { get; set; }
        }

        public class NetCoreAttachments
        {
            public string fileContent { get; set; }
            public string fileName { get; set; }
        }

        public class NetCoreSettings
        {
            public int footer { get; set; }
            public int clicktrack { get; set; }
            public int opentrack { get; set; }
            public int unsubscribe { get; set; }
        }

        public class NetCoreResponse
        {
            public NetCoreError error_info { get; set; }
            public string message { get; set; }
        }

        public class NetCoreError
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
