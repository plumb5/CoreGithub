using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLLmsPublisherReport : IDisposable
    {
        Task<int> GetLmsPublisherMaxCount(string UserIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OrderbyVal, LmsCustomReport filterLead, string Stagename);
        Task<DataSet> GetLmsPublisherReport(string UserIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OffSet, int FetchNext, int OrderbyVal, LmsCustomReport filterLead, string Stagename);
        Task<List<Publisher>> GetPublisherList(int? Score = null);
        Task<int> GetLmsSourceMaxCount(string UserIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OrderbyVal, LmsCustomReport filterLead);
        Task<DataSet> GetLmsPublisherSourceReport(string UserIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OffSet, int FetchNext, int OrderbyVal, LmsCustomReport filterLead);
    }
}
