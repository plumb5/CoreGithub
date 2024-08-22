using NuGet.Protocol.Plugins;
using P5GenralDL;
using P5GenralML;
using Plumb5.Models;
using System.Data;
using System.Net;

namespace Plumb5.Areas.CaptureForm.Models
{
    public class GenralFormDetails : IDisposable
    {
        public string? ErrorMessage { get; set; } = "";
        public bool Status { get; set; }
        public int FormId { get; set; }

        public FormDetails? savedFormdetails { get; set; }
        public FormRules? savedFormRules { get; set; }
        public List<FormFields> savedFormField { get; set; }
        public List<FormFieldsBindingDetails> savedFormFieldBindingDetails { get; set; }
        public FormResponseReportToSetting? savedresponseSettings { get; set; }
        public List<MailSendingSetting> savedMailSetting { get; set; }
        public List<FormBanner> savedFormBanner { get; set; }
        public List<SmsSendingSetting> savedSmsSetting { get; set; }
        public List<WhatsAppSendingSetting> savedWhatsAppSetting { get; set; }

        public List<WebHookDetails> savedWebHookDetails { get; set; }

        int AdsId, UserId;
        private readonly string SqlProvider;

        public GenralFormDetails(int adsId, int userId, string sqlProvider)
        {
            Status = true;
            UserId = userId;
            SqlProvider = sqlProvider;
            AdsId = adsId;

        }

        #region CaptureForm

