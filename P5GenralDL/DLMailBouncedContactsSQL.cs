using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace P5GenralDL
{
    public class DLMailBouncedContactsSQL : CommonDataBaseInteraction, IDLMailBouncedContacts
    {
        CommonInfo connection;
        public DLMailBouncedContactsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailBouncedContactsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(MailBouncedContact bounceDetails)
        {
            string storeProcCommand = "Mail_BouncedContact";
            object? param = new { Action = "Save", bounceDetails.Emailid, bounceDetails.Category, bounceDetails.ReasonForBounce, bounceDetails.Errorcode, bounceDetails.BounceDate, bounceDetails.BounceType };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "Mail_BouncedContact";
            object? param = new { Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<List<MLMailBouncedContact>> GetBouncedContacts(MLMailBouncedContact bouncedDetails, int OffSet, int FetchNext, int GroupId)
        {
            string storeProcCommand = "Mail_BouncedContact";
            object? param = new { Action = "GetBouncedContacts", bouncedDetails.BounceType, bouncedDetails.Category, bouncedDetails.ReasonForBounce, OffSet, FetchNext, GroupId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailBouncedContact>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<int> GetMaxCount(MLMailBouncedContact bouncedDetails, int GroupId)
        {
            string storeProcCommand = "Mail_BouncedContact";
            object? param = new { Action = "BouncedCount", bouncedDetails.BounceType, bouncedDetails.Category, bouncedDetails.ReasonForBounce, GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<MLMailBouncedCategory>> GetBouncedCategory(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Mail_BouncedContact";
            object? param = new { Action = "GetMailBouncedByCategory", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailBouncedCategory>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<DataSet> GetMailEmailsOpenHourOfDay(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Mail_Dashboard";
            object? param = new { Action = "GetMailEmailsOpenHourOfDay", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
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
