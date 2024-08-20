using P5GenralML;

namespace P5GenralDL
{
    public interface IDLWhatsAppConfigurationName:IDisposable
    {
        Task<List<MLWhatsAppConfigurationName>> GetConfigurationNames();
        Task<List<MLWhatsAppConfigurationName>> GetConfigurationNamesList();
    }
}