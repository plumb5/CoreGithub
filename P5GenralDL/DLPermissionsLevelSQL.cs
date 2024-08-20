using DBInteraction;
using IP5GenralDL;
using Newtonsoft.Json;
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
    public class DLPermissionsLevelSQL : CommonDataBaseInteraction, IDLPermissionsLevel
    {
        CommonInfo connection;
        public DLPermissionsLevelSQL()
        {
            connection = GetDBConnection();
        }

        public DLPermissionsLevelSQL(string ConnectionStrings)
        {
            connection = new CommonInfo { Connection = ConnectionStrings };
        }

        public async Task<Int32> Save(PermissionsLevels permissionslevel)
        {
            string storeProcCommand = "Permissions_Levels";
            object? param = new
            {
                Action = "Save",
                permissionslevel.Name,
                permissionslevel.PermissionDescription,
                permissionslevel.IsSuperAdmin,
                permissionslevel.Developer,
                permissionslevel.UserRole,
                permissionslevel.UserRoleHasFullControl,
                permissionslevel.UserRoleView,
                permissionslevel.UserRoleContribute,
                permissionslevel.Contacts,
                permissionslevel.ContactsHasFullControl,
                permissionslevel.ContactsView,
                permissionslevel.ContactsContribute,
                permissionslevel.ContactsGuest,
                permissionslevel.ContactsDesign,
                permissionslevel.Analytics,
                permissionslevel.AnalyticsHasFullControl,
                permissionslevel.AnalyticsView,
                permissionslevel.AnalyticsContribute,
                permissionslevel.AnalyticsGuest,
                permissionslevel.AnalyticsDesign,
                permissionslevel.Forms,
                permissionslevel.FormsHasFullControl,
                permissionslevel.FormsView,
                permissionslevel.FormsContribute,
                permissionslevel.FormsDesign,
                permissionslevel.FormsGuest,
                permissionslevel.EmailMarketing,
                permissionslevel.EmailMarketingHasFullControl,
                permissionslevel.EmailMarketingView,
                permissionslevel.EmailMarketingContribute,
                permissionslevel.EmailMarketingDesign,
                permissionslevel.EmailMarketingGuest,
                permissionslevel.LeadManagement,
                permissionslevel.LeadManagementHasFullControl,
                permissionslevel.LeadManagementView,
                permissionslevel.LeadManagementContribute,
                permissionslevel.LeadManagementDesign,
                permissionslevel.LeadManagementGuest,
                permissionslevel.Social,
                permissionslevel.SocialHasFullControl,
                permissionslevel.SocialView,
                permissionslevel.SocialContribute,
                permissionslevel.SocialDesign,
                permissionslevel.SocialGuest,
                permissionslevel.DataManagement,
                permissionslevel.DataManagementHasFullControl,
                permissionslevel.DataManagementView,
                permissionslevel.DataManagementContribute,
                permissionslevel.DataManagementDesign,
                permissionslevel.DataManagementGuest,
                permissionslevel.Mobile,
                permissionslevel.MobileHasFullControl,
                permissionslevel.MobileView,
                permissionslevel.MobileContribute,
                permissionslevel.MobileDesign,
                permissionslevel.MobileGuest,
                permissionslevel.SMS,
                permissionslevel.SMSHasFullControl,
                permissionslevel.SMSView,
                permissionslevel.SMSContribute,
                permissionslevel.SMSDesign,
                permissionslevel.SMSGuest,
                permissionslevel.SiteChat,
                permissionslevel.SiteChatHasFullControl,
                permissionslevel.SiteChatView,
                permissionslevel.SiteChatContribute,
                permissionslevel.SiteChatDesign,
                permissionslevel.SiteChatGuest,
                permissionslevel.MainUserId,
                permissionslevel.CreatedByUserId,
                permissionslevel.WorkFlow,
                permissionslevel.WorkFlowHasFullControl,
                permissionslevel.WorkFlowView,
                permissionslevel.WorkFlowContribute,
                permissionslevel.WorkFlowDesign,
                permissionslevel.WorkFlowGuest,
                permissionslevel.WebPushNotification,
                permissionslevel.WebPushNotificationHasFullControl,
                permissionslevel.WebPushNotificationView,
                permissionslevel.WebPushNotificationContribute,
                permissionslevel.WebPushNotificationDesign,
                permissionslevel.WebPushNotificationGuest,
                permissionslevel.MobileEngagement,
                permissionslevel.MobileEngagementHasFullControl,
                permissionslevel.MobileEngagementView,
                permissionslevel.MobileEngagementContribute,
                permissionslevel.MobileEngagementDesign,
                permissionslevel.MobileEngagementGuest,
                permissionslevel.Segmentation,
                permissionslevel.SegmentationHasFullControl,
                permissionslevel.SegmentationView,
                permissionslevel.SegmentationContribute,
                permissionslevel.SegmentationDesign,
                permissionslevel.SegmentationGuest,
                permissionslevel.Export,
                permissionslevel.MaskData,
                permissionslevel.MobilePushNotification,
                permissionslevel.MobilePushNotificationHasFullControl,
                permissionslevel.MobilePushNotificationView,
                permissionslevel.MobilePushNotificationContribute,
                permissionslevel.MobilePushNotificationDesign,
                permissionslevel.MobilePushNotificationGuest,
                permissionslevel.Dashboard,
                permissionslevel.DashboardHasFullControl,
                permissionslevel.DashboardView,
                permissionslevel.DashboardContribute,
                permissionslevel.DashboardGuest,
                permissionslevel.DashboardDesign,
                permissionslevel.LeadScoring,
                permissionslevel.LeadScoringHasFullControl,
                permissionslevel.LeadScoringView,
                permissionslevel.LeadScoringContribute,
                permissionslevel.LeadScoringDesign,
                permissionslevel.LeadScoringGuest,
                permissionslevel.Whatsapp,
                permissionslevel.WhatsappHasFullControl,
                permissionslevel.WhatsappView,
                permissionslevel.WhatsappContribute,
                permissionslevel.WhatsappDesign,
                permissionslevel.WhatsappGuest,
                permissionslevel.CustomEvents,
                permissionslevel.CustomEventsHasFullControl,
                permissionslevel.CustomEventsView,
                permissionslevel.CustomEventsContribute,
                permissionslevel.CustomEventsDesign,
                permissionslevel.CustomEventsGuest
            };

            using var db = GetDbConnection();
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(PermissionsLevels permissionslevel)
        {
            string storeProcCommand = "Permissions_Levels";

            object? param = new
            {
                Action = "Update",
                permissionslevel.Id,
                permissionslevel.Name,
                permissionslevel.PermissionDescription,
                permissionslevel.IsSuperAdmin,
                permissionslevel.Developer,
                permissionslevel.UserRole,
                permissionslevel.UserRoleHasFullControl,
                permissionslevel.UserRoleView,
                permissionslevel.UserRoleContribute,
                permissionslevel.Contacts,
                permissionslevel.ContactsHasFullControl,
                permissionslevel.ContactsView,
                permissionslevel.ContactsContribute,
                permissionslevel.ContactsGuest,
                permissionslevel.ContactsDesign,
                permissionslevel.Analytics,
                permissionslevel.AnalyticsHasFullControl,
                permissionslevel.AnalyticsView,
                permissionslevel.AnalyticsContribute,
                permissionslevel.AnalyticsGuest,
                permissionslevel.AnalyticsDesign,
                permissionslevel.Forms,
                permissionslevel.FormsHasFullControl,
                permissionslevel.FormsView,
                permissionslevel.FormsContribute,
                permissionslevel.FormsDesign,
                permissionslevel.FormsGuest,
                permissionslevel.EmailMarketing,
                permissionslevel.EmailMarketingHasFullControl,
                permissionslevel.EmailMarketingView,
                permissionslevel.EmailMarketingContribute,
                permissionslevel.EmailMarketingDesign,
                permissionslevel.EmailMarketingGuest,
                permissionslevel.LeadManagement,
                permissionslevel.LeadManagementHasFullControl,
                permissionslevel.LeadManagementView,
                permissionslevel.LeadManagementContribute,
                permissionslevel.LeadManagementDesign,
                permissionslevel.LeadManagementGuest,
                permissionslevel.Social,
                permissionslevel.SocialHasFullControl,
                permissionslevel.SocialView,
                permissionslevel.SocialContribute,
                permissionslevel.SocialDesign,
                permissionslevel.SocialGuest,
                permissionslevel.DataManagement,
                permissionslevel.DataManagementHasFullControl,
                permissionslevel.DataManagementView,
                permissionslevel.DataManagementContribute,
                permissionslevel.DataManagementDesign,
                permissionslevel.DataManagementGuest,
                permissionslevel.Mobile,
                permissionslevel.MobileHasFullControl,
                permissionslevel.MobileView,
                permissionslevel.MobileContribute,
                permissionslevel.MobileDesign,
                permissionslevel.MobileGuest,
                permissionslevel.SMS,
                permissionslevel.SMSHasFullControl,
                permissionslevel.SMSView,
                permissionslevel.SMSContribute,
                permissionslevel.SMSDesign,
                permissionslevel.SMSGuest,
                permissionslevel.SiteChat,
                permissionslevel.SiteChatHasFullControl,
                permissionslevel.SiteChatView,
                permissionslevel.SiteChatContribute,
                permissionslevel.SiteChatDesign,
                permissionslevel.SiteChatGuest,
                permissionslevel.MainUserId,
                permissionslevel.WorkFlow,
                permissionslevel.WorkFlowHasFullControl,
                permissionslevel.WorkFlowView,
                permissionslevel.WorkFlowContribute,
                permissionslevel.WorkFlowDesign,
                permissionslevel.WorkFlowGuest,
                permissionslevel.WebPushNotification,
                permissionslevel.WebPushNotificationHasFullControl,
                permissionslevel.WebPushNotificationView,
                permissionslevel.WebPushNotificationContribute,
                permissionslevel.WebPushNotificationDesign,
                permissionslevel.WebPushNotificationGuest,
                permissionslevel.MobileEngagement,
                permissionslevel.MobileEngagementHasFullControl,
                permissionslevel.MobileEngagementView,
                permissionslevel.MobileEngagementContribute,
                permissionslevel.MobileEngagementDesign,
                permissionslevel.MobileEngagementGuest,
                permissionslevel.Segmentation,
                permissionslevel.SegmentationHasFullControl,
                permissionslevel.SegmentationView,
                permissionslevel.SegmentationContribute,
                permissionslevel.SegmentationDesign,
                permissionslevel.SegmentationGuest,
                permissionslevel.Export,
                permissionslevel.MaskData,
                permissionslevel.MobilePushNotification,
                permissionslevel.MobilePushNotificationHasFullControl,
                permissionslevel.MobilePushNotificationView,
                permissionslevel.MobilePushNotificationContribute,
                permissionslevel.MobilePushNotificationDesign,
                permissionslevel.MobilePushNotificationGuest,
                permissionslevel.Dashboard,
                permissionslevel.DashboardHasFullControl,
                permissionslevel.DashboardView,
                permissionslevel.DashboardContribute,
                permissionslevel.DashboardGuest,
                permissionslevel.DashboardDesign,
                permissionslevel.LeadScoring,
                permissionslevel.LeadScoringHasFullControl,
                permissionslevel.LeadScoringView,
                permissionslevel.LeadScoringContribute,
                permissionslevel.LeadScoringDesign,
                permissionslevel.LeadScoringGuest,
                permissionslevel.Whatsapp,
                permissionslevel.WhatsappHasFullControl,
                permissionslevel.WhatsappView,
                permissionslevel.WhatsappContribute,
                permissionslevel.WhatsappDesign,
                permissionslevel.WhatsappGuest,
                permissionslevel.CustomEvents,
                permissionslevel.CustomEventsHasFullControl,
                permissionslevel.CustomEventsView,
                permissionslevel.CustomEventsContribute,
                permissionslevel.CustomEventsDesign,
                permissionslevel.CustomEventsGuest
            };

            using var db = GetDbConnection();
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<int> GetMaxCount(int MainUserId, string? RoleName = null)
        {
            string storeProcCommand = "Permissions_Levels";
            object? param = new { Action = "MaxCount", MainUserId };

            using var db = GetDbConnection();
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<List<PermissionsLevels>> GetPermissionsList(int OffSet, int FetchNext, int MainUserId, string? RoleName = null)
        {
            string storeProcCommand = "Permissions_Levels";
            object? param = new { Action = "GET", MainUserId, RoleName, FetchNext, OffSet };

            using var db = GetDbConnection();
            return (await db.QueryAsync<PermissionsLevels>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "Permissions_Levels";
            object? param = new { Action = "Delete", Id };

            using var db = GetDbConnection();
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<PermissionsLevels?> GetPermission(int PermissionId, int MainUserId)
        {
            string storeProcCommand = "Permissions_Levels";
            object? param = new { Action = "GET", PermissionId, MainUserId };

            using var db = GetDbConnection();
            return await db.QueryFirstOrDefaultAsync<PermissionsLevels?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<PermissionsLevels>> BindGroupsContact(MLUserGroup userGroup, int OffSet, int FetchNext)
        {
            string storeProcCommand = "Permissions_Levels";
            object? param = new { Action = "GET", OffSet, FetchNext, userGroup.UserInfoUserId, userGroup.CreatedByUserId };

            using var db = GetDbConnection();
            return (await db.QueryAsync<PermissionsLevels>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<PermissionsLevels?> UserPermission(int UserInfoUserId)
        {
            string storeProcCommand = "Permissions_Levels";
            object? param = new { Action = "UserPermission", UserInfoUserId };

            using var db = GetDbConnection();
            return await db.QueryFirstOrDefaultAsync<PermissionsLevels?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<PermissionsLevels?> UserPermissionbyAccountId(int UserInfoUserId, int AccountId)
        {
            string storeProcCommand = "Permissions_Levels";
            object? param = new { Action = "UserPermissionByaccountId", UserInfoUserId, AccountId };

            using var db = GetDbConnection();
            return await db.QueryFirstOrDefaultAsync<PermissionsLevels?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<PermissionsLevels>> GetRoles(int MainUserId)
        {
            string storeProcCommand = "Permissions_Levels";
            object? param = new { Action = "GetRoles", MainUserId };

            using var db = GetDbConnection();
            return (await db.QueryAsync<PermissionsLevels>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<PermissionsLevels>> GetRolesByIds(List<int> PermissionLevelIds)
        {
            string storeProcCommand = "Permissions_Levels";
            object? param = new { Action = "GetRolesByIds", PermissionLevelIds = string.Join(",", PermissionLevelIds) };

            using var db = GetDbConnection();
            return (await db.QueryAsync<PermissionsLevels>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
