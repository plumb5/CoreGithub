using P5GenralML;

namespace P5GenralDL
{
    public interface IDLLmsCustomFields:IDisposable
    {
        Task<bool> Delete();
        Task<List<LmsCustomFields>> GetDetails();
        Task<List<MLContactFieldEditSetting>> GetMLIsPublisher();
        Task<List<MLContactFieldEditSetting>> GetMLIsSearchbyColumn();
        Task<List<LmsCustomFields>> GetPurgeSettings();
        Task SaveProperty(LmsCustomFields lmsCustomFields);
    }
}