        public async Task SaveAllDetailsOfForm(FormDetails formdetails, List<FormFieldsBindingDetails> formfieldbindingdetails, List<FormFields> allFormFields, FormRules rulesData, FormResponseReportToSetting responseSettings, List<WebHookDetails> webHookDetails, int responseMailSettingFieldIndex, int responseSMSSettingFieldIndex, int responseMailOutSettingIndex, int responseSalesAssigmentSettingIndex, List<MailSendingSetting> mailSettingList, List<SmsSendingSetting> smsSettingList, int responseSmsOutSettingIndex, int responseRedirectUrlSettingIndex, int responseAutoAssignToGroupIndex, List<WhatsAppSendingSetting> WhatsAppSettingList, int responseWhatsAppOutSettingIndex, int responseWhatsAppSettingFieldIndex, int responseReportToPhoneIndex = -1, List<int> AutoAssignToGroupIndexValues = null, List<string> DeletedWebhookId = null, List<string> RuleChecking = null, List<int> IsOverSourceIndexValues = null)
        {
            bool FormUpdateStatus = false;
            //Form details
            using (var objFromsBAL = DLFormDetails.GetDLFormDetails(AdsId, SqlProvider))
            {
                formdetails.UserInfoUserId = UserId;
                if (formdetails.Id > 0)
                {
                    FormId = formdetails.Id;
                    FormUpdateStatus = await objFromsBAL.Update(formdetails);

                    if (!FormUpdateStatus)
                        formdetails.Id = FormId = -1;
                }
                else
                {
                    try
                    {
                        FormId = formdetails.Id = await objFromsBAL.Save(formdetails);
                    }
                    catch (Exception ex)
                    {

                    }
                }
            }

            if (formdetails.Id > 0)
            {
                using (var objFromsBAL = DLFormRules.GetDLFormRules(AdsId, SqlProvider))
                {
                    rulesData.FormId = formdetails.Id;
                    if (!await objFromsBAL.Save(rulesData))
                    {
                        ErrorMessage = "Problem in saving rules";
                        Status = false;
                    }
                }
                try
                {
                    DataTable dtruleschecking = new DataTable();
                    dtruleschecking.Columns.Add("id", typeof(int));
                    dtruleschecking.Columns.Add("formid", typeof(int));
                    dtruleschecking.Columns.Add("rulename", typeof(string));
                    if (RuleChecking != null)
                    {
                        for (int i = 0; i < RuleChecking.Count; i++)
                        {
                            try
                            {
                                dtruleschecking.Rows.Add(i, formdetails.Id, RuleChecking[i]);
                            }
                            catch (Exception ex)
                            {
                            }
                        }
                    }
                    else
                    {
                        dtruleschecking.Rows.Add(-1, formdetails.Id, "NA");
                    }
                    using (var objruleckeckBAL = DLRuleChecking.GetDLRuleChecking(AdsId, SqlProvider))
                    {
                        await objruleckeckBAL.Saverulecheck(dtruleschecking);
                    }
                }
                catch (Exception ex)
                {

                }
                //Delete all the binding fields if already exists and re-insert again
                using (var objFromsBAL = DLFormFieldsBindingDetails.GetDLFormFieldsBindingDetails(AdsId, SqlProvider))
                {
                    await objFromsBAL.DeleteFields(formdetails.Id);
                }

                if (formfieldbindingdetails != null && formfieldbindingdetails.Count > 0)
                {
                    using (var objFromsBAL = DLFormFieldsBindingDetails.GetDLFormFieldsBindingDetails(AdsId, SqlProvider))
                    {
                        foreach (FormFieldsBindingDetails formbindingField in formfieldbindingdetails)
                        {
                            formbindingField.UserInfoUserId = UserId;
                            formbindingField.FormId = formdetails.Id;
                            formbindingField.Id = await objFromsBAL.Save(formbindingField);
                        }
                    }
                    savedFormFieldBindingDetails = formfieldbindingdetails;
                }

                if (allFormFields != null && allFormFields.Count > 0)
                {
                    using (var objFromsBAL = DLFormFields.GetDLFormFields(AdsId, SqlProvider))
                    {
                        foreach (FormFields formField in allFormFields)
                        {
                            formField.UserInfoUserId = UserId;
                            formField.FormId = formdetails.Id;

                            if (formField.Id > 0)
                            {
                                await objFromsBAL.Update(formField);
                            }
                            else
                            {
                                formField.Id = await objFromsBAL.Save(formField);
                            }
                        }
                    }
                    savedFormField = allFormFields;
                }

                if (mailSettingList != null && mailSettingList.Count() > 0)
                {
                    using (var objMailCreate = DLMailSendingSetting.GetDLMailSendingSetting(AdsId, SqlProvider))
                    {
                        responseSettings.MailIdList = "";
                        foreach (var eachMailSetting in mailSettingList)
                        {
                            eachMailSetting.ScheduledStatus = 0;
                            eachMailSetting.ReplyTo = eachMailSetting.FromEmailId;
                            eachMailSetting.UserInfoUserId = UserId;
                            eachMailSetting.Name = formdetails.Heading + "-" + formdetails.Id.ToString();
                            eachMailSetting.Id = await objMailCreate.SaveResponseMailSettingOfForms(eachMailSetting);

                            responseSettings.MailIdList += "," + eachMailSetting.Id.ToString();
                        }

                        if (responseSettings.MailIdList.Contains(","))
                            responseSettings.MailIdList = responseSettings.MailIdList.Substring(1);
                    }
                }

                if (smsSettingList != null && smsSettingList.Count > 0)
                {
                    using (var objSmsSendingSettingSave = DLSmsSendingSetting.GetDLSmsSendingSetting(AdsId, SqlProvider))
                    {
                        responseSettings.SmsSendingSettingIdList = "";
                        int Smsindex = 0;
                        foreach (var eachSmsSetting in smsSettingList)
                        {
                            eachSmsSetting.UserInfoUserId = UserId;
                            eachSmsSetting.ScheduleBatchType = "SINGLE";
                            if (responseSmsOutSettingIndex > -1)
                            {
                                eachSmsSetting.Name = "Conditional" + "-" + formdetails.Id.ToString() + "-" + Smsindex;
                                Smsindex++;
                            }
                            else
                            {
                                eachSmsSetting.Name = "Un-Conditional" + "-" + formdetails.Id.ToString();
                            }

                            eachSmsSetting.Id = await objSmsSendingSettingSave.SaveForForms(eachSmsSetting);
                            responseSettings.SmsSendingSettingIdList += "," + eachSmsSetting.Id.ToString();

                        }

                        if (responseSettings.SmsSendingSettingIdList.Contains(","))
                            responseSettings.SmsSendingSettingIdList = responseSettings.SmsSendingSettingIdList.Substring(1);
                    }
                }
                else
                {
                    responseSettings.SmsSendingSettingIdList = "";
                }

                if (WhatsAppSettingList != null && WhatsAppSettingList.Count > 0)
                {
                    using (var objWhatsAppSendingSettingSave = DLWhatsAppSendingSetting.GetDLWhatsAppSendingSetting(AdsId, SqlProvider))
                    {
                        responseSettings.WhatsAppSendingSettingIdList = "";
                        int WhatsAppindex = 0;
                        foreach (var eachWhatsAppSetting in WhatsAppSettingList)
                        {
                            eachWhatsAppSetting.UserInfoUserId = UserId;
                            if (responseWhatsAppOutSettingIndex > -1)
                            {
                                eachWhatsAppSetting.Name = "Conditional" + "-" + formdetails.Id.ToString() + "-" + WhatsAppindex;
                                WhatsAppindex++;
                            }
                            else
                            {
                                eachWhatsAppSetting.Name = "Un-Conditional" + "-" + formdetails.Id.ToString();
                            }

                            eachWhatsAppSetting.Id = await objWhatsAppSendingSettingSave.SaveForForms(eachWhatsAppSetting);
                            responseSettings.WhatsAppSendingSettingIdList += "," + eachWhatsAppSetting.Id.ToString();

                        }

                        if (responseSettings.WhatsAppSendingSettingIdList.Contains(","))
                            responseSettings.WhatsAppSendingSettingIdList = responseSettings.WhatsAppSendingSettingIdList.Substring(1);
                    }
                }
                else
                {
                    responseSettings.WhatsAppSendingSettingIdList = "";
                }
                #region Get Field id by Index

                if (responseMailSettingFieldIndex > -1 && responseSettings.ReportToFormsMailFieldId <= 0)
                {
                    if (responseMailSettingFieldIndex <= allFormFields.Count)
                    {
                        responseSettings.ReportToFormsMailFieldId = allFormFields[responseMailSettingFieldIndex].Id;
                    }
                }

                if (responseSMSSettingFieldIndex > -1 && responseSettings.ReportToFormsSMSFieldId <= 0)
                {
                    if (responseSMSSettingFieldIndex <= allFormFields.Count)
                    {
                        responseSettings.ReportToFormsSMSFieldId = allFormFields[responseSMSSettingFieldIndex].Id;
                    }
                }

                if (responseMailOutSettingIndex > -1 && responseSettings.MailOutDependencyFieldId <= 0)
                {
                    if (responseMailOutSettingIndex <= allFormFields.Count)
                    {
                        responseSettings.MailOutDependencyFieldId = allFormFields[responseMailOutSettingIndex].Id;
                    }
                }

                if (responseSmsOutSettingIndex > -1 && responseSettings.SmsOutDependencyFieldId <= 0)
                {
                    if (responseSmsOutSettingIndex <= allFormFields.Count)
                    {
                        responseSettings.SmsOutDependencyFieldId = allFormFields[responseSmsOutSettingIndex].Id;
                    }
                }

                if (responseSalesAssigmentSettingIndex > -1 && responseSettings.ReportToAssignLeadToUserIdFieldId <= 0)
                {
                    if (responseSalesAssigmentSettingIndex <= allFormFields.Count)
                    {
                        responseSettings.ReportToAssignLeadToUserIdFieldId = allFormFields[responseSalesAssigmentSettingIndex].Id;
                    }
                }
                if (responseWhatsAppOutSettingIndex > -1 && responseSettings.WhatsAppOutDependencyFieldId <= 0)
                {
                    if (responseWhatsAppOutSettingIndex <= allFormFields.Count)
                    {
                        responseSettings.WhatsAppOutDependencyFieldId = allFormFields[responseWhatsAppOutSettingIndex].Id;
                    }
                }
                if (responseRedirectUrlSettingIndex > -1 && responseSettings.RedirectUrl != null && responseSettings.RedirectUrl.Length > 0)
                {
                    if (responseRedirectUrlSettingIndex <= allFormFields.Count)
                    {
                        int DependencyId = allFormFields[responseRedirectUrlSettingIndex].Id;

                        if (responseSettings.RedirectUrl.IndexOf("ReplaceDependencyId") > -1 && DependencyId > 0)
                            responseSettings.RedirectUrl = responseSettings.RedirectUrl.Replace("ReplaceDependencyId", DependencyId.ToString());
                    }
                }

                //if (responseAutoAssignToGroupIndex > -1 && responseSettings.GroupId != null && responseSettings.GroupId.Length > 0)
                //{
                //    if (responseAutoAssignToGroupIndex <= allFormFields.Count)
                //    {
                //        int DependencyId = allFormFields[responseAutoAssignToGroupIndex].Id;

                //        if (responseSettings.GroupId.IndexOf("ReplaceDependencyId") > -1 && DependencyId > 0)
                //            responseSettings.GroupId = responseSettings.GroupId.Replace("ReplaceDependencyId", DependencyId.ToString());
                //    }
                //}

                if (AutoAssignToGroupIndexValues != null && AutoAssignToGroupIndexValues.Count() > 0 && responseSettings.GroupId != null && responseSettings.GroupId.Length > 0)
                {

                    for (int i = 0; i < AutoAssignToGroupIndexValues.Count(); i++)
                    {
                        if (AutoAssignToGroupIndexValues[i] <= allFormFields.Count)
                        {
                            int DependencyId = allFormFields[AutoAssignToGroupIndexValues[i]].Id;

                            if (responseSettings.GroupId.IndexOf("ReplaceDependencyId_" + i + "") > -1 && DependencyId > 0)
                                responseSettings.GroupId = responseSettings.GroupId.Replace("ReplaceDependencyId_" + i + "", DependencyId.ToString());
                        }
                    }
                }
                if (IsOverSourceIndexValues != null && IsOverSourceIndexValues.Count() > 0 && responseSettings.IsOverRideSource != null && responseSettings.IsOverRideSource.Length > 0)
                {

                    for (int i = 0; i < IsOverSourceIndexValues.Count(); i++)
                    {
                        if (IsOverSourceIndexValues[i] <= allFormFields.Count)
                        {
                            int DependencyId = allFormFields[IsOverSourceIndexValues[i]].Id;

                            if (responseSettings.IsOverRideSource.IndexOf("ReplaceDependencyId_" + i + "") > -1 && DependencyId > 0)
                                responseSettings.IsOverRideSource = responseSettings.IsOverRideSource.Replace("ReplaceDependencyId_" + i + "", DependencyId.ToString());
                        }
                    }
                }


                if (responseReportToPhoneIndex > -1 && responseSettings.ReportToDetailsByPhoneCall != null && responseSettings.ReportToDetailsByPhoneCall.Length > 0)
                {
                    if (responseReportToPhoneIndex <= allFormFields.Count)
                    {
                        int DependencyId = allFormFields[responseReportToPhoneIndex].Id;

                        if (responseSettings.ReportToDetailsByPhoneCall.IndexOf("ReplaceDependencyId") > -1 && DependencyId > 0)
                            responseSettings.ReportToDetailsByPhoneCall = responseSettings.ReportToDetailsByPhoneCall.Replace("ReplaceDependencyId", DependencyId.ToString());
                    }
                }

                if (webHookDetails != null)
                {
                    using (var dLWebHookDetails = DLWebHookDetails.GetDLWebHookDetails(AdsId, SqlProvider))
                    {
                        int i = 0;

                        responseSettings.WebHookId = null;
                        var NewListData = webHookDetails.Select(x => x.WebHookId).ToList();

                        foreach (var ewebhookdetails in webHookDetails)
                        {
                            if (Convert.ToInt32(NewListData[i]) != 0)
                            {
                                ewebhookdetails.WebHookId = Convert.ToInt32(NewListData[i]);
                                await dLWebHookDetails.Update(ewebhookdetails);
                                responseSettings.WebHookId += "," + ewebhookdetails.WebHookId;
                            }

                            else
                            {
                                ewebhookdetails.WebHookId = await dLWebHookDetails.Save(ewebhookdetails);
                                responseSettings.WebHookId += "," + ewebhookdetails.WebHookId.ToString();
                            }
                            i++;
                        }


                        if (responseSettings.WebHookId != null && responseSettings.WebHookId != "")
                        {
                            responseSettings.WebHookId = responseSettings.WebHookId.Remove(0, 1);
                        }
                    }
                }
                if (DeletedWebhookId != null)
                {
                    using (var dLWebHookDetails = DLWebHookDetails.GetDLWebHookDetails(AdsId, SqlProvider))
                    {
                        for (int id = 0; id < DeletedWebhookId.Count();)
                        {
                            await dLWebHookDetails.Delete(Convert.ToInt32(DeletedWebhookId[id]));
                            id++;
                        }
                    }

                }
                if (webHookDetails == null)
                {
                    responseSettings.WebHookId = "0";
                }
                #endregion Get Field id by Index

                responseSettings.FormId = formdetails.Id;
                using (var objFromsBAL = DLFormResponseReportToSetting.GetDLFormResponseReportToSetting(AdsId, SqlProvider))
                {
                    if (!await objFromsBAL.Save(responseSettings))
                    {
                        ErrorMessage = "Problem in saving response setting";
                        Status = false;
                    }
                }
            }
            else
            {
                if (formdetails.Id == -1)
                {
                    ErrorMessage = "With this name already form exists";
                    Status = false;
                }
            }
        }

