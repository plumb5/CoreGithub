using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLSmsTemplate:IDisposable
    {
        Task<Int32> Save(SmsTemplate smsTemplate);
        Task<bool> Update(SmsTemplate smsTemplate);
        Task<IEnumerable<SmsTemplate>> GetTemplateDetails(SmsTemplate smsTemplate, int OffSet = -1, int FetchNext = 0);
        Task<IEnumerable<SmsTemplate>> GetArchiveTemplateDetails(SmsTemplate smsTemplate, int OffSet = -1, int FetchNext = 0);
        Task<bool> RestoreTemplate(int Id);
        Task<IEnumerable<SmsTemplate>> GetDetails(SmsTemplate smsTemplate);
        Task<IEnumerable<SmsTemplate>> GetAllTemplate(int UserInfoUserId = 0, List<int> UserInfoUserIdList = null, int? IsSuperAdmin = null);
        Task<SmsTemplate?> GetDetails(int SmsTemplateId);
        Task<SmsTemplate?> GetDetailsByName(string Name);
        Task<SmsTemplate?> GetTemplateArchive(string Name);
        Task<Int32> GetMaxCount(SmsTemplate smsTemplate);
        Task<Int32> GetArchiveMaxCount(SmsTemplate smsTemplate);
        Task<bool> Delete(int Id);
        Task<IEnumerable<SmsTemplate>> GetAllTemplate(IEnumerable<int> TemplateList);
        Task<bool> UpdateTemplateStatus(int TemplateId);
    }
}
