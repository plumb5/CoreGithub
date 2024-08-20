using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLChatSetting:IDisposable
    {
        Task<Int16> Save(ChatSetting ChatSetting);
        Task<ChatSetting?> GET();
    }
}
