﻿using Dapper;
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
    public class DLChatSettingPG : CommonDataBaseInteraction, IDLChatSetting
    {
        CommonInfo connection;
        public DLChatSettingPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async Task<Int16> Save(ChatSetting ChatSetting)
        {
            string storeProcCommand = "select * from chat_setting_save(@UserLimit)";
            object? param = new { ChatSetting.UserLimit };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param);
        }
        public async Task<ChatSetting?> GET()
        {
            string storeProcCommand = "select * from chat_setting_get()";

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ChatSetting?>(storeProcCommand);
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


