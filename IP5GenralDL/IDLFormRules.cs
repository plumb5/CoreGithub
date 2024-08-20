using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLFormRules:IDisposable
    {
        Task<bool> Save(FormRules rulesData);
        Task<FormRules?> Get(int FormId);
        Task<FormRules?> GetRawRules(int FormId);

    }
}
