using P5GenralML;

namespace P5GenralDL
{
    public interface IDLEmailVerifyProviderSetting:IDisposable
    {
        Task<bool> Delete(int Id);
        Task<EmailVerifyProviderSetting?> GetActiveprovider();
        Task<List<EmailVerifyProviderSetting>> GetList(string ProviderName = null);
        Task<int> Save(EmailVerifyProviderSetting setting);
        Task<bool> Update(EmailVerifyProviderSetting setting);
    }
}