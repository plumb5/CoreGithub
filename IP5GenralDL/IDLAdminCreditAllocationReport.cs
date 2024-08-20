using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLAdminCreditAllocationReport : IDisposable
    {
        Task<int> Save(AdminCreditAllocationReport credit);
        Task<int> GetCount(AdminCreditAllocationReport obj, DateTime fromDateTime, DateTime toDateTime);
        Task<List<MLAdminCreditAllocationReport>> GetDetails(AdminCreditAllocationReport obj, DateTime fromDateTime, DateTime toDateTime, int Offset, int FetchNext);
    }
}
