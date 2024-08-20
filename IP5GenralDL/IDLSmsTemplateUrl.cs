using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLSmsTemplateUrl : IDisposable
    {
        Task<Int32> SaveSmsTemplateUrl(SmsTemplateUrl smsTemplateUrls);
        Task<bool> Update(SmsTemplateUrl smsTemplateUrls);
        Task<IEnumerable<SmsTemplateUrl>> GetDetail(int SmsTemplateId);
        Task<IEnumerable<string>> GetUrl(int smsTemplateUrlId);
        Task<bool> Delete(SmsTemplateUrl TemplateUrls);
        Task<string?> GetUrlAsync(int smsTemplateUrlId);
        Task<SmsTemplateUrl?> GetDetailByUrl(string Url);

    }
}
