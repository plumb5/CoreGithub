﻿using Dapper;
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
    public class DLEventSettingPG : CommonDataBaseInteraction, IDLEventSetting
    {
        CommonInfo connection;
        public DLEventSettingPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLEventSettingPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<List<EventSetting>> GET(string EventName)
        {
            string storeProcCommand = "select * from event_setting_get(@EventName)";
            object? param = new { EventName };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<EventSetting>(storeProcCommand, param)).ToList();

        }

        public async Task<List<EventSetting>> GetEventTrackingDetails()
        {
            string storeProcCommand = "select * from inserteventsetting_get()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<EventSetting>(storeProcCommand, param)).ToList();

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
