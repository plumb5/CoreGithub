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
    internal class DLSiteSerachConfigurationPG : CommonDataBaseInteraction, IDLSiteSerachConfiguration
    {
        CommonInfo connection;
        public DLSiteSerachConfigurationPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSiteSerachConfigurationPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(LoginInfo user, string Plumb5AccountDomain, string Plumb5AccountName, string SiteUrl)
        {
            string storeProcCommand = "select * from sitesearch_configuration_save(@Plumb5AccountName, @Plumb5AccountDomain, @UserId, @UserName, @EmailId, @SiteUrl)";
            object? param = new { Plumb5AccountName, Plumb5AccountDomain, user.UserId, user.UserName, user.EmailId, SiteUrl };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
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
