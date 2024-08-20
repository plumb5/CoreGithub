using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLDashboardMail : IDisposable
    {
        Task<List<MailDashboardCampaignEffectiveness>> GetMailDashboardCampaignEffectiveness(DateTime FromDate, DateTime ToDate);
        Task<MailDashboadEngagement?> GetMailDashboadEngagement(DateTime FromDate, DateTime ToDate);
        Task<MailDashboardDelivery?> GetMailDashboardDelivery(DateTime FromDate, DateTime ToDate);
        Task<List<MailPerformanceOverTime>> GetMailPerformanceOverTime(DateTime FromDate, DateTime ToDate);
    }
}