        #endregion CaptureForm

        #region Question Poll

        public async void SaveAllDetailsOfForm(FormDetails formdetails, FormFields formField, FormRules rulesData, FormResponseReportToSetting responseSettings, MailSendingSetting mailSetting)
        {
            using (var objFromsBAL = DLFormDetails.GetDLFormDetails(AdsId, SqlProvider))
            {
                formdetails.UserInfoUserId = UserId;
                if (formdetails.Id > 0)
                {
                    FormId = formdetails.Id;
                    await objFromsBAL.Update(formdetails);
                }
                else
                {
                    FormId = formdetails.Id = await objFromsBAL.Save(formdetails);
                }
            }
            if (formdetails.Id > 0)
            {
                using (var objFromsBAL = DLFormRules.GetDLFormRules(AdsId, SqlProvider))
                {
                    rulesData.FormId = formdetails.Id;
                    if (!await objFromsBAL.Save(rulesData))
                    {
                        ErrorMessage = "Problem in saving rules";
                        Status = false;
                    }
                }


                using (var objFromsBAL = DLFormFields.GetDLFormFields(AdsId, SqlProvider))
                {
                    formField.UserInfoUserId = UserId;
                    formField.FormId = formdetails.Id;
                    if (formField.Id > 0)
                    {
                        await objFromsBAL.Update(formField);
                    }
                    else
                    {
                        formField.Id = await objFromsBAL.Save(formField);
                    }
                }

                if (mailSetting != null && !String.IsNullOrEmpty(mailSetting.FromEmailId) && !String.IsNullOrEmpty(mailSetting.FromName) && !String.IsNullOrEmpty(mailSetting.Subject) && mailSetting.MailTemplateId > 0)
                {
                    using (var objMailCreate = DLMailSendingSetting.GetDLMailSendingSetting(AdsId, SqlProvider))
                    {
                        mailSetting.ScheduledStatus = 0;
                        mailSetting.ReplyTo = mailSetting.FromEmailId;
                        mailSetting.UserInfoUserId = UserId;
                        mailSetting.Name = formdetails.Heading + "-" + formdetails.Id.ToString();
                        mailSetting.Id = await objMailCreate.Save(mailSetting);

                        responseSettings.MailIdList = mailSetting.Id.ToString();
                    }
                }


                responseSettings.FormId = formdetails.Id;
                using (var objFromsBAL = DLFormResponseReportToSetting.GetDLFormResponseReportToSetting(AdsId, SqlProvider))
                {
                    if (!await objFromsBAL.Save(responseSettings))
                    {
                        ErrorMessage = "Problem in saving response setting";
                        Status = false;
                    }
                }
            }
            else
            {
                if (formdetails.Id == -1)
                {
                    ErrorMessage = "With this name already form exists";
                    Status = false;
                }
            }
        }

