using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLChatLoadCloseResponseCount
    {
        Task<int> SaveUpdateForImpression(int ChatId);
        void UpdateFormClose(int ChatId);
    }
}
