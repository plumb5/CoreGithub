using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLSmsDashboardReport:IDisposable
    {
        Task<List<MLSmsDashboardCampaignEffectiveness>> GetCampaignEffectivenessData(string fromdate, string todate);
        Task<List<MLSmsDashboardEngagement>> GetSmsDashboardEngagementData(string fromdate, string todate);
        Task<List<MLSmsDashboardDelivery>> GetSmsDashboardDeliveryData(string fromdate, string todate);
        Task<List<MLSmsDashboardSmsPerformanceOverTime>> GetSmsPerformanceOverTimeData(string fromdate, string todate);
        Task<List<MLSmsDashboardBouncedVsRejected>> GetSmsDashboardBouncedRejectedData(string fromdate, string todate);
    }
}
