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
    public class DLUserInfoPG : CommonDataBaseInteraction, IDLUserInfo
    {
        CommonInfo connection;
        public DLUserInfoPG()
        {
            connection = GetDBConnection();
        }

        public async Task<Int32> SaveDetails(UserInfo userInfo)
        {
            string storeProcCommand = "select * from user_info_save(@FirstName, @LastName, @EmailId, @Password, @IsAdmin, @ActiveStatus, @RegistrationDate, @DomainForTrack, @CompanyName, @CompanyWebUrl, @AddressDetails, @SecondaryAddress, @City, @StateDetail, @Country, @ZipPostalCode, @BusinessPhone, @MobilePhone, @IsTrial, @ApiKey, @PasswordPolicyStatus, @EmployeeCode, @LastModifiedByUserId, @UserAccountType, @UserAccountRedirectDomain, @SetPrimaryPhoneNumber)";
            object? param = new { userInfo.FirstName, userInfo.LastName, userInfo.EmailId, userInfo.Password, userInfo.IsAdmin, userInfo.ActiveStatus, userInfo.RegistrationDate, userInfo.DomainForTrack, userInfo.CompanyName, userInfo.CompanyWebUrl, userInfo.AddressDetails, userInfo.SecondaryAddress, userInfo.City, userInfo.StateDetail, userInfo.Country, userInfo.ZipPostalCode, userInfo.BusinessPhone, userInfo.MobilePhone, userInfo.IsTrial, userInfo.ApiKey, userInfo.PasswordPolicyStatus, userInfo.EmployeeCode, userInfo.LastModifiedByUserId, userInfo.UserAccountType, userInfo.UserAccountRedirectDomain, userInfo.SetPrimaryPhoneNumber };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<bool> UpdateDetails(UserInfo userInfo)
        {
            string storeProcCommand = "select * from user_info_update(@UserId, @FirstName, @LastName, @EmailId, @Password, @CompanyName, @CompanyWebUrl, @AddressDetails, @SecondaryAddress, @City, @StateDetail, @Country, @ZipPostalCode, @BusinessPhone, @MobilePhone, @EmployeeCode, @LastModifiedByUserId, @UserAccountType, @UserAccountRedirectDomain, @SetPrimaryPhoneNumber)";
            object? param = new { userInfo.UserId, userInfo.FirstName, userInfo.LastName, userInfo.EmailId, userInfo.Password, userInfo.CompanyName, userInfo.CompanyWebUrl, userInfo.AddressDetails, userInfo.SecondaryAddress, userInfo.City, userInfo.StateDetail, userInfo.Country, userInfo.ZipPostalCode, userInfo.BusinessPhone, userInfo.MobilePhone, userInfo.EmployeeCode, userInfo.LastModifiedByUserId, userInfo.UserAccountType, userInfo.UserAccountRedirectDomain, userInfo.SetPrimaryPhoneNumber };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param) > 0;
        }

        public async Task<UserInfo?> GetDetail(string emailId)
        {
            string storeProcCommand = "select * from user_info_getbyemaild(@emailId)";
            object? param = new { emailId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<UserInfo?>(storeProcCommand, param);
        }

        public async Task<UserInfo?> GetDetail(int UserId)
        {
            string storeProcCommand = "select * from user_info_get(@UserIdList,@EmailId,@Password,@UserId,@ApiKey,@MobilePhone)";
            object? param = new { UserIdList = "", EmailId = "", Password = "", UserId, ApiKey = "", MobilePhone = "" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<UserInfo?>(storeProcCommand, param);
        }

        public UserInfo? GetDetailData(int UserId)
        {
            string storeProcCommand = "select * from user_info_get(@UserIdList,@EmailId,@Password,@UserId,@ApiKey,@MobilePhone)";
            object? param = new { UserIdList = "", EmailId = "", Password = "", UserId, ApiKey = "", MobilePhone = "" };

            using var db = GetDbConnection(connection.Connection);
            return db.QueryFirstOrDefault<UserInfo?>(storeProcCommand, param);
        }

        public async Task<UserInfo?> GetDetailByAPIKey(string apikey)
        {
            string storeProcCommand = "select * from user_info_get(null, null, null, null, @apikey, null)";
            object? param = new { apikey };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<UserInfo?>(storeProcCommand, param);
        }

        public List<UserInfo> GetDetail(IEnumerable<int> Users)
        {
            string storeProcCommand = "select * from user_info_get(@useridlist)";
            object? param = new { useridlist = string.Join(",", new List<int>(Users).ToArray()) };

            using var db = GetDbConnection(connection.Connection);
            return (db.Query<UserInfo>(storeProcCommand, param)).ToList();
        }

        public async Task<bool> Delete(int UserId)
        {
            string storeProcCommand = "select * from user_info_del(@UserId)";
            object? param = new { UserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param) > 0;
        }

        public async Task<int> MainUserId(int UserId)
        {
            string storeProcCommand = "select * from user_info_getmainuserid(@UserId)";
            object? param = new { UserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }


        public async Task<bool> ToogleStatus(int UserId, bool ActiveStatus)
        {
            string storeProcCommand = "select * from user_info_tooglestatus(@UserId, @ActiveStatus)";
            object? param = new { UserId, ActiveStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param) > 0;
        }

        public async Task<List<Groups>> Groups(int UserId)
        {
            string storeProcCommand = "select * from user_info_groups(@UserId)";
            object? param = new { UserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Groups>(storeProcCommand, param)).ToList();
        }

        public async Task<List<Groups>> GroupsbyAccountId(int UserId, int AccountId)
        {
            string storeProcCommand = "select * from user_info_groupsbyaccount(@UserId, @AccountId)";
            object? param = new { UserId, AccountId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Groups>(storeProcCommand, param)).ToList();
        }

        public async Task<bool> UpdateFirstTimePasswordReset(int UserId, string NewPassword)
        {
            string storeProcCommand = "select * from user_info_updatefirsttimepasswordreset(@UserId, @NewPassword)";
            object? param = new { UserId, NewPassword };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param) > 0;
        }

        public async Task<bool> UpdateOtp(int UserId, string Otp)
        {
            string storeProcCommand = "select * from user_info_updateotp(@UserId, @Otp)";
            object? param = new { UserId, Otp };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param) > 0;
        }

        public async Task<List<UserInfo>> GetList()
        {
            string storeProcCommand = "select * from user_info_get()";

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<UserInfo>(storeProcCommand)).ToList();
        }

        public async Task<List<MLUserInfo>> GetCredentials(int AccountId)
        {
            string storeProcCommand = "select * from user_info_getcredentials(@AccountId)";
            object? param = new { AccountId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLUserInfo>(storeProcCommand, param)).ToList();
        }

        public async Task<List<MLUserDetails>> GetAllUsersbyUserId(int UserId, int AccountId)
        {
            string storeProcCommand = "select * from userdetails_getuserswithsenior(@UserId)";
            object? param = new { UserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLUserDetails>(storeProcCommand, param)).ToList();
        }

        public async Task<List<MLUserInfo>> GetUserDetails(int UserId, string EmailId, int OffSet, int FetchNext, int UserGroupId)
        {
            const string storeProcCommand = "select * from userdetails_getusersdetails(@UserId, @EmailId, @UserGroupId)";
            object? param = new { UserId, EmailId, UserGroupId = (UserGroupId > 0 ? UserGroupId.ToString() : "") };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLUserInfo>(storeProcCommand, param)).ToList();
        }

        public async Task<UserInfo?> GetDetailByPhone(string mobilePhone)
        {
            string storeProcCommand = "select * from user_info_get(@mobilePhone)";
            object? param = new { mobilePhone };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<UserInfo?>(storeProcCommand, param);
        }

        public async Task<bool> DeleteUserDetailsByAccountId(int AccountId)
        {
            string storeProcCommand = "select * from user_info_deleteusersbyaccountid(@AccountId)";
            object? param = new { AccountId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> UpdatePreferredAccountId(int PreferredAccountId, int UserId)
        {
            string storeProcCommand = "select * from user_info_updatepreferredaccountid(@PreferredAccountId, @UserId)";
            object? param = new { PreferredAccountId, UserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        #region CoBrowsing
        public async Task<bool> UpdateUserLastActiveDateTime(int UserId)
        {
            string storeProcCommand = "select user_info_updatelastactivedatetime(@UserId)";
            object? param = new { UserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }
        public async Task<List<UserInfo>> GetAllActiveUserDetails()
        {
            string storeProcCommand = "select * from user_info_getallactiveuserdetails()";

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<UserInfo>(storeProcCommand)).ToList();
        }

        public async Task<UserInfo?> CheckAssignedUserIsActive(int UserId)
        {
            string storeProcCommand = "select * from user_info_checkuseridisactive(@UserId)";
            object? param = new { UserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<UserInfo?>(storeProcCommand);
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
