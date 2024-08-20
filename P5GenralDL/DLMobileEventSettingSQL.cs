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
    public class DLMobileEventSettingSQL : CommonDataBaseInteraction, IDLMobileEventSetting
    {
        CommonInfo connection;
        public DLMobileEventSettingSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobileEventSettingSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(MobileEventSetting mobileEventSetting)
        {
            string storeProcCommand = "MobileEvent_Setting";
            object? param = new { Action= "Save",mobileEventSetting.UserInfoUserId, mobileEventSetting.EventIdentifier, mobileEventSetting.EventName, mobileEventSetting.EventSpecifier };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(MobileEventSetting mobileEventSetting)
        {
            string storeProcCommand = "MobileEvent_Setting";
            object? param = new { Action = "Update", mobileEventSetting.Id, mobileEventSetting.EventIdentifier, mobileEventSetting.EventName, mobileEventSetting.EventSpecifier, mobileEventSetting.UpdatedUserInfoUserId };
            using var db = GetDbConnection(connection.Connection); 
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;
        }
        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "MobileEvent_Setting";
            object? param = new { Action = "Delete", Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }
        public async Task<Int32> GetMaxCount(MobileEventSetting mobileEventSetting)
        {
            string storeProcCommand = "MobileEvent_Setting";
            object? param = new { Action = "MaxCount" };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<MobileEventSetting>> GetList(MobileEventSetting mobileEventSetting, int OffSet, int FetchNext)
        {
            string storeProcCommand = "MobileEvent_Setting";
            object? param = new { Action = "GetList", OffSet, FetchNext };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MobileEventSetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
            disposed = true;
        }
        public void Dispose()
        {
            Dispose(true);
        }
        #endregion End of Dispose Method
    }
}
