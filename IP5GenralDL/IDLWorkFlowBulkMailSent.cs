using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWorkFlowBulkMailSent : IDisposable
    {
        Task<bool> DeleteAllTheDataWhichAreInQuque(int WorkFlowId);
        Task<long> GetTotalBulkMail(int MailSendingSettingId, int WorkFlowId);
    }
}
