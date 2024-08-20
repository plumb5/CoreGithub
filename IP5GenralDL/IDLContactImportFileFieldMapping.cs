using P5GenralML;

namespace P5GenralDL
{
    public interface IDLContactImportFileFieldMapping :IDisposable
    {
        Task<int> Save(ContactImportFileFieldMapping importFileFieldMapping);
    }
}