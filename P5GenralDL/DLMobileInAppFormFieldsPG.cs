using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLMobileInAppFormFieldsPG : CommonDataBaseInteraction, IDLMobileInAppFormFields
    {
        CommonInfo connection;
        public DLMobileInAppFormFieldsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobileInAppFormFieldsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int16> Save(MobileInAppFormFields inAppFormFields)
        {
            string storeProcCommand = "select * from MobileInApp_FormFields(@Action, @UserInfoUserId, @InAppCampaignId, @Name, @FieldType, @SubFields, @RelationField, @Mandatory, @FormScore, @PhoneValidationType, @FieldDisplay, @CalendarDisplayType, @ContactMappingField, @FieldPriority)";
            object? param = new { Action = "Save", inAppFormFields.UserInfoUserId, inAppFormFields.InAppCampaignId, inAppFormFields.Name, inAppFormFields.FieldType, inAppFormFields.SubFields, inAppFormFields.RelationField, inAppFormFields.Mandatory, inAppFormFields.FormScore, inAppFormFields.PhoneValidationType, inAppFormFields.FieldDisplay, inAppFormFields.CalendarDisplayType, inAppFormFields.ContactMappingField, inAppFormFields.FieldPriority };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param);

        }

        public async Task<bool> Update(MobileInAppFormFields inAppFormFields)
        {
            string storeProcCommand = "select * from UpdateScore(@Action, @Id, @UserInfoUserId, @InAppCampaignId, @Name, @FieldType, @SubFields, @RelationField, @Mandatory, @FormScore, @PhoneValidationType, @FieldDisplay, @CalendarDisplayType, @ContactMappingField, @FieldPriority)";
            object? param = new { Action = "Update", inAppFormFields.Id, inAppFormFields.UserInfoUserId, inAppFormFields.InAppCampaignId, inAppFormFields.Name, inAppFormFields.FieldType, inAppFormFields.SubFields, inAppFormFields.RelationField, inAppFormFields.Mandatory, inAppFormFields.FormScore, inAppFormFields.PhoneValidationType, inAppFormFields.FieldDisplay, inAppFormFields.CalendarDisplayType, inAppFormFields.ContactMappingField, inAppFormFields.FieldPriority };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<bool> Delete(Int16 Id)
        {
            string storeProcCommand = "select * from MobileInApp_FormFields(@Action,@Id)";
            object? param = new { Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<bool> DeleteFields(int InAppCampaignId)
        {
            string storeProcCommand = "select * from UpdateScore(@InAppCampaignId)";
            object? param = new { InAppCampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<List<MobileInAppFormFields>> GET(int InAppCampaignId)
        {
            string storeProcCommand = "select * from mobileinapp_formfields_get(@InAppCampaignId)";
            object? param = new { InAppCampaignId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobileInAppFormFields>(storeProcCommand, param)).ToList();

        }

        public async Task<List<MobileInAppFormFields>> GET()
        {
            string storeProcCommand = "select * from MobileInApp_FormFields(@Action)";
            object? param = new { Action = "GET" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobileInAppFormFields>(storeProcCommand, param)).ToList();

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
