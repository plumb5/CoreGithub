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
    public class DLSmsConfigurationPG : CommonDataBaseInteraction, IDLSmsConfiguration
    {
        CommonInfo connection;

        public DLSmsConfigurationPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsConfigurationPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(SmsConfiguration smsConfiguration, string ConfigurationName = null)
        {
            string storeProcCommand = "select * from sms_configuration_save(@UserInfoUserId,@ProviderName,@IsDefaultProvider,@ApiKey,@Sender,@IsPromotionalOrTransactionalType,@Password,@UserName,@ConfigurationUrl,@IsBulkSupported,@EntityId,@TelemarketerId,@DLTRequired,@DLTOperatorName, @ConfigurationName)";
            object? param = new { smsConfiguration.UserInfoUserId, smsConfiguration.ProviderName, smsConfiguration.IsDefaultProvider, smsConfiguration.ApiKey, smsConfiguration.Sender, smsConfiguration.IsPromotionalOrTransactionalType, smsConfiguration.Password, smsConfiguration.UserName, smsConfiguration.ConfigurationUrl, smsConfiguration.IsBulkSupported, smsConfiguration.EntityId, smsConfiguration.TelemarketerId, smsConfiguration.DLTRequired, smsConfiguration.DLTOperatorName, ConfigurationName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }
        public async Task<bool> Update(SmsConfiguration smsConfiguration)
        {
            string storeProcCommand = "select * from sms_configuration_update(@Id, @UserInfoUserId, @ProviderName, @IsDefaultProvider, @ApiKey, @Sender, @IsPromotionalOrTransactionalType, @Password, @UserName, @ConfigurationUrl, @IsBulkSupported, @EntityId, @TelemarketerId, @DLTRequired, @DLTOperatorName)";
            object? param = new { smsConfiguration.Id, smsConfiguration.UserInfoUserId, smsConfiguration.ProviderName, smsConfiguration.IsDefaultProvider, smsConfiguration.ApiKey, smsConfiguration.Sender, smsConfiguration.IsPromotionalOrTransactionalType, smsConfiguration.Password, smsConfiguration.UserName, smsConfiguration.ConfigurationUrl, smsConfiguration.IsBulkSupported, smsConfiguration.EntityId, smsConfiguration.TelemarketerId, smsConfiguration.DLTRequired, smsConfiguration.DLTOperatorName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<List<SmsConfiguration>> GetSmsConfigurationDetails(SmsConfiguration smsConfiguration)
        {
            string storeProcCommand = "select * from sms_configuration_get(@ProviderName,@SmsConfigurationNameId)";
            object? param = new { smsConfiguration.ProviderName, smsConfiguration.SmsConfigurationNameId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsConfiguration>(storeProcCommand, param)).ToList();

        }

        public async Task<SmsConfiguration?> GetPromotionalDetails(SmsConfiguration smsConfiguration)
        {
            string storeProcCommand = "select * from sms_configuration_getpromotional(@Type,@SearchText)";
            object? param = new { smsConfiguration.SmsConfigurationNameId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsConfiguration>(storeProcCommand, param);

        }

        public async Task<SmsConfiguration?> GetTransactionalDetails(SmsConfiguration smsConfiguration)
        {
            string storeProcCommand = "select * from sms_configuration_gettransactional(@SmsConfigurationNameId)";
            object? param = new { smsConfiguration.SmsConfigurationNameId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsConfiguration>(storeProcCommand, param);

        }

        public async Task<SmsConfiguration?> GetActive()
        {
            string storeProcCommand = "select * from sms_configuration_getactive()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsConfiguration>(storeProcCommand, param);

        }

        public async Task<bool> ChangeDefaultConfig(SmsConfiguration smsConfiguration)
        {
            string storeProcCommand = "select * from Lms_FormFields(@Action, @Id, @IsDefaultProvider)";
            object? param = new { Action = "ChangeEditableStatus", smsConfiguration.Id, smsConfiguration.IsDefaultProvider };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<bool> ToogleStatus(SmsConfiguration mailConfiguration)
        {
            string storeProcCommand = "select * from sms_configuration_tooglestatus(@Id, @ActiveStatus)";
            object? param = new { mailConfiguration.Id, mailConfiguration.ActiveStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;


        }

        public async Task<bool> UpdateGovernanceConfiguration(SmsConfiguration governanceConfiguration)
        {
            string storeProcCommand = "select * from sms_configuration_updategovernanceconfiguration(@IsTimeRestriction, @WeekDays, @WeekDayStartTime, @WeekDayEndTime, @Saturday, @SaturdayStartTime, @SaturdayEndTime, @Sunday, @SundayStartTime, @SundayEndTime)";
            object? param = new { governanceConfiguration.IsTimeRestriction, governanceConfiguration.WeekDays, governanceConfiguration.WeekDayStartTime, governanceConfiguration.WeekDayEndTime, governanceConfiguration.Saturday, governanceConfiguration.SaturdayStartTime, governanceConfiguration.SaturdayEndTime, governanceConfiguration.Sunday, governanceConfiguration.SundayStartTime, governanceConfiguration.SundayEndTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<SmsConfiguration?> GetTimeRestrictionData()
        {
            string storeProcCommand = "select * from sms_configuration_getgovernanceconfiguration()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsConfiguration>(storeProcCommand, param);

        }

        public async Task TruncateSmsDetails()
        {
            string storeProcCommand = "select * from sms_configuration_truncatesmsdetails()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<List<MLSmsConfiguration>> GetConfigurationDetails()
        {
            string storeProcCommand = "select * from sms_configuration_getsmsconfigurationdetails()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsConfiguration>(storeProcCommand, param)).ToList();

        }

        public async Task<Int32> Update(SmsConfiguration smsConfiguration, string ConfigurationName)
        {
            try
            {
                string storeProcCommand = "select * from sms_configuration_updatevendordetails(@UserInfoUserId, @ProviderName, @IsDefaultProvider, @ApiKey, @Sender, @IsPromotionalOrTransactionalType, @Password, @UserName, @ConfigurationUrl, @IsBulkSupported, @EntityId, @TelemarketerId, @DLTRequired, @DLTOperatorName, @ConfigurationName, @SmsConfigurationNameId)";
                object? param = new { smsConfiguration.UserInfoUserId, smsConfiguration.ProviderName, smsConfiguration.IsDefaultProvider, smsConfiguration.ApiKey, smsConfiguration.Sender, smsConfiguration.IsPromotionalOrTransactionalType, smsConfiguration.Password, smsConfiguration.UserName, smsConfiguration.ConfigurationUrl, smsConfiguration.IsBulkSupported, smsConfiguration.EntityId, smsConfiguration.TelemarketerId, smsConfiguration.DLTRequired, smsConfiguration.DLTOperatorName, ConfigurationName, smsConfiguration.SmsConfigurationNameId };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
            }
            catch (Exception ex)
            {
                return 0;
            }

        }
        public async Task<bool> ArchiveVendorDetails(int smsConfigurationNameId)
        {
            string storeProcCommand = "select * from sms_configuration_archivedetails(@smsConfigurationNameId)";
            object? param = new { smsConfigurationNameId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<SmsConfiguration?> GetConfigurationDetailsForSending(bool IsPromotionalOrTransactionalType, bool IsDefaultProvider = false, int SmsConfigurationNameId = 0)
        {
            string storeProcCommand = "select * from sms_configuration_getconfigurationdetails(@SmsConfigurationNameId, @IsPromotionalOrTransactionalType, @IsDefaultProvider)";
            object? param = new { SmsConfigurationNameId, IsPromotionalOrTransactionalType, IsDefaultProvider };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsConfiguration>(storeProcCommand, param);

        }

        public async Task<SmsConfiguration?> GetDoveSoftProvider(bool IsPromotionalOrTransactionalType)
        {
            string storeProcCommand = "select * from sms_configuration_getdovesoftprovider(@IsPromotionalOrTransactionalType)";
            object? param = new { IsPromotionalOrTransactionalType };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsConfiguration>(storeProcCommand, param);

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
