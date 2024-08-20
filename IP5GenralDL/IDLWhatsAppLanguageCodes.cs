using P5GenralML;

namespace P5GenralDL
{
    public interface IDLWhatsAppLanguageCodes:IDisposable
    {
        Task<WhatsAppLanguageCodes?> GetWhatsAppShortenLanguageCode(string VendorName, string TemplateLanguage);
    }
}