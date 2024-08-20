using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWebPushTemplate : IDisposable
    {
        Task<Int32> Save(WebPushTemplate webpushTemplate);
        Task<bool> Update(WebPushTemplate webpushTemplate);
        Task<int> GetMaxCount(WebPushTemplate webpushTemplate);
        Task<int> GetArchiveMaxCount(WebPushTemplate webpushTemplate);
        Task<List<WebPushTemplate>> GetAllTemplates(WebPushTemplate webpushTemplate, int OffSet = -1, int FetchNext = 0);
        Task<List<WebPushTemplate>> GetAllArchiveTemplates(WebPushTemplate webpushTemplate, int OffSet = -1, int FetchNext = 0);
        Task<WebPushTemplate?> GetDetails(WebPushTemplate webpushTemplate);
        Task<WebPushTemplate?> GetDetailsByName(string Name);
        Task<WebPushTemplate?> GetArchiveTemplate(string Name);
        Task<bool> UpdateArchiveStatus(int Id);
        Task<bool> Delete(int Id);
        Task<bool> RestoreTemplate(int Id);
        WebPushTemplate? GetDetailsSync(WebPushTemplate webpushTemplate);
    }
}
