using Dapper;
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
    public class DLMobileInAppCampaignPG : CommonDataBaseInteraction, IDLMobileInAppCampaign
    {
        CommonInfo connection;
        public DLMobileInAppCampaignPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobileInAppCampaignPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(MobileInAppCampaign inappCampaign)
        {
            string storeProcCommand = "select * from mobile_inappcampaign_save(@Name, @Design, @DraftTemplateId, @Status, @Priority, @Screen, @IsRuleCampaign, @IsTriggerResponse, @IsStaticForm, @CampaignId, @InAppCampaignType, @ImpressionCount, @ResponseCount, @ClosedCount, @RecentEvent, @StartDate, @ExpiryDate, @GroupId)";
            object? param = new { inappCampaign.Name, inappCampaign.Design, inappCampaign.DraftTemplateId, inappCampaign.Status, inappCampaign.Priority, inappCampaign.Screen, inappCampaign.IsRuleCampaign, inappCampaign.IsTriggerResponse, inappCampaign.IsStaticForm, inappCampaign.CampaignId, inappCampaign.InAppCampaignType, inappCampaign.ImpressionCount, inappCampaign.ResponseCount, inappCampaign.ClosedCount, inappCampaign.RecentEvent, inappCampaign.StartDate, inappCampaign.ExpiryDate, inappCampaign.GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<bool> Update(MobileInAppCampaign inappCampaign)
        {
            string storeProcCommand = "select * from mobile_inappcampaign_update(@Id,@Name,@Design,@DraftTemplateId,@Status,@Priority,@Screen,@IsRuleCampaign,@IsTriggerResponse,@IsStaticForm,@CampaignId,@InAppCampaignType,@ImpressionCount,@ResponseCount,@ClosedCount,@RecentEvent,@StartDate,@ExpiryDate,@GroupId)";
            object? param = new { inappCampaign.Id, inappCampaign.Name, inappCampaign.Design, inappCampaign.DraftTemplateId, inappCampaign.Status, inappCampaign.Priority, inappCampaign.Screen, inappCampaign.IsRuleCampaign, inappCampaign.IsTriggerResponse, inappCampaign.IsStaticForm, inappCampaign.CampaignId, inappCampaign.InAppCampaignType, inappCampaign.ImpressionCount, inappCampaign.ResponseCount, inappCampaign.ClosedCount, inappCampaign.RecentEvent, inappCampaign.StartDate, inappCampaign.ExpiryDate, inappCampaign.GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "select * from mobile_inappcampaign_delete(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<MobileInAppCampaign?> GetDetail(int Id)
        {
            string storeProcCommand = "select * from SelectVisitorAutoSuggest(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MobileInAppCampaign?>(storeProcCommand, param);

        }

        public async Task<int> GetMaxCount(DateTime FromDate, DateTime ToDate, string Name = null)
        {
            string storeProcCommand = "select * from mobile_inappcampaign_maxcount(@FromDate, @ToDate, @Name)";
            object? param = new { FromDate, ToDate, Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<List<MobileInAppCampaign>> GetAllInAppCampaigns(DateTime FromDate, DateTime ToDate, int OffSet = 0, int FetchNext = 0, string Name = null)
        {
            string storeProcCommand = "select * from mobile_inappcampaign_getall(@FromDate, @ToDate, @Name, @OffSet, @FetchNext)";
            object? param = new { FromDate, ToDate, Name, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobileInAppCampaign>(storeProcCommand, param)).ToList();

        }
        public async Task<List<MobileInAppCampaign>> GetAllActiveInAppCampaignsList(string DeviceId)
        {
            string storeProcCommand = "select * from SelectVisitorAutoSuggest(@DeviceId)";
            object? param = new { DeviceId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobileInAppCampaign>(storeProcCommand, param)).ToList();

        }

        public async Task<bool> ChangePriority(int Id, int Priority)
        {
            string storeProcCommand = "select * from UpdateScore(@Id, @Priority)";
            object? param = new { Id, Priority };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<bool> ToogleCampaignStatus(MobileInAppCampaign inappCampaign)
        {
            string storeProcCommand = "select * from mobile_inappcampaign_tooglestatus(@Id,@Status)";
            object? param = new { inappCampaign.Id, inappCampaign.Status };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<List<MobileInAppCampaign>> GetMobileInAppFormCampaign()
        {
            string storeProcCommand = "select * from mobile_inappcampaign_getmobileinappformcampaign()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobileInAppCampaign>(storeProcCommand, param)).ToList();

        }

        public async Task<List<MobileInAppCampaign>> GetMobileInAppCampaign()
        {
            string storeProcCommand = "select * from SelectVisitorAutoSuggest()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobileInAppCampaign>(storeProcCommand, param)).ToList();

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
