using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLIntegrationStatus:IDisposable
    {
        Task<int> GetWebTracking();
        Task<int> GetEventTracking();
        Task<int> GetEmailSetup();
        Task<int> GetSiteSearch();
        Task<int> GetEmailVerification();
        Task<int> GetSpamTester();
        Task<int> GetSmsSetup();
        Task<WebPushSubscriptionSetting?> GetWebPushTracking();
        Task<int> GetMobileSdkTracking();
        Task<int> GetClickToCallSetup();
        Task<int> GetWhatsAppSetup();
    }
}
