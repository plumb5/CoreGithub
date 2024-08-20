using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLContactExtraFieldPG : CommonDataBaseInteraction, IDLContactExtraField
    {
        CommonInfo connection;
        public DLContactExtraFieldPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLContactExtraFieldPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int16> Save(ContactExtraField contactField)
        {
            string storeProcCommand = "select contact_extrafield_save(@UserInfoUserId, @UserGroupId, @FieldName, @FieldType, @SubFields, @HideField, @IsMandatory)";
            object? param = new {contactField.UserInfoUserId, contactField.UserGroupId, contactField.FieldName, contactField.FieldType, contactField.SubFields, contactField.HideField, contactField.IsMandatory };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param);
        }

        public async Task<bool>  Update(ContactExtraField contactField)
        {
            string storeProcCommand = "select contact_extrafield_update(@Id, @UserInfoUserId, @UserGroupId, @FieldName, @FieldType, @SubFields, @HideField, @IsMandatory)";
            object? param = new { contactField.Id, contactField.UserInfoUserId, contactField.UserGroupId, contactField.FieldName, contactField.FieldType, contactField.SubFields, contactField.HideField, contactField.IsMandatory };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
        }

        public async Task<List<ContactExtraField>>  GetList(int UserInfoUserId = 0, List<int> UserInfoUserIdList = null)
        {
            string storeProcCommand = "select * from contact_extrafield_get()"; 
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ContactExtraField>(storeProcCommand)).ToList();
        }

        public async Task<bool> Delete(int Id)
        {
            int fieldIndex = 0;

            string storeProcCommand = "select contact_extrafield_deletefield(@Id)";
            object? param = new { Id };
            using var db = GetDbConnection(connection.Connection);
            fieldIndex = Convert.ToInt32(await db.ExecuteScalarAsync(storeProcCommand, param));
            
            string UpdateFields = "";
            if (fieldIndex > 0)
            {
                storeProcCommand = "select contactfield_editsetting_deletepropertybyname(@PropertyName)";
                string PropertyName = "CustomField" + fieldIndex.ToString();
                object? paramName = new { PropertyName };
                using var dbs = GetDbConnection(connection.Connection);
                int fieldIndexs = Convert.ToInt32(await dbs.ExecuteScalarAsync(storeProcCommand, paramName));

                for (int i = fieldIndex; i < 60; i++)
                {
                    UpdateFields += ",customfield" + i.ToString() + "=customfield" + (i + 1).ToString();
                }
                UpdateFields = UpdateFields.TrimStart(',');

                storeProcCommand = "select contact_extrafield_updatecommand(@UpdateFields)"; 
                object? paramNames = new { UpdateFields }; 
                using var udbs = GetDbConnection(connection.Connection);
                return await udbs.ExecuteScalarAsync<int>(storeProcCommand, paramNames) >0;
            }
            return false;
        }

        public async Task<bool> ChangeEditableStatus(ContactExtraField fieldConfig)
        {
            string storeProcCommand = "select contact_extrafield_changeeditablestatus(@Id,@IsEditable)";

            object? param = new { fieldConfig.Id, fieldConfig.IsEditable };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<ContactExtraField?>   GetDetails(ContactExtraField fieldConfig)
        {
            string storeProcCommand = "select * from contact_extrafield_getdetails(@Id,@FieldName)"; 
            object? param = new { fieldConfig.Id, fieldConfig.FieldName };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ContactExtraField?>(storeProcCommand, param);
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
