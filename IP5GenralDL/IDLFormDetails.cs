using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLFormDetails : IDisposable
    {
        Task<Int32> Save(FormDetails formDetails);
        Task<bool> Update(FormDetails formDetails);
        Task<List<FormDetails>> GET(FormDetails formDetails, int OffSet, int FetchNext, string ListOfFormId, List<string> fieldName, bool IsEventForms, List<int> UserInfoUserIdList = null, int? IsSuperAdmin = null, Nullable<DateTime> FromDateTime = null, Nullable<DateTime> ToDateTime = null);
        Task<FormDetails> GETDetails(FormDetails formDetails);
        Task<int> GetMaxCount(FormDetails formDetails, Nullable<DateTime> FromDateTime = null, Nullable<DateTime> ToDateTime = null);
        Task<bool> Delete(Int32 Id);
        Task<bool> ToogleStatus(FormDetails formDetails);
        Task<bool> GetStatus(int FormId);
        Task<bool> ChangePriority(int Id, Int16 FormPriority);
        Task<int> GetTopOneIdBasedOnFormType(int FormType);
        Task<bool> UpdateCampaignIdentifier(int Id, string ClientCampaignIdentifier, int CamapignId, string CampaignIdentiferName, bool IsOtpForm, int OTPFormId, bool IsWebOrMobileForm, int OTPGenerationLimits, bool OTPPageRestrictions, bool IsClickToCallForm, bool IsVerifiedEmail, bool IsAutoWhatsApp, string BlockEmailIds);
        Task<List<FormDetails>> GetOTPForms(string FormType = null);
    }
}
