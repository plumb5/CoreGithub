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
    public class DLLmsContactMailSmsWhatsAppDetailsSQL : CommonDataBaseInteraction, IDLLmsContactMailSmsWhatsAppDetails
    {
        CommonInfo connection;
        public DLLmsContactMailSmsWhatsAppDetailsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLmsContactMailSmsWhatsAppDetailsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(int apiid, int contactid, int lmsgroupid, int templateid, string channel, string p5field, string p5value)
        {
            string storeProcCommand = "Lmscontact_Mailsmswhatsappdetails";
            object? param = new {Action="Save" ,apiid, contactid, lmsgroupid, templateid, channel, p5field, p5value };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<Int32> CheckCommunicationSent(int apiid, int contactid, int lmsgroupid, int templateid, string channel, string p5field, string p5value)
        {
            string storeProcCommand = "Lmscontact_Mailsmswhatsappdetails";
            object? param = new { Action = "Get", apiid, contactid, lmsgroupid, templateid, channel, p5field, p5value };
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
