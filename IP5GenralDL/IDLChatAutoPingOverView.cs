using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLChatAutoPingOverView : IDisposable
    {
        Task<Int32> Save(ChatAutoPingOverView AutoPingOverView);
        Task<bool> Update(ChatAutoPingOverView AutoPingOverView);
        Task<List<ChatAutoPingOverView>> GetAutoPingOverViewList(ChatAutoPingOverView AutoPingOverView, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext);
    }
}
