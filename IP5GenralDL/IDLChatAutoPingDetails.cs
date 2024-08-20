using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLChatAutoPingDetails : IDisposable
    {
        Task<Int32> Save(ChatAutoPingDetails AutoPingDetails);
    }
}
