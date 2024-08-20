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
    public class DLFormFieldsBindingDetailsSQL : CommonDataBaseInteraction, IDLFormFieldsBindingDetails
    {
        CommonInfo connection = null;
        public DLFormFieldsBindingDetailsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLFormFieldsBindingDetailsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int16> Save(FormFieldsBindingDetails formFields)
        {
            string storeProcCommand = "FormFields_BindingDetails";
            object? param = new { Action="Save",formFields.UserInfoUserId, formFields.FormId, formFields.Name, formFields.FieldType, formFields.SubFields, formFields.RelationField, formFields.Mandatory, formFields.PhoneValidationType, formFields.FieldDisplay, formFields.CalendarDisplayType, formFields.RedirectLink, formFields.ContactMappingField, formFields.FormLayoutOrder, formFields.FormUniqueIdentifier, formFields.FieldShowOrHide };
            using var db = GetDbConnection(connection.Connection);
            return Convert.ToInt16( await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure));
        }

        public async Task<bool> Update(FormFieldsBindingDetails formFields)
        {
            string storeProcCommand = "FormFields_BindingDetails";
            object? param = new { Action = "Update", formFields.UserInfoUserId, formFields.Id, formFields.FormId, formFields.Name, formFields.FieldType, formFields.SubFields, formFields.RelationField, formFields.Mandatory, formFields.PhoneValidationType, formFields.FieldDisplay, formFields.CalendarDisplayType, formFields.RedirectLink, formFields.ContactMappingField, formFields.FormLayoutOrder, formFields.FormUniqueIdentifier, formFields.FieldShowOrHide };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;
        }

        public async Task<bool> Delete(Int16 Id)
        {
            string storeProcCommand = "FormFields_BindingDetails";
            object? param = new { Action = "Delete", Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> DeleteFields(Int32 FormId)
        {
            string storeProcCommand = "FormFields_BindingDetails";

            object? param = new { Action= "DeleteFields", FormId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<IEnumerable<FormFieldsBindingDetails>> GET(int FormId)
        {
            string storeProcCommand = "FormFields_BindingDetails";

            object? param = new { Action = "GET", FormId };
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<FormFieldsBindingDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
