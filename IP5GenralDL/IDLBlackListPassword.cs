using P5GenralML;

namespace P5GenralDL
{
    public interface IDLBlackListPassword:IDisposable
    {
        Task<List<BlackListPassword>> GetBlackListNameExists();
    }
}