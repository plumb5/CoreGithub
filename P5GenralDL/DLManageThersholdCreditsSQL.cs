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
    public class DLManageThersholdCreditsSQL : CommonDataBaseInteraction, IDLManageThersholdCredits
    {
        CommonInfo connection;
        public DLManageThersholdCreditsSQL()
        {
            connection = GetDBConnection();
        }

        public DLManageThersholdCreditsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> SaveDetails(ManageThersholdCredits thershold)
        {
            string storeProcCommand = "ManageThersholdCredits_Details";
            object? param = new { Action= "Save", thershold.AccountId, thershold.UserId, thershold.ConsumableType, thershold.ProviderName, thershold.ThresholdCredit, thershold.IsEmailNotification };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<ManageThersholdCredits>> GetDetails(ManageThersholdCredits thershold)
        {
            string storeProcCommand = "ManageThersholdCredits_Details"; 
            object? param = new { Action = "GetDetails", thershold.AccountId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<ManageThersholdCredits>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Delete(int Id, int accountId)
        {
            string storeProcCommand = "ManageThersholdCredits_Details"; 
            object? param = new { Action = "Delete", Id, accountId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<IEnumerable<ManageThersholdCredits>> GetThersholdDetails(ManageThersholdCredits thershold)
        {
            string storeProcCommand = "ManageThersholdCredits_Details";
            object? param = new { Action = "GetThersholdDetails", thershold.AccountId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<ManageThersholdCredits>(storeProcCommand, param, commandType: CommandType.StoredProcedure); 
        }

        public async Task<bool> UpdateLastInteractionDate(int Id, int accountId)
        {
            string storeProcCommand = "ManageThersholdCredits_Details";
            object? param = new { Action = "UpdateLastInteractionDate", Id, accountId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)> 0;
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
