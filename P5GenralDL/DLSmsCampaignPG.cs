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
    public class DLSmsCampaignPG : CommonDataBaseInteraction, IDLSmsCampaign
    {
        CommonInfo connection;

        public DLSmsCampaignPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsCampaignPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(SmsCampaign smsCampaign)
        {
            string storeProcCommand = "select * from Sms_Campaign(@Action,@Name, @UserInfoUserId, @UserGroupId)";
            object? param = new { Action = "Save", smsCampaign.Name, smsCampaign.UserInfoUserId, smsCampaign.UserGroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<bool> Update(SmsCampaign smsCampaign)
        {
            string storeProcCommand = "select * from Sms_Campaign(@Action,@Name,@Id)";
            object? param = new { Action = "Update", smsCampaign.Name, smsCampaign.Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "select * from Sms_Campaign(@Action,@Id)";
            object? param = new { Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;


        }

        public async Task<List<SmsCampaign>> GetDetails(SmsCampaign smsCampaign, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from Sms_Campaign(@Action,@OffSet, @FetchNext,@Name)";
            object? param = new { Action = "GET", OffSet, FetchNext, smsCampaign.Name };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsCampaign>(storeProcCommand, param)).ToList();

        }

        public async Task<SmsCampaign?> GetDetail(SmsCampaign smsCampaign)
        {
            string storeProcCommand = "select * from smsCampaign(@Action,@Id,@Name)";
            object? param = new { Action = "GET", smsCampaign.Id, smsCampaign.Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsCampaign>(storeProcCommand, param);

        }

        public async Task<List<SmsCampaign>> GetCustomisedCampaignDetails(IEnumerable<int> ListOfId, List<string> fieldName = null)
        {
            string storeProcCommand = "select * from Sms_Campaign(@Action,@fieldName)";
            object? param = new { Action = "GET", ListOfId = string.Join(",", new List<int>(ListOfId).ToArray()), fieldName = fieldName != null ? string.Join(",", fieldName.ToArray()) : null };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsCampaign>(storeProcCommand, param)).ToList();

        }
        public async Task<int> MaxCount(SmsCampaign smsCampaign)
        {
            string storeProcCommand = "select * from Sms_Campaign(@Action,@Name)";
            object? param = new { Action = "MaxCount", smsCampaign.Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

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
