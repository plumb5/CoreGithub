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
    public class DLSmsUserReplySQL : CommonDataBaseInteraction, IDLSmsUserReply
    {
        CommonInfo connection;
        public DLSmsUserReplySQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsUserReplySQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(SmsUserReply UserReply)
        {
            string storeProcCommand = "Sms_UserReply";
            object? param = new { Action= "Save", UserReply.ContactId, UserReply.Phonenumber, UserReply.SmsType, UserReply.SendingSettingId, UserReply.IncomingText, UserReply.VendorName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
    }
}
