using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMobilePushSendingSetting : IDisposable
    {
        Task<Int32> Save(MobilePushSendingSetting mobilePushSendingSetting);
        Task<bool> Update(MobilePushSendingSetting mobilePushSendingSetting);
        Task<Int32> MaxCount(DateTime FromDate, DateTime ToDate, string Name = null);
        Task<List<MobilePushSendingSetting>> GetList(int OffSet, int FetchNext, DateTime FromDate, DateTime ToDate, string Name = null);
        Task<MobilePushSendingSetting?> GetDetail(int Id);
        Task<bool> Delete(int Id);
        Task<bool> CheckIdentifier(string IdentifierName);
    }
}
