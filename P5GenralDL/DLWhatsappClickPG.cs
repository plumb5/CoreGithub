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
    public class DLWhatsappClickPG : CommonDataBaseInteraction, IDLWhatsappClick
    {
        CommonInfo connection;
        public DLWhatsappClickPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWhatsappClickPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> SaveAsync(WhatsappClick click)
        {
            string storeProcCommand = "select * from whatsapp_click_save(@WhatsappSendingSettingId,@ContactId,@TrackIp,@UrlLink,@P5WhatsappUniqueID)";
            object? param = new { click.WhatsappSendingSettingId, click.ContactId, click.TrackIp, click.UrlLink, click.P5WhatsappUniqueID };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }
        public async Task<List<WhatsappClick>> GetwhatsappClick(IEnumerable<string> P5WhatsappUniqueID)
        {
            string P5WhatsappUniqueIDss = "";
            foreach (var p5SMSUniqueIDs in P5WhatsappUniqueID)
            {
                P5WhatsappUniqueIDss += "'" + p5SMSUniqueIDs + "',";
            }
            P5WhatsappUniqueIDss = P5WhatsappUniqueIDss.Remove(P5WhatsappUniqueIDss.Length - 1);
            string storeProcCommand = "select * from whatsapp_click_getlist(@P5WhatsappUniqueIDss)";
            object? param = new { P5WhatsappUniqueIDss };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WhatsappClick>(storeProcCommand, param)).ToList();
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
