using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLShareReport:IDisposable
    {
        Task<object> Select_EmailId_AutoSuggest(MLShareReport mlObj);
    }
}
