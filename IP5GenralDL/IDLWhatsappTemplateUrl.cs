using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWhatsappTemplateUrl : IDisposable
    {
        Task<Int32> SaveWhatsappTemplateUrl(WhatsAppTemplateUrl TemplateUrls);
        Task<List<WhatsAppTemplateUrl>> GetDetail(int WhatsAppTemplateId);
        Task<WhatsAppTemplateUrl?> GetDetailByUrl(string Url);
        Task<int> GetUrlByIdUrl(int WhatsAppTemplatesId, string UrlContent);
        Task<bool> Update(WhatsAppTemplateUrl TemplateUrls);
        Task<string?> GetUrlAsync(int smsTemplateUrlId);
        Task<bool> Delete(WhatsAppTemplateUrl TemplateUrls);
    }
}
