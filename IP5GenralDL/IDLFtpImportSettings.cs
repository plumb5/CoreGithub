using P5GenralML;

namespace P5GenralDL
{
    public interface IDLFtpImportSettings : IDisposable
    {
        Task<bool> Delete(int Id);
        Task<List<FtpImportSettings>> GetDetails(int OffSet, int FetchNext);
        Task<List<FtpImportSettings>> GetDetailsList();
        FtpImportSettings? GetFtpImportSettingsDetails(int Id);
        Task<int> MaxCount();
        Task<int> Save(FtpImportSettings ftpImportSettings);
        Task<bool> Update(FtpImportSettings ftpImportSettings);
    }
}