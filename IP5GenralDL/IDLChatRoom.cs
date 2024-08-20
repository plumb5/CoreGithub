using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLChatRoom : IDisposable
    {
        Task<List<ChatFullTranscipt>> GetTranscriptAdmin(int chatId, string UserId);
        Task<int> BlockParticularUser(int chatId, string ChatUserId, int UserId);
        Task<MLChatRoom?> GetAgentData(MLChatRoom chatRoom);
        Task<bool> CityAndNames(MLChatRoom chatRoom);
        Task<bool> DesktopNotification(MLChatRoom chatRoom);
        Task<bool> SoundNotify(MLChatRoom chatRoom);
        Task<int> UpdateNote(int chatId, string UserId, string comments);
        Task<int> UpdateContactId(string UserId, int ContactId, string UtmTagSource = null);
        Task<List<ChatFullTranscipt>> GetPastChat(int chatId, string UserId);
    }
}
