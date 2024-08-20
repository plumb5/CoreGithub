using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLGcmFcmSettingsSQL : CommonDataBaseInteraction, IDLGcmFcmSettings
    {
        CommonInfo connection = null;
        public DLGcmFcmSettingsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLGcmFcmSettingsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<object> GetNotification(MLGcmFcmSettings mlObj)
        {
            try
            {
                string storeProcCommand = "SelectGcmFcmSettings";
                object? param = new { mlObj.Action, mlObj.SenderId, mlObj.ApiKey, mlObj.PackageName, mlObj.Type, mlObj.IsDefault };

                using var db = GetDbConnection(connection.Connection);
                return await db.QueryAsync<DataSet>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

            }
            catch
            {
                return 0;
            }
        }

        public async Task<object> GettingIOSSettings(APNsettings mlObj)
        {
            try
            {
                string storeProcCommand = "SelectIOS_PushSettings";
                object? param = new { mlObj.Action, mlObj.CertificateName, mlObj.PassPhrase, mlObj.PushMode, mlObj.IOSPackageName };

                using var db = GetDbConnection(connection.Connection);
                return await db.QueryAsync<DataSet>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

            }
            catch
            {
                return 0;
            }
        }
    }
}
