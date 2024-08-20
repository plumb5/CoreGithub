using P5GenralML;

namespace P5GenralDL
{
    public interface IDLMailDripForMails : IDisposable
    {
        Task<List<MLMailDripForMails>> GetReport(int MailSendingSettingId);
    }
}