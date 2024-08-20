using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLChatUser : IDisposable
    {
        Task<bool> Update(ChatUser chatuser);
        Task<int> GetMaxCount(ChatUser chatuser, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime);
        Task<List<ChatUser>> GetList(ChatUser chatuser, int OffSet, int FetchNext, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime);
        Task<ChatUser?> Get(ChatUser chatuser);
        void UpdateName(string userId, string name, int contactId = 0);
    }
}
