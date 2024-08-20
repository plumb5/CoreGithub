using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLLmsStageNotification : IDisposable
    {
        Task<Int32> Save(LmsStageNotification notification);
        Task<bool> UpdateLastAssignedUserId(Int16 LMSStageId, int UserInfoUserId);
        Task<List<LmsStageNotification>> GET();
        Task<LmsStageNotification?> GET(int StageScore);
    }
}
