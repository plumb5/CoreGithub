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
    public class DLSmsTrackForIndividualSQL : CommonDataBaseInteraction, IDLSmsTrackForIndividual
    {
        CommonInfo connection;
        public DLSmsTrackForIndividualSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsTrackForIndividualSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(SmsTrackForIndividual smsTrackForIndividual)
        {
            string storeProcCommand = "SmsTrack_ForIndividual";
            object? param = new { Action= "Save",smsTrackForIndividual.PhoneNumber, smsTrackForIndividual.SmsContent, smsTrackForIndividual.ContactId, smsTrackForIndividual.SmsTemplateId, smsTrackForIndividual.IsFormIsChatIsLmsIsMail, smsTrackForIndividual.IsUnicodeMessage, smsTrackForIndividual.UserInfoUserId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }



        #region Dispose Method
        private bool _disposed = false;
        protected void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                _disposed = true;
                if (disposing)
                {
                    connection = null;
                }
            }
        }

        public void Dispose()
        {
            Dispose(true);
        }
        #endregion End of Dispose Method
    }
}
