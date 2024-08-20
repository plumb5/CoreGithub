using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWorkFlowWhatsAppBulkSentInitiation:IDisposable
    {
        Task<IEnumerable<WorkFlowWhatsAppBulkSentInitiation>> GetSentInitiation();
        Task<bool> UpdateSentInitiation(WorkFlowWhatsAppBulkSentInitiation BulkSentInitiation);
        Task<Int32> Save(WorkFlowWhatsAppBulkSentInitiation BulkSentInitiation);
        Task<bool> ResetInitiation();
    }
}
