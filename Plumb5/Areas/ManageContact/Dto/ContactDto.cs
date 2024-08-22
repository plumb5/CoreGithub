using P5GenralML;

namespace Plumb5.Areas.ManageContact.Dto
{
    public record Contact_MaxCountDto(Contact contact, Int32? GroupId = null);
    public record Contact_MaxCountMasterFilter(Contact contact, int OffSet, int FetchNext, int creategroupchk, string Newgroupname, string Newgroupdescription, int filteredgroupid, string FromDate, string ToDate);
    public record Contact_GetDetails(Contact contact, int FetchNext, int OffSet, Int32? GroupId = null);
    public record Contact_GetCustomContactDetails(Contact contact, int OffSet, int FetchNext, int groupid, string FromDate, string ToDate);
    public record Contact_ExportDto(int FetchNext, int OffSet, string FileType);
    public record Contact_AddToInvalidateDo(int[] contact);
    public record Contact_GetGroupNameByContacts(int[] contact);
    public record Contact_AddToGroup(int AccountId, int[] contact, string[] Groups);
    public record Contact_AddToUnsubscribe(int[] contact, bool emilchk, bool smschk);
    public record Contact_VerifyEmailContactDto(int accountId, int ContactId);
    public record Contact_VerifyEmailContactListDto(int accountId, int[] ContactId);
    public record Contact_GetContactPropertyListDto(int AccountId);
    public record Contact_SaveOrUpdateContact(int AccountId, Contact contact, int OldUserInfoUserId, int GroupId, bool IsVerifiedEmail, int LmsSourceType, int lmsgrpmemberid, string lmsgrpmembers = null);
    public record Contact_GetContactDetailsForUpdateDto(int AccountId, Contact contact, int LmsGroupId);
    public record Contact_GetLmsContactDetailsForUpdate(int AccountId, int ContactId, int LmsGroupId);
    public record Contact_DeleteFromGroupDto(int[] contact, int[] Groups);
    public record Contact_ContactsExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
}
