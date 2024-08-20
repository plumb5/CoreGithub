using P5GenralML;

namespace P5GenralDL
{
    public interface IDLWebPushBulkInitiation
    {
        Task<List<WebPushBulkInitiation>> GetSentInitiation();
        Task<int> Save(WebPushBulkInitiation BulkSentInitiation);
        Task<bool> UpdateSentInitiation(WebPushBulkInitiation BulkSentInitiation);
    }
}