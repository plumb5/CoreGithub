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
    public class DLMailSentSQL : CommonDataBaseInteraction, IDLMailSent
    {
        CommonInfo connection;

        public DLMailSentSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailSentSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Send(MailSent mailSent)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "Save", mailSent.MailTemplateId, mailSent.MailCampaignId, mailSent.MailSendingSettingId, mailSent.GroupId, mailSent.ContactId, mailSent.EmailId, mailSent.ResponseId, mailSent.DripSequence, mailSent.DripConditionType, mailSent.SendStatus, mailSent.ProductIds, mailSent.P5MailUniqueID, mailSent.ErrorMessage, mailSent.Subject, mailSent.FromName, mailSent.FromEmailId, mailSent.ReplayToEmailId, mailSent.CampaignJobName, mailSent.MailConfigurationNameId, mailSent.UserInfoUserId, mailSent.Score, mailSent.LeadLabel, mailSent.Publisher, mailSent.LmsGroupMemberId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateOpen(string ResponseId, string DeviceName = null, string DeviceType = null, string UserAgent = null)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "UpdateOpen", ResponseId, DeviceName, DeviceType, UserAgent };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<MailSent?> UpdateClick(string ResponseId, string DeviceName = null, string DeviceType = null, string UserAgent = null)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "UpdateClick", ResponseId, DeviceName, DeviceType, UserAgent };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailSent?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<MailSent?> UpdateUnsubscribe(string ResponseId, string DeviceName = null, string DeviceType = null, string UserAgent = null)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "UpdateUnsubscribeById", ResponseId, DeviceName, DeviceType, UserAgent };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailSent?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }


        public async Task UpdateIsBounced(string ResponseId, string Emailid, string BouncedCategory, string BouncedReason)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "UpdateIsBounced", ResponseId, Emailid, BouncedCategory, BouncedReason };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<GroupMember>> GetContactIdList(int[] MailSendingSettingId, int[] CampaignResponseValue)
        {
            Int16 Opened, Clicked, Forward, Unsubscribe, IsBounced; Opened = Clicked = Forward = Unsubscribe = IsBounced = 0;
            Int16? SendStatus = null;
            foreach (int value in CampaignResponseValue)
            {
                if (value == 1)
                    Opened = 1;
                else if (value == 2)
                    Clicked = 1;
                else if (value == 3)
                    Unsubscribe = 1;
                else if (value == 4)
                    IsBounced = 1;
                else if (value == 5)
                    Forward = 1;
                else if (value == 6)
                    SendStatus = 0;
            }

            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "GetContactIdList", MailSendingSettingId = string.Join(",", MailSendingSettingId), Opened, Clicked, Forward, Unsubscribe, IsBounced, SendStatus };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<GroupMember>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<int> IndividualMaxCount(int mailCampaignId, DateTime FromDateTime, DateTime ToDateTime, string Emailid)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "IndividualMaxCount", mailCampaignId, FromDateTime, ToDateTime, Emailid };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<MailSent>> GetIndividualResponseData(int mailCampaignId, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, string Emailid)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "GetIndividualResponseData", mailCampaignId, FromDateTime, ToDateTime, OffSet, FetchNext, Emailid };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailSent>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<bool> ElasticOpenUpdate(string ResponseId, string Emailid)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "ElasticOpenUpdate", ResponseId, Emailid };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }
        public async Task<MailSent?> ElasticClickUpdate(string ResponseId, string Emailid)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "ElasticClickUpdate", ResponseId, Emailid };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailSent?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> ElasticUnsubscribeUpdate(string ResponseId, string Emailid)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "ElasticUnsubscribeByIdUpdate", ResponseId, Emailid };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }
        public async Task ElasticIsBouncedUpdate(string ResponseId, string Emailid, string BouncedCategory, string BouncedReason, string BouncedType)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "ElasticIsBouncedUpdate", ResponseId, Emailid, BouncedCategory, BouncedReason, BouncedType };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateDeliveredByResponseId(string ResponseId, string EmailId = null)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "UpdateDeliveredByResponseId", ResponseId, EmailId };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }


        public async Task<object> GetOpenAndClickedRate(string GroupIds)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "GetOpenAndClickedRate", GroupIds };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<int> GetConsumptionCount(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "GetConsumptionCount", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<MLMailCampaign>> GetCampaignResponseData(int MailSendingSettingId)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "GetCampaignResponseData", MailSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailCampaign>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task UpdateDeliveredByResponseIdAsync(string ResponseId, string EmailId = null)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "UpdateDeliveredByResponseId", ResponseId, EmailId };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> ElasticDeliveredUpdateAsync(string ResponseId, string Emailid, DateTime? datetime = null)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "ElasticDeliveredUpdate", ResponseId, Emailid, datetime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> ElasticOpenUpdateAsync(string ResponseId, string Emailid, DateTime? datetime = null)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "ElasticOpenUpdate", ResponseId, Emailid, datetime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<MailSent?> ElasticClickUpdateAsync(string ResponseId, string Emailid, DateTime? datetime = null)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "ElasticClickUpdate", ResponseId, Emailid, datetime };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailSent?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> ElasticUnsubscribeUpdateAsync(string ResponseId, string Emailid)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "ElasticUnsubscribeByIdUpdate", ResponseId, Emailid };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task ElasticIsBouncedUpdateAsync(string ResponseId, string Emailid, string BouncedCategory, string BouncedReason, string BouncedType)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "ElasticIsBouncedUpdate", ResponseId, Emailid, BouncedCategory, BouncedReason, BouncedType };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task UpdateIsBouncedAsync(string ResponseId, string Emailid, string BouncedCategory, string BouncedReason)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "UpdateIsBounced", ResponseId, Emailid, BouncedCategory, BouncedReason };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateOpenAsync(string ResponseId, string DeviceName, string DeviceType, string UserAgent)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "UpdateOpen", ResponseId, DeviceName, DeviceType, UserAgent };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<MailSent?> UpdateClickAsync(string ResponseId, string DeviceName, string DeviceType, string UserAgent)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "UpdateClick", ResponseId, DeviceName, DeviceType, UserAgent };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailSent?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<MailSent?> UpdateUnsubscribeAsync(string ResponseId, string DeviceName, string DeviceType, string UserAgent)
        {
            string storeProcCommand = "Mail_Sent";
            object? param = new { Action = "UpdateUnsubscribeById", ResponseId, DeviceName, DeviceType, UserAgent };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailSent?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
