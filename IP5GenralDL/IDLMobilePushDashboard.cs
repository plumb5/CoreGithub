using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMobilePushDashboard : IDisposable
    {
        Task<MLMobilePushDashboard?> GetSubcribersDetails(DateTime FromDateTime, DateTime ToDateTime);
        Task<MLMobilePushDashboard?> GetCampaignDetails(DateTime FromDateTime, DateTime ToDateTime);
        Task<List<MLMobilePushDashboard>> GetNotificationDetails(DateTime FromDateTime, DateTime ToDateTime);
    }
}
