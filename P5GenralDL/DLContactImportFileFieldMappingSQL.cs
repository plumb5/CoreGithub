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
    public class DLContactImportFileFieldMappingSQL : CommonDataBaseInteraction, IDLContactImportFileFieldMapping
    {
        readonly CommonInfo connection;
        public DLContactImportFileFieldMappingSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLContactImportFileFieldMappingSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(ContactImportFileFieldMapping importFileFieldMapping)
        {
            string storeProcCommand = "UpdateScore";
            object? param = new { Action = "Save", importFileFieldMapping.ImportOverViewId, importFileFieldMapping.FileFieldName, importFileFieldMapping.FileFieldIndex, importFileFieldMapping.P5ColumnName, importFileFieldMapping.FrontEndName, importFileFieldMapping.IsMapped, importFileFieldMapping.IsNameChanged };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    
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
