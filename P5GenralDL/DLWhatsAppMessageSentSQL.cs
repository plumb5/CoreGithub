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
    public class DLWhatsAppMessageSentSQL : CommonDataBaseInteraction, IDLWhatsAppMessageSent
    {
        CommonInfo connection;
        public DLWhatsAppMessageSentSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWhatsAppMessageSentSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<DataSet> GetOpenAndClickedRate(string GroupIds)
        {
            string storeProcCommand = "Sms_Sent";
            object? param = new { Action = "GetDeliveredAndClickedRate", GroupIds };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;

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
