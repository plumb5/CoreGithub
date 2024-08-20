using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWorkFlowSmsBulkSentInitiation
    {
        Task<List<WorkFlowSmsBulkSentInitiation>> GetSentInitiation();
        Task<bool> UpdateSentInitiation(WorkFlowSmsBulkSentInitiation BulkSentInitiation);
        Task<bool> ResetInitiation();
        Task<int> Save(WorkFlowSmsBulkSentInitiation BulkSentInitiation);
    }
}
