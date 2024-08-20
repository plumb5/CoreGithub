namespace Plumb5.Areas.Mail.Dto
{
    public record Unsubscribed_GetGroupListDto(int accountId);
    public record Unsubscribed_GetMaxCountDto(int accountId, int GroupId = 0);
    public record Unsubscribed_GetUnSubScribedContactListDto(int accountId, int OffSet, int FetchNext, int GroupId = 0);
    public record Unsubscribed_GetGroupNameByContactsDto(int[] contact);
    public record Unsubscribed_AddToGroupDto(int accountId, int[] contact, string[] Groups);
    public record Unsubscribed_DeleteFromGroupDto(int accountId, int[] contact, int[] Groups);
    public record Unsubscribed_UpdateUnSubscribRecordDto(int accountId, int[] contact);
    public record Unsubscribed_GetUnsubscribedDetailsDto(string EmailId, byte Unsubscribe);
    public record Unsubscribed_ExportDto(int OffSet, int FetchNext, string FileType);
    public record Unsubscribed_ExportUnsubscribeDetailsDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
 
}
