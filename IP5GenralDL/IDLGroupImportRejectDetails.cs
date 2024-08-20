using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLGroupImportRejectDetails : IDisposable
    {
        Task<int> Save(GroupImportRejectDetails GroupImportRejectDetails);
        Task<GroupImportRejectDetails?> Get(GroupImportRejectDetails GroupImportRejectDetails);
        Task<List<GroupImportRejectDetails>> GetList(GroupImportRejectDetails GroupImportRejectDetails, DateTime? FromDateTime = null, DateTime? ToDateTime = null);
    }
}
