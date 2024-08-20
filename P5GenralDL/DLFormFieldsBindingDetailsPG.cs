using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DBInteraction;
using Dapper;
using IP5GenralDL;

namespace P5GenralDL
{
    public class DLFormFieldsBindingDetailsPG: CommonDataBaseInteraction, IDLFormFieldsBindingDetails
    {
        CommonInfo connection = null;
        public DLFormFieldsBindingDetailsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLFormFieldsBindingDetailsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int16> Save(FormFieldsBindingDetails formFields)
        {
            string storeProcCommand = "select formfields_bindingdetails_save(@UserInfoUserId, @FormId, @Name, @FieldType, @SubFields, @RelationField, @Mandatory, @PhoneValidationType, @FieldDisplay, @CalendarDisplayType, @RedirectLink, @ContactMappingField, @FormLayoutOrder, @FormUniqueIdentifier, @FieldShowOrHide)";
            object? param = new { formFields.UserInfoUserId, formFields.FormId, formFields.Name, formFields.FieldType, formFields.SubFields, formFields.RelationField, formFields.Mandatory, formFields.PhoneValidationType, formFields.FieldDisplay, formFields.CalendarDisplayType, formFields.RedirectLink, formFields.ContactMappingField, formFields.FormLayoutOrder, formFields.FormUniqueIdentifier, formFields.FieldShowOrHide };
            using var db = GetDbConnection(connection.Connection);
            return Convert.ToInt16(await db.ExecuteScalarAsync<int>(storeProcCommand, param));
        }

        public async Task<bool>   Update(FormFieldsBindingDetails formFields)
        {
            string storeProcCommand = "select formfields_bindingdetails_update(@UserInfoUserId, @Id, @FormId, @Name, @FieldType, @SubFields, @RelationField, @Mandatory, @PhoneValidationType, @FieldDisplay, @CalendarDisplayType, @RedirectLink, @ContactMappingField, @FormLayoutOrder, @FormUniqueIdentifier, @FieldShowOrHide)";
            object? param = new { formFields.UserInfoUserId, formFields.Id, formFields.FormId, formFields.Name, formFields.FieldType, formFields.SubFields, formFields.RelationField, formFields.Mandatory, formFields.PhoneValidationType, formFields.FieldDisplay, formFields.CalendarDisplayType, formFields.RedirectLink, formFields.ContactMappingField, formFields.FormLayoutOrder, formFields.FormUniqueIdentifier, formFields.FieldShowOrHide };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
        }

        public async Task<bool> Delete(Int16 Id)
        {
            string storeProcCommand = "select formfields_bindingdetails_delete(@Id)";
            object? param = new { Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> DeleteFields(Int32 FormId)
        {
            string storeProcCommand = "select formfields_bindingdetails_deletefields(@FormId)";
            
            object? param = new { FormId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<IEnumerable<FormFieldsBindingDetails>> GET(int FormId)
        {
            string storeProcCommand = "select * from formfields_bindingdetails_get(@FormId)";
      
            object? param = new { FormId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<FormFieldsBindingDetails>(storeProcCommand, param);
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
