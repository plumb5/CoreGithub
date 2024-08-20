using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;
using static System.Net.WebRequestMethods;

namespace P5GenralDL
{
    public class DLUserInfoSQL : CommonDataBaseInteraction, IDLUserInfo
    {
        CommonInfo connection;
        public DLUserInfoSQL()
        {
            connection = GetDBConnection();
        }

        public async Task<Int32> SaveDetails(UserInfo userInfo)
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "Save", userInfo.FirstName, userInfo.LastName, userInfo.EmailId, userInfo.Password, userInfo.IsAdmin, userInfo.ActiveStatus, userInfo.RegistrationDate, userInfo.DomainForTrack, userInfo.CompanyName, userInfo.CompanyWebUrl, userInfo.AddressDetails, userInfo.SecondaryAddress, userInfo.City, userInfo.StateDetail, userInfo.Country, userInfo.ZipPostalCode, userInfo.BusinessPhone, userInfo.MobilePhone, userInfo.IsTrial, userInfo.ApiKey, userInfo.PasswordPolicyStatus, userInfo.EmployeeCode, userInfo.LastModifiedByUserId, userInfo.UserAccountType, userInfo.UserAccountRedirectDomain, userInfo.SetPrimaryPhoneNumber };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateDetails(UserInfo userInfo)
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "Update", userInfo.UserId, userInfo.FirstName, userInfo.LastName, userInfo.EmailId, userInfo.Password, userInfo.CompanyName, userInfo.CompanyWebUrl, userInfo.AddressDetails, userInfo.SecondaryAddress, userInfo.City, userInfo.StateDetail, userInfo.Country, userInfo.ZipPostalCode, userInfo.BusinessPhone, userInfo.MobilePhone, userInfo.EmployeeCode, userInfo.LastModifiedByUserId, userInfo.UserAccountType, userInfo.UserAccountRedirectDomain, userInfo.SetPrimaryPhoneNumber };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<UserInfo?> GetDetail(string emailId)
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "GET", emailId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<UserInfo?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<UserInfo?> GetDetail(int UserId)
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "GET", UserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<UserInfo?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public UserInfo GetDetailData(int UserId)
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "GET", UserId };

            using var db = GetDbConnection(connection.Connection);
            return db.QueryFirstOrDefault<UserInfo?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<UserInfo?> GetDetailByAPIKey(string apikey)
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "GET", apikey };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<UserInfo?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public List<UserInfo> GetDetail(IEnumerable<int> Users)
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "GET", useridlist = string.Join(",", new List<int>(Users).ToArray()) };

            using var db = GetDbConnection(connection.Connection);
            return (db.Query<UserInfo>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<bool> Delete(int UserId)
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "DEL", UserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<int> MainUserId(int UserId)
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "GetMainUserId", UserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }


        public async Task<bool> ToogleStatus(int UserId, bool ActiveStatus)
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "ToogleStatus", UserId, ActiveStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<List<Groups>> Groups(int UserId)
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "GROUPS", UserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Groups>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<Groups>> GroupsbyAccountId(int UserId, int AccountId)
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "GROUPSBYACCOUNT", UserId, AccountId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Groups>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<bool> UpdateFirstTimePasswordReset(int UserId, string NewPassword)
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "UpdateFirstTimePasswordReset", UserId, NewPassword };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> UpdateOtp(int UserId, string Otp)
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "UpdateOtp", UserId, Otp };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<List<UserInfo>> GetList()
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "GET" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<UserInfo>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<MLUserInfo>> GetCredentials(int AccountId)
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "GetCredentials", AccountId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLUserInfo>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<MLUserDetails>> GetAllUsersbyUserId(int UserId, int AccountId)
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "GetUsersWithSenior", UserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLUserDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<MLUserInfo>> GetUserDetails(int UserId, string EmailId, int OffSet, int FetchNext, int UserGroupId)
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "GetUserDetails", UserId, EmailId, UserGroupId = (UserGroupId > 0 ? UserGroupId.ToString() : "") };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLUserInfo>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<UserInfo?> GetDetailByPhone(string mobilePhone)
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "GET", mobilePhone };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<UserInfo?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> DeleteUserDetailsByAccountId(int AccountId)
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "DeleteUsersByAccountId", AccountId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> UpdatePreferredAccountId(int PreferredAccountId, int UserId)
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "UpdatePreferredAccountId", PreferredAccountId, UserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        #region CoBrowsing
        public async Task<bool> UpdateUserLastActiveDateTime(int UserId)
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "UpdateLastActiveDateTime", UserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }
        public async Task<List<UserInfo>> GetAllActiveUserDetails()
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "GetAllActiveUserDetails" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<UserInfo>(storeProcCommand, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<UserInfo?> CheckAssignedUserIsActive(int UserId)
        {
            string storeProcCommand = "User_Info";
            object? param = new { Action = "CheckUserIdIsActive", UserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<UserInfo?>(storeProcCommand, commandType: CommandType.StoredProcedure);
        }
        #endregion CoBrowsing

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
