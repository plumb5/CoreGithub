using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLPurchasePG : CommonDataBaseInteraction, IDLPurchase
    {
        CommonInfo connection;
        public DLPurchasePG()
        {
            connection = GetDBConnection();
        }

        public async Task<int> SaveDetails(Purchase purchase)
        {
            string storeProcCommand = "select purchase_details_save(@UserInfoUserId, @FeatureId, @Allocated, @ExpiryDate, @AccountId)";
            object? param = new { purchase.UserInfoUserId, purchase.FeatureId, purchase.Allocated, purchase.ExpiryDate, purchase.AccountId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }


        public async Task<List<Purchase>> GetDetail(int UserInfoUserId)
        {
            string storeProcCommand = "select * from purchase_details_get(@UserInfoUserId)";
            object? param = new { UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Purchase>(storeProcCommand, param)).ToList();
        }

        public async Task<Purchase?> Get(int AdsId, int UserInfoUserId, int FeatureId)
        {
            string storeProcCommand = "select * from purchase_details_getdetails(@AdsId, @UserInfoUserId, @FeatureId)";
            object? param = new { AdsId, UserInfoUserId, FeatureId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<Purchase?>(storeProcCommand, param);
        }

        public async Task<bool> Delete(int AdsId, int UserInfoUserId, int FeatureId)
        {
            string storeProcCommand = "select purchase_details_delete(@AdsId, @UserInfoUserId, @FeatureId)";
            object? param = new { AdsId, UserInfoUserId, FeatureId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> DeletePurchaseDetailsByAccountId(int AccountId)
        {
            string storeProcCommand = "select purchase_details_deletepurchasedetailsbyaccountid(@AccountId)";
            object? param = new { AccountId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task UpatedDailyConsumption(int AccountId, int MainUserInfoUserId, DateTime YesterdayDateTime)
        {
            string storeProcCommand = "select purchase_details_upateddailyconsumption(@AccountId, @MainUserInfoUserId, @YesterdayDateTime)";
            object? param = new { AccountId, MainUserInfoUserId, YesterdayDateTime };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<MLPurchaseConsumption?> GetDailyConsumptionedDetails(int AccountId, int MainUserId)
        {
            string storeProcCommand = "select * from purchase_details_getdailyconsumptioneddetails(@AccountId, @MainUserId)";
            object? param = new { AccountId, MainUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLPurchaseConsumption?>(storeProcCommand, param);
        }

        public async Task<bool> UpdateFeatureStatus(int AccountId, int FeatureId, bool FeatureStatus)
        {
            string storeProcCommand = "select purchase_details_updatefeaturestatus(@AccountId, @FeatureId, @FeatureStatus)";
            object? param = new { AccountId, FeatureId, FeatureStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<List<Purchase>> GetDetailByAccountId(int AccountId)
        {
            string storeProcCommand = "select * from purchase_details_getdetailbyaccountid(@AccountId)";
            object? param = new { AccountId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Purchase>(storeProcCommand, param)).ToList();
        }
        public async Task<MLPurchaseCredit?>  GetDailyConsumptionDetails(int AccountId, int MainUserId, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from purchase_details_getdailyconsumptiondetails(@AccountId, @MainUserId, @OffSet, @FetchNext)";
            object? param = new { AccountId, MainUserId, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLPurchaseCredit?>(storeProcCommand, param);
        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    connection = null;
                }
            }
            //dispose unmanaged ressources
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
