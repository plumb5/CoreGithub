using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLWorkFlowMobileSQL : CommonDataBaseInteraction, IDLWorkFlowMobile
    {
        CommonInfo connection;
        public DLWorkFlowMobileSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowMobileSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="workFlowOBD"></param>
        /// <returns></returns>
        public async Task<int> Save(MLWorkFlowMobile workFlowMobile)
        {
            string storeProcCommand = "WorkFlow_Mobile";
            object? param = new { Action = "Save", workFlowMobile.MobilePushTemplateId, workFlowMobile.IsTriggerEveryActivity };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="workFlowOBD"></param>
        /// <returns></returns>
        public async Task<bool> Update(MLWorkFlowMobile workFlowMobile)
        {
            string storeProcCommand = "WorkFlow_Mobile";
            object? param = new { Action = "Update", workFlowMobile.ConfigureMobileId, workFlowMobile.MobilePushTemplateId, workFlowMobile.IsTriggerEveryActivity };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="ConfigureMobileId"></param>
        /// <returns></returns>
        public async Task<AppPushCampaign?> GetDetails(int ConfigureMobileId)
        {
            string storeProcCommand = "WorkFlow_Mobile";
            object? param = new { Action = "GetDetails", ConfigureMobileId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<AppPushCampaign>(storeProcCommand, param);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="ConfigureMobileId"></param>
        /// <returns></returns>
        public async Task<MLWorkFlowMobile?> GetCountsData(int ConfigureMobileId, DateTime? FromDate = null, DateTime? ToDate = null, byte IsSplitTested = 0, string DeviceId = null)
        {
            string storeProcCommand = "WorkFlow_Mobile";
            object? param = new { Action = "GetCounts", ConfigureMobileId, FromDate, ToDate, IsSplitTested, DeviceId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLWorkFlowMobile>(storeProcCommand, param);
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
