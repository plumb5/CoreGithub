using Dapper;
using DBInteraction;
using IP5GenralDL;
using Microsoft.Identity.Client;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLAdminAccountInfoPG : CommonDataBaseInteraction, IDLAdminAccountInfo
    {
        CommonInfo connection;
        public DLAdminAccountInfoPG(int key = 0)
        {
            connection = GetDBConnection();
        }

        public async Task<MLAdminUserInfo?> GetSupportManagerByAccountId(int AccountId)
        {
            string storeProcCommand = "select * from admin_getuserdetails_getsupportmanagerbyaccountid(@AccountId)";
            object? param = new { AccountId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLAdminUserInfo?>(storeProcCommand, param);
        }

        public async Task<MLAdminManagersName?> GetManagersNameByAccountId(int AccountId)
        {
            string storeProcCommand = "select * from admin_getuserdetails_getaccountmanagersbyaccountid(@AccountId)";
            object? param = new { AccountId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLAdminManagersName?>(storeProcCommand, param);
        }

        public async Task<bool> StopStartAccount(int AccountId, int Status)
        {
            string storeProcCommand = "select adminaccount_details_stopstartaccount(@AccountId,@Status)";
            object? param = new { AccountId, Status };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<MLAdminUserInfo?> GetManagerByAccountId(int AccountId)
        {
            string storeProcCommand = "select * from admin_getuserdetails_getmanagerbyaccountid(@AccountId)";
            object? param = new { AccountId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLAdminUserInfo?>(storeProcCommand, param);
        }

        public async Task<bool> UpdateAccountManager(int AccountId, int UserId, int SupportUserId)
        {
            string storeProcCommand = "select admin_getuserdetails_updateaccountmanager(@AccountId, @UserId, @SupportUserId)";
            object? param = new { AccountId, UserId, SupportUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<long> SaveSupportAccountManagers(int AccountId, int accountmanager)
        {
            string storeProcCommand = "select admin_getuserdetails_updateaccountmanager(@AccountId, @accountmanager)";
            object? param = new { AccountId, accountmanager };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> AdminAccountsDelete(int AccountId)
        {
            string storeProcCommand = "select adminaccount_details_useraccountdeletion(@AccountId)";
            object? param = new { AccountId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<int> SaveManagerDetails(MLAdminUserInfo addmanager)
        {
            string storeProcCommand = "select managerDetails_save(@Role, @UserId, @FirstName, @LastName, @EmailId, @MobilePhone, @Password)";
            object? param = new { addmanager.Role, addmanager.UserId, addmanager.FirstName, addmanager.LastName, addmanager.EmailId, addmanager.MobilePhone, addmanager.Password };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }


        public async Task<int> DeleteManagerDetails(int Userid, int Role, int UpdateManagerRole)
        {
            string storeProcCommand = "select managerdetails_delete(@Userid, @Role, @UpdateManagerRole)";
            object? param = new { Userid, Role, UpdateManagerRole };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<List<MLAdminUserInfo>> GetManagerdetailsForDropdown()
        {
            string storeProcCommand = "select * from ManagerDetails_GetManagerForDropDown()";

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLAdminUserInfo>(storeProcCommand)).ToList();
        }
        public async Task<int> UpdateMergeAccountSuportManager(int UserId)
        {
            string storeProcCommand = "select managerdetails_mergemanager(@UserId)";
            object? param = new { UserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<int> ChangeManagerStatus(int userid, bool ActiveStatus)
        {
            string storeProcCommand = "select managerdetails_changestatus(@userid, @ActiveStatus)";
            object? param = new { userid, ActiveStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<List<MLAdminUserInfo>> GetManagerDetails(object Role)
        {
            string storeProcCommand = "select * from managerdetails_get(@Role)";
            object? param = new { Role };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLAdminUserInfo>(storeProcCommand, param)).ToList();
        }

        public async Task<MLAdminManagersDetails?> GetManagersDetailsByAccountId(int AccountId)
        {
            string storeProcCommand = "select * from admin_getuserdetails_getaccountmanagersdetailsbyaccountid(@AccountId)";
            object? param = new { AccountId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLAdminManagersDetails?>(storeProcCommand, param);
        }


        public async Task<bool> UpdateAccountType(int AccountId, short AccountType)
        {
            string storeProcCommand = "select account_details_updateaccounttype()";
            object? param = new { AccountId, AccountType };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> UpdateExpiryDate(int AccountId, DateTime ExpiryDate)
        {
            string storeProcCommand = "select account_details_updateexpiry(@AccountId, @ExpiryDate)";
            object? param = new { AccountId, ExpiryDate };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<DataSet> GetManagerDetails(int userid, int supportuserid)
        {
            string storeProcCommand = "select * from admin_getuserdetailslistall(@Userid,@Supportuserid)";
            object? param = new { userid, supportuserid };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand);
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
                    connection = null;
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
