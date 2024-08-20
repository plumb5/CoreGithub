using P5GenralML;

namespace IP5GenralDL
{
    public interface IDLFormDashboard:IDisposable
    {
        Task<List<MLFormDashboardDetails>> GetTotalFormSubmissions(DateTime FromDateTime, DateTime ToDateTime);
        Task<List<MLFormDashboardDetails>> GetTopFivePerFormingForms(DateTime FromDateTime, DateTime ToDateTime);
        Task<MLFormDashboardDetails> GetPlatformDistribution(DateTime FromDateTime, DateTime ToDateTime);
        Task<MLFormDashboardDetails> GetAggregateFormsData(DateTime FromDateTime, DateTime ToDateTime);
        Task<int> GetMaxCount(DateTime FromDateTime, DateTime ToDateTime, string EmbeddedFormOrPopUpFormOrTaggedForm, int FormId);
        Task<List<MLFormDashboard>> GetFormByReport(int OffSet, int FetchNext, DateTime FromDateTime, DateTime ToDateTime, string EmbeddedFormOrPopUpFormOrTaggedForm, int FormId);
        Task<List<FormDetails>> GetFormDetailsByReport(DateTime FromDateTime, DateTime ToDateTime, string EmbeddedFormOrPopUpFormOrTaggedForm);
    }
}
