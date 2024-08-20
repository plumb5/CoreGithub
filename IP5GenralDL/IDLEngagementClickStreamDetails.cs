using P5GenralML;

namespace P5GenralDL
{
    public interface IDLEngagementClickStreamDetails : IDisposable
    {
        Task<List<MLEachCallerDetails>> EachCallerDetails(string PhoneNumber);
        Task<List<MLSmsSentEachDetails>> EachSmsSentDetails(string PhoneNumber);
        Task<List<string>> GetVisitorPageFlow(string MachineId, string SessionId);
    }
}