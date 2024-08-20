using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLRevenueMapping : IDisposable
    {
        Task<List<RevenueMapping>> GetSettingsFieldsName();
        Task<List<RevenueMapping>> Geteventfileds(int customeventoverviewid);
        Task<List<RevenueMapping>> GetSettingFieldNames();
        Task<List<RevenueMapping>> GetRevenueFiledsNameById(int customeventoverviewid);
        Task<List<RevenueMapping>> GetRevenueData();
        Task<List<RevenueMapping>> GeteventfiledsbyId(int customeventoverviewid);
        Task<Int32> Save(RevenueMapping RevenueMappingFields);
        Task<bool> Delete();
    }
}
