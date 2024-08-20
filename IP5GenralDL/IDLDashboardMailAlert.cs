using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLDashboardMailAlert:IDisposable
    {
        Task<Int32> Save(DashboardMailAlert mailAlert);
        Task<DashboardMailAlert?> GetDetail(int Id);
        Task<bool> Delete(int Id);
        Task<IEnumerable<DashboardMailAlert>> GetAllMailAlerts();
        Task<bool> UpdateLastWeeklyTriggerDate(DashboardMailAlert mailAlert);
        Task<bool> UpdateLastFornightlyTriggerDate(DashboardMailAlert mailAlert);
        Task<bool> UpdateLastMonthlyTriggerDate(DashboardMailAlert mailAlert);
        Task<bool> UpdateLastQuarterlyTriggerDate(DashboardMailAlert mailAlert);
        Task<bool> UpdateLastDailyTriggerDate(DashboardMailAlert mailAlert);
    }
}
