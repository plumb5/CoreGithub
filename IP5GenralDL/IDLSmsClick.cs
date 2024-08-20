using P5GenralML;

namespace P5GenralDL
{
    public interface IDLSmsClick:IDisposable
    {
        Task<List<SmsClick>> GetSmsClick(IEnumerable<string> p5SMSUniqueID);
        Task<int> Save(SmsClick mailClick);
      
    }
}