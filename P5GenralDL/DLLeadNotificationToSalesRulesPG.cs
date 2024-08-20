using Dapper;
using DBInteraction;
using IP5GenralDL;
using Newtonsoft.Json;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    internal class DLLeadNotificationToSalesRulesPG : CommonDataBaseInteraction, IDLLeadNotificationToSalesRules
    {
        CommonInfo connection;
        public DLLeadNotificationToSalesRulesPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async Task<IEnumerable<LeadNotificationToSalesRules>>  GetLeadNotificationToSales(int Id = 0, bool? Status = null)
        {
            string storeProcCommand = "select * from leadnotification_tosalesrules_get(@Id, @Status )"; 
            object? param = new  {Id, Status };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<LeadNotificationToSalesRules>(storeProcCommand, param);
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
