using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLPermissionSubLevels : IDisposable
    {
        Task<long> Save(PermissionSubLevels subLevels);
        Task<bool> Delete(long PermissionLevelId);
        Task<PermissionSubLevels?> GetDetails(PermissionSubLevels subLevels, string FeatureName);
        Task<List<PermissionSubLevels>> GetAllDetails(PermissionSubLevels subLevels);
    }
}
