using P5GenralML;

namespace IP5GenralDL
{
    public interface IDLMailSpamScoreVerifySetting:IDisposable
    {
        Task<Int32> Save(MailSpamScoreVerifySetting setting);
        Task<bool> Update(MailSpamScoreVerifySetting setting);
        Task<List<MailSpamScoreVerifySetting>> GetList(string ProviderName = null);
        Task<MailSpamScoreVerifySetting?> GetActiveprovider();
        Task<bool> Delete(int Id);
    }
}
