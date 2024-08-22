
using P5GenralML;

namespace Plumb5.Areas.CaptureForm.Dto
{
    public record CommonDetailsForForms_CommonDto(string value);
    public record CommonDetailsForForms_GetFields(int FormId);
    public record CommonDetailsForForms_GetTopOneIdBasedOnFormType(int FormType, string SessionUID);
    public record CommonDetailsForForms_SaveOrUpdateCampaignDetails(int Id, string ClientCampaignIdentifier, int CamapignId, string CampaignIdentiferName, bool IsOtpForm, int OTPFormId, bool IsWebOrMobileForm, int OTPGenerationLimits, bool OTPPageRestrictions, bool IsClickToCallForm, bool IsVerifiedEmail, bool IsAutoWhatsApp, string BlockEmailIds);
    public record CommonDetailsForForms_GetOTPForms(string FormType);
    public record CommonDetailsForForms_GetFormRespondedNamesByContactId(int ContactId);
    public record CommonDetailsForForms_GetFormDetails(int accountId, int FormId);
    public record CommonDetailsForForms_GetFormsListBasedOnType(int AdsId, string fromDateTime, string toDateTime, string EmbeddedFormOrPopUpFormOrTaggedForm);
    public record CommonDetailsForForms_GetAllFieldDetails(int AccountId);
    public record CommonDetailsForForms_GetUser(int accountId);
    public record CommonDetailsForForms_SetCustomDesignSession(List<FormFields> formFieldsList, FormDetails formDetails, List<FormBanner> formBannerList);

}
