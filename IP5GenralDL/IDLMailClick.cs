using P5GenralML;

namespace P5GenralDL
{
    public interface IDLMailClick:IDisposable
    {
        Task<List<MailClick>> GetMailClick(IEnumerable<string> p5MailUniqueID);
        Task<int> Save(MailClick mailClick);
    }
}