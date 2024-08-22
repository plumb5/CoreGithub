namespace Plumb5.Areas.Mail.Dto
{
    public record Campaign_ExportCampaignIdentifierDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
}
