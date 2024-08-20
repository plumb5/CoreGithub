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
    public class DLCoBrowserInformationPG : CommonDataBaseInteraction, IDLCoBrowserInformation
    {
        CommonInfo connection;
        public DLCoBrowserInformationPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLCoBrowserInformationPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32>  Save(CoBrowserInformation coBrowserInformation)
        {
            string storeProcCommand = "select cobrowser_information_save(@CustomerName,@CustomerPhone,@SessionId,@RequestDate,@CoBrowserLink,@UserInfoUserId,@LastAssignedUserInfoUserId,@IsNewUserAssigned,@VendorStatusCode,@VendorStatusDescription)";
            
            object? param = new  {coBrowserInformation.CustomerName,coBrowserInformation.CustomerPhone,coBrowserInformation.SessionId,coBrowserInformation.RequestDate,
                               coBrowserInformation.CoBrowserLink,coBrowserInformation.UserInfoUserId,coBrowserInformation.LastAssignedUserInfoUserId,
                               coBrowserInformation.IsNewUserAssigned,coBrowserInformation.VendorStatusCode,coBrowserInformation.VendorStatusDescription };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) ;
        }
        public async Task<CoBrowserInformation?>  GetLastAssignedUserDetails()
        {
            string storeProcCommand = "select * from cobrowser_information_getlastassigneduser()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<CoBrowserInformation?>(storeProcCommand, param);
        }
        public async Task<CoBrowserInformation?> GetCoBrowserInformation(int UserId)
        {
            string storeProcCommand = "select * from cobrowser_information_getusercobrowserinfo(@UserId)";
            object? param = new { UserId }; 
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<CoBrowserInformation?>(storeProcCommand, param);
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
