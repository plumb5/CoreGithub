using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLAdminMasterCredit:IDisposable
    {
        Task<Int32> SaveDetails(AdminMasterCredit masterCredit);
        Task<bool> UpdateCreditConsumed(AdminMasterCredit masterCredit);
        Task<List<AdminMasterCredit>> SelectMasterCredit(AdminMasterCredit masterCredit);
        Task<List<MLAdminMasterCredit>> GetFeatureWiseMaxCount();
    }
}