        #endregion Question Poll

        #region Rating

        public async void SaveAllDetailsOfForm(FormDetails formdetails, FormRules rulesData, FormResponseReportToSetting responseSettings, MailSendingSetting mailSetting)
        {
            using (var objFromsBAL = DLFormDetails.GetDLFormDetails(AdsId, SqlProvider))
            {
                formdetails.UserInfoUserId = UserId;
                if (formdetails.Id > 0)
                {
                    FormId = formdetails.Id;
                    await objFromsBAL.Update(formdetails);
                }
                else
                {
                    FormId = formdetails.Id = await objFromsBAL.Save(formdetails);
                }
            }
            if (formdetails.Id > 0)
            {
                using (var objFromsBAL = DLFormRules.GetDLFormRules(AdsId, SqlProvider))
                {
                    rulesData.FormId = formdetails.Id;
                    if (!await objFromsBAL.Save(rulesData))
                    {
                        ErrorMessage = "Problem in saving rules";
                        Status = false;
                    }
                }

                if (mailSetting != null && !String.IsNullOrEmpty(mailSetting.FromEmailId) && !String.IsNullOrEmpty(mailSetting.FromName) && !String.IsNullOrEmpty(mailSetting.Subject) && mailSetting.MailTemplateId > 0)
                {
                    using (var objMailCreate = DLMailSendingSetting.GetDLMailSendingSetting(AdsId, SqlProvider))
                    {
                        mailSetting.ScheduledStatus = 0;
                        mailSetting.ReplyTo = mailSetting.FromEmailId;
                        mailSetting.UserInfoUserId = UserId;
                        mailSetting.Name = formdetails.Heading + "-" + formdetails.Id.ToString();
                        mailSetting.Id = await objMailCreate.Save(mailSetting);

                        responseSettings.MailIdList = mailSetting.Id.ToString();
                    }
                }


                responseSettings.FormId = formdetails.Id;
                using (var objFromsBAL = DLFormResponseReportToSetting.GetDLFormResponseReportToSetting(AdsId, SqlProvider))
                {
                    if (!await objFromsBAL.Save(responseSettings))
                    {
                        ErrorMessage = "Problem in saving response setting";
                        Status = false;
                    }
                }
            }
            else
            {
                if (formdetails.Id == -1)
                {
                    ErrorMessage = "With this name already form exists";
                    Status = false;
                }
            }
        }

