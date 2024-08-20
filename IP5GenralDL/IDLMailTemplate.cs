using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMailTemplate : IDisposable
    {
        Task<int> Save(MailTemplate mailTemplate);
        Task<List<MailTemplate>> GET(MailTemplate mailTemplate, int FetchNext, int OffSet, string ListOfMailTemplateId, List<string> fieldName);
        MailTemplate GETDetails(MailTemplate mailTemplate);
        Task<int> GetMaxCount(MailTemplate mailTemplate);
        Task<int> GetArchiveMaxCount(MailTemplate mailTemplate);
        Task<List<MLMailTemplate>> GetArchiveList(MailTemplate mailTemplate, int OffSet, int FetchNext);
        Task<bool> Delete(int Id);
        Task<bool> RestoreTemplate(int Id);
        Task<MailTemplate?> GetArchiveTemplate(string Name, bool IsBeeTemplate);
        Task<bool> UpdateArchiveStatus(int Id);
        Task<bool> UpdateSpamScore(MailTemplate mailTemplate);
        Task<List<MLMailTemplate>> GetAllTemplateList(IEnumerable<int> templatesIdList);
        Task<List<MLMailTemplate>> GetList(MailTemplate mailTemplate, int OffSet, int FetchNext);
        Task<bool> UpdateBasicDetails(MailTemplate mailTemplate);
        Task<List<MailTemplate>> GetAllTemplateList();
    }
}
