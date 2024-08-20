using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMobilePushTemplate
    {
        Task<int> Save(MobilePushTemplate mobilePushTemplate);
        Task<bool> Update(MobilePushTemplate mobilePushTemplate);
        Task<MobilePushTemplate> GetDetailsByName(string TemplateName);
        Task<MobilePushTemplate> GetArchiveTemplate(string TemplateName);
        Task<bool> UpdateArchiveStatus(int Id);
        Task<int> GetMaxCount(MobilePushTemplate mobilepushTemplate);
        Task<List<MobilePushTemplate>> GetAllTemplates(MobilePushTemplate mobilepushTemplate, int OffSet = 0, int FetchNext = 0);
        Task<MobilePushTemplate?> GetDetails(MobilePushTemplate mobilepushTemplate);
        Task<bool> Delete(int Id);
    }
}
