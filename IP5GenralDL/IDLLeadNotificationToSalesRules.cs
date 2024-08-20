using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLLeadNotificationToSalesRules:IDisposable
    {
        Task<IEnumerable<LeadNotificationToSalesRules>> GetLeadNotificationToSales(int Id = 0, bool? Status = null);
    }
}
