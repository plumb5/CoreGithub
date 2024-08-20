using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Identity.Client;

namespace P5GenralDL
{
    public class DLSmsUrlParameterPG : CommonDataBaseInteraction, IDLSmsUrlParameter
    {
        CommonInfo connection;
        public DLSmsUrlParameterPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsUrlParameterPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<long> Save(SmsUrlParameter smsUrlParameter)
        {
            string storeProcCommand = "select * from Sms_UrlParameter(@Action,@UrlParameter)";
            object? param = new { Action = "Save", smsUrlParameter.UrlParameter };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param);

        }



        public async Task<string> Get(long SmsUrlParameterId)
        {
            string returnvalue = null;

            string storeProcCommand = "select * from sms_urlparameter_get(@SmsUrlParameterId)";
            object? param = new { SmsUrlParameterId };

            using var db = GetDbConnection(connection.Connection);
            var reader = await db.ExecuteReaderAsync(storeProcCommand, param);

            if (reader.Read())
                returnvalue = reader["UrlParameter"].ToString();

            return returnvalue;
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
