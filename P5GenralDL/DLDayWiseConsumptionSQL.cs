using Dapper;
using DBInteraction;
using Microsoft.Identity.Client;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLDayWiseConsumptionSQL : CommonDataBaseInteraction, IDLDayWiseConsumption
    {
        CommonInfo connection;
        public DLDayWiseConsumptionSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLDayWiseConsumptionSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task SaveMailCount(DayWiseConsumption ConsumptionDetails)
        {
            string storeProcCommand = "DayWise_Consumption";
            object? param = new { Action = "SaveMailCount", ConsumptionDetails.AccountId, ConsumptionDetails.UserId, ConsumptionDetails.ConsumptionDate, ConsumptionDetails.TotalMailSent };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task SaveSmsCount(DayWiseConsumption ConsumptionDetails)
        {
            string storeProcCommand = "DayWise_Consumption";
            object? param = new { Action = "SaveSmsCount", ConsumptionDetails.AccountId, ConsumptionDetails.UserId, ConsumptionDetails.ConsumptionDate, ConsumptionDetails.TotalSmsSent };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task SaveSpamCount(DayWiseConsumption ConsumptionDetails)
        {
            string storeProcCommand = "DayWise_Consumption";
            object? param = new { Action = "SaveSpamCount", ConsumptionDetails.AccountId, ConsumptionDetails.UserId, ConsumptionDetails.ConsumptionDate, ConsumptionDetails.TotalSpamCheck };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task SaveEmailVerifyCount(DayWiseConsumption ConsumptionDetails)
        {
            string storeProcCommand = "DayWise_Consumption";
            object? param = new { Action = "SaveEmailVerifyCount", ConsumptionDetails.AccountId, ConsumptionDetails.UserId, ConsumptionDetails.ConsumptionDate, ConsumptionDetails.TotalEmailVerified };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task SaveWebPushCount(DayWiseConsumption ConsumptionDetails)
        {
            string storeProcCommand = "DayWise_Consumption";
            object? param = new { Action = "SaveWebPushCount", ConsumptionDetails.AccountId, ConsumptionDetails.UserId, ConsumptionDetails.ConsumptionDate, ConsumptionDetails.TotalWebPushSent };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task SaveMobilePushCount(DayWiseConsumption ConsumptionDetails)
        {
            string storeProcCommand = "DayWise_Consumption";
            object? param = new { Action = "SaveMobilePushCount", ConsumptionDetails.AccountId, ConsumptionDetails.UserId, ConsumptionDetails.ConsumptionDate, ConsumptionDetails.TotalMobilePushSent };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<DayWiseConsumption?> GetTodaysConsumption(int UserId)
        {
            string storeProcCommand = "DayWise_Consumption";
            object? param = new { Action = "GetTodaysConsumption", UserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<DayWiseConsumption>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<DayWiseConsumption?> GetTotalConsumption(int AccountId, DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "DayWise_Consumption";
            object? param = new { Action = "GetTotalConsumption", AccountId, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<DayWiseConsumption>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task SaveWhatsappCount(DayWiseConsumption ConsumptionDetails)
        {
            string storeProcCommand = "DayWise_Consumption";
            object? param = new { Action = "SaveWhatsappCount", ConsumptionDetails.AccountId, ConsumptionDetails.UserId, ConsumptionDetails.ConsumptionDate, ConsumptionDetails.TotalWhatsappSent };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
