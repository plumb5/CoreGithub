﻿using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLFormBannerLoadClickSQL : CommonDataBaseInteraction, IDLFormBannerLoadClick
    {
        CommonInfo connection = null;
        public DLFormBannerLoadClickSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLFormBannerLoadClickSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public void SaveUpdateForImpression(int FormBannerId, string TrackIp, string MachineId, string SessionRefeer)
        {
            string storeProcCommand = "Form_BannerLoadClick";
            object? param = new { @Action = "SaveUpdateForImpression", FormBannerId, TrackIp, MachineId, SessionRefeer };

            using var db = GetDbConnection(connection.Connection);
            db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public void UpdateFormResponse(int FormBannerId, string TrackIp, string MachineId = null, string SessionRefeer = null)
        {
            string storeProcCommand = "Form_BannerLoadClick";
            object? param = new { @Action = "UpdateFormResponse", FormBannerId, MachineId };

            using var db = GetDbConnection(connection.Connection);
            db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public void UpdateFormClose(int FormBannerId, string TrackIp, string MachineId, string SessionRefeer)
        {
            string storeProcCommand = "Form_BannerLoadClick";
            object? param = new { @Action = "UpdateFormClose", FormBannerId, TrackIp, MachineId, SessionRefeer };

            using var db = GetDbConnection(connection.Connection);
            db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
    }
}


