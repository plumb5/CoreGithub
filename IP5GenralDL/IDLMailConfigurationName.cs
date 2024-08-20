using P5GenralML;

namespace P5GenralDL
{
    public interface IDLMailConfigurationName : IDisposable
    {
        Task<List<MLMailConfigurationName>> GetConfigurationNames();
        Task<List<MLMailConfigurationName>> GetConfigurationNamesList();
    }
}