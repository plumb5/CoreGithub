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
    public class DLCustomEventImportFromFilePG : CommonDataBaseInteraction, IDLCustomEventImportFromFile
    {
        CommonInfo conne;

        public DLCustomEventImportFromFilePG(int adsId)
        {
            conne = GetDBConnection(adsId);
        }

        public async void ImportData(DataTable dt, int EventImportOverViewId)
        {
            CommonBulkInsert(conne.Connection, dt, "customeventimportfromfile");
        }

        public async Task<DataSet>  StartImport(int EventImportOverViewId, ContactMergeConfiguration mergeConfiguration)
        {
            string storeProcCommand = "select * from customevent_importfrom_file_startimport(EventImportOverViewId, @PrimaryEmail, @PrimarySMS, @AlternateEmail, @AlternateSMS)";
            object? param = new { EventImportOverViewId, mergeConfiguration.PrimaryEmail, mergeConfiguration.PrimarySMS, mergeConfiguration.AlternateEmail, mergeConfiguration.AlternateSMS };

            using var db = GetDbConnection(conne.Connection); 
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    conne = null;
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
