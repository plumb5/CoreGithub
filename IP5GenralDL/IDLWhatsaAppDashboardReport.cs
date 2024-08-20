using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWhatsaAppDashboardReport:IDisposable
    {
        Task<IEnumerable<MLWhatsAppDashboardCampaignEffectiveness>> GetCampaignEffectivenessData(string fromdate, string todate);
        Task<IEnumerable<MLWhatsAppDashboardSubcribers>> GetWhatsAppDashboardSubcribersData(string fromdate, string todate);
        Task<IEnumerable<MLWhatsAppDashboardDelivery>> GetWhatsAppDashboardDeliveryData(string fromdate, string todate);
        Task<IEnumerable<MLWhatsAppDashboardWhatsAppPerformanceOverTime>> GetWhatsAppPerformanceOverTimeData(string fromdate, string todate);
        Task<IEnumerable<MLWhatsAppDashboardDeliveredVsFailed>> GetWhatsAppDashboardDeliveredFailedData(string fromdate, string todate);
        Task<IEnumerable<MLWhatsAppDashboardBouncedVsRejected>> GetWhatsAppDashboardBouncedRejectedData(string fromdate, string todate);

    }
}
