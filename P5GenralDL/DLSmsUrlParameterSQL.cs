using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace P5GenralDL
{
    public class DLSmsUrlParameterSQL : CommonDataBaseInteraction, IDLSmsUrlParameter
    {
        CommonInfo connection;
        public DLSmsUrlParameterSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsUrlParameterSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<long> Save(SmsUrlParameter smsUrlParameter)
        {
            string storeProcCommand = "Sms_UrlParameter";
            object? param = new { Action= "Save", smsUrlParameter.UrlParameter };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

       
        public async Task<string> Get(long SmsUrlParameterId)
        {
            string returnvalue = null;

            string storeProcCommand = "Sms_UrlParameter";
            object? param = new { Action="Get", SmsUrlParameterId };

            using var db = GetDbConnection(connection.Connection);
            var reader = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
