using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLCustomDashboardMailAlert
    {
        Task<MLCustomDashboardMailAlert?> GetAllMailAlerts(DateTime FromDate, DateTime ToDate);
        Task<MLCustomDashboardMailAlertNew?> GetAllMailAlertsNew(DateTime FromDate, DateTime ToDate);
    }
}
