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
    public class DLDayWiseConsumptionPG : CommonDataBaseInteraction, IDLDayWiseConsumption
    {
        CommonInfo connection;
        public DLDayWiseConsumptionPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public DLDayWiseConsumptionPG()
        {
            connection = GetDBConnection();
        }
        public DLDayWiseConsumptionPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task SaveMailCount(DayWiseConsumption ConsumptionDetails)
        {
            string storeProcCommand = "select * from daywise_consumption_savemailcount(@AccountId, @UserId, @ConsumptionDate, @TotalMailSent)";
            object? param = new { ConsumptionDetails.AccountId, ConsumptionDetails.UserId, ConsumptionDetails.ConsumptionDate, ConsumptionDetails.TotalMailSent };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task SaveSmsCount(DayWiseConsumption ConsumptionDetails)
        {
            string storeProcCommand = "select * from daywise_consumption_savesmscount(@AccountId, @UserId, @ConsumptionDate, @TotalSmsSent)";
            object? param = new { ConsumptionDetails.AccountId, ConsumptionDetails.UserId, ConsumptionDetails.ConsumptionDate, ConsumptionDetails.TotalSmsSent };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task SaveSpamCount(DayWiseConsumption ConsumptionDetails)
        {
            string storeProcCommand = "select * from daywise_consumption_savespamcount(@AccountId, @UserId, @ConsumptionDate, @TotalSpamCheck)";
            object? param = new { ConsumptionDetails.AccountId, ConsumptionDetails.UserId, ConsumptionDetails.ConsumptionDate, ConsumptionDetails.TotalSpamCheck };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task SaveEmailVerifyCount(DayWiseConsumption ConsumptionDetails)
        {
            string storeProcCommand = "select * from daywise_consumption_saveemailverifycount(@AccountId, @UserId, @ConsumptionDate, @TotalEmailVerified)";
            object? param = new { ConsumptionDetails.AccountId, ConsumptionDetails.UserId, ConsumptionDetails.ConsumptionDate, ConsumptionDetails.TotalEmailVerified };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task SaveWebPushCount(DayWiseConsumption ConsumptionDetails)
        {
            string storeProcCommand = "select * from daywise_consumption_savewebpushcount(@AccountId, @UserId, @ConsumptionDate, @TotalWebPushSent)";
            object? param = new { ConsumptionDetails.AccountId, ConsumptionDetails.UserId, ConsumptionDetails.ConsumptionDate, ConsumptionDetails.TotalWebPushSent };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task SaveMobilePushCount(DayWiseConsumption ConsumptionDetails)
        {
            string storeProcCommand = "select * from daywise_consumption_savewebpushcount(@AccountId, @UserId, @ConsumptionDate, @TotalMobilePushSent)";
            object? param = new { ConsumptionDetails.AccountId, ConsumptionDetails.UserId, ConsumptionDetails.ConsumptionDate, ConsumptionDetails.TotalMobilePushSent };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<DayWiseConsumption?> GetTodaysConsumption(int UserId)
        {
            string storeProcCommand = "select * from SelectVisitorAutoSuggest(@UserId)";
            object? param = new { UserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<DayWiseConsumption?>(storeProcCommand, param);

        }

        public async Task<DayWiseConsumption?> GetTotalConsumption(int AccountId, DateTime FromDateTime, DateTime ToDateTime)
        {
            try
            {
                string storeProcCommand = "select * from daywise_consumption_gettotalconsumption(@AccountId, @FromDateTime, @ToDateTime)";
                object? param = new { AccountId, FromDateTime, ToDateTime };

                using var db = GetDbConnection(connection.Connection);
                return await db.QueryFirstOrDefaultAsync<DayWiseConsumption?>(storeProcCommand, param);
            }
            catch(Exception ex)
            {
                throw new Exception();
            }

        }

        public async Task SaveWhatsappCount(DayWiseConsumption ConsumptionDetails)
        {
            string storeProcCommand = "select * from daywise_consumption_savewebpushcount(ConsumptionDetails.AccountId,@UserId,@ConsumptionDate,@TotalWhatsappSent)";
            object? param = new { ConsumptionDetails.AccountId, ConsumptionDetails.UserId, ConsumptionDetails.ConsumptionDate, ConsumptionDetails.TotalWhatsappSent };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);

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
