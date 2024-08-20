using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMainScript : IDisposable
    {
        Task<MainScript?> GetScriptBasedOnFileName(string FileName);
        Task<Int32> InsertScript(MainScript mainScript);
        Task<IEnumerable<MainScript>> GetScripts();
    }
}
