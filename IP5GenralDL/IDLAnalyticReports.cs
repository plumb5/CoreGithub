using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLAnalyticReports : IDisposable
    {
        Task<Int32> Save(AnalyticReports analyticReports);
        Task<Int32> Update(AnalyticReports analyticReports);
        Task<List<AnalyticReports>> GetAnalyticsSaveReport(string UserIdList);
        Task<bool> DeleteSavedSearch(int Id);
        Task<AnalyticReports?> GetFilterConditionDetails(int FilterConditionId);
        Task<Int32> GetMaxCount(AnalyticCustomReports filterLead, string Groupby, DateTime FromDateTime, DateTime ToDateTime);
        Task<DataSet> GetAnalyticReports(AnalyticCustomReports filterDataJson, string Groupby, int offset, int fetchNext, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime);
    }
}