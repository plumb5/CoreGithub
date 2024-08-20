using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLLmsScheduler : IDisposable
    {
        Task<DataSet> GetReminderDetails();
        Task<DataSet> LmsSmsReminderDetails();
        Task<DataSet> LmsWhatsAppReminderDetails();
        Task<DataSet> LmsMailAlertReminderDetails();
        Task<bool> UpdateMailAlertScheduleSentStatus(int Id, int ContactId, string Status);
        Task<bool> UpdateSmsAlertScheduleSentStatus(int Id, int ContactId, string Status);
        Task<bool> UpdateWhatsAppAlertScheduleSentStatus(int Id, int ContactId, string Status);
    }
}
