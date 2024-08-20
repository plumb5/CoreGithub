using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace P5GenralDL
{
    public class DLMobileInAppFormFieldsSQL : CommonDataBaseInteraction, IDLMobileInAppFormFields
    {
        CommonInfo connection;
        public DLMobileInAppFormFieldsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobileInAppFormFieldsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int16> Save(MobileInAppFormFields inAppFormFields)
        {
            string storeProcCommand = "MobileInApp_FormFields";
            object? param = new { Action= "Save", inAppFormFields.UserInfoUserId, inAppFormFields.InAppCampaignId, inAppFormFields.Name, inAppFormFields.FieldType, inAppFormFields.SubFields, inAppFormFields.RelationField, inAppFormFields.Mandatory, inAppFormFields.FormScore, inAppFormFields.PhoneValidationType, inAppFormFields.FieldDisplay, inAppFormFields.CalendarDisplayType, inAppFormFields.ContactMappingField, inAppFormFields.FieldPriority };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> Update(MobileInAppFormFields inAppFormFields)
        {
            string storeProcCommand = "MobileInApp_FormFields";
            object? param = new { Action = "Update", inAppFormFields.Id, inAppFormFields.UserInfoUserId, inAppFormFields.InAppCampaignId, inAppFormFields.Name, inAppFormFields.FieldType, inAppFormFields.SubFields, inAppFormFields.RelationField, inAppFormFields.Mandatory, inAppFormFields.FormScore, inAppFormFields.PhoneValidationType, inAppFormFields.FieldDisplay, inAppFormFields.CalendarDisplayType, inAppFormFields.ContactMappingField, inAppFormFields.FieldPriority };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<bool> Delete(Int16 Id)
        {
            string storeProcCommand = "MobileInApp_FormFields";
            object? param = new { Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<bool> DeleteFields(int InAppCampaignId)
        {
            string storeProcCommand = "MobileInApp_FormFields";
            object? param = new { Action = "DeleteFields", InAppCampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<List<MobileInAppFormFields>> GET(int InAppCampaignId)
        {
            string storeProcCommand = "MobileInApp_FormFields";
            object? param = new { Action = "GET"};

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobileInAppFormFields>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }


        public async Task<List<MobileInAppFormFields>> GET()
        {
            string storeProcCommand = "MobileInApp_FormFields";
            object? param = new { Action = "GET"};

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobileInAppFormFields>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

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
