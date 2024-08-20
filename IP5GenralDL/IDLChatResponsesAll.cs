using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLChatResponsesAll : IDisposable
    {
        Task<int> GetCountOfSelecCamp(int ChatId, string IpAddress, string SearchContent, int MinChatRepeatTime, int MaxChatRepeatTime, DateTime FromDateTime, DateTime ToDateTime);
        Task<List<ChatAllResponses>> AllChat(int ChatId, string IpAddress, string SearchContent, int MinChatRepeatTime, int MaxChatRepeatTime, int OffSet, int FetchNext, DateTime FromDateTime, DateTime ToDateTime);
        Task<List<ChatAllResponsesForExport>> GetAllChatToExport(int ChatId, string IpAddress, string SearchContent, int MinChatRepeatTime, int MaxChatRepeatTime, int OffSet, int FetchNext, DateTime FromDateTime, DateTime ToDateTime);
    }
}
