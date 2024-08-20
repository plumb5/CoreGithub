using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLSmsCampaignSQL : CommonDataBaseInteraction, IDLSmsCampaign
    {
        CommonInfo connection;

        public DLSmsCampaignSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsCampaignSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(SmsCampaign smsCampaign)
        {
            string storeProcCommand = "Sms_Campaign";
            object? param = new { Action="Save", smsCampaign.Name, smsCampaign.UserInfoUserId, smsCampaign.UserGroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> Update(SmsCampaign smsCampaign)
        {
            string storeProcCommand = "Sms_Campaign";
            object? param = new { Action = "Update", smsCampaign.Name, smsCampaign.Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "Sms_Campaign";
            object? param = new { Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<List<SmsCampaign>> GetDetails(SmsCampaign smsCampaign, int OffSet, int FetchNext)
        {
            string storeProcCommand = "Sms_Campaign";
            object? param = new { Action = "GET", OffSet, FetchNext, smsCampaign.Name };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsCampaign>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<SmsCampaign?> GetDetail(SmsCampaign smsCampaign)
        {
            string storeProcCommand = "Sms_Campaign";
            object? param = new { Action = "GET", smsCampaign.Id, smsCampaign.Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsCampaign>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<SmsCampaign>> GetCustomisedCampaignDetails(IEnumerable<int> ListOfId, List<string> fieldName)
        {
            string storeProcCommand = "Sms_Campaign";
            object? param = new { Action = "GET", ListOfId=string.Join(",", new List<int>(ListOfId).ToArray()), fieldName=fieldName != null ? string.Join(",", fieldName.ToArray()) : null };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsCampaign>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }
        public async Task<int> MaxCount(SmsCampaign smsCampaign)
        {
            string storeProcCommand = "Sms_Campaign";
            object? param = new { Action= "MaxCount", smsCampaign.Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        #region Dispose Method
        private bool _disposed = false;
        protected void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                _disposed = true;
                if (disposing)
                {

                }
            }
        }

        public void Dispose()
        {
            Dispose(true);
        }
        #endregion End of Dispose Method
    }
}
