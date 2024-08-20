using P5GenralML;

namespace P5GenralDL
{
    public interface IDLGoogleImportJobsResponse:IDisposable
    {
        Task<List<GoogleImportJobsResponse?>> GetGoogleAdsResponses(int Googleimportsettingsid, DateTime fromDateTime, DateTime toDateTime, int OffSet, int FetchNext);
        Task<int> ResponsesMaxCount(int Googleimportsettingsid, DateTime fromDateTime, DateTime toDateTime);
        Task<int> Save(GoogleImportJobsResponse googleresponse);
        Task<int> Update(int Id, string status);
    }
}