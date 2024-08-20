using P5GenralML;

namespace Plumb5.Areas.CaptureForm.Dto
{
    public record Response_GetFormMaxCountDto(int AdsId, string fromDateTime, string toDateTime, string EmbeddedFormOrPopUpFormOrTaggedForm);
    public record Response_GetFormFieldsDto(int AdsId);
    public record Response_GetMaxCountDto(int AdsId, string fromDateTime, string toDateTime, string EmbeddedFormOrPopUpFormOrTaggedForm, int VisitorType);
    public record Response_GetResponsesDto(int AdsId, int FormId, int OffSet, int FetchNext, string fromDateTime, string toDateTime, string EmbeddedFormOrPopUpFormOrTaggedForm, int VisitorType);
    public record Response_GetPollResponseDataDto(int FormId, int OffSet, int FetchNext, string fromDateTime, string toDateTime);
    public record Response_GetCustomMaxCountDto(FormResponses formResponses, string FromDate, string ToDate, string EmbeddedFormOrPopUpFormOrTaggedForm = null);
    public record Response_GetCustomResponsesDto(FormResponses formResponses, int OffSet, int FetchNext, string FromDate, string ToDate, string EmbeddedFormOrPopUpFormOrTaggedForm = null);
    public record Response_UpdateDto(int AdsId, int Id);
    public record Response_ExportDto(int OffSet, int FetchNext, string FileType);
    public record Response_FormResponseExportDto(int OffSet, int FetchNext, string FileType);
    public record Response_FormResponseAllExportDto(int OffSet, int FetchNext, string FileType);
    public record Response_FormReportExportDto(int OffSet, int FetchNext, string FileType);

}
