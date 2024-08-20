using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLWhatsappClickSQL : CommonDataBaseInteraction, IDLWhatsappClick
    {
        CommonInfo connection;
        public DLWhatsappClickSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWhatsappClickSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> SaveAsync(WhatsappClick click)
        {
            string storeProcCommand = "Whatsapp_Click";
            object? param = new { Action= "Save", click.WhatsappSendingSettingId, click.ContactId, click.TrackIp, click.UrlLink, click.P5WhatsappUniqueID };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<List<WhatsappClick>> GetwhatsappClick(IEnumerable<string> P5WhatsappUniqueID)
        {            
            string P5WhatsappUniqueIDss = "";
            foreach (var p5SMSUniqueIDs in P5WhatsappUniqueID)
            {
                P5WhatsappUniqueIDss += "'" + p5SMSUniqueIDs + "',";
            }
            P5WhatsappUniqueIDss = P5WhatsappUniqueIDss.Remove(P5WhatsappUniqueIDss.Length - 1);
            List<string> paramName = new List<string> { "@Action", "@P5WhatsappUniqueID" };

            object[] objDat = { "GETLIST", P5WhatsappUniqueIDss };
            string storeProcCommand = "Whatsapp_Click";
            object? param = new { Action = "GETLIST", P5WhatsappUniqueIDss };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WhatsappClick>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

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
