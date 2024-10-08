﻿using Dapper;
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
    public class DLContactFieldEditSettingSQL : CommonDataBaseInteraction, IDLContactFieldEditSetting
    {
        CommonInfo connection;
        public DLContactFieldEditSettingSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public DLContactFieldEditSettingSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<MLContactFieldEditSetting>> GetFullList()
        {
            string storeProcCommand = "ContactField_EditSetting";
            object? param = new { Action = "GetIsSearchbyColumnValues" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLContactFieldEditSetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }
        public async Task<List<MLContactFieldEditSetting>> GetMLIsSearchbyColumn()
        {
            string storeProcCommand = "ContactField_Property";
            object? param = new { Action = "GetIsSearchbyColumnValues" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLContactFieldEditSetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }
        public async Task<bool> UpdateProperty(ContactFieldProperty c)
        {
            string storeProcCommand = "ContactField_Property";
            object? param = new { Action= "UpdateIsSearchByColumn", c.Id, c.IsSearchbyColumn };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }
        public async Task<List<ContactFieldEditSetting>> GetSetting()
        {
            string storeProcCommand = "ContactField_EditSetting";
            object? param = new { Action= "GetSetting" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ContactFieldEditSetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task SaveProperty(ContactFieldEditSetting editSetting)
        {
            string storeProcCommand = "ContactField_EditSetting";
            object? param = new { Action = "SaveProperty", editSetting.PropertyId, editSetting.IsMandatory, editSetting.IsCustomField };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }



        public async Task DeleteProperty(int PropertyId)
        {
            string storeProcCommand = "ContactField_EditSetting";
            object? param = new { Action = "DeleteProperty", PropertyId };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task UpdateDisplayOrder(ContactFieldEditSetting editSetting)
        {
            string storeProcCommand = "ContactField_EditSetting";
            object? param = new { Action = "UpdateDisplayOrder", editSetting.PropertyId, editSetting.DisplayOrder };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task DeletePropertyByName(string PropertyName)
        {
            string storeProcCommand = "ContactField_EditSetting";
            object? param = new { Action = "DeletePropertyByName", PropertyName };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task SaveupdateLmsheaderflag(bool headerflag)
        {
            string storeProcCommand = "Lms_HeaderFlag";
            object? param = new { Action= "Saveupdateheaderflag", headerflag };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<List<MLContactFieldEditSetting>> GetMLIsPublisher()
        {
            string storeProcCommand = "ContactField_Property";
            object? param = new { Action = "GetPublisherField" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLContactFieldEditSetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }
        public async Task<bool> UpdatePublisherField(ContactFieldProperty c)
        {
            string storeProcCommand = "ContactField_Property";
            object? param = new { Action = "UpdatePublisherField", c.Id, c.IsPublisherField };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
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
