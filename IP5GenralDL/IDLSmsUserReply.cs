using P5GenralML;

namespace P5GenralDL
{
    public interface IDLSmsUserReply : IDisposable
    {
        Task<int> Save(SmsUserReply UserReply);
    }
}