        #endregion Rating


        #region Embed Forms

        public async Task SaveAllDetailsOfForm(FormDetails formdetails, FormRules rulesData, List<FormBanner> bannerlist, FormResponseReportToSetting responseSettings, MailSendingSetting mailSetting, List<WebHookDetails> webHookDetails, List<string> DeletedWebhookId = null, List<string> RuleChecking = null)
        {
            bool FormUpdateStatus = false;
            using (var objFromsBAL = DLFormDetails.GetDLFormDetails(AdsId, SqlProvider))
            {
                formdetails.UserInfoUserId = UserId;
                if (formdetails.Id > 0)
                {
                    FormId = formdetails.Id;
                    FormUpdateStatus = await objFromsBAL.Update(formdetails);

                    if (!FormUpdateStatus)
                        formdetails.Id = FormId = -1;
                }
                else
                {
                    FormId = formdetails.Id = await objFromsBAL.Save(formdetails);
                }
            }
            if (formdetails.Id > 0)
            {
                using (var objFromsBAL = DLFormRules.GetDLFormRules(AdsId, SqlProvider))
                {
                    rulesData.FormId = formdetails.Id;
                    if (!await objFromsBAL.Save(rulesData))
                    {
                        ErrorMessage = "Problem in saving rules";
                        Status = false;
                    }
                }
                try
                {
                    DataTable dtruleschecking = new DataTable();
                    dtruleschecking.Columns.Add("id", typeof(int));
                    dtruleschecking.Columns.Add("formid", typeof(int));
                    dtruleschecking.Columns.Add("rulename", typeof(string));
                    if (RuleChecking != null)
                    {
                        for (int i = 0; i < RuleChecking.Count; i++)
                        {
                            try
                            {
                                dtruleschecking.Rows.Add(i, formdetails.Id, RuleChecking[i]);
                            }
                            catch (Exception ex)
                            {
                            }
                        }
                    }
                    else
                    {
                        dtruleschecking.Rows.Add(-1, formdetails.Id, "NA");
                    }
                    using (var objruleckeckBAL = DLRuleChecking.GetDLRuleChecking(AdsId, SqlProvider))
                    {
                        await objruleckeckBAL.Saverulecheck(dtruleschecking);
                    }
                }
                catch (Exception ex)
                {

                }

                using (var objDLBanner = DLFormBanner.GetDLFormBanner(AdsId, SqlProvider))
                {
                    foreach (FormBanner banner in bannerlist)
                    {
                        banner.FormId = formdetails.Id;
                        if (banner.Id > 0)
                        {
                            await objDLBanner.Update(banner);
                        }
                        else
                        {
                            await objDLBanner.Save(banner);
                        }
                    }
                }


                if (mailSetting != null && !String.IsNullOrEmpty(mailSetting.FromEmailId) && !String.IsNullOrEmpty(mailSetting.FromName) && !String.IsNullOrEmpty(mailSetting.Subject) && mailSetting.MailTemplateId > 0)
                {
                    using (var objMailCreate = DLMailSendingSetting.GetDLMailSendingSetting(AdsId, SqlProvider))
                    {
                        mailSetting.ScheduledStatus = 0;
                        mailSetting.ReplyTo = mailSetting.FromEmailId;
                        mailSetting.UserInfoUserId = UserId;
                        mailSetting.Name = formdetails.Heading + "-" + formdetails.Id.ToString();
                        mailSetting.Id = await objMailCreate.Save(mailSetting);

                        responseSettings.MailIdList = mailSetting.Id.ToString();
                    }
                }

                if (webHookDetails != null)
                {
                    using (var bLWebHookDetails = DLWebHookDetails.GetDLWebHookDetails(AdsId, SqlProvider))
                    {
                        int i = 0;

                        responseSettings.WebHookId = null;
                        var NewListData = webHookDetails.Select(x => x.WebHookId).ToList();

                        foreach (var ewebhookdetails in webHookDetails)
                        {
                            if (Convert.ToInt32(NewListData[i]) != 0)
                            {
                                ewebhookdetails.WebHookId = Convert.ToInt32(NewListData[i]);
                                await bLWebHookDetails.Update(ewebhookdetails);
                                responseSettings.WebHookId += "," + ewebhookdetails.WebHookId;
                            }

                            else
                            {
                                ewebhookdetails.WebHookId = await bLWebHookDetails.Save(ewebhookdetails);
                                responseSettings.WebHookId += "," + ewebhookdetails.WebHookId.ToString();
                            }
                            i++;
                        }

                        if (!string.IsNullOrEmpty(responseSettings.WebHookId))
                            responseSettings.WebHookId = responseSettings.WebHookId.Remove(0, 1);
                    }
                }
                if (DeletedWebhookId != null)
                {

                    using (var dLWebHookDetails = DLWebHookDetails.GetDLWebHookDetails(AdsId, SqlProvider))
                    {

                        for (int id = 0; id < DeletedWebhookId.Count();)
                        {
                            await dLWebHookDetails.Delete(Convert.ToInt32(DeletedWebhookId[id]));
                            id++;
                        }
                    }

                }
                if (webHookDetails == null)
                {
                    responseSettings.WebHookId = "0";
                }
                responseSettings.FormId = formdetails.Id;
                using (var objFromsBAL = DLFormResponseReportToSetting.GetDLFormResponseReportToSetting(AdsId, SqlProvider))
                {
                    if (!await objFromsBAL.Save(responseSettings))
                    {
                        ErrorMessage = "Problem in saving response setting";
                        Status = false;
                    }
                }
            }
            else
            {
                if (formdetails.Id == -1)
                {
                    ErrorMessage = "With this name already form exists";
                    Status = false;
                }
            }
        }

