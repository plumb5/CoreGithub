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
    public class DLMailDripsPG : CommonDataBaseInteraction, IDLMailDrips
    {
        CommonInfo connection;

        public DLMailDripsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailDripsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<bool> UpdateDripDetails(MailDrips mailDrips)
        {
            string storeProcCommand = "select mail_drips_updatedripdetails(@Id, @MailTemplateId, @DripSubject, @DripConditionType, @MySeniorDripConditionType, @ScheduledDate)";
            object? param = new { mailDrips.Id, mailDrips.MailTemplateId, mailDrips.DripSubject, mailDrips.DripConditionType, mailDrips.MySeniorDripConditionType, mailDrips.ScheduledDate };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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
