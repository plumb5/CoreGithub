using P5GenralML;

namespace P5GenralDL
{
    public interface IDLContactImportError:IDisposable
    {
        Task<List<ContactImportError>> GetList(int ContactImportOverviewId, int OffSet = -1, int FetchNext = 0);
        Task<int> GetMaxCount(int ContactImportOverviewId);
        Task<int> Save(ContactImportError contactError);
    }
}