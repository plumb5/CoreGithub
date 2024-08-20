using P5GenralML;

namespace Plumb5.Areas.CaptureForm.Dto
{
    public record ManagePopUpForms_GetMaxCount(int accountId, FormDetails formDetails);
    public record ManagePopUpForms_GetAllDetails(int accountId, FormDetails formDetails, int OffSet, int FetchNext);
    public record ManagePopUpForms_Delete(int accountId, Int16 Id);
    public record ManagePopUpForms_ToogleStatus(int accountId, FormDetails formDetails);
    public record ManagePopUpForms_CopyFormDetails(int accountId, int Id);
    public record ManagePopUpForms_ChangePriority(int AccountId, List<FormDetails> formdetails);
    public record ManagePopUpForms_PopUpFormsExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
}
