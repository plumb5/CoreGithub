using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLChatBotResponseSetting : IDisposable
    {
        Task<int> Save(ChatBotResponseSetting responseSetting);
        Task<bool> Update(ChatBotResponseSetting responseSetting);
        Task<ChatBotResponseSetting?> GetDetails();
    }
}
