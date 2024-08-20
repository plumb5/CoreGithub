using P5GenralML;

namespace P5GenralDL
{
    public interface IDLGoogleImportSettings:IDisposable
    {
        Task<int> ChangeStatusadwords(int Id);
        Task<int> Delete(int Id);
        Task<List<GoogleImportSettings>> GetCount(bool IsRecurring);
        Task<GoogleImportSettings?> GetDetails(int googleimportsettingsid, bool IsRecurring);
        Task<List<GoogleImportSettings>> GetOverviewDetails(DateTime fromDateTime, DateTime toDateTime, int OffSet, int FetchNext, string Groupname);
        Task<GoogleImportSettings?> GetRunningDetails(bool IsRecurring);
        Task<int> MaxCount(DateTime fromDateTime, DateTime toDateTime, string Groupname);
        Task<int> Save(GoogleImportSettings googleimportsettings);
        Task<int> Update(GoogleImportSettings googleimportsettings);
        Task<bool> UpdateRecurringStatus(bool IsRecurring);
        Task<bool> UpdateStatus(GoogleImportSettings googleImportSettingss);
    }
}