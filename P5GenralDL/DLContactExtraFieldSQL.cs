using P5GenralML;
using IP5GenralDL;
using System.Data;
using System.Globalization;
using System.ComponentModel;
using DBInteraction;
using Dapper;
using Azure.Core;
using System;


namespace P5GenralDL
{
    public class DLContactExtraFieldSQL : CommonDataBaseInteraction, IDLContactExtraField
    {
        CommonInfo connection;
        public DLContactExtraFieldSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLContactExtraFieldSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int16> Save(ContactExtraField contactField)
        {
            string storeProcCommand = "Contact_ExtraField";
            object? param = new { Action="Save", contactField.UserInfoUserId, contactField.UserGroupId, contactField.FieldName, contactField.FieldType, contactField.SubFields, contactField.HideField, contactField.IsMandatory };
            using var db = GetDbConnection(connection.Connection);
            return Convert.ToInt16(await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure));
        }

        public async Task<bool>  Update(ContactExtraField contactField)
        {
            string storeProcCommand = "Contact_ExtraField";
            object? param = new { Action = "Update", contactField.Id, contactField.UserInfoUserId, contactField.UserGroupId, contactField.FieldName, contactField.FieldType, contactField.SubFields, contactField.HideField, contactField.IsMandatory };
            using var db = GetDbConnection(connection.Connection);
            return  await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;
        }

        public async Task<List<ContactExtraField>> GetList(int UserInfoUserId = 0, List<int> UserInfoUserIdList = null)
        {
            string storeProcCommand = "Contact_ExtraField"; 
            object? param = new {Action="GET" };
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ContactExtraField>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<bool> Delete(int Id)
        {
            int fieldIndex = 0;

            string storeProcCommand = "Contact_ExtraField";
            object? param = new { Action = "DeleteField", Id };
            using var db = GetDbConnection(connection.Connection);
            fieldIndex = Convert.ToInt32(await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)); 
            string UpdateFields = "";
            if (fieldIndex > 0)
            {
                storeProcCommand = "ContactField_EditSetting";
                string PropertyName = "CustomField" + fieldIndex.ToString();
                object? paramName = new { Action = "DeletePropertyByName", PropertyName };
                using var dbs = GetDbConnection(connection.Connection);
                int fieldIndexs = Convert.ToInt32(await dbs.ExecuteAsync(storeProcCommand, paramName, commandType: CommandType.StoredProcedure));


                for (int i = fieldIndex; i < 60; i++)
                {
                    UpdateFields += ",customfield" + i.ToString() + "=customfield" + (i + 1).ToString();
                }
                UpdateFields = UpdateFields.TrimStart(',');

                storeProcCommand = "Contact_ExtraField"; 
                object? paramNames = new { Action= "UpdateCommand", UpdateFields };
                using var udbs = GetDbConnection(connection.Connection);
                return await udbs.ExecuteAsync(storeProcCommand, paramNames, commandType: CommandType.StoredProcedure)>0;
            }
            return false;
        }

        public async Task<bool> ChangeEditableStatus(ContactExtraField fieldConfig)
        {
            string storeProcCommand = "Contact_ExtraField";
            object? param = new {Action= "ChangeEditableStatus", fieldConfig.Id, fieldConfig.IsEditable };
            using var db = GetDbConnection(connection.Connection);  
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<ContactExtraField?> GetDetails(ContactExtraField fieldConfig)
        {
            string storeProcCommand = "Contact_ExtraField"; 
            object? param = new {Action= "GetDetails", fieldConfig.Id, fieldConfig.FieldName };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ContactExtraField?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
