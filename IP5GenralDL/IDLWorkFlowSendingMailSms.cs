using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWorkFlowSendingMailSms
    {
        Task<List<MLMailSent>> GetMailBulkDetails(MLMailSent mailSent, int MaxLimit);
        Task<bool> SaveToMailSent(DataTable mailSent);
        Task<bool> UpdateTotalCounts(DataTable mailSent, int MailSendingSettingId);
        Task<Int32> DeleteFromWorkFlowBulkMailSent(DataTable mailSent);
        Task<List<SmsSent>> GetSmsBulkDetails(int SmsSendingSettingId, int WorkFlowId, Int16 SendStatus, int MaxLimit);
    }
}
