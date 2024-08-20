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
    public class DLWebPushSubscriptionSettingWithVapidPublicKeyPG : CommonDataBaseInteraction, IDLWebPushSubscriptionSettingWithVapidPublicKey
    {
        CommonInfo connection;
        public DLWebPushSubscriptionSettingWithVapidPublicKeyPG(int AccountId)
        {
            connection = GetDBConnection(AccountId);
        }

        public DLWebPushSubscriptionSettingWithVapidPublicKeyPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<WebPushSubscriptionSettingWithVapidPublicKey?> GetWebPushSubscriptionSetting()
        {
            string storeProcCommand = "select * from webpush_subscriptionsetting_getvapidkey()";

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WebPushSubscriptionSettingWithVapidPublicKey?>(storeProcCommand);


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
