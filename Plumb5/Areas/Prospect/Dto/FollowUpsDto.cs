namespace Plumb5.Areas.Prospect.Dto
{
    public record FollowUps_GetFollowUpNotificationDto(int accountId, int UserId);
    public record FollowUps_LeadsExportDto(int AccountId, int OffSet, int FetchNext, string FileType);
}
