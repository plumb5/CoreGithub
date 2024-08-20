using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLFacebookAssignmentSettings : IDisposable
    {
        Task<Int32> SaveSettings(FacebookAssignmentSettings AssignmentSettings);
        Task<FacebookAssignmentSettings?> GetSettings(FacebookAssignmentSettings AssignmentSettings);
        Task<bool> UpdateLastAssignedUserId(string PageId, int UserInfoUserId);
    }
}
