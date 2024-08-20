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
    internal class DLPaymentCardDetailsPG : CommonDataBaseInteraction, IDLPaymentCardDetails
    {
        CommonInfo connection;
        public DLPaymentCardDetailsPG()
        {
            connection = GetDBConnection();
        }

        public async Task<Int32> SaveDetails(PaymentCardDetails cardDetails)
        {
            string storeProcCommand = "select  payment_carddetails_save( @UserInfoUserId, @CardNumber, @NameOnCard, @ExpirationDate, @CardCVV, @AutoBillingStatus)";
            object? param = new { cardDetails.UserInfoUserId, cardDetails.CardNumber, cardDetails.NameOnCard, cardDetails.ExpirationDate, cardDetails.CardCVV, cardDetails.AutoBillingStatus };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool>  UpdateDetails(PaymentCardDetails cardDetails)
        {
            string storeProcCommand = "select payment_carddetails_update(@Id, @UserInfoUserId, @CardNumber, @NameOnCard, @ExpirationDate, @CardCVV, @AutoBillingStatus)";
            object? param = new {  cardDetails.Id, cardDetails.UserInfoUserId, cardDetails.CardNumber, cardDetails.NameOnCard, cardDetails.ExpirationDate, cardDetails.CardCVV, cardDetails.AutoBillingStatus };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
        }

        public async Task<IEnumerable<PaymentCardDetails>>   GetDetailsList(int UserInfoUserId)
        {
            string storeProcCommand = "select * from payment_carddetails_get(@UserInfoUserId)";
            object? param = new {  UserInfoUserId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<PaymentCardDetails>(storeProcCommand, param);
             
        }

        public async Task<PaymentCardDetails?>  GetDetail(Int32 Id)
        {
            string storeProcCommand = "select * from payment_carddetails_get(@Id)";
            object? param = new {   Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<PaymentCardDetails?>(storeProcCommand, param);
        }

        public async Task<bool> Delete(Int16 Id)
        {
            string storeProcCommand = "select payment_carddetails_del(@Id)";
            object? param = new {   Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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

