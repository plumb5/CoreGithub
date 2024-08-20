using P5GenralML;
using IP5GenralDL;
using System.Data;
using System.Globalization;
using System.ComponentModel;
using DBInteraction;
using Dapper;
using Azure.Core;
using System;

namespace P5GenralDL
{
    public class DLAppMessengerTrackForIndividualPG : CommonDataBaseInteraction, IDLAppMessengerTrackForIndividual
    {
        CommonInfo connection;
        public DLAppMessengerTrackForIndividualPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLAppMessengerTrackForIndividualPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(AppMessengerTrackForIndividual messengerTrack)
        {
            string storeProcCommand = "select appmessengertrack_forindividual_save(@PhoneNumber, @AppMessengerContent, @ContactId, @AppMessengerTemplateId, @IsFormIsChatIsLmsIsMail)";
            object? param = new { messengerTrack.PhoneNumber, messengerTrack.AppMessengerContent, messengerTrack.ContactId, messengerTrack.AppMessengerTemplateId, messengerTrack.IsFormIsChatIsLmsIsMail };
             
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<IEnumerable<AppMessengerTrackForIndividual>> GetSmsTrackForIndividual(string PhoneNumber)
        {
            string storeProcCommand = "select appmessengertrack_forindividual_get(@PhoneNumber)";
            object? param = new { PhoneNumber };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<AppMessengerTrackForIndividual>(storeProcCommand, param);
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
