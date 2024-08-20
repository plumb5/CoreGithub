using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLGroupImportOverview : IDisposable
    {
        Task<int> Save(GroupImportOverview groupImportOverview);
        Task<bool> Update(GroupImportOverview groupImportOverview);
        Task<GroupImportOverview?> Get(GroupImportOverview groupImportOverview);
        Task<List<GroupImportOverview>> GetList(GroupImportOverview groupImportOverview, DateTime? FromDateTime, DateTime? ToDateTime);
    }
}
