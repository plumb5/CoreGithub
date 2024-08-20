using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLAdminMasterCreditAudit:IDisposable
    {
        Task<int> GetMaxcount(AdminMasterCreditAudit masterCreditAudit, DateTime? FromDateTime = null, DateTime? ToDateTime = null);
        Task<IEnumerable<AdminMasterCreditAudit>> GetDetails(AdminMasterCreditAudit masterCreditAudit, DateTime? FromDateTime = null, DateTime? ToDateTime = null, int FetchNext = 0, int offset = 0);
    }
}
