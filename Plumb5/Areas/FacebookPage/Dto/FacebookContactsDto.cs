using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.FacebookPage.Dto
{
    public record FacebookContacts_MaxCountDto(Contact contact, Int32? GroupId = null);
    public record FacebookContacts_GetDetailsDto(Contact contact, int FetchNext, int OffSet, Int32? GroupId = null);
    public record FacebookContacts_GetGroupNameByContactsDto(int[] contact);
    public record FacebookContacts_AddToGroupDto(int[] contact, string[] Groups);
    public record FacebookContacts_DeleteFromGroupDto(int[] contact, int[] Groups);
    public record FacebookContacts_AddToUnsubscribeDto(int[] contact, bool emilchk, bool smschk);
    public record FacebookContacts_AddToInvalidateDto(int[] contact);
    public record FacebookContacts_VerifyEmailContactDto(int accountId, int ContactId);
}
