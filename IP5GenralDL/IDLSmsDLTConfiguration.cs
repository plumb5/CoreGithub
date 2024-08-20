using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLSmsDLTConfiguration : IDisposable
    {
        Task<SmsDLTConfiguration?> GetOperatorData(string OperatorName);
        Task<List<SmsDLTConfiguration>> GetList();
    }
}
