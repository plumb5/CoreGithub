using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLChatExtraLinks : IDisposable
    {
        Task<Int16> Save(ChatExtraLinks ChatExtraLinks);
        Task<bool> Update(ChatExtraLinks ChatExtraLinks);
        Task<bool> Delete(Int16 Id);
        Task<List<ChatExtraLinks>> GET(bool? ToogleStatus = null);
        Task<bool> ToogleStatus(ChatExtraLinks ChatExtraLinks);
    }
}
