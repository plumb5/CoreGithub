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
    public class DLMailConfigurationSQL : CommonDataBaseInteraction, IDLMailConfiguration
    {
        CommonInfo connection;
        public DLMailConfigurationSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailConfigurationSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(MailConfiguration mailConfiguration, string ConfigurationName = null)
        {
            string storeProcCommand = "Mail_Configuration";
            object? param = new { Action= "Save", mailConfiguration.UserInfoUserId, mailConfiguration.ProviderName, mailConfiguration.AccountName, mailConfiguration.ApiKey, mailConfiguration.IsPromotionalOrTransactionalType, mailConfiguration.ActiveStatus, mailConfiguration.ConfigurationUrl, mailConfiguration.IsBulkSupported, mailConfiguration.ApiSecretKey, mailConfiguration.IsDefaultProvider, ConfigurationName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<bool> Update(MailConfiguration mailConfiguration, string ConfigurationName = null)
        {
            string storeProcCommand = "Mail_Configuration";
            object? param = new { Action = "Update", mailConfiguration.Id, mailConfiguration.UserInfoUserId, mailConfiguration.ProviderName, mailConfiguration.AccountName, mailConfiguration.ApiKey, mailConfiguration.IsPromotionalOrTransactionalType, mailConfiguration.ActiveStatus, mailConfiguration.ConfigurationUrl, mailConfiguration.IsBulkSupported, mailConfiguration.ApiSecretKey, mailConfiguration.IsDefaultProvider, mailConfiguration.MailConfigurationNameId, ConfigurationName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }
        public async Task<List<MailConfiguration>> GetDetails(MailConfiguration mailConfiguration)
        {
            string storeProcCommand = "Mail_Configuration";
            object? param = new { Action = "GET" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<MailConfiguration?> GetPromotionalDetails(MailConfiguration mailConfiguration)
        {
            string storeProcCommand = "Mail_Configuration";
            object? param = new { Action = "GETPromotional" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailConfiguration?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<MailConfiguration?> GetTransactionalDetails(MailConfiguration mailConfiguration)
        {
            string storeProcCommand = "Mail_Configuration";
            object? param = new { Action = "GETTransactional" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailConfiguration?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<MailConfiguration?> GetTransactionalDetailsAsync(MailConfiguration mailConfiguration)
        {
            string storeProcCommand = "Mail_Configuration";
            object? param = new { Action = "GETTransactional"};

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailConfiguration?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> ToogleStatus(MailConfiguration mailConfiguration)
        {
            string storeProcCommand = "Mail_Configuration";
            object? param = new { Action = "ToogleStatus", mailConfiguration.Id, mailConfiguration.ActiveStatus, mailConfiguration.ProviderName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<bool> SaveUrl(string DomainForImage, string DomainForTracking)
        {
            string storeProcCommand = "Mail_Configuration";
            object? param = new { Action = "SaveUrl", DomainForImage, DomainForTracking };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<bool> SaveUnsubscribeUrl(string UnsubscribeUrl)
        {
            string storeProcCommand = "Mail_Configuration";
            object? param = new { Action = "SaveUnsubscribeUrl", UnsubscribeUrl };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<bool> UpdateGovernanceConfiguration(MailConfiguration governanceConfiguration)
        {
            string storeProcCommand = "Mail_Configuration";
            object? param = new { Action = "UpdateGovernanceConfiguration", governanceConfiguration.IsTimeRestriction, governanceConfiguration.WeekDays, governanceConfiguration.WeekDayStartTime, governanceConfiguration.WeekDayEndTime, governanceConfiguration.Saturday, governanceConfiguration.SaturdayStartTime, governanceConfiguration.SaturdayEndTime, governanceConfiguration.Sunday, governanceConfiguration.SundayStartTime, governanceConfiguration.SundayEndTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }
        public async Task<bool> DeleteServiceProvider(string ProviderName)
        {
            string storeProcCommand = "Mail_Configuration";
            object? param = new { Action = "Delete", ProviderName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }
        public async Task<List<MailConfiguration>> GetServiceProviderlDetails(int mailConfigurationNameID = 0)
        {
            string storeProcCommand = "Mail_Configuration";
            object? param = new { Action = "GetServiceProviderlDetails", mailConfigurationNameID };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }
        public async Task<List<MailConfiguration>> GetProviderNameForDomainValidation()
        {
            string storeProcCommand = "SelectVisitorAutoSuggest";
            object? param = new { Action = "GetProviderName"};

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }
        public async Task<List<MailConfiguration>> GetUnsubscribeUrlDetails()
        {
            string storeProcCommand = "Mail_Configuration";
            object? param = new { Action = "GetUnsubscribeUrl" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }
        public async Task<List<MailConfiguration>> GetDetailsByProviderName(string ProviderName)
        {
            string storeProcCommand = "SelectVisitorAutoSuggest";
            object? param = new { Action = "GetDetailsByProviderNamr", ProviderName };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task TruncateMailDetails()
        {
            string storeProcCommand = "Mail_Configuration";
            object? param = new { Action = "TruncateMailDetails" };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<List<MLMailConfiguration>> GetAllServiceProviderlDetails()
        {
            string storeProcCommand = "SelectVisitorAutoSuggest";
            object? param = new { Action = "GetAllServiceProviderlDetails" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }
        public async Task<bool> ArchiveVendorDetails(int mailConfigurationNameId)
        {
            string storeProcCommand = "Mail_Configuration";
            object? param = new { Action = "ArchiveDetails", mailConfigurationNameId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<MailConfiguration?> GetConfigurationDetailsForSending(bool IsPromotionalOrTransactionalType, bool IsDefaultProvider, int MailConfigurationNameId)
        {
            string storeProcCommand = "Mail_Configuration";
            object? param = new { Action = "GetConfigurationDetails", MailConfigurationNameId, IsPromotionalOrTransactionalType, IsDefaultProvider };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
