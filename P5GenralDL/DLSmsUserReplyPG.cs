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
    public class DLSmsUserReplyPG : CommonDataBaseInteraction, IDLSmsUserReply
    {
        CommonInfo connection;
        public DLSmsUserReplyPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsUserReplyPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(SmsUserReply UserReply)
        {
            string storeProcCommand = "select * from Sms_UserReply(@Action, @ContactId, @Phonenumber, @SmsType, @SendingSettingId, @IncomingText, @VendorName)";
            object? param = new { Action = "Save", UserReply.ContactId, UserReply.Phonenumber, UserReply.SmsType, UserReply.SendingSettingId, UserReply.IncomingText, UserReply.VendorName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
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
