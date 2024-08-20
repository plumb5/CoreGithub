using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLIpligenceStateListPG : CommonDataBaseInteraction, IDLIpligenceStateList
    {
        CommonInfo connection;
        public DLIpligenceStateListPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLIpligenceStateListPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<List<IpligenceDAS>> GetStateList(string StateName)
        {
            string storeProcCommand = "select * from ipligence_statelist(@StateName)";
            List<string> paramName = new List<string> { StateName };
            object? param = new { };
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<IpligenceDAS>(storeProcCommand, param)).ToList();
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



