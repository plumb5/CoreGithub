﻿using Dapper;
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
    public class DLWhatsAppConfigurationSQL : CommonDataBaseInteraction, IDLWhatsAppConfiguration
    {
        CommonInfo connection;
        public DLWhatsAppConfigurationSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWhatsAppConfigurationSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(WhatsAppConfiguration whatsAppConfigurationDetails, string ConfigurationName = null)
        {
            string storeProcCommand = "WhatsApp_Configuration";
            object? param = new { Action = "Save", whatsAppConfigurationDetails.UserInfoUserId, whatsAppConfigurationDetails.ProviderName, whatsAppConfigurationDetails.IsDefaultProvider, whatsAppConfigurationDetails.ApiKey, whatsAppConfigurationDetails.WhatsappBussinessNumber, whatsAppConfigurationDetails.CountryCode, whatsAppConfigurationDetails.ConfigurationUrl, ConfigurationName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task TruncateWSPDetails()
        {
            string storeProcCommand = "WhatsApp_Configuration";
            object? param = new { Action = "TruncateWspDetails" };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<WhatsAppConfiguration?> GetConfigurationDetails(int Id = 0)
        {
            string storeProcCommand = "WhatsApp_Configuration";
            object? param = new { Action = "GET", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WhatsAppConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<WhatsAppConfiguration>> GetWhatsAppConfigurationDetails(WhatsAppConfiguration whatsappConfiguration)
        {
            string storeProcCommand = "WhatsApp_Configuration";
            object? param = new { Action = "GET", whatsappConfiguration.ProviderName };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WhatsAppConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<bool> Delete(int WSPID)
        {
            string storeProcCommand = "WhatsApp_Configuration";
            object? param = new { Action = "Delete", WSPID };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<int> update(WhatsAppConfiguration whatsAppConfigurationDetails, string ConfigurationName)
        {
            string storeProcCommand = "WhatsApp_Configuration";
            object? param = new { Action = "Update", whatsAppConfigurationDetails.Id, whatsAppConfigurationDetails.UserInfoUserId, whatsAppConfigurationDetails.ProviderName, whatsAppConfigurationDetails.IsDefaultProvider, whatsAppConfigurationDetails.ApiKey, whatsAppConfigurationDetails.WhatsappBussinessNumber, whatsAppConfigurationDetails.CountryCode, ConfigurationName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<MLWhatsAppConfiguration>> GETWSPCongigureDetails()
        {
            string storeProcCommand = "SelectVisitorAutoSuggest";
            object? param = new { Action = "GetWhatsAppConfigurationDetails" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWhatsAppConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<WhatsAppConfiguration?> GetConfigDetails()
        {
            string storeProcCommand = "WhatsApp_Configuration";
            object? param = new { Action = "GetDetails" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WhatsAppConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<bool> ArchiveVendorDetails(int whatsappConfigurationNameId)
        {
            string storeProcCommand = "WhatsApp_Configuration";
            object? param = new { Action = "ArchiveDetails", whatsappConfigurationNameId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<WhatsAppConfiguration?> GetConfigurationDetailsForSending(int whatsappConfigurationNameId = 0, bool IsDefaultProvider = false, bool IsPromotionalOrTransactionalType = false)
        {
            string storeProcCommand = "WhatsApp_Configuration";
            object? param = new { Action = "GetConfigurationDetails", whatsappConfigurationNameId, IsDefaultProvider };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WhatsAppConfiguration>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
