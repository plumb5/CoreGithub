using P5GenralML;

namespace P5GenralDL
{
    public interface IDLGoogleContacts
    {
        Task<List<GoogleContact>> GetContacts(int GoogleImportSettingsId, int GroupId, int Offset, int FetchNext);
        Task<int> GetContactsCount(int GroupId);
    }
}