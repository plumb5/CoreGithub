using Microsoft.AspNetCore.Mvc;

namespace Plumb5.Areas.Mail.Dto
{
    public record IndividualResponse_IndividualMaxCountDto(int mailCampaignId, string fromDateTime, string toDateTime, string EmailId = null);
    public record IndividualResponse_GetIndividualResponseDataDto(int mailCampaignId, string fromDateTime, string toDateTime, int OffSet, int FetchNext, string EmailId = null);
    public record IndividualResponse_ExportDto(string fromDateTime, string toDateTime, int OffSet, int FetchNext, string FileType);
}
