using Newtonsoft.Json;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLChatRule:IDisposable
    {
        Task<bool> Save(ChatRule rulesData);
        Task<ChatRule?> Get(int ChatId);
        Task<ChatRule?> GetRawRules(int ChatId);
    }
}
