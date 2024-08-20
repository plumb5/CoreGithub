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
    public class DLManageThersholdCreditsPG : CommonDataBaseInteraction, IDLManageThersholdCredits
    {
        CommonInfo connection;
        public DLManageThersholdCreditsPG()
        {
            connection = GetDBConnection();
        }

        public DLManageThersholdCreditsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> SaveDetails(ManageThersholdCredits thershold)
        {
            string storeProcCommand = "select managethersholdcredits_details_save(@AccountId, @UserId, @ConsumableType, @ProviderName, @ThresholdCredit, @IsEmailNotification)";
            object? param = new{ thershold.AccountId, thershold.UserId, thershold.ConsumableType, thershold.ProviderName, thershold.ThresholdCredit, thershold.IsEmailNotification };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<IEnumerable<ManageThersholdCredits>> GetDetails(ManageThersholdCredits thershold)
        {
            string storeProcCommand = "select * from managethersholdcredits_details_getdetails(@AccountId)"; 
            object? param = new{ thershold.AccountId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<ManageThersholdCredits>(storeProcCommand, param);
        }

        public async Task<bool> Delete(int Id, int accountId)
        {
            string storeProcCommand = "select managethersholdcredits_details_delete(@Id, @accountId )"; 
            object? param = new{ Id, accountId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
        }

        public async Task<IEnumerable<ManageThersholdCredits>> GetThersholdDetails(ManageThersholdCredits thershold)
        {
            string storeProcCommand = "select * from managethersholdcredits_details_getthersholddetails(@AccountId)"; 
            object? param = new{ thershold.AccountId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<ManageThersholdCredits>(storeProcCommand, param);
        }

        public async Task<bool> UpdateLastInteractionDate(int Id, int accountId)
        {
            string storeProcCommand = "select managethersholdcredits_details_updatelastinteractiondate(@Id, @accountId)"; 
            object? param = new{ Id, accountId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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
