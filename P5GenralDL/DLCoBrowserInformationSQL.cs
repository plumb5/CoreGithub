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
    public class DLCoBrowserInformationSQL : CommonDataBaseInteraction, IDLCoBrowserInformation
    {
        CommonInfo connection;
        public DLCoBrowserInformationSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLCoBrowserInformationSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(CoBrowserInformation coBrowserInformation)
        {
            string storeProcCommand = "CoBrowser_Information";

            object? param = new
            {
                Action = "Save",
                coBrowserInformation.CustomerName,
                coBrowserInformation.CustomerPhone,
                coBrowserInformation.SessionId,
                coBrowserInformation.RequestDate,
                coBrowserInformation.CoBrowserLink,
                coBrowserInformation.UserInfoUserId,
                coBrowserInformation.LastAssignedUserInfoUserId,
                coBrowserInformation.IsNewUserAssigned,
                coBrowserInformation.VendorStatusCode,
                coBrowserInformation.VendorStatusDescription
            };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<CoBrowserInformation?> GetLastAssignedUserDetails()
        {
            string storeProcCommand = "CoBrowser_Information)";
            object? param = new { Action = "GetLastAssignedUser" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<CoBrowserInformation?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<CoBrowserInformation?> GetCoBrowserInformation(int UserId)
        {
            string storeProcCommand = "CoBrowser_Information";
            object? param = new { Action= "GetUserCoBrowserInfo", UserId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<CoBrowserInformation?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
