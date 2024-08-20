using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLCustomEventsOverView:IDisposable
    {
        Task<Int32> Save(CustomEventsOverView customevntsoverview);
        Task<CustomEventsOverView?> GetCustomEventByName(string CustomEventName);
        Task<Int32> MaxCount(string CustomEventName, DateTime fromDateTime, DateTime ToDateTime);
        Task<IEnumerable<CustomEventsOverView>> GetReportData(string CustomEventName, Nullable<DateTime> fromDateTime, Nullable<DateTime> ToDateTime, int OffSet, int FetchNext);
        Task<bool> DeleteCustomEventOverView(int Id);
        Task<Int32> StopCustomEventTrack(int Id);
        Task<IEnumerable<CustomEventsNames>> GetCustomEventsNames();
        Task<IEnumerable<MLCustomEventsOverViewMappings>> GetCustomEventsColumnNames(int CustomEventOverViewId);
        Task<IEnumerable<CustomEventsOverView>> GetEventNamesForRevenue(Nullable<DateTime> fromDateTime, Nullable<DateTime> ToDateTime);

    }
}
