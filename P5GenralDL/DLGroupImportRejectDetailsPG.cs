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
    public class DLGroupImportRejectDetailsPG : CommonDataBaseInteraction, IDLGroupImportRejectDetails
    {
        readonly CommonInfo connection;

        public DLGroupImportRejectDetailsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLGroupImportRejectDetailsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(GroupImportRejectDetails GroupImportRejectDetails)
        {
            string storeProcCommand = "select group_importrejectdetails_save(@GroupImportOverviewId, @ContactImportOverviewId, @GroupId, @EmailId, @PhoneNumber, @FileRowNumber, @RejectedReason, @RejectionType)";
            object? param = new { GroupImportRejectDetails.GroupImportOverviewId, GroupImportRejectDetails.ContactImportOverviewId, GroupImportRejectDetails.GroupId, GroupImportRejectDetails.EmailId, GroupImportRejectDetails.PhoneNumber, GroupImportRejectDetails.FileRowNumber, GroupImportRejectDetails.RejectedReason, GroupImportRejectDetails.RejectionType };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<GroupImportRejectDetails?> Get(GroupImportRejectDetails GroupImportRejectDetails)
        {
            string storeProcCommand = "select * from group_importrejectdetails_get(@GroupImportOverviewId, @ContactImportOverviewId, @GroupId)";
            object? param = new { GroupImportRejectDetails.GroupImportOverviewId, GroupImportRejectDetails.ContactImportOverviewId, GroupImportRejectDetails.GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<GroupImportRejectDetails?>(storeProcCommand, param);
        }

        public async Task<List<GroupImportRejectDetails>> GetList(GroupImportRejectDetails GroupImportRejectDetails, DateTime? FromDateTime = null, DateTime? ToDateTime = null)
        {
            string storeProcCommand = "select * from group_importrejectdetails_getlist(@GroupImportOverviewId, @ContactImportOverviewId, @GroupId, @RejectionType, @FromDateTime, @ToDateTime)";
            object? param = new { GroupImportRejectDetails.GroupImportOverviewId, GroupImportRejectDetails.ContactImportOverviewId, GroupImportRejectDetails.GroupId, GroupImportRejectDetails.RejectionType, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<GroupImportRejectDetails>(storeProcCommand, param)).ToList();
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
