using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLChatBannerSync : IDisposable
    {
        Task<int> Save(ChatBanner chatbanner);
        Task<bool> Update(ChatBanner chatbanner);
        Task<bool> Delete(int Id);
        Task<List<ChatBanner>> GetList(int OffSet, int FetchNext);
    }
}
