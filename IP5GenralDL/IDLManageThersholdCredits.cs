using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLManageThersholdCredits:IDisposable
    {
        Task<Int32> SaveDetails(ManageThersholdCredits thershold);
        Task<IEnumerable<ManageThersholdCredits>> GetDetails(ManageThersholdCredits thershold);
        Task<bool> Delete(int Id, int accountId);
        Task<IEnumerable<ManageThersholdCredits>> GetThersholdDetails(ManageThersholdCredits thershold);
        Task<bool> UpdateLastInteractionDate(int Id, int accountId);

    }
}
