using P5GenralML;

namespace Plumb5.Areas.Prospect.Dto
{
    public record Leads_GetMaxCountDto(int AccountId, LmsCustomReport filterLead);
    public record Leads_GetReportDto(int AccountId, LmsCustomReport filterLead, int OffSet, int FetchNext);
    public record Leads_GetStageScoreDto(int accountId);
    public record Leads_LmsGroupsListDto(int accountId);
    public record Leads_GetUserDto(int accountId, int Getallusers);
    public record Leads_DeleteDto(int accountId, int ContactId);
    public record Leads_DeleteSelectedLeadsDto(int accountId, List<int> LmsGroupMemberID);
    public record Leads_UpdateNotesDto(int accountId, Notes notes);
    public record Leads_GetNoteListDto(int accountId, int contactId);
    public record Leads_SaveFollowUpsDto(int accountId, int[] ContactIds, int[] LmsGroupmembersIds, string FollowUpContent, byte FollowUpStatus, string FollowUpdate, int FollowUpUserId, int[] LmsGroupIds, Contact SetRemainder = null, string ToReminderWhatsAppPhoneNumber = null);
    public record Leads_UpdateStageDto(int accountId, MLContact mLContact, List<string> stages, string leadEmailId, int UserInfoUserId, string ClouserDate, string LmsGroupName = null);
    public record Leads_BulkStageUpdateDto(int accountId, List<MLContact> mlContacts);
    public record Leads_BulkAssignSalesPersonDto(int accountId, int[] LmsGroupMemberId, int UserInfoUserId);
    public record Leads_UpdateLeadLabelDto(int accountId, int[] LeadLmsGroupMemberList, string LabelValue, int LmsGroupId);
    public record Leads_UpdateFollowUpCompletedDto(int accountId, int[] LmsGroupmemberIds);
    public record Leads_GetLeadFollowUpDataDto(int accountId, int LmsGroupmemberId);
    public record Leads_UpdateLeadSeenDto(int AdsId, int ContactId);
    public record Leads_LeadsExportDto(int AccountId, int OffSet, int FetchNext, string FileType);
    public record Leads_GetPropertySettingDto(int AccountId);
    public record Leads_GetLMSHeaderFlagDto(int AccountId);
    public record Leads_GetIsSearchbyColumnDto(int AccountId);
    public record Leads_GetPermissionlevelUsersDto(int AccountId);
    public record Leads_GetLMSCustomFieldsDto(int AccountId);
    public record Leads_GetUsersListDto(int accountId, int Getallusers);
}
