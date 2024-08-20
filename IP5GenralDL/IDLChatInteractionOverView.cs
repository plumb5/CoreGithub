using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLChatInteractionOverView : IDisposable
    {
        Task<Int32> Save(ChatInteractionOverView chatOverView);
        Task<bool> Update(ChatInteractionOverView chatOverView);
        Task<List<ChatInteractionOverView>> GetList(ChatInteractionOverView chatOverView, DateTime FromDateTime, DateTime ToDateTime);
        Task<List<MLChatInteractionOverView>> GetImpressionList(ChatInteractionOverView chatOverView, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext);
    }
}
