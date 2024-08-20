using System.Data;

namespace P5GenralDL
{
    public interface IDLAutoContactValidation
    {
        Task<DataSet> GetAllAccountIds();
        Task<bool> Save(int AccountId, int GroupId);
        Task<bool> Delete(int AccountId, int GroupId);
    }
}