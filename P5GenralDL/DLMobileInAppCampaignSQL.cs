using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace P5GenralDL
{
    public class DLMobileInAppCampaignSQL : CommonDataBaseInteraction, IDLMobileInAppCampaign
    {
        CommonInfo connection;
        public DLMobileInAppCampaignSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobileInAppCampaignSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(MobileInAppCampaign inappCampaign)
        {
            string storeProcCommand = "Mobile_InAppCampaign";
            object? param = new { Action= "Save", inappCampaign.Name, inappCampaign.Design, inappCampaign.DraftTemplateId, inappCampaign.Status, inappCampaign.Priority, inappCampaign.Screen, inappCampaign.IsRuleCampaign, inappCampaign.IsTriggerResponse, inappCampaign.IsStaticForm, inappCampaign.CampaignId, inappCampaign.InAppCampaignType, inappCampaign.ImpressionCount, inappCampaign.ResponseCount, inappCampaign.ClosedCount, inappCampaign.RecentEvent, inappCampaign.StartDate, inappCampaign.ExpiryDate, inappCampaign.GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> Update(MobileInAppCampaign inappCampaign)
        {
            string storeProcCommand = "Mobile_InAppCampaign";
            object? param = new { Action = "Update", inappCampaign.Id, inappCampaign.Name, inappCampaign.Design, inappCampaign.DraftTemplateId, inappCampaign.Status, inappCampaign.Priority, inappCampaign.Screen, inappCampaign.IsRuleCampaign, inappCampaign.IsTriggerResponse, inappCampaign.IsStaticForm, inappCampaign.CampaignId, inappCampaign.InAppCampaignType, inappCampaign.ImpressionCount, inappCampaign.ResponseCount, inappCampaign.ClosedCount, inappCampaign.RecentEvent, inappCampaign.StartDate, inappCampaign.ExpiryDate, inappCampaign.GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "Mobile_InAppCampaign";
            object? param = new { Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<MobileInAppCampaign?> GetDetail(int Id)
        {
            string storeProcCommand = "Mobile_InAppCampaign";
            object? param = new { Action = "GET", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MobileInAppCampaign?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }


        public async Task<int> GetMaxCount(DateTime FromDate, DateTime ToDate, string Name = null)
        {
            string storeProcCommand = "Mobile_InAppCampaign";
            object? param = new { Action= "MaxCount", FromDate, ToDate, Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<MobileInAppCampaign>> GetAllInAppCampaigns(DateTime FromDate, DateTime ToDate, int OffSet = 0, int FetchNext = 0, string Name = null)
        {
            string storeProcCommand = "Mobile_InAppCampaign";
            object? param = new { Action = "GetAll", OffSet, FetchNext, FromDate, ToDate, Name };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobileInAppCampaign>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }
        public async Task<List<MobileInAppCampaign>> GetAllActiveInAppCampaignsList(string DeviceId)
        {
            string storeProcCommand = "SelectVisitorAutoSuggest";
            object? param = new { Action = "GetActiveInAppCampaignList", DeviceId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobileInAppCampaign>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<List<MobileInAppCampaign>> GetAllActiveInAppCampaignsListAsync(string DeviceId)
        {
            string storeProcCommand = "Mobile_InAppCampaign";
            object? param = new { Action = "GetActiveInAppCampaignList", DeviceId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobileInAppCampaign>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<bool> ChangePriority(int Id, int Priority)
        {
            string storeProcCommand = "Mobile_InAppCampaign";
            object? param = new { Action = "UpdatePriorityStatus", Id, Priority };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<bool> ToogleCampaignStatus(MobileInAppCampaign inappCampaign)
        {
            string storeProcCommand = "Mobile_InAppCampaign";
            object? param = new { Action = "ToogleStatus", inappCampaign.Id, inappCampaign.Status };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<List<MobileInAppCampaign>> GetMobileInAppFormCampaign()
        {
            string storeProcCommand = "Mobile_InAppCampaign";
            object? param = new { Action = "GetMobileInAppFormCampaign"};

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobileInAppCampaign>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<List<MobileInAppCampaign>> GetMobileInAppCampaign()
        {
            string storeProcCommand = "Mobile_InAppCampaign";
            object? param = new { Action = "GetMobileInAppCampaign"};

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobileInAppCampaign>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

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
