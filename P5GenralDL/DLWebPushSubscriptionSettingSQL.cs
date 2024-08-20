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

namespace P5GenralDL
{
    public class DLWebPushSubscriptionSettingSQL : CommonDataBaseInteraction, IDLWebPushSubscriptionSetting
    {
        CommonInfo connection;
        public DLWebPushSubscriptionSettingSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWebPushSubscriptionSettingSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(WebPushSubscriptionSetting WebPushSetting)
        {
            string storeProcCommand = "WebPush_SubscriptionSetting";
            object? param = new { Action = "Save", WebPushSetting.UserInfoUserId, WebPushSetting.UserGroupId, WebPushSetting.WebPushStep, WebPushSetting.IsShowOnAllPages, WebPushSetting.ShowSpecificPageUrl, WebPushSetting.ShowOptInDelayTime, WebPushSetting.HideOptInDelayTime, WebPushSetting.IsOptInDeviceDesktop, WebPushSetting.IsOptInDeviceMobile, WebPushSetting.IsNotificationToLastDevice, WebPushSetting.ExcludePageUrl, WebPushSetting.WelcomeMessageTitle, WebPushSetting.WelcomeMessageText, WebPushSetting.WelcomeMessageIcon, WebPushSetting.WelcomeMessageRedirectUrl, WebPushSetting.HttpOrHttpsPush, WebPushSetting.Step2ConfigurationSubDomain, WebPushSetting.NotificationPromptType, WebPushSetting.NotificationPosition, WebPushSetting.NotificationMessage, WebPushSetting.NotificationAllowButtonText, WebPushSetting.NotificationDoNotAllowButtonText, WebPushSetting.NotificationBodyBackgoundColor, WebPushSetting.NotificationBodyTextColor, WebPushSetting.NotificationButtonBackgoundColor, WebPushSetting.NotificationButtonTextColor, WebPushSetting.NativeBrowserMessage, WebPushSetting.NativeBrowserIcon, WebPushSetting.NativeBrowserBackgoundColor, WebPushSetting.NativeBrowserTextColor, WebPushSetting.GroupId, WebPushSetting.urlassigngroup };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(WebPushSubscriptionSetting WebPushSetting)
        {
            string storeProcCommand = "WebPush_SubscriptionSetting";
            object? param = new { Action = "Update", WebPushSetting.Id, WebPushSetting.UserInfoUserId, WebPushSetting.UserGroupId, WebPushSetting.WebPushStep, WebPushSetting.IsShowOnAllPages, WebPushSetting.ShowSpecificPageUrl, WebPushSetting.ShowOptInDelayTime, WebPushSetting.HideOptInDelayTime, WebPushSetting.IsOptInDeviceDesktop, WebPushSetting.IsOptInDeviceMobile, WebPushSetting.IsNotificationToLastDevice, WebPushSetting.ExcludePageUrl, WebPushSetting.WelcomeMessageTitle, WebPushSetting.WelcomeMessageText, WebPushSetting.WelcomeMessageIcon, WebPushSetting.WelcomeMessageRedirectUrl, WebPushSetting.HttpOrHttpsPush, WebPushSetting.Step2ConfigurationSubDomain, WebPushSetting.NotificationPromptType, WebPushSetting.NotificationPosition, WebPushSetting.NotificationMessage, WebPushSetting.NotificationAllowButtonText, WebPushSetting.NotificationDoNotAllowButtonText, WebPushSetting.NotificationBodyBackgoundColor, WebPushSetting.NotificationBodyTextColor, WebPushSetting.NotificationButtonBackgoundColor, WebPushSetting.NotificationButtonTextColor, WebPushSetting.NativeBrowserMessage, WebPushSetting.NativeBrowserIcon, WebPushSetting.NativeBrowserBackgoundColor, WebPushSetting.NativeBrowserTextColor, WebPushSetting.GroupId, WebPushSetting.urlassigngroup };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "WebPush_SubscriptionSetting";
            object? param = new { Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<WebPushSubscriptionSetting?> Get()
        {
            string storeProcCommand = "WebPush_SubscriptionSetting";
            object? param = new { Action = "Get" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WebPushSubscriptionSetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
