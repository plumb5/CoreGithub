using P5GenralML;

namespace P5GenralDL
{
    public interface IDLWebHookDetails : IDisposable
    {
        Task<WebHookDetails?> GetWebHookDetails(int WebHookId);
        Task<int> Save(WebHookDetails webHookDetails);
        Task<bool> Update(WebHookDetails webHookDetails);
        Task<bool> Delete(int WebHookId);
    }
}