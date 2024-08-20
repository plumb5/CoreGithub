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
    public class DLPaymentCardDetailsSQL : CommonDataBaseInteraction, IDLPaymentCardDetails
    {
        CommonInfo connection;
        public DLPaymentCardDetailsSQL()
        {
            connection = GetDBConnection();
        }

        public async Task<Int32> SaveDetails(PaymentCardDetails cardDetails)
        {
            string storeProcCommand = "Payment_CardDetails";
            object? param = new {Action= "Save", cardDetails.UserInfoUserId, cardDetails.CardNumber, cardDetails.NameOnCard, cardDetails.ExpirationDate, cardDetails.CardCVV, cardDetails.AutoBillingStatus };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateDetails(PaymentCardDetails cardDetails)
        {
            string storeProcCommand = "Payment_CardDetails";
            object? param = new { Action = "Update", cardDetails.Id, cardDetails.UserInfoUserId, cardDetails.CardNumber, cardDetails.NameOnCard, cardDetails.ExpirationDate, cardDetails.CardCVV, cardDetails.AutoBillingStatus };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)> 0;
        }

        public async Task<IEnumerable<PaymentCardDetails>> GetDetailsList(int UserInfoUserId)
        {
            string storeProcCommand = "Payment_CardDetails";
            object? param = new { Action = "GET", UserInfoUserId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<PaymentCardDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure);


        }

        public async Task<PaymentCardDetails?> GetDetail(Int32 Id)
        {
            string storeProcCommand = "Payment_CardDetails";
            object? param = new { Action = "GET", Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<PaymentCardDetails?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> Delete(Int16 Id)
        {
            string storeProcCommand = "Payment_CardDetails";
            object? param = new { Action= "DEL", Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
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


