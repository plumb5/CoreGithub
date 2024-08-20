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
    public class DLMobileEventSettingPG : CommonDataBaseInteraction, IDLMobileEventSetting
    {
        CommonInfo connection;
        public DLMobileEventSettingPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobileEventSettingPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(MobileEventSetting mobileEventSetting)
        {
            string storeProcCommand = "select mobileevent_setting_save(@UserInfoUserId, @EventIdentifier, @EventName,@EventSpecifier)";
            object? param = new { mobileEventSetting.UserInfoUserId, mobileEventSetting.EventIdentifier, mobileEventSetting.EventName, mobileEventSetting.EventSpecifier };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool>  Update(MobileEventSetting mobileEventSetting)
        {
            string storeProcCommand = "select mobileevent_setting_update(@Id, @EventIdentifier,@EventName, @EventSpecifier, @UpdatedUserInfoUserId)"; 
            object? param = new { mobileEventSetting.Id, mobileEventSetting.EventIdentifier, mobileEventSetting.EventName, mobileEventSetting.EventSpecifier, mobileEventSetting.UpdatedUserInfoUserId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
        } 
        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "select mobileevent_setting_delete(@Id)"; 
            object? param = new { Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<Int32> GetMaxCount(MobileEventSetting mobileEventSetting)
        {
            string storeProcCommand = "select mobileevent_setting_maxcount()";  
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand)  ;
        }

        public async Task<IEnumerable<MobileEventSetting>> GetList(MobileEventSetting mobileEventSetting, int OffSet, int FetchNext)
        {
            string storeProcCommand = "mobileevent_setting_getlist(@OffSet, @FetchNext)";
            object? param = new { OffSet , FetchNext };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MobileEventSetting>(storeProcCommand, param);
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
