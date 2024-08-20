using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLCRMFilterCondition
    {
        Task<int> Save(CRMFilterCondition filterCondition);
        Task<bool> Update(CRMFilterCondition filterCondition);
        Task<CRMFilterCondition?> GetFilterReportById(int Id);
        Task<List<CRMFilterCondition>> GetAllFilterCondition();
    }
}
