using P5GenralML;

namespace P5GenralDL
{
    public interface IDLGetData :IDisposable
    {
        Task<List<GetAccount>> GetDetails(DateTime dateFrom, DateTime dateTo);
    }
}