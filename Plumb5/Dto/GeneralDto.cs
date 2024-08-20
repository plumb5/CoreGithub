namespace Plumb5.Dto
{
    public record General_GetActiveEmailIdsDto(int accountId);
    public record General_GetContactDetails(int AccountId, int UserId, string EmailId, string PhoneNumber);
    public record General_GetContactExtraField(int AccountId);
    public record General_GetLmsContactDetailsForUpdate(int AccountId, int ContactId, int LmsGroupId);
}
