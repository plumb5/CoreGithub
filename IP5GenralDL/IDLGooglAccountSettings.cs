using P5GenralML;

namespace P5GenralDL
{
    public interface IDLGooglAccountSettings:IDisposable
    {
        Task<int> ChangeStatusadwords(int Id, bool Status);
        Task<bool> Delete(int Id);
        Task<GooglAccountSettings?> Get(int Id);
        Task<List<GooglAccountSettings>> GetDetails(int Id);
        Task<int> Save(GooglAccountSettings googlAccountsettings);
        Task<bool> Update(GooglAccountSettings googlAccountsettings);
    }
}