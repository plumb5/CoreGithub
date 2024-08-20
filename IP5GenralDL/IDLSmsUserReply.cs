using P5GenralML;

namespace P5GenralDL
{
    public interface IDLSmsUserReply
    {
        Task<int> Save(SmsUserReply UserReply);
    }
}