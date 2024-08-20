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
    public class DLSmsConfigurationSQL : CommonDataBaseInteraction, IDLSmsConfiguration
    {
        CommonInfo connection;

        public DLSmsConfigurationSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsConfigurationSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(SmsConfiguration smsConfiguration, string ConfigurationName = null)
        {
            string storeProcCommand = "Sms_Configuration";
            object? param = new { Action= "Save", smsConfiguration.UserInfoUserId, smsConfiguration.ProviderName, smsConfiguration.IsDefaultProvider, smsConfiguration.ApiKey, smsConfiguration.Sender, smsConfiguration.IsPromotionalOrTransactionalType, smsConfiguration.Password, smsConfiguration.UserName, smsConfiguration.ConfigurationUrl, smsConfiguration.IsBulkSupported, smsConfiguration.EntityId, smsConfiguration.TelemarketerId, smsConfiguration.DLTRequired, smsConfiguration.DLTOperatorName, ConfigurationName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<bool> Update(SmsConfiguration smsConfiguration)
        {
            string storeProcCommand = "Sms_Configuration";
            object? param = new { Action = "Update", smsConfiguration.Id, smsConfiguration.UserInfoUserId, smsConfiguration.ProviderName, smsConfiguration.IsDefaultProvider, smsConfiguration.ApiKey, smsConfiguration.Sender, smsConfiguration.IsPromotionalOrTransactionalType, smsConfiguration.Password, smsConfiguration.UserName, smsConfiguration.ConfigurationUrl, smsConfiguration.IsBulkSupported, smsConfiguration.EntityId, smsConfiguration.TelemarketerId, smsConfiguration.DLTRequired, smsConfiguration.DLTOperatorName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<List<SmsConfiguration>> GetSmsConfigurationDetails(SmsConfiguration smsConfiguration)
        {
            string storeProcCommand = "Sms_Configuration";
            object? param = new { Action = "GET", smsConfiguration.ProviderName, smsConfiguration.SmsConfigurationNameId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<SmsConfiguration?> GetPromotionalDetails(SmsConfiguration smsConfiguration)
        {
            string storeProcCommand = "Sms_Configuration";
            object? param = new { Action = "GETPromotional", smsConfiguration.SmsConfigurationNameId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<SmsConfiguration?> GetTransactionalDetails(SmsConfiguration smsConfiguration)
        {
            string storeProcCommand = "Sms_Configuration";
            object? param = new { Action = "GETTransactional", smsConfiguration.SmsConfigurationNameId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<SmsConfiguration?> GetTransactionalDetailsAsync(SmsConfiguration smsConfiguration)
        {
            string storeProcCommand = "Sms_Configuration";
            object? param = new { Action = "GETTransactional" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<SmsConfiguration?> GetActive()
        {
            string storeProcCommand = "Sms_Configuration";
            object? param = new { Action = "GET"};

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

            
        }

        public async Task<bool> ChangeDefaultConfig(SmsConfiguration smsConfiguration)
        {
            string storeProcCommand = "Lms_FormFields";
            object? param = new { Action = "ChangeEditableStatus", smsConfiguration.Id, smsConfiguration.IsDefaultProvider };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<bool> ToogleStatus(SmsConfiguration mailConfiguration)
        {
            string storeProcCommand = "Sms_Configuration";
            object? param = new { Action = "ToogleStatus", mailConfiguration.Id, mailConfiguration.ActiveStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;


        }

        public async Task<bool> UpdateGovernanceConfiguration(SmsConfiguration governanceConfiguration)
        {
            string storeProcCommand = "Sms_Configuration";
            object? param = new { Action = "UpdateGovernanceConfiguration", governanceConfiguration.IsTimeRestriction, governanceConfiguration.WeekDays, governanceConfiguration.WeekDayStartTime, governanceConfiguration.WeekDayEndTime, governanceConfiguration.Saturday, governanceConfiguration.SaturdayStartTime, governanceConfiguration.SaturdayEndTime, governanceConfiguration.Sunday, governanceConfiguration.SundayStartTime, governanceConfiguration.SundayEndTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<SmsConfiguration?> GetTimeRestrictionData()
        {
            string storeProcCommand = "Sms_Configuration";
            object? param = new { Action = "GetGovernanceConfiguration"};

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

            
        }

        public async Task TruncateSmsDetails()
        {
            string storeProcCommand = "Sms_Configuration";
            object? param = new { Action = "TruncateSmsDetails" };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<MLSmsConfiguration>> GetConfigurationDetails()
        {
            string storeProcCommand = "Sms_Configuration";
            object? param = new { Action = "GetSmsConfigurationDetails"};

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }
        public async Task<bool> ArchiveVendorDetails(int smsConfigurationNameId)
        {
            string storeProcCommand = "Sms_Configuration";
            object? param = new { Action = "ArchiveDetails", smsConfigurationNameId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }
        public async Task<Int32> Update(SmsConfiguration smsConfiguration, string ConfigurationName)
        {
            string storeProcCommand = "Sms_Configuration";
            object? param = new { Action= "UpdateVendorDetails", smsConfiguration.UserInfoUserId, smsConfiguration.ProviderName, smsConfiguration.IsDefaultProvider, smsConfiguration.ApiKey, smsConfiguration.Sender, smsConfiguration.IsPromotionalOrTransactionalType, smsConfiguration.Password, smsConfiguration.UserName, smsConfiguration.ConfigurationUrl, smsConfiguration.IsBulkSupported, smsConfiguration.EntityId, smsConfiguration.TelemarketerId, smsConfiguration.DLTRequired, smsConfiguration.DLTOperatorName, ConfigurationName, smsConfiguration.SmsConfigurationNameId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<SmsConfiguration?> GetConfigurationDetailsForSending(bool IsPromotionalOrTransactionalType, bool DefaultStatus, int SmsConfigurationNameId)
        {
            string storeProcCommand = "SelectVisitorAutoSuggest";
            object? param = new { Action = "GetConfigurationDetails", SmsConfigurationNameId, IsPromotionalOrTransactionalType, DefaultStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<SmsConfiguration?> GetDoveSoftProvider(bool IsPromotionalOrTransactionalType)
        {
            string storeProcCommand = "Sms_Configuration";
            object? param = new { Action = "GetDoveSoftProvider", IsPromotionalOrTransactionalType };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
