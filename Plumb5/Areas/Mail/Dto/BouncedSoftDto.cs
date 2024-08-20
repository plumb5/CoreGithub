using P5GenralML;
namespace Plumb5.Areas.Mail.Dto
{
    public record BouncedSoft_GetGroupListDto(int accountId);
    public record BouncedSoft_GetMaxCountDto(int accountId, MLMailBouncedContact MailBounced, int GroupId = 0);
    public record BouncedSoft_GetBouncedContactListDto(int accountId, MLMailBouncedContact MailBounced, int OffSet, int FetchNext, int GroupId = 0);
    public record BouncedSoft_GetGroupNameByContactsDto(int[] contact);
    public record BouncedSoft_AddToGroupDto(int accountId, int[] contact, string[] Groups);
    public record BouncedSoft_DeleteFromGroupDto(int accountId, int[] contact, int[] Groups);
    public record BouncedSoft_DeleteBounceRecordDto(int accountId, List<MLMailBouncedContact> bounceList);
    public record BouncedSoft_ExportDto(int accountId, MLMailBouncedContact MailBounced, string FileType, int GroupId = 0);
    public record BouncedSoft_ExportUnsubscribedContactsDto(int accountId, string FileType);
}
