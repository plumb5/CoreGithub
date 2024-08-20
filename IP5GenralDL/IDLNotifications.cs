using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLNotifications : IDisposable
    {
        Task<long> Save(Notifications notifications);
        Task<bool> Update(Notifications notifications);
        Task<int> GetNotificationCount(int UserInfoUserId);
        Task<List<Notifications>> GetNotifications(int UserInfoUserId);
        Task<Notifications?> GetNotificationsByUserId(int UserInfoUserId, int ContactId, string PageUrl);
        Task<bool> UpdateSeenStatus(Notifications notifications);
    }
}
