using P5GenralML;

namespace P5GenralDL
{
    public interface IDLCartDetails
    {
        Task<List<CartDetails>> Get(string TxId);
        Task<Int32> SaveDetails(CartDetails cartDetails);
    }
}