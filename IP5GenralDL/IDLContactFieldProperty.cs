using P5GenralML;

namespace P5GenralDL
{
    public interface IDLContactFieldProperty:IDisposable
    {
        Task<List<ContactFieldProperty>> GetAll();
        Task<List<ContactFieldProperty>> GetMasterFilterColumns();
        Task<List<ContactFieldProperty>> GetSelectedContactField();
        Task<int> Save(ContactFieldProperty contactFieldProperty);
    }
}