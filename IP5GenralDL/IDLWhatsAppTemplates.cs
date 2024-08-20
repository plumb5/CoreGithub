using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWhatsAppTemplates : IDisposable
    {
        Task<int> GetMaxCount(WhatsAppTemplates whatsAppTemplate);
        Task<List<MLWhatsAppTemplates>> GetList(WhatsAppTemplates whatsAppTemplate, int OffSet, int FetchNext);
        Task<Int32> Save(WhatsAppTemplates whatsAppTemplate);
        Task<List<WhatsAppTemplates>> GetAllTemplate(int UserInfoUserId = 0, List<int> UserInfoUserIdList = null, int? IsSuperAdmin = null);
        Task<List<WhatsAppTemplates>> GetAllTemplate(IEnumerable<int> TemplateList);
        Task<List<WhatsAppTemplates>> GetTemplateDetails(WhatsAppTemplates whatsappTemplate, int OffSet = 0, int FetchNext = 0);
        Task<WhatsAppTemplates?> GetSingle(int Id);
        Task<bool> Update(WhatsAppTemplates whatsAppTemplate);
        Task<bool> Delete(int Id);
        Task<WhatsAppTemplates?> GetDetails(int WhatsAppTemplateId);
        Task<WhatsAppTemplates?> GetTemplateArchive(string Name);
        Task<bool> UpdateTemplateStatus(int TemplateId);
        Task<int> GetArchiveMaxCount(WhatsAppTemplates whatsAppTemplate);
        Task<List<MLWhatsAppTemplates>> GetArchiveReport(WhatsAppTemplates whatsAppTemplate, int OffSet, int FetchNext);
        Task<bool> UnArchive(int Id);
    }
}
