using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWorkFlowWhatsApp:IDisposable
    {
        Task<Int32> Save(MLWorkFlowWhatsApp WhatsappConfig);
        Task<Int32> SaveAsync(MLWorkFlowWhatsApp WhatsappConfig);
        Task<bool> UpdateAsync(MLWorkFlowWhatsApp WhatsappConfig);
        void UpdateWorkflowWhatsAppCampaignSendStatus(int workflowwhatsappSendingSettingId);
        Task<IEnumerable<WorkFlowWhatsApp>> GetRecentWorkflowWhatsAppCampaignsForDailyOnce();
        Task<SendingDatalist?> GetDetails(int ConfigureWhatsAppId);
        Task<WorkFlowWhatsApp?> GetWhatsAppDetails(int ConfigureWhatsAppId);
        Task<WorkFlowWhatsApp?> GetDetails(int ConfigureWhatsAppId, DateTime? FromDate, DateTime? ToDate, byte IsSplitTested = 0, string PhoneNumber = null);
        Task<IEnumerable<WorkFlowWhatsApp>> GetRecentWorkflowWhatsAppCampaignsForInterval();

    }
}
