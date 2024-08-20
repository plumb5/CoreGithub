using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLChatInteraction
    {
        void InsertMessage(int chatId, string userId, string chatRoom, string message, string sessionRefer);

        Task<ChatVisitorDetails?> GetVisitorDetails(int chatId, string userId, string sessionRefer);

        Task<List<ChatFullTranscipt>> GetTodayMessage(int chatId, string userId);

        void UpdateDetails(int chatId, string userId, string userIdName, string name, string emailId, string message, string phoneNumber, string SessionRefeer);
    }
}
