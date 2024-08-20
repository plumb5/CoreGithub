using NuGet.Protocol.Plugins;
using P5GenralDL;
using P5GenralML;
using System.Net;

namespace Plumb5.Areas.CaptureForm.Models
{
    public class DuplicateFormCreation : IDisposable
    {
        public int FormId { get; set; }

        readonly int accountId;
        private readonly string? SqlProvider;

        public DuplicateFormCreation(int AdsId, string? sqlProvider)
        {
            accountId = AdsId;
            SqlProvider = sqlProvider;
        }

        public async Task<int> CreateDuplicate(int Id)
        {
            FormDetails formdetails = null;
            FormRules? formrules = null;
            List<FormFields> formfields = null;
            List<FormFieldsBindingDetails> formfieldsBindingDetails = null;
            FormResponseReportToSetting? savedresponseSettings = null;
            List<FormBanner> formBanner = null;

            using (var objFormDetails = DLFormDetails.GetDLFormDetails(accountId, SqlProvider))
            {
                formdetails = await objFormDetails.GETDetails(new FormDetails() { Id = Id });
                DateTime date = new DateTime();
                var strYear = date.Month.ToString() + date.Day.ToString() + DateTime.Now.Millisecond.ToString();
                formdetails.FormIdentifier = formdetails.FormIdentifier + "_COPY_" + strYear + "";
                //formdetails.FormStatus = false;
                try
                {
                    FormId = await objFormDetails.Save(formdetails);
                }
                catch (Exception ex)
                {

                }


            }

            if (FormId > 0)
            {
                using (var objFormRules = DLFormRules.GetDLFormRules(accountId, SqlProvider))
                {
                    formrules = await objFormRules.Get(Id);
                    if (formrules != null && formrules.FormId > 0)
                    {
                        formrules.FormId = FormId;
                        await objFormRules.Save(formrules);
                    }
                }

                using (var objDLResSetting = DLFormResponseReportToSetting.GetDLFormResponseReportToSetting(accountId, SqlProvider))
                {
                    savedresponseSettings = await objDLResSetting.Get(Id);

                    if (savedresponseSettings != null && savedresponseSettings.FormId > 0)
                    {
                        savedresponseSettings.FormId = FormId;
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

                        if (!string.IsNullOrEmpty(savedresponseSettings.WebHookId) && savedresponseSettings.WebHookId != "0")
                        {

                            string[] WebHookIds = savedresponseSettings.WebHookId.Split(',');
                            savedresponseSettings.WebHookId = null;
                            foreach (var EachWebHookId in WebHookIds)
                            {
                                int WebHookId = Convert.ToInt32(EachWebHookId);
                                using (var dLWebHookDetails = DLWebHookDetails.GetDLWebHookDetails(accountId, SqlProvider))
                                {
                                    WebHookDetails? webHookDetails = await dLWebHookDetails.GetWebHookDetails(WebHookId);
                                    savedresponseSettings.WebHookId += "," + Convert.ToString(await dLWebHookDetails.Save(webHookDetails));
                                }
                            }
                        }

                        if (savedresponseSettings.WebHookId != null && savedresponseSettings.WebHookId != "")
                        {
                            savedresponseSettings.WebHookId = savedresponseSettings.WebHookId.Remove(0, 1);
                        }
                        await objDLResSetting.Save(savedresponseSettings);
                    }
                }

                using (var objFormFields = DLFormFields.GetDLFormFields(accountId, SqlProvider))
                {
                    formfields = (await objFormFields.GET(Id)).ToList();
                    if (formfields != null && formfields.Count > 0)
                    {
                        foreach (FormFields fieldDetails in formfields)
                        {
                            fieldDetails.FormId = FormId;
                            await objFormFields.Save(fieldDetails);
                        }
                    }
                }

                using (var objFormFieldsBindingDetails = DLFormFieldsBindingDetails.GetDLFormFieldsBindingDetails(accountId, SqlProvider))
                {
                    formfieldsBindingDetails = (await objFormFieldsBindingDetails.GET(Id)).ToList();
                    if (formfieldsBindingDetails != null && formfieldsBindingDetails.Count > 0)
                    {
                        foreach (FormFieldsBindingDetails fieldDetailsBindingDetails in formfieldsBindingDetails)
                        {
                            fieldDetailsBindingDetails.FormId = FormId;
                            await objFormFieldsBindingDetails.Save(fieldDetailsBindingDetails);
                        }
                    }
                }

                using (var objFormBanner = DLFormBanner.GetDLFormBanner(accountId, SqlProvider))
                {
                    formBanner = await objFormBanner.GET(Id);
                    if (formBanner != null && formBanner.Count > 0)
                    {
                        foreach (FormBanner banner in formBanner)
                        {
                            banner.FormId = FormId;
                            banner.Name = formdetails.FormIdentifier;
                            {
                                await objFormBanner.Save(banner);
                            }
                        }
                    }
                }
            }
            return FormId;
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
