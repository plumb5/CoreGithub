using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace P5GenralDL
{
    public class DLContactMergeConfigurationPG : CommonDataBaseInteraction, IDLContactMergeConfiguration
    {
        private CommonInfo connection;
        public DLContactMergeConfigurationPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLContactMergeConfigurationPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(ContactMergeConfiguration settings)
        {
            const string storeProcCommand = "select contact_mergeconfiguration_save(@UserInfoUserId, @PrimaryEmail, @PrimarySMS, @AlternateEmail, @AlternateSMS)";
            object? param = new { settings.UserInfoUserId, settings.PrimaryEmail, settings.PrimarySMS, settings.AlternateEmail, settings.AlternateSMS };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
             
        }

        public async Task<ContactMergeConfiguration?> GetSettingDetails()
        {
            const string storeProcCommand = "select * from contact_mergeconfiguration_getsettingdetails()"; 
            object? param = new { }; 
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ContactMergeConfiguration?>(storeProcCommand, param);
        }
        

        public async Task<bool> Delete(int Id)
        {
            const string storeProcCommand = "select contact_mergeconfiguration_delete(@Id)";

            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0; 
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
