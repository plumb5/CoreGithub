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
    public class DLPurchaseSQL : CommonDataBaseInteraction, IDLPurchase
    {
        CommonInfo connection;
        public DLPurchaseSQL()
        {
            connection = GetDBConnection();
        }

        public async Task<int> SaveDetails(Purchase purchase)
        {
            string storeProcCommand = "Purchase_Details";
            object? param = new { Action = "Save", purchase.UserInfoUserId, purchase.FeatureId, purchase.Allocated, purchase.ExpiryDate, purchase.AccountId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }


        public async Task<List<Purchase>> GetDetail(int UserInfoUserId)
        {
            string storeProcCommand = "Purchase_Details";
            object? param = new { Action = "Get", UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Purchase>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<Purchase?> Get(int AdsId, int UserInfoUserId, int FeatureId)
        {
            string storeProcCommand = "Purchase_Details";
            object? param = new { Action = "GetDetails", AdsId, UserInfoUserId, FeatureId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<Purchase?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Delete(int AdsId, int UserInfoUserId, int FeatureId)
        {
            string storeProcCommand = "Purchase_Details";
            object? param = new { Action = "Delete", AdsId, UserInfoUserId, FeatureId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> DeletePurchaseDetailsByAccountId(int AccountId)
        {
            string storeProcCommand = "Purchase_Details";
            object? param = new { Action = "DeletePurchaseDetailsByAccountId", AccountId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task UpatedDailyConsumption(int AccountId, int MainUserInfoUserId, DateTime YesterdayDateTime)
        {
            string storeProcCommand = "Purchase_Details";
            object? param = new { Action = "UpatedDailyConsumption", AccountId, MainUserInfoUserId, YesterdayDateTime };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<MLPurchaseConsumption?> GetDailyConsumptionedDetails(int AccountId, int MainUserId)
        {
            string storeProcCommand = "Purchase_Details";
            object? param = new { Action = "GetDailyConsumptionedDetails", AccountId, MainUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLPurchaseConsumption?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateFeatureStatus(int AccountId, int FeatureId, bool FeatureStatus)
        {
            string storeProcCommand = "Purchase_Details";
            object? param = new { Action = "UpdateFeatureStatus", AccountId, FeatureId, FeatureStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<List<Purchase>> GetDetailByAccountId(int AccountId)
        {
            string storeProcCommand = "Purchase_Details";
            object? param = new { Action = "GetDetailByAccountId", AccountId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Purchase>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }
        public async Task<MLPurchaseCredit?> GetDailyConsumptionDetails(int AccountId, int MainUserId, int OffSet, int FetchNext)
        {
            string storeProcCommand = "Purchase_Details";
            object? param = new { Action = "GetDailyConsumptionDetails", AccountId, MainUserId, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLPurchaseCredit?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
