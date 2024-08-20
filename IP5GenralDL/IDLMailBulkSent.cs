using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMailBulkSent
    {
        Task<List<MLMailSent>> GetBulkMailSentDetails(int MailSendingSettingId, int MaxLimit);
        Task<int> InsertToMailSent(DataTable mailsentbulk);
        Task<bool> UpdateBulkMailSentDetails(List<long> MailBulkSentIds);
        Task<bool> DeleteSentMailBulk(int MailSendingSettingId);
        Task<long> GetTotalBulkMail(int MailSendingSettingId);
        Task<bool> DeleteTotalBulkMail(int MailSendingSettingId);
    }
}
