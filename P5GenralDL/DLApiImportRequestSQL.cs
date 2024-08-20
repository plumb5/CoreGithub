using P5GenralML;
using IP5GenralDL;
using System.Data;
using System.Globalization;
using System.ComponentModel;
using DBInteraction;
using Dapper;


namespace P5GenralDL
{
    public  class DLApiImportRequestSQL : CommonDataBaseInteraction, IDLApiImportRequest
    {
        CommonInfo connection;
        public DLApiImportRequestSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async Task<Int32> GetMaxCount(DateTime fromdatetime, DateTime todatetime, string requestcontent = null, string name = null, bool? IsContactSuccess = null, bool? IsLmsSuccess = null)
        {
            string storeProcCommand = "ApiImportResponseSetting_Logs";
            object? param = new { Action = "Maxcount", fromdatetime, todatetime, requestcontent, name, IsContactSuccess, IsLmsSuccess };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<DataSet> GetDetails(DateTime fromdatetime, DateTime todatetime, string requestcontent = null, string name = null, bool? IsContactSuccess = null, bool? IsLmsSuccess = null, int offset = 0, int fetchnext = 10)
        {
            string storeProcCommand = "ApiImportResponseSetting_Logs";
            object? param = new { Action = "GetDetails", fromdatetime, todatetime, requestcontent, name, IsContactSuccess, IsLmsSuccess, offset, fetchnext };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
