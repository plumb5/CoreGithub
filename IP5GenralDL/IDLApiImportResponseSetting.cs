using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLApiImportResponseSetting : IDisposable
    {
        Task<bool> Save(ApiImportResponseSetting responseSettings);
        Task<int> MaxCount(string Name);
        Task<IEnumerable<ApiImportResponseSetting>> Get(int FetchNext, int OffSet, string Name);
        Task<bool> Delete(int Id);
        Task<bool> ToggleStatus(int Id, bool Status);
        Task<ApiImportResponseSetting?> Get(string Name);
        Task<bool> UpdateLastAssigUserIdNotificationToSales(int Id, int UserInfoUserId);
        Task<IEnumerable<ApiImportResponseSetting>> GetNames();
    }
}
