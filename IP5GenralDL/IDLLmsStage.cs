using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLLmsStage : IDisposable
    {
        Task<Int16> Save(LmsStage lmsStage);
        Task<bool> Update(LmsStage lmsStage);
        Task<List<LmsStage>> GetAllList(int? Score = null);
        Task<bool> Delete(int Id);


    }
}
