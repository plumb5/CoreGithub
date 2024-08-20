using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLSmsDLTConfigurationPG : CommonDataBaseInteraction, IDLSmsDLTConfiguration
    {
        CommonInfo connection;

        public DLSmsDLTConfigurationPG()
        {
            connection = GetDBConnection();
        }


        public DLSmsDLTConfigurationPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<SmsDLTConfiguration?> GetOperatorData(string OperatorName)
        {
            string storeProcCommand = "select * from smsdlt_configuration_getoperatordata(@OperatorName)";
            object? param = new { OperatorName };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsDLTConfiguration?>(storeProcCommand, param);
        }

        public async Task<List<SmsDLTConfiguration>> GetList()
        {
            string storeProcCommand = "select * from smsdlt_configuration_getlist()";

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsDLTConfiguration>(storeProcCommand)).ToList();
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

