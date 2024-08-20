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
    public class DLCustomEventImportFileFieldMappingSQL : CommonDataBaseInteraction, IDLCustomEventImportFileFieldMapping
    {
        CommonInfo connection = null;
        public DLCustomEventImportFileFieldMappingSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLCustomEventImportFileFieldMappingSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(CustomEventImportFileFieldMapping importFileFieldMapping)
        {
            string storeProcCommand = "CustomEventImportFileField_Mapping";
            object? param = new {Action="Save", importFileFieldMapping.ImportOverViewId, importFileFieldMapping.FileFieldName, importFileFieldMapping.FileFieldIndex, importFileFieldMapping.P5ColumnName, importFileFieldMapping.FrontEndName, importFileFieldMapping.IsMapped, importFileFieldMapping.IsNameChanged, importFileFieldMapping.FieldMappingType };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
