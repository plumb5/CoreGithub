using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWebPushSubscriptionSetting : IDisposable
    {
        Task<int> Save(WebPushSubscriptionSetting WebPushSetting);
        Task<bool> Update(WebPushSubscriptionSetting WebPushSetting);
        Task<bool> Delete(int Id);
        Task<WebPushSubscriptionSetting?> Get();
    }
}
