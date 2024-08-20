using P5GenralML;

namespace P5GenralDL
{
    public interface IDLEmailNotificationViaContactImport
    {
        Task<List<EmailNotificationViaContactImport>> GetList(EmailNotificationViaContactImport emailNotificationViaContactImport);
    }
}