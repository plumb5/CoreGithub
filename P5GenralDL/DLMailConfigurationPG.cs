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
    public class DLMailConfigurationPG : CommonDataBaseInteraction, IDLMailConfiguration
    {
        CommonInfo connection;
        public DLMailConfigurationPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailConfigurationPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<Int32> Save(MailConfiguration mailConfiguration, string ConfigurationName = null)
        {
            string storeProcCommand = "select * from mail_configuration_save(@UserInfoUserId, @ProviderName, @AccountName, @ApiKey, @IsPromotionalOrTransactionalType, @ActiveStatus, @ConfigurationUrl, @IsBulkSupported, @ApiSecretKey, @IsDefaultProvider, @ConfigurationName )";
            object? param = new { mailConfiguration.UserInfoUserId, mailConfiguration.ProviderName, mailConfiguration.AccountName, mailConfiguration.ApiKey, mailConfiguration.IsPromotionalOrTransactionalType, mailConfiguration.ActiveStatus, mailConfiguration.ConfigurationUrl, mailConfiguration.IsBulkSupported, mailConfiguration.ApiSecretKey, mailConfiguration.IsDefaultProvider, ConfigurationName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }
        public async Task<bool> Update(MailConfiguration mailConfiguration, string ConfigurationName = null)
        {
            try { 
                    string storeProcCommand = "select * from mail_configuration_update(@Id, @UserInfoUserId, @ProviderName, @AccountName, @ApiKey, @IsPromotionalOrTransactionalType, @ActiveStatus, @ConfigurationUrl, @IsBulkSupported, @ApiSecretKey, @IsDefaultProvider, @MailConfigurationNameId, @ConfigurationName )";
                    object? param = new { mailConfiguration.Id, mailConfiguration.UserInfoUserId, mailConfiguration.ProviderName, mailConfiguration.AccountName, mailConfiguration.ApiKey, mailConfiguration.IsPromotionalOrTransactionalType, mailConfiguration.ActiveStatus, mailConfiguration.ConfigurationUrl, mailConfiguration.IsBulkSupported, mailConfiguration.ApiSecretKey, mailConfiguration.IsDefaultProvider, mailConfiguration.MailConfigurationNameId, ConfigurationName };

                    using var db = GetDbConnection(connection.Connection);
                    return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
                }
            catch(Exception ex)
            {
                    throw new Exception();
            }

        }
        public async Task<List<MailConfiguration>> GetDetails(MailConfiguration mailConfiguration)
        {
            try
            {
                string storeProcCommand = "select * from mail_configuration_get()";
                object? param = new { };

                using var db = GetDbConnection(connection.Connection);
                return (await db.QueryAsync<MailConfiguration>(storeProcCommand, param)).ToList();
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<MailConfiguration?> GetPromotionalDetails(MailConfiguration mailConfiguration)
        {
            string storeProcCommand = "select * from mail_configuration_getpromotional()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailConfiguration?>(storeProcCommand, param);

        }

        public async Task<MailConfiguration?> GetTransactionalDetails(MailConfiguration mailConfiguration)
        {
            string storeProcCommand = "select * from SelectVisitorAutoSuggest()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailConfiguration>(storeProcCommand, param);

        }

        public async Task<bool> ToogleStatus(MailConfiguration mailConfiguration)
        {
            string storeProcCommand = "select * from Mail_Configuration(@Action,@Id, @ActiveStatus, @ProviderName)";
            object? param = new { Action = "ToogleStatus", mailConfiguration.Id, mailConfiguration.ActiveStatus, mailConfiguration.ProviderName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<bool> SaveUrl(string DomainForImage, string DomainForTracking)
        {
            string storeProcCommand = "select * from Mail_Configuration(@Action,@DomainForImage, @DomainForTracking )";
            object? param = new { Action = "SaveUrl", DomainForImage, DomainForTracking };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<bool> SaveUnsubscribeUrl(string UnsubscribeUrl)
        {
            string storeProcCommand = "select * from mail_configuration_saveunsubscribeurl(@UnsubscribeUrl)";
            object? param = new { UnsubscribeUrl };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<bool> UpdateGovernanceConfiguration(MailConfiguration governanceConfiguration)
        {
            try
            {
             
                string storeProcCommand = "select * from mail_configuration_updategovernanceconfiguration(@IsTimeRestriction, @WeekDays, @WeekDayStartTime, @WeekDayEndTime, @Saturday, @SaturdayStartTime, @SaturdayEndTime, @Sunday, @SundayStartTime, @SundayEndTime )";
                object? param = new { governanceConfiguration.IsTimeRestriction, governanceConfiguration.WeekDays, governanceConfiguration.WeekDayStartTime, governanceConfiguration.WeekDayEndTime, governanceConfiguration.Saturday, governanceConfiguration.SaturdayStartTime, governanceConfiguration.SaturdayEndTime, governanceConfiguration.Sunday, governanceConfiguration.SundayStartTime, governanceConfiguration.SundayEndTime };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public async Task<bool> DeleteServiceProvider(string ProviderName)
        {
            string storeProcCommand = "select * from mail_configuration_delete(@ProviderName)";
            object? param = new { ProviderName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }
        public async Task<List<MailConfiguration>> GetServiceProviderlDetails(int mailConfigurationNameID = 0)
        {
            string storeProcCommand = "select * from mail_configuration_getserviceproviderldetails(@mailConfigurationNameID)";
            object? param = new { mailConfigurationNameID };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailConfiguration>(storeProcCommand, param)).ToList();

        }
        public async Task<List<MailConfiguration>> GetProviderNameForDomainValidation()
        {
            string storeProcCommand = "select * from mail_configuration_getprovidername()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailConfiguration>(storeProcCommand, param)).ToList();

        }
        public async Task<List<MailConfiguration>> GetUnsubscribeUrlDetails()
        {
            string storeProcCommand = "select * from mail_configuration_getunsubscribeurl()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailConfiguration>(storeProcCommand, param)).ToList();

        }
        public async Task<List<MailConfiguration>> GetDetailsByProviderName(string ProviderName)
        {
            string storeProcCommand = "select * from mail_configuration_getdetailsbyprovidernamr(@ProviderName)";
            object? param = new { ProviderName };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailConfiguration>(storeProcCommand, param)).ToList();

        }

        public async Task TruncateMailDetails()
        {
            string storeProcCommand = "select * from mail_configuration_truncatemaildetails()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            await db.QueryAsync<DataSet>(storeProcCommand, param);

        }
        public async Task<bool> ArchiveVendorDetails(int whatsappConfigurationNameId)
        {
            string storeProcCommand = "select * from mail_configuration_archivedetails(@whatsappConfigurationNameId)";
            object? param = new { whatsappConfigurationNameId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }
        public async Task<List<MLMailConfiguration>> GetAllServiceProviderlDetails()
        {
            string storeProcCommand = "select * from mail_configuration_getallserviceproviderldetails()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailConfiguration>(storeProcCommand, param)).ToList();

        }

        public async Task<MailConfiguration?> GetConfigurationDetailsForSending(bool IsPromotionalOrTransactionalType, bool IsDefaultProvider = false, int MailConfigurationNameId = 0)
        {
            string storeProcCommand = "select * from mail_configuration_getconfigurationdetails(@MailConfigurationNameId, @IsPromotionalOrTransactionalType, @IsDefaultProvider )";
            object? param = new { MailConfigurationNameId, IsPromotionalOrTransactionalType, IsDefaultProvider };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailConfiguration>(storeProcCommand, param);

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
