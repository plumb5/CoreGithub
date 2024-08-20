using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLMailDripsSQL : CommonDataBaseInteraction, IDLMailDrips
    {
        CommonInfo connection;

        public DLMailDripsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailDripsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<bool> UpdateDripDetails(MailDrips mailDrips)
        {
            string storeProcCommand = "Mail_Drips";
            object? param = new { Action = "UpdateDripDetails", mailDrips.Id, mailDrips.MailTemplateId, mailDrips.DripSubject, mailDrips.DripConditionType, mailDrips.MySeniorDripConditionType, mailDrips.ScheduledDate };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
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
