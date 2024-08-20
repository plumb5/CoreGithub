using P5GenralML;

namespace P5GenralDL
{
    public interface IDLGoogleAdWordsImportData : IDisposable
    {
        Task<int> ChangeStatusadwords(int Id);
        Task<bool> DeleteadwordsData(int Id);
        Task<List<GoogleAdWordsImportData>> GetDetails();
        Task<GoogleAdWordsImportData?> GetDetailsAsync(int Id);
        Task<int> Save(GoogleAdWordsImportData GoogleAdwords);
        Task<bool> Update(GoogleAdWordsImportData GoogleAdwords);
    }
}