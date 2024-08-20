using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLNotificationDetails : IDisposable
    {
        Task<Int32> SaveDetails(NotificationDetails notification);
        Task<Int32> SaveCallDetails(MLNotificationDetails notification);
        Task<List<NotificationDetails>> GetDetails(int UserInfoUserId, int OffSet, int FetchNext);
        Task<NotificationDetails?> GetDetails(Int32 Id);
    }
}