        #endregion Embed Forms

        public async Task GetFormDetailsRules(int FormId)
        {
            using (var objDLForm = DLFormDetails.GetDLFormDetails(AdsId, SqlProvider))
            {
                savedFormdetails = new FormDetails() { Id = FormId };
                savedFormdetails = await objDLForm.GETDetails(savedFormdetails);

                if (savedFormdetails != null && savedFormdetails.Id > 0)
                {
                    if (!string.IsNullOrEmpty(savedFormdetails.MainBackgroundDesign))
                        savedFormdetails.MainBackgroundDesign = WebUtility.HtmlDecode(savedFormdetails.MainBackgroundDesign);

                    if (!string.IsNullOrEmpty(savedFormdetails.TitleCss))
                        savedFormdetails.TitleCss = WebUtility.HtmlDecode(savedFormdetails.TitleCss);

                    if (!string.IsNullOrEmpty(savedFormdetails.DescriptionCss))
                        savedFormdetails.DescriptionCss = WebUtility.HtmlDecode(savedFormdetails.DescriptionCss);

                    if (!string.IsNullOrEmpty(savedFormdetails.LabelCss))
                        savedFormdetails.LabelCss = WebUtility.HtmlDecode(savedFormdetails.LabelCss);

                    if (!string.IsNullOrEmpty(savedFormdetails.TextboxDropCss))
                        savedFormdetails.TextboxDropCss = WebUtility.HtmlDecode(savedFormdetails.TextboxDropCss);

                    if (!string.IsNullOrEmpty(savedFormdetails.ButtonCss))
                        savedFormdetails.ButtonCss = WebUtility.HtmlDecode(savedFormdetails.ButtonCss);

                    if (!string.IsNullOrEmpty(savedFormdetails.ErrorCss))
                        savedFormdetails.ErrorCss = WebUtility.HtmlDecode(savedFormdetails.ErrorCss);

                    if (!string.IsNullOrEmpty(savedFormdetails.CloseCss))
                        savedFormdetails.CloseCss = WebUtility.HtmlDecode(savedFormdetails.CloseCss);

                    if (!string.IsNullOrEmpty(savedFormdetails.PlaceHolderClass))
                        savedFormdetails.PlaceHolderClass = WebUtility.HtmlDecode(savedFormdetails.PlaceHolderClass);

                    if (!string.IsNullOrEmpty(savedFormdetails.GeneralCss))
                        savedFormdetails.GeneralCss = WebUtility.HtmlDecode(savedFormdetails.GeneralCss);

                    if (!string.IsNullOrEmpty(savedFormdetails.GeneralParentCss))
                        savedFormdetails.GeneralParentCss = WebUtility.HtmlDecode(savedFormdetails.GeneralParentCss);

                    if (!string.IsNullOrEmpty(savedFormdetails.BannerImageDesignCss))
                        savedFormdetails.BannerImageDesignCss = WebUtility.HtmlDecode(savedFormdetails.BannerImageDesignCss);

                    if (!string.IsNullOrEmpty(savedFormdetails.RadioCheckBoxFieldsCss))
                        savedFormdetails.RadioCheckBoxFieldsCss = WebUtility.HtmlDecode(savedFormdetails.RadioCheckBoxFieldsCss);
                }
            }

            using (var objDLRules = DLFormRules.GetDLFormRules(AdsId, SqlProvider))
            {
                savedFormRules = await objDLRules.Get(FormId);

                if (savedFormRules != null && savedFormRules.IsBelong > 0)
                {
                    GetGroupIdNames grpnames = new GetGroupIdNames(SqlProvider);
                    string grpreturnvalues = await grpnames.GetGroupNames(AdsId, UserId, savedFormRules.BelongsToGroup);

                    if (!string.IsNullOrEmpty(grpreturnvalues))
                    {
                        if (grpreturnvalues.LastIndexOf("#") > 0)
                            savedFormRules.BelongsToGroup = grpreturnvalues.Substring(0, grpreturnvalues.Length - 2);
                        else
                            savedFormRules.BelongsToGroup = grpreturnvalues.ToString();
                    }
                }
            }

            using (var objDLResSetting = DLFormResponseReportToSetting.GetDLFormResponseReportToSetting(AdsId, SqlProvider))
            {
                savedresponseSettings = await objDLResSetting.Get(FormId);

                if (savedresponseSettings != null && savedresponseSettings.FormId > 0)
                {
                    if (!string.IsNullOrEmpty(savedresponseSettings.WebHooks))
                        savedresponseSettings.WebHooks = WebUtility.HtmlDecode(savedresponseSettings.WebHooks);

                    if (!string.IsNullOrEmpty(savedresponseSettings.WebHooksFinalUrl))
                        savedresponseSettings.WebHooksFinalUrl = WebUtility.HtmlDecode(savedresponseSettings.WebHooksFinalUrl);

                    if (!string.IsNullOrEmpty(savedresponseSettings.RedirectUrl))
                        savedresponseSettings.RedirectUrl = WebUtility.HtmlDecode(savedresponseSettings.RedirectUrl);

                    if (!string.IsNullOrEmpty(savedresponseSettings.ReportToDetailsByPhoneCall))
                        savedresponseSettings.ReportToDetailsByPhoneCall = WebUtility.HtmlDecode(savedresponseSettings.ReportToDetailsByPhoneCall);

                    if (!string.IsNullOrEmpty(savedresponseSettings.GroupId))
                        savedresponseSettings.GroupId = WebUtility.HtmlDecode(savedresponseSettings.GroupId);

                    if (!string.IsNullOrEmpty(savedresponseSettings.GroupIdBasedOnOptin))
                        savedresponseSettings.GroupIdBasedOnOptin = WebUtility.HtmlDecode(savedresponseSettings.GroupIdBasedOnOptin);
                }
            }

            if (savedresponseSettings != null)
            {
                if (!String.IsNullOrEmpty(savedresponseSettings.MailIdList) && savedresponseSettings.MailIdList.Length > 0)
                {
                    savedMailSetting = new List<MailSendingSetting>();
                    MailSendingSetting maildata = new MailSendingSetting();
                    using var objDLMailSetting = DLMailSendingSetting.GetDLMailSendingSetting(AdsId, SqlProvider);

                    string[] mailIdList = savedresponseSettings.MailIdList.Split(',');

                    foreach (var EachMailId in mailIdList)
                    {
                        MailSendingSetting? mailSendingSetting = await objDLMailSetting.GetDetail(Convert.ToInt32(EachMailId));
                        if (mailSendingSetting != null)
                        {
                            savedMailSetting.Add(mailSendingSetting);
                        }
                    }
                }

                if (!String.IsNullOrEmpty(savedresponseSettings.SmsSendingSettingIdList) && savedresponseSettings.SmsSendingSettingIdList.Length > 0)
                {
                    savedSmsSetting = new List<SmsSendingSetting>();
                    SmsSendingSetting maildata = new SmsSendingSetting();
                    using var objDLSmsSetting = DLSmsSendingSetting.GetDLSmsSendingSetting(AdsId, SqlProvider);

                    string[] smsIdList = savedresponseSettings.SmsSendingSettingIdList.Split(',');

                    foreach (var EachSmsId in smsIdList)
                    {
                        SmsSendingSetting? smsSetting = await objDLSmsSetting.Get(Convert.ToInt32(EachSmsId));
                        if (smsSetting != null)
                        {
                            savedSmsSetting.Add(smsSetting);
                        }
                    }
                }
                if (!String.IsNullOrEmpty(savedresponseSettings.WhatsAppSendingSettingIdList) && savedresponseSettings.WhatsAppSendingSettingIdList.Length > 0)
                {
                    savedWhatsAppSetting = new List<WhatsAppSendingSetting>();
                    WhatsAppSendingSetting maildata = new WhatsAppSendingSetting();
                    using var objBLWhatsAppSetting = DLWhatsAppSendingSetting.GetDLWhatsAppSendingSetting(AdsId, SqlProvider);

                    string[] WhatsAppIdList = savedresponseSettings.WhatsAppSendingSettingIdList.Split(',');

                    foreach (var EachWhatsAppId in WhatsAppIdList)
                    {
                        WhatsAppSendingSetting? WhatsAppSetting = await objBLWhatsAppSetting.Get(Convert.ToInt32(EachWhatsAppId));
                        if (WhatsAppSetting != null)
                        {
                            savedWhatsAppSetting.Add(WhatsAppSetting);
                        }
                    }
                }
                if (savedresponseSettings != null && !string.IsNullOrEmpty(savedresponseSettings.WebHookId) && savedresponseSettings.WebHookId != "0")
                {
                    savedWebHookDetails = new List<WebHookDetails>();
                    string[] WebHookIds = savedresponseSettings.WebHookId.Split(',');
                    foreach (var EachWebHookId in WebHookIds)
                    {
                        int WebHookId = Convert.ToInt32(EachWebHookId);
                        using (var dLWebHookDetails = DLWebHookDetails.GetDLWebHookDetails(AdsId, SqlProvider))
                        {
                            savedWebHookDetails.Add(await dLWebHookDetails.GetWebHookDetails(WebHookId));
                        }
                    }


                }
            }
        }

