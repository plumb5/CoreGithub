using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLApiImportRequest : IDisposable
    {
        Task<int> GetMaxCount(DateTime fromdatetime, DateTime todatetime, string requestcontent = null, string name = null, bool? IsContactSuccess = null, bool? IsLmsSuccess = null);
        Task<DataSet> GetDetails(DateTime fromdatetime, DateTime todatetime, string requestcontent = null, string name = null, bool? IsContactSuccess = null, bool? IsLmsSuccess = null, int offset = 0, int fetchnext = 10);
    }
}
