using P5GenralML;

namespace P5GenralDL
{
    public interface IDLContactGroup
    {
        Task<bool> ImportAndAddToGroup(MLContactGroup contactWithGroup);
        Task<int> ImportContact(MLContactGroup contactWithGroup);
        Task<bool> UpdateOnlyNameEmailPhone(MLContactGroup contact);
    }
}