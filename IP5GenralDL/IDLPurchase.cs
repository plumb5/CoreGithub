using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLPurchase : IDisposable
    {
        Task<int> SaveDetails(Purchase purchase);
        Task<List<Purchase>> GetDetail(int UserInfoUserId);
        Task<Purchase?> Get(int AdsId, int UserInfoUserId, int FeatureId);
        Task<bool> Delete(int AdsId, int UserInfoUserId, int FeatureId);
        Task<bool> DeletePurchaseDetailsByAccountId(int AccountId);
        Task UpatedDailyConsumption(int AccountId, int MainUserInfoUserId, DateTime YesterdayDateTime);
        Task<MLPurchaseConsumption?> GetDailyConsumptionedDetails(int AccountId, int MainUserId);
        Task<bool> UpdateFeatureStatus(int AccountId, int FeatureId, bool FeatureStatus);
        Task<List<Purchase>> GetDetailByAccountId(int AccountId);
        Task<MLPurchaseCredit?> GetDailyConsumptionDetails(int AccountId, int MainUserId, int OffSet, int FetchNext);
    }
}
