using P5GenralML;

namespace P5GenralDL
{
    public interface IDLCallApiConfiguration : IDisposable
    {
        Task<MLCallApiConfiguration> GetCallConfigurationDetails(string ProviderName = null);
        Task<Int16> Save(MLCallApiConfiguration callApiConfiguration);
        Task<bool> ToogleStatus(MLCallApiConfiguration callApiConfiguration);
        Task<bool> Update(MLCallApiConfiguration callApiConfiguration);
    }
}