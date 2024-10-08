﻿using Dapper;
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
    public class DLWorkFlowWebPushBulkInitiationPG : CommonDataBaseInteraction, IDLWorkFlowWebPushBulkInitiation
    {
        CommonInfo connection;

        public DLWorkFlowWebPushBulkInitiationPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowWebPushBulkInitiationPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<IEnumerable<WorkFlowWebPushBulkInitiation>> GetSentInitiation()
        {
            string storeProcCommand = "select * from workflow_webpushbulkinitiation_getsentinitiation()";
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowWebPushBulkInitiation>(storeProcCommand);
        }

        public async Task<bool> UpdateSentInitiation(WorkFlowWebPushBulkInitiation BulkSentInitiation)
        {
            string storeProcCommand = "select workflow_webpushbulkinitiation_updatesentinitiation(@SendingSettingId, @InitiationStatus, @WorkFlowId, @WorkFlowDataId)";
            object? param = new { BulkSentInitiation.SendingSettingId, BulkSentInitiation.InitiationStatus, BulkSentInitiation.WorkFlowId, BulkSentInitiation.WorkFlowDataId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;

        }

        public async Task<bool> ResetSentInitiation()
        {
            string storeProcCommand = "select workflow_webpushbulkinitiation_resetsentinitiation()";
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand) > 0;
        }

        public async Task<Int32> Save(WorkFlowWebPushBulkInitiation BulkSentInitiation)
        {
            string storeProcCommand = "select workflow_webpushbulkinitiation_save(@SendingSettingId, @WorkFlowId, @WorkFlowDataId )"; 
            object? param = new { BulkSentInitiation.SendingSettingId, BulkSentInitiation.WorkFlowId, BulkSentInitiation.WorkFlowDataId };
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
