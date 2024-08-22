using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Data;
using System.Globalization;
using System.Reflection;

namespace Plumb5.Areas.ManageContact.Dto
{
    public record Group_GetGroupReportCountDto(int accountId, Groups group);
    public record Group_BindGroupDetailsDto(int accountId, MLGroups group, int OffSet, int FetchNext);
    public record Group_GetGroupsDetailsDto(int accountId, int GroupId);
    public record Group_GetContactInfoDetailsDto(int accountId);
    public record Group_GetGroupsByStaticOrDynamicDto(int accountId, Int16 GroupType);
    public record Group_GroupExportDto(int AccountId, int Duration, int OffSet, int FetchNext, string FileType);
    public record Group_GroupContactExportDto(int accountId, string FileType, int GroupId);
    public record Group_SaveOrUpdateDetailsDto(int accountId, Groups group);
    public record Group_GetGroupsCountByGroupIdDto(int accountId, int GroupId);
    public record Group_SearchAndAddtoGroupDto(int accountId, Contact contact, int StartCount, int EndCount, int GroupId, string FromDate, string ToDate);
    public record Group_RemoveContactFromOtherGroupDto(int accountId, int GroupId);
    public record Group_DuplicateContactsToNewGroupDto(int accountId, int GroupId, int NewGroupId);
    public record Group_DeleteDto(int accountId, int Id);
    public record Group_ValidateGroupDto(ContactEmailValidationOverView contactEmailValidationOverView);
    public record Group_GetPropertiesDto(int AccountId);
    public record Group_GetTotalUniqueRecipientsCountDto(int accountId, string ListOfGroupId);
    public record Group_MergeDistinctContactIntoGroupDto(int accountId, string ListOfGroupId, Groups group);
    public record Group_GetGroupListDto(int accountId);
    public record Group_MoveGroupsContactDto(int accountId, int UserId, string selectedGroups, int newGroupId);
    public record Group_MergeGroupContactsDto(int accountId, string selectedGroups, Groups groups);
    public record Group_CopyGroupsContactDto(int accountId, int UserId, string selectedGroups, int newGroupId);
    public record Group_CreateControlGroupDto(int accountId, ControlGroups Controlgroupinfo);
    public record Group_AutoEmailValidationDto(int accountId, int GroupId);
    public record Group_GroupMemberMaxCountDto(int accountId, int GroupId);
    public record Group_GroupMemberCountsReportDto(int accountId, int GroupId, int OffSet, int FetchNext);
    public record Group_GetGroupEmailVerfiedCountDto(int accountId, Groups group);
}
