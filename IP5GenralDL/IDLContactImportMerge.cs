using P5GenralML;

namespace P5GenralDL
{
    public interface IDLContactImportMerge:IDisposable
    {
        Task<List<ContactImportMerge>> GetList(int ContactImportOverviewId);
    }
}