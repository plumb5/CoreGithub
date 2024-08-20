using P5GenralML;

namespace P5GenralDL
{
    public interface IDLMailConfigForSending : IDisposable
    {
        Task<bool> ChangeEditableStatus(MailConfigForSending verifyfromEmailId);
        Task<bool> Delete(int Id);
        Task<List<MailConfigForSending>> GetActiveEmails();
        Task<MailConfigForSending?> GetActiveFromEmailId();
        Task<List<MailConfigForSending>> GetFromEmailIdToBind();
        Task<bool> MakeEmailIdActive(int Id);
        Task<int> MaxCount();
        Task<short> Save(MailConfigForSending verifyfromEmailId);
    }
}