using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLLmsFollowUpReport:IDisposable
    {
        Task<Int32> GetMaxCount(string UserIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime);
        Task<DataSet> GetLmsFollowUpReport(string UserIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OffSet, int FetchNext);
    }
}