        public async Task GetFormBindingFieldDetails(int FormId)
        {
            using (var objDLFormFields = DLFormFieldsBindingDetails.GetDLFormFieldsBindingDetails(AdsId, SqlProvider))
            {
                savedFormFieldBindingDetails = (await objDLFormFields.GET(FormId)).ToList();

                if (savedFormFieldBindingDetails != null && savedFormFieldBindingDetails.Count() > 0)
                {
                    int PhoneNumberFieldIndex = -1;

                    if (savedFormFieldBindingDetails.Any(x => x.FieldType == 3))
                        PhoneNumberFieldIndex = savedFormFieldBindingDetails.Select((field, index) => new { field, index }).First(x => x.field.FieldType == 3).index;

                    if (PhoneNumberFieldIndex > -1)
                        savedFormFieldBindingDetails[PhoneNumberFieldIndex].PhoneValidationType = WebUtility.HtmlDecode(savedFormFieldBindingDetails[PhoneNumberFieldIndex].PhoneValidationType);
                }
            }
        }

        public async Task GetFormField(int FormId)
        {
            using (var objDLFormFields = DLFormFields.GetDLFormFields(AdsId, SqlProvider))
            {
                savedFormField = (await objDLFormFields.GET(FormId)).ToList();

                if (savedFormField != null && savedFormField.Count() > 0)
                {
                    int PhoneNumberFieldIndex = -1;

                    if (savedFormField.Any(x => x.FieldType == 3))
                        PhoneNumberFieldIndex = savedFormField.Select((field, index) => new { field, index }).First(x => x.field.FieldType == 3).index;

                    if (PhoneNumberFieldIndex > -1)
                        savedFormField[PhoneNumberFieldIndex].PhoneValidationType = WebUtility.HtmlDecode(savedFormField[PhoneNumberFieldIndex].PhoneValidationType);
                }
            }
        }

        public async Task GetBannerDetails(int FormId)
        {
            using (var objDLFormBanner = DLFormBanner.GetDLFormBanner(AdsId, SqlProvider))
            {
                savedFormBanner = await objDLFormBanner.GET(FormId);

                if (savedFormBanner != null && savedFormBanner.Count() > 0)
                {
                    for (int i = 0; i < savedFormBanner.Count(); i++)
                    {
                        if (!string.IsNullOrEmpty(savedFormBanner[i].BannerContent))
                        {
                            savedFormBanner[i].BannerContent = WebUtility.HtmlDecode(savedFormBanner[i].BannerContent);
                        }
                    }
                }
            }
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
