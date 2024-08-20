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
    public class DLWhatsAppConfigurationPG : CommonDataBaseInteraction, IDLWhatsAppConfiguration
    {
        CommonInfo connection;
        public DLWhatsAppConfigurationPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWhatsAppConfigurationPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(WhatsAppConfiguration whatsAppConfigurationDetails, string ConfigurationName = null)
        {
            string storeProcCommand = "select * from whatsapp_configuration_save(@UserInfoUserId,@ProviderName,@IsDefaultProvider,@ApiKey,@WhatsappBussinessNumber,@CountryCode,@ConfigurationUrl,@ConfigurationName )";
            object? param = new { whatsAppConfigurationDetails.UserInfoUserId, whatsAppConfigurationDetails.ProviderName, whatsAppConfigurationDetails.IsDefaultProvider, whatsAppConfigurationDetails.ApiKey, whatsAppConfigurationDetails.WhatsappBussinessNumber, whatsAppConfigurationDetails.CountryCode, whatsAppConfigurationDetails.ConfigurationUrl, ConfigurationName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task TruncateWSPDetails()
        {
            string storeProcCommand = "select * from whatsapp_configuration_truncatewspdetails()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<WhatsAppConfiguration?> GetConfigurationDetails(int Id = 0)
        {
            string storeProcCommand = "select * from whatsapp_configuration_get(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WhatsAppConfiguration>(storeProcCommand, param);

        }

        public async Task<List<WhatsAppConfiguration>> GetWhatsAppConfigurationDetails(WhatsAppConfiguration whatsappConfiguration)
        {
            string storeProcCommand = "select * from whatsapp_configuration_get(@Id,@ProviderName)";
            object? param = new { whatsappConfiguration.Id,whatsappConfiguration.ProviderName };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WhatsAppConfiguration>(storeProcCommand, param)).ToList();

        }

        public async Task<bool> Delete(int WSPID)
        {
            string storeProcCommand = "select * from WhatsApp_Configuration(@Action,@WSPID)";
            object? param = new { Action = "Delete", WSPID };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<int> update(WhatsAppConfiguration whatsAppConfigurationDetails, string ConfigurationName)
        {
            string storeProcCommand = "select * from whatsapp_configuration_update(@Id, @UserInfoUserId, @ProviderName, @IsDefaultProvider, @ApiKey, @WhatsappBussinessNumber, @CountryCode, @ConfigurationUrl,@ConfigurationName)";
            object? param = new { whatsAppConfigurationDetails.Id, whatsAppConfigurationDetails.UserInfoUserId, whatsAppConfigurationDetails.ProviderName, whatsAppConfigurationDetails.IsDefaultProvider, whatsAppConfigurationDetails.ApiKey, whatsAppConfigurationDetails.WhatsappBussinessNumber, whatsAppConfigurationDetails.CountryCode, whatsAppConfigurationDetails.ConfigurationUrl, ConfigurationName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<List<MLWhatsAppConfiguration>> GETWSPCongigureDetails()
        {
            string storeProcCommand = "select * from whatsapp_configuration_getwhatsappconfigurationdetails()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWhatsAppConfiguration>(storeProcCommand, param)).ToList();

        }

        public async Task<WhatsAppConfiguration?> GetConfigDetails()
        {
            string storeProcCommand = "select * from whatsapp_configuration_getdetails()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WhatsAppConfiguration>(storeProcCommand, param);

        }

        public async Task<bool> ArchiveVendorDetails(int whatsappConfigurationNameId)
        {
            string storeProcCommand = "select * from whatsapp_configuration_archivedetails(@whatsappConfigurationNameId)";
            object? param = new { whatsappConfigurationNameId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<WhatsAppConfiguration?> GetConfigurationDetailsForSending(int whatsappConfigurationNameId = 0, bool IsDefaultProvider = false, bool IsPromotionalOrTransactionalType = false)
        {
            string storeProcCommand = "select * from whatsapp_configuration_getconfigurationdetails(@whatsappConfigurationNameId, @IsDefaultProvider)";
            object? param = new { whatsappConfigurationNameId, IsDefaultProvider };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WhatsAppConfiguration>(storeProcCommand, param);

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
