﻿using Dapper;
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
    public class DLLeadUnSeenPG : CommonDataBaseInteraction, IDLLeadUnSeen
    {
        CommonInfo connection;
        public DLLeadUnSeenPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLeadUnSeenPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> LeadUnSeenMaxCount()
        {
            string storeProcCommand = "select Leads_UnSeenReport_LeadsUnSeenReport()"; 
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand);
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
