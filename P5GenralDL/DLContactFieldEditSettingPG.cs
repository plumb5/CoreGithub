﻿using Dapper;
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
    public class DLContactFieldEditSettingPG : CommonDataBaseInteraction, IDLContactFieldEditSetting
    {
        CommonInfo connection;
        int AdsId;
        public DLContactFieldEditSettingPG(int adsId)
        {
            AdsId = adsId;
            connection = GetDBConnection(adsId);
        }
        public DLContactFieldEditSettingPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<MLContactFieldEditSetting>> GetFullList()
        {
            List<MLContactFieldEditSetting> ContactPropertyList = null;
            string storeProcCommand = "select * from contactfield_editsetting_getfulllist()";
            
            using var db = GetDbConnection(connection.Connection);
            ContactPropertyList=(await db.QueryAsync<MLContactFieldEditSetting>(storeProcCommand)).ToList();

            
            if (ContactPropertyList != null && ContactPropertyList.Count > 0 && ContactPropertyList.Any(x => x.IsCustomField && x.PropertyName.Contains("CustomField")))
            {
                List<ContactExtraField> extraFieldList = null;                
                DLContactExtraFieldPG objBL = new DLContactExtraFieldPG(AdsId);
                extraFieldList = await objBL.GetList();

                if (extraFieldList != null && extraFieldList.Count > 0)
                {
                    for (int i = 1; i <= extraFieldList.Count; i++)
                    {
                        foreach (var PropertyList in ContactPropertyList.Where(x => x.PropertyName == "CustomField" + i))
                        {
                            PropertyList.DisplayName = extraFieldList[i - 1].FieldName;
                            PropertyList.FieldType = (short)extraFieldList[i - 1].FieldType;
                            PropertyList.IsMandatory = extraFieldList[i - 1].IsMandatory;

                            var SubFields = extraFieldList[i - 1].SubFields == null ? "" : extraFieldList[i - 1].SubFields;
                            var SubFieldKeyValue = "";
                            if (!string.IsNullOrEmpty(SubFields))
                            {
                                var SubFieldsArray = SubFields.Split(',');
                                SubFieldKeyValue = "[";
                                foreach (var item in SubFieldsArray)
                                {
                                    SubFieldKeyValue += "{\"Name\":\"" + item + "\",\"Value\":\"" + item + "\"},";
                                }

                                SubFieldKeyValue = SubFieldKeyValue.TrimEnd(',') + "]";
                            }

                            PropertyList.FieldOption = SubFieldKeyValue;
                        }
                    }
                }

                ContactPropertyList.RemoveAll(x => x.DisplayName == string.Empty);
            }

            return ContactPropertyList;
        }

        public async Task<List<ContactFieldEditSetting>> GetSetting()
        {
            string storeProcCommand = "select * from ContactField_EditSetting(@Action)";
            object? param = new { Action= "GetSetting" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ContactFieldEditSetting>(storeProcCommand, param)).ToList();

        }

        public async Task SaveProperty(ContactFieldEditSetting editSetting)
        {
            string storeProcCommand = "select * from contactfield_editsetting_saveproperty(@PropertyId,@IsMandatory,@IsCustomField)";
            object? param = new { editSetting.PropertyId, editSetting.IsMandatory, editSetting.IsCustomField };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync(storeProcCommand, param);
        }

        public async Task DeleteProperty(int PropertyId)
        {
            string storeProcCommand = "select * from contactfield_editsetting_deleteproperty(@PropertyId)";
            object? param = new { PropertyId };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync(storeProcCommand, param);

        }

        public async Task UpdateDisplayOrder(ContactFieldEditSetting editSetting)
        {
            string storeProcCommand = "select * from contactfield_editsetting_updatedisplayorder(@PropertyId,@DisplayOrder)";
            object? param = new { editSetting.PropertyId, editSetting.DisplayOrder };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync(storeProcCommand, param);

        }

        public async Task DeletePropertyByName(string PropertyName)
        {
            string storeProcCommand = "select * from ContactField_EditSetting(@Action,@PropertyName)";
            object? param = new { Action= "DeletePropertyByName", PropertyName };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync(storeProcCommand, param);

        }
       
        public async Task SaveupdateLmsheaderflag(bool headerflag)
        {
                string storeProcCommand = "select * from Lms_HeaderFlag_Saveupdateheaderflag(@headerflag)";
                object? param = new { headerflag };

                using var db = GetDbConnection(connection.Connection);
                await db.ExecuteScalarAsync(storeProcCommand, param);
             
        }
        public async Task<bool> UpdateProperty(ContactFieldProperty c)
        {
            string storeProcCommand = "select * from contactfield_property_updateissearchbycolumn(@Id,@IsSearchbyColumn)";
            object? param = new { c.Id, c.IsSearchbyColumn };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<List<MLContactFieldEditSetting>> GetMLIsSearchbyColumn()
        {
            string storeProcCommand = "select * from contactfield_property_getissearchbycolumnvalues()";
            
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLContactFieldEditSetting>(storeProcCommand)).ToList();

        }

        public async Task<List<MLContactFieldEditSetting>> GetMLIsPublisher()
        {
            string storeProcCommand = "select * from contactfield_property_getispublisherfieldcolumnvalues()";
           
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLContactFieldEditSetting>(storeProcCommand)).ToList();

        }

        public async Task<bool> UpdatePublisherField(ContactFieldProperty c)
        {
            string storeProcCommand = "select * from contactfield_property_updateispublisherfield(@Id,@IsPublisherField)";
            object? param = new { c.Id, c.IsPublisherField };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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
