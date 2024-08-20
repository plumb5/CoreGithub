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
    public class DLWebPushSubscriptionSettingPG : CommonDataBaseInteraction, IDLWebPushSubscriptionSetting
    {
        CommonInfo connection;
        public DLWebPushSubscriptionSettingPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWebPushSubscriptionSettingPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(WebPushSubscriptionSetting WebPushSetting)
        {
            string storeProcCommand = "select webpush_subscriptionsetting_save(@UserInfoUserId, @UserGroupId, @WebPushStep, @IsShowOnAllPages, @ShowSpecificPageUrl, @ShowOptInDelayTime, @HideOptInDelayTime, @IsOptInDeviceDesktop, @IsOptInDeviceMobile, @IsNotificationToLastDevice, @ExcludePageUrl, @WelcomeMessageTitle, @WelcomeMessageText, @WelcomeMessageIcon, @WelcomeMessageRedirectUrl, @HttpOrHttpsPush, @Step2ConfigurationSubDomain, @NotificationPromptType, @NotificationPosition, @NotificationMessage, @NotificationAllowButtonText, @NotificationDoNotAllowButtonText, @NotificationBodyBackgoundColor, @NotificationBodyTextColor, @NotificationButtonBackgoundColor, @NotificationButtonTextColor, @NativeBrowserMessage, @NativeBrowserIcon, @NativeBrowserBackgoundColor, @NativeBrowserTextColor, @GroupId, @urlassigngroup)";
            object? param = new { WebPushSetting.UserInfoUserId, WebPushSetting.UserGroupId, WebPushSetting.WebPushStep, WebPushSetting.IsShowOnAllPages, WebPushSetting.ShowSpecificPageUrl, WebPushSetting.ShowOptInDelayTime, WebPushSetting.HideOptInDelayTime, WebPushSetting.IsOptInDeviceDesktop, WebPushSetting.IsOptInDeviceMobile, WebPushSetting.IsNotificationToLastDevice, WebPushSetting.ExcludePageUrl, WebPushSetting.WelcomeMessageTitle, WebPushSetting.WelcomeMessageText, WebPushSetting.WelcomeMessageIcon, WebPushSetting.WelcomeMessageRedirectUrl, WebPushSetting.HttpOrHttpsPush, WebPushSetting.Step2ConfigurationSubDomain, WebPushSetting.NotificationPromptType, WebPushSetting.NotificationPosition, WebPushSetting.NotificationMessage, WebPushSetting.NotificationAllowButtonText, WebPushSetting.NotificationDoNotAllowButtonText, WebPushSetting.NotificationBodyBackgoundColor, WebPushSetting.NotificationBodyTextColor, WebPushSetting.NotificationButtonBackgoundColor, WebPushSetting.NotificationButtonTextColor, WebPushSetting.NativeBrowserMessage, WebPushSetting.NativeBrowserIcon, WebPushSetting.NativeBrowserBackgoundColor, WebPushSetting.NativeBrowserTextColor, WebPushSetting.GroupId, WebPushSetting.urlassigngroup };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> Update(WebPushSubscriptionSetting WebPushSetting)
        {
            string storeProcCommand = "select webpush_subscriptionsetting_update(@Id, @UserInfoUserId, @UserGroupId, @WebPushStep, @IsShowOnAllPages, @ShowSpecificPageUrl, @ShowOptInDelayTime, @HideOptInDelayTime, @IsOptInDeviceDesktop, @IsOptInDeviceMobile, @IsNotificationToLastDevice, @ExcludePageUrl, @WelcomeMessageTitle, @WelcomeMessageText, @WelcomeMessageIcon, @WelcomeMessageRedirectUrl, @HttpOrHttpsPush, @Step2ConfigurationSubDomain, @NotificationPromptType, @NotificationPosition, @NotificationMessage, @NotificationAllowButtonText, @NotificationDoNotAllowButtonText, @NotificationBodyBackgoundColor, @NotificationBodyTextColor, @NotificationButtonBackgoundColor, @NotificationButtonTextColor, @NativeBrowserMessage, @NativeBrowserIcon, @NativeBrowserBackgoundColor, @NativeBrowserTextColor, @GroupId, @urlassigngroup)";
            object? param = new { WebPushSetting.Id, WebPushSetting.UserInfoUserId, WebPushSetting.UserGroupId, WebPushSetting.WebPushStep, WebPushSetting.IsShowOnAllPages, WebPushSetting.ShowSpecificPageUrl, WebPushSetting.ShowOptInDelayTime, WebPushSetting.HideOptInDelayTime, WebPushSetting.IsOptInDeviceDesktop, WebPushSetting.IsOptInDeviceMobile, WebPushSetting.IsNotificationToLastDevice, WebPushSetting.ExcludePageUrl, WebPushSetting.WelcomeMessageTitle, WebPushSetting.WelcomeMessageText, WebPushSetting.WelcomeMessageIcon, WebPushSetting.WelcomeMessageRedirectUrl, WebPushSetting.HttpOrHttpsPush, WebPushSetting.Step2ConfigurationSubDomain, WebPushSetting.NotificationPromptType, WebPushSetting.NotificationPosition, WebPushSetting.NotificationMessage, WebPushSetting.NotificationAllowButtonText, WebPushSetting.NotificationDoNotAllowButtonText, WebPushSetting.NotificationBodyBackgoundColor, WebPushSetting.NotificationBodyTextColor, WebPushSetting.NotificationButtonBackgoundColor, WebPushSetting.NotificationButtonTextColor, WebPushSetting.NativeBrowserMessage, WebPushSetting.NativeBrowserIcon, WebPushSetting.NativeBrowserBackgoundColor, WebPushSetting.NativeBrowserTextColor, WebPushSetting.GroupId, WebPushSetting.urlassigngroup };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "select webpush_subscriptionsetting_delete(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<WebPushSubscriptionSetting?> Get()
        {
            string storeProcCommand = "select * from webpush_subscriptionsetting_get()";

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WebPushSubscriptionSetting>(storeProcCommand);
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
