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
    public class DLMailBouncedContactsPG : CommonDataBaseInteraction, IDLMailBouncedContacts
    {
        CommonInfo connection;
        public DLMailBouncedContactsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailBouncedContactsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(MailBouncedContact bounceDetails)
        {
            string storeProcCommand = "select mail_bouncedcontact_save(@Emailid, @Category, @ReasonForBounce, @Errorcode, @BounceDate, @BounceType)";
            object? param = new { bounceDetails.Emailid, bounceDetails.Category, bounceDetails.ReasonForBounce, bounceDetails.Errorcode, bounceDetails.BounceDate, bounceDetails.BounceType };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "select mail_bouncedcontact_delete()";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<List<MLMailBouncedContact>> GetBouncedContacts(MLMailBouncedContact bouncedDetails, int OffSet, int FetchNext, int GroupId)
        {
            string storeProcCommand = "select * from mail_bouncedcontact_getbouncedcontacts(@BounceType, @Category, @ReasonForBounce, @OffSet, @FetchNext, @GroupId)";
            object? param = new { bouncedDetails.BounceType, bouncedDetails.Category, bouncedDetails.ReasonForBounce, OffSet, FetchNext, GroupId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailBouncedContact>(storeProcCommand, param)).ToList();
        }

        public async Task<int> GetMaxCount(MLMailBouncedContact bouncedDetails, int GroupId)
        {
            string storeProcCommand = "select mail_bouncedcontact_bouncedcount(@BounceType, @Category, @ReasonForBounce, @GroupId)";
            object? param = new { bouncedDetails.BounceType, bouncedDetails.Category, bouncedDetails.ReasonForBounce, GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<List<MLMailBouncedCategory>> GetBouncedCategory(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select * from mail_bouncedcontact_getmailbouncedbycategory(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailBouncedCategory>(storeProcCommand, param)).ToList();
        }

        public async Task<DataSet> GetMailEmailsOpenHourOfDay(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select * from mail_dashboard_getmailemailsopenhourofday(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
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
