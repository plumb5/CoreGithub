using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLChatEventDetails : IDisposable
    {
        Task Save(ChatEventDetails ChatEventDetails);
        Task<List<ChatEventDetails>> GetChatEventDetailsList(ChatEventDetails ChatEventDetails);
        Task<List<MLChatEventDetails>> GetOverView(string ChatUserId);
    }
}
