using P5GenralML;

namespace Plumb5.Areas.WebPush.Dto
{
    public record WebPushIndividualResponse_GetMaxCountDto(string fromDateTime, string toDateTime, int WebPushTemplateId = 0, string MachineId = null);
    public record WebPushIndividualResponse_GetIndividualResponsesDto(int OffSet, int FetchNext, string fromDateTime, string toDateTime, int WebPushTemplateId = 0, string MachineId = null);
    public record WebPushIndividualResponse_ExportWebPushIndividualResponseReportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);

}
