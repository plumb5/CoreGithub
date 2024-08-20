using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.Intrinsics.Arm;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLContactFieldPropertyPG : CommonDataBaseInteraction, IDLContactFieldProperty
    {
        CommonInfo connection;
        int AdsId;
        public DLContactFieldPropertyPG(int adsId)
        {
            AdsId = adsId;
            connection = GetDBConnection(adsId);
        }
        public DLContactFieldPropertyPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<ContactFieldProperty>> GetAll()
        {
            List<ContactFieldProperty> ContactPropertyList = null;
            try
            {
                 
                string storeProcCommand = "select * from contactfield_property_getall()";


                using var db = GetDbConnection(connection.Connection);
                ContactPropertyList = (await db.QueryAsync<ContactFieldProperty>(storeProcCommand)).ToList();
                ContactPropertyList = await BindDisplayName(ContactPropertyList);
                
            }
            catch (Exception ex)
            {
                 ex.Message.ToString();
            }
            return ContactPropertyList;

        }

        public async Task<List<ContactFieldProperty>> GetSelectedContactField()
        {
            List<ContactFieldProperty> ContactPropertyList = null;
            string storeProcCommand = "select * from contactfield_property_getselectedcontactfield()";
            
            using var db = GetDbConnection(connection.Connection);
            ContactPropertyList=(await db.QueryAsync<ContactFieldProperty>(storeProcCommand)).ToList();

            ContactPropertyList = await BindDisplayName(ContactPropertyList);
            return ContactPropertyList;
        }

        public async Task<Int32> Save(ContactFieldProperty contactFieldProperty)
        {
            string storeProcCommand = "select * from ContactField_Property(@Action, @PropertyName, @DisplayName, @FieldType, @FieldOption, @IsCustomField)";
            object? param = new { Action= "Save", contactFieldProperty.PropertyName, contactFieldProperty.DisplayName, contactFieldProperty.FieldType, contactFieldProperty.FieldOption, contactFieldProperty.IsCustomField };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) ;

        }

        public async Task<List<ContactFieldProperty>> GetMasterFilterColumns()
        {
            List<ContactFieldProperty> ContactPropertyList = null;
            string storeProcCommand = "select * from contactfield_property_getmasterfiltercolumn()";

            using var db = GetDbConnection(connection.Connection);
            ContactPropertyList = (await db.QueryAsync<ContactFieldProperty>(storeProcCommand)).ToList();

            ContactPropertyList = await BindDisplayName(ContactPropertyList);
            return ContactPropertyList;
        }

        #region Bind Custom Field Name
        private async Task<List<ContactFieldProperty>> BindDisplayName(List<ContactFieldProperty> contactFieldProperties)
        {
            if (contactFieldProperties != null && contactFieldProperties.Count > 0)
            {
                List<ContactExtraField> extraFieldList = null;
                DLContactExtraFieldPG objBL = new DLContactExtraFieldPG(AdsId);
                extraFieldList = await objBL.GetList();

                if (extraFieldList != null && extraFieldList.Count > 0)
                {
                    for (int i = 1; i <= extraFieldList.Count; i++)
                    {
                        foreach (var PropertyList in contactFieldProperties.Where(x => x.IsCustomField && x.PropertyName == "CustomField" + i))
                        {
                            PropertyList.DisplayName = extraFieldList[i - 1].FieldName;
                            PropertyList.FieldType = (short)extraFieldList[i - 1].FieldType;
                            PropertyList.FieldOption = extraFieldList[i - 1].SubFields == null ? "" : extraFieldList[i - 1].SubFields;
                        }
                    }
                }

                contactFieldProperties.RemoveAll(x => x.DisplayName == string.Empty);
            }

            return contactFieldProperties;
        }
        #endregion

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
