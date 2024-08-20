using P5GenralML;

namespace Plumb5.Areas.Mail.Dto
{
    public record GroupDto_BindGroupsContact(MLGroups group, int FetchNext, int OffSet);
    public record GroupDto_GroupsContactImport(MLGroups group, int FetchNext, int OffSet);
    public record GroupDto_GetGroupList(int accountId, Groups group);
    public record GroupDto_BindGroupsDetailsWithoutCount(MLGroups group, int FetchNext, int OffSet);
    public record GroupDto_GetGroupsCountByGroupId(int GroupId);
}
