using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLFormBannerLoadClickPG : CommonDataBaseInteraction, IDLFormBannerLoadClick
    {
        CommonInfo connection = null;
        public DLFormBannerLoadClickPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLFormBannerLoadClickPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public void SaveUpdateForImpression(int FormBannerId, string TrackIp, string MachineId, string SessionRefeer)
        {
            string storeProcCommand = "select * from form_bannerloadclick_saveupdateforimpression(@FormBannerId, @TrackIp,@MachineId, @SessionRefeer)";
            object? param = new { FormBannerId, TrackIp, MachineId, SessionRefeer };

            using var db = GetDbConnection(connection.Connection);
            db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public void UpdateFormResponse(int FormBannerId, string TrackIp, string MachineId = null, string SessionRefeer = null)
        {
            string storeProcCommand = "select * from form_bannerloadclick_updateformresponse(@FormBannerId, @MachineId)";
            object? param = new { FormBannerId, MachineId };

            using var db = GetDbConnection(connection.Connection);
            db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public void UpdateFormClose(int FormBannerId, string TrackIp, string MachineId, string SessionRefeer)
        {
            string storeProcCommand = "select * from form_bannerloadclick_updateformclose(@FormBannerId, @TrackIp,@MachineId, @SessionRefeer)";
            object? param = new { FormBannerId, TrackIp, MachineId, SessionRefeer };

            using var db = GetDbConnection(connection.Connection);
            db.ExecuteScalarAsync<int>(storeProcCommand, param);
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

