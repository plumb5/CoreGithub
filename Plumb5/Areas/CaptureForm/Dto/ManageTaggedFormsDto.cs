using P5GenralML;

namespace Plumb5.Areas.CaptureForm.Dto
{
    public record ManageTaggedForms_GetMaxCountDto(int accountId, MLFormScripts formScripts);

    public record ManageTaggedForms_GetAllDetailsDto(int accountId, MLFormScripts formScripts, int OffSet, int FetchNext);

    public record ManageTaggedForms_ToogleStatusDto(int accountId, int Id, bool FormScriptStatus);

    public record ManageTaggedForms_DeleteDto(int accountId, int Id);

    public record ManageTaggedForms_TaggedFormsExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);

    public record ManageTaggedForms_UpdateAlternateUrlDto(int accountId, int FormId, string AlternatePageUrls);

}
