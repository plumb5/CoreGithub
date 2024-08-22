using P5GenralML;

namespace Plumb5.Areas.Mail.Dto
{
    public record BouncedHard_GetGroupListDto(int accountId);
    public record BouncedHard_GetMaxCountDto(int accountId, MLMailBouncedContact MailBounced, int GroupId = 0);
    public record BouncedHard_GetBouncedContactListDto(int accountId, MLMailBouncedContact MailBounced, int OffSet, int FetchNext, int GroupId = 0);
    public record BouncedHard_AddToGroupDto(int accountId, int[] contact, string[] Groups);
    public record BouncedHard_DeleteFromGroupDto(int accountId, int[] contact, int[] Groups);
    public record BouncedHard_DeleteBounceRecordDto(int accountId, List<MLMailBouncedContact> bounceList);
    public record BouncedHard_ExportDto(int accountId, MLMailBouncedContact MailBounced, string FileType, int GroupId = 0);
    public record BouncedHard_ExportUnsubscribedContactsDto(int accountId, string FileType);
}
