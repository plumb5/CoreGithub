using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLLeadScoreDecaySetting:IDisposable
    {
        Task<IEnumerable<LeadScoreDecaySetting>> GetList();
        void UpdateLeadScoreBasedOnActivity(LeadScoreDecaySetting decaySetting, DateTime FromDateTime, DateTime ToDateTime);
        Task<Int32> Save(LeadScoreDecaySetting decaySetting);
        Task<bool> Delete();
    }
}
