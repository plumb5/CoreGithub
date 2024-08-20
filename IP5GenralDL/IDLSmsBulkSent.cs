using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLSmsBulkSent:IDisposable
    {
        Task<IEnumerable<SmsSent>> GetBulkSmsSentDetails(int SmsSendingSettingId, int MaxLimit);
        Task<bool> UpdateBulkSmsSentDetails(List<long> SmsBulkSentIds);
        Task<long> GetTotalBulkSms(int SmsSendingSettingId);
        Task<bool> DeleteTotalBulkSms(int SmsSendingSettingId);

    }
}
