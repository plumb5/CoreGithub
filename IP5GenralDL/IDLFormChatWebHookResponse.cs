using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLFormChatWebHookResponse:IDisposable
    {
        Task<int> MaxCount(int formOrChatId, string callingSource, string webhookids = null);
        Task<List<WebHookTracker>> GetDetails(int formOrChatId, string callingSource, int OffSet, int FetchNext, string webhookids = null);
    }
}
