using P5GenralML;
using IP5GenralDL;
using System.Data;
using System.Globalization;
using System.ComponentModel;
using DBInteraction;
using Dapper;


namespace P5GenralDL
{
    public class DLApiImportRequestPG : CommonDataBaseInteraction, IDLApiImportRequest
    {
        CommonInfo connection;
        public DLApiImportRequestPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async Task<Int32> GetMaxCount(DateTime fromdatetime, DateTime todatetime, string requestcontent = null, string name = null, bool? IsContactSuccess = null, bool? IsLmsSuccess = null)
        {
            string storeProcCommand = "select * from getapiimportresponsesettinglogs_maxcount(@fromdatetime,@todatetime,@requestcontent,@name,@IsContactSuccess,@IsLmsSuccess)";
            object? param = new { fromdatetime, todatetime, requestcontent, name, IsContactSuccess, IsLmsSuccess };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<DataSet> GetDetails(DateTime fromdatetime, DateTime todatetime, string requestcontent = null, string name = null, bool? IsContactSuccess = null, bool? IsLmsSuccess = null, int offset = 0, int fetchnext = 10)
        {
            string storeProcCommand = "select * from getapiimportresponsesettinglogs_getdetails(@fromdatetime,@todatetime,@requestcontent,@name,@IsContactSuccess,@IsLmsSuccess,@offset,@fetchnext)";
            object? param = new { fromdatetime, todatetime, requestcontent, name, IsContactSuccess, IsLmsSuccess, offset, fetchnext };
            using var db = GetDbConnection(connection.Connection);
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
