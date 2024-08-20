using P5GenralML;

namespace P5GenralDL
{
    public interface IDLContactHistory
    {
        Task<List<ContactHistory>> GetContactDeleteHistory(List<int> contactIdList);
    }
}