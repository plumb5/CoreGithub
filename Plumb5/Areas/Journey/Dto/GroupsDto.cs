using P5GenralML;

namespace Plumb5.Areas.Journey.Dto
{
    public record Group_GetMaxCount(int accountId, WorkFlowGroup groups);
    public record Group_BindGroups(int accountId, WorkFlowGroup groups, int OffSet, int FetchNext);
    public record Group_MaxCount(int accountId, string groupids, bool Isbelong);
    public record Group_BindGropsDetails(int accountId, string groupids, bool Isbelong, int Offset = 0, int FetchNext = 0, int actiontype = 1);
    public record Group_BindContacts(int accountId, string contacts);
    public record Group_BindGroupsContact(int accountId, int GroupId, int Action, int FetchNext = 0, int OffSet = 0, int GroupMemberId = 0);
    public record Group_GetContacts(int accountId, string ContactIds);
    public record Group_GetContactMaxCount(int accountId, Contact contact, Int32? AgeRange1 = null, Int32? AgeRange2 = null, Int32? GroupId = null, string DateRange1 = null, string DateRange2 = null, DateTime? GroupDate = null, string IsSmsNAcheck = null);
    public record Group_GetDetails(int accountId, Contact contact, int FetchNext, int OffSet, Int32? AgeRange1 = null, Int32? AgeRange2 = null, Int32? GroupId = null, string DateRange1 = null, string DateRange2 = null, DateTime? GroupDate = null, string IsSmsNAcheck = null);
}
