using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLCustomEvents:IDisposable
    {
        Task<Int32> GetEventscounts(Nullable<DateTime> fromDateTime, Nullable<DateTime> ToDateTime, int customeventoverviewid, Contact contact, string machineid, Customevents customevents);
        Task<IEnumerable<Customevents>> GetEventsReportData(Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int customeventoverviewid, int ContactId, int OffSet, int FetchNext, Contact contact, string machineid, Customevents customevents);
        Task<IEnumerable<Customevents>> UCPGetEventsName(DateTime? fromDateTime, DateTime? toDateTime, int customeventoverviewid, int contactID, string customEventName, int offSet, int fetchNext, string machineid);
        Task<IEnumerable<Customevents>> UCPGetEventsReportData(Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int customeventoverviewid, int ContactId, int OffSet, int FetchNext, Contact contact, string machineid, Customevents customevents);
        Task<bool> SearchAndAddtoGroup(int UserInfoUserId, int UserGroupId, int customeventoverviewid, Customevents customevents, int GroupId, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime);
        Task<Int32> GetAggergatecounts(DateTime fromDateTime, DateTime ToDateTime, int customeventoverviewid, string groupbyeventfields, string displayextrafields);
        Task<DataSet> GetAggregateData(string FromDateTime, string ToDateTime, int customeventoverviewid, string groupbyeventfields, string displayextrafields, int OffSet, int FetchNext);
        Task<IEnumerable<Customevents>> GetMaxAggregateDetails(DateTime fromDateTime, DateTime ToDateTime, int customeventoverviewid, int OffSet, int FetchNext, Customevents customevents, string queryforaggrgatedetails, string groupbyquery, string CustomFieldname);
        Task<IEnumerable<Contact>> GeteventcontactData(DateTime fromDateTime, DateTime ToDateTime, int customeventoverviewid, int OffSet, int FetchNext, Customevents customevents);
        Task<IEnumerable<Customevents>> GetUniquevisitorDetails(DateTime fromDateTime, DateTime ToDateTime, int customeventoverviewid, int OffSet, int FetchNext, Customevents customevents);
        Customevents? GetCustomevents(int ContactId, string CustomEventName, string CustomEventColumnNames, string TopData, string Orderby, string MachineId = null);
        Task<IEnumerable<Customevents>> GetRevenueEventsReportData(Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int customeventoverviewid, int OffSet, int FetchNext);
        Task<IEnumerable<Customevents>> GetRevenuesingleEventsReportData(int customeventoverviewid, int Id);
        Task<Int32> GetRevenueMaxCount(int customeventoverviewid, DateTime fromDateTime, DateTime ToDateTime);
        Task<DataSet> GetRevenueDetails(int customeventoverviewid, string dynamicefieldnames, DateTime fromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, string BindType);

    }
}
