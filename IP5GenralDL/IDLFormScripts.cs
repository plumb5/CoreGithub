using P5GenralML;

namespace P5GenralDL
{
    public interface IDLFormScripts:IDisposable
    {
        Task<bool> Delete(int Id);
        Task<List<MLFormScripts>> Get(MLFormScripts formScripts, int OffSet, int FetchNext);
        Task<List<FormScripts>> GetBasedOnURL(FormScripts formScripts);
        Task<FormScripts?> GetDetail(FormScripts formScripts);
        Task<int> GetMaxCount(MLFormScripts formScripts);
        Task<int> Save(FormScripts formScripts);
        Task<bool> ToogleStatus(int Id, bool FormScriptStatus);
        Task<bool> Update(FormScripts formScripts);
        Task<bool> UpdateAlternateUrl(int FormId, string AlternatePageUrls);
    }
}