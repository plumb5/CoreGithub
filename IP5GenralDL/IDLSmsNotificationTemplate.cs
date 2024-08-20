using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLSmsNotificationTemplate : IDisposable
    {
        Task<Int32> Save(SmsNotificationTemplate notificationTemplate);
        Task<SmsNotificationTemplate?> GetByIdentifier(string Identifier);
        Task<SmsNotificationTemplate?> GetById(int Id);
        Task<List<SmsNotificationTemplate>> Get(int OffSet, int FetchNext);
        Task<bool> Update(SmsNotificationTemplate notificationTemplate);
        Task<int> GetMaxCount();
        Task<bool> UpdateStatus(bool IsSmsNotificationEnabled);
    }
}
