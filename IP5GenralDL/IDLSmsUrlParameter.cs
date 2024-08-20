using P5GenralML;

namespace P5GenralDL
{
    public interface IDLSmsUrlParameter : IDisposable
    {
        Task<string> Get(long SmsUrlParameterId);
        Task<long> Save(SmsUrlParameter smsUrlParameter);
    }
}