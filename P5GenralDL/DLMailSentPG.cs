using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IP5GenralDL;
using Dapper;
using System.Diagnostics.Tracing;

namespace P5GenralDL
{
    public class DLMailSentPG : CommonDataBaseInteraction, IDLMailSent
    {
        CommonInfo connection;

        public DLMailSentPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailSentPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Send(MailSent mailSent)
        {
            string storeProcCommand = "select mail_sent_save(@MailTemplateId, @MailCampaignId, @MailSendingSettingId, @GroupId, @ContactId, @EmailId, @ResponseId, @DripSequence, @DripConditionType, @SendStatus, @ProductIds, @P5MailUniqueID, @ErrorMessage, @Subject, @FromName, @FromEmailId, @ReplayToEmailId, @CampaignJobName, @MailConfigurationNameId, @UserInfoUserId, @Score, @LeadLabel, @Publisher, @LmsGroupMemberId)";
            object? param = new { mailSent.MailTemplateId, mailSent.MailCampaignId, mailSent.MailSendingSettingId, mailSent.GroupId, mailSent.ContactId, mailSent.EmailId, mailSent.ResponseId, mailSent.DripSequence, mailSent.DripConditionType, mailSent.SendStatus, mailSent.ProductIds, mailSent.P5MailUniqueID, mailSent.ErrorMessage, mailSent.Subject, mailSent.FromName, mailSent.FromEmailId, mailSent.ReplayToEmailId, mailSent.CampaignJobName, mailSent.MailConfigurationNameId, mailSent.UserInfoUserId, mailSent.Score, mailSent.LeadLabel, mailSent.Publisher, mailSent.LmsGroupMemberId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<bool> UpdateOpen(string ResponseId, string DeviceName = null, string DeviceType = null, string UserAgent = null)
        {
            string storeProcCommand = "select mail_sent_updateopen(@ResponseId, @DeviceName, @DeviceType, @UserAgent)";
            object? param = new { ResponseId, DeviceName, DeviceType, UserAgent };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<MailSent?> UpdateClick(string ResponseId, string DeviceName = null, string DeviceType = null, string UserAgent = null)
        {
            string storeProcCommand = "select * from mail_sent_updateclick(@ResponseId, @DeviceName, @DeviceType, @UserAgent)";
            object? param = new { ResponseId, DeviceName, DeviceType, UserAgent };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailSent?>(storeProcCommand, param);
        }

        public async Task<MailSent?> UpdateUnsubscribe(string ResponseId, string DeviceName = null, string DeviceType = null, string UserAgent = null)
        {
            string storeProcCommand = "select * from mail_sent_updateunsubscribebyid(@ResponseId, @DeviceName, @DeviceType, @UserAgent)";
            object? param = new { ResponseId, DeviceName, DeviceType, UserAgent };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailSent?>(storeProcCommand, param);
        }


        public async Task UpdateIsBounced(string ResponseId, string Emailid, string BouncedCategory, string BouncedReason)
        {
            string storeProcCommand = "select mail_sent_updateisbounced(@ResponseId, @Emailid, @BouncedCategory, @BouncedReason)";
            object? param = new { ResponseId, Emailid, BouncedCategory, BouncedReason };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);
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

            string storeProcCommand = "select * from mail_sent_getcontactidlist(@MailSendingSettingId, @Opened, @Clicked, @Forward, @Unsubscribe, @IsBounced, @SendStatus)";
            object? param = new { MailSendingSettingId = string.Join(",", MailSendingSettingId), Opened, Clicked, Forward, Unsubscribe, IsBounced, SendStatus };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<GroupMember>(storeProcCommand, param)).ToList();
        }

        public async Task<int> IndividualMaxCount(int mailCampaignId, DateTime FromDateTime, DateTime ToDateTime, string Emailid)
        {
            string storeProcCommand = "select mail_sent_individualmaxcount(@mailCampaignId, @FromDateTime, @ToDateTime, @Emailid)";
            object? param = new { mailCampaignId, FromDateTime, ToDateTime, Emailid };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<List<MailSent>> GetIndividualResponseData(int mailCampaignId, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, string Emailid)
        {
            string storeProcCommand = "select * from mail_sent_getindividualresponsedata(@mailCampaignId, @FromDateTime, @ToDateTime, @OffSet, @FetchNext, @Emailid)";
            object? param = new { mailCampaignId, FromDateTime, ToDateTime, OffSet, FetchNext, Emailid };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailSent>(storeProcCommand, param)).ToList();
        }

        public async Task<bool> ElasticOpenUpdate(string ResponseId, string Emailid)
        {
            string storeProcCommand = "select mail_sent_elasticopenupdate(@ResponseId, @Emailid)";
            object? param = new { ResponseId, Emailid };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }
        public async Task<MailSent?> ElasticClickUpdate(string ResponseId, string Emailid)
        {
            string storeProcCommand = "select * from mail_sent_elasticclickupdate(@ResponseId, @Emailid)";
            object? param = new { ResponseId, Emailid };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailSent?>(storeProcCommand, param);
        }

        public async Task<bool> ElasticUnsubscribeUpdate(string ResponseId, string Emailid)
        {
            string storeProcCommand = "select mail_sent_elasticunsubscribebyidupdate(@ResponseId, @Emailid)";
            object? param = new { ResponseId, Emailid };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }
        public async Task ElasticIsBouncedUpdate(string ResponseId, string Emailid, string BouncedCategory, string BouncedReason, string BouncedType)
        {
            string storeProcCommand = "select mail_sent_elasticisbouncedupdate(@ResponseId, @Emailid, @BouncedCategory, @BouncedReason, @BouncedType)";
            object? param = new { ResponseId, Emailid, BouncedCategory, BouncedReason, BouncedType };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task UpdateDeliveredByResponseId(string ResponseId, string EmailId = null)
        {
            string storeProcCommand = "select mail_sent_updatedeliveredbyresponseid(@ResponseId, @EmailId)";
            object? param = new { ResponseId, EmailId };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }


        public async Task<object> GetOpenAndClickedRate(string GroupIds)
        {
            string storeProcCommand = "select mail_sent_getopenandclickedrate(@GroupIds)";
            object? param = new { GroupIds };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<int> GetConsumptionCount(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select mail_sent_getconsumptioncount(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<List<MLMailCampaign>> GetCampaignResponseData(int MailSendingSettingId)
        {
            string storeProcCommand = "select * from mail_sent_getcampaignresponsedata(@MailSendingSettingId)";
            object? param = new { MailSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailCampaign>(storeProcCommand, param)).ToList();
        }

        public async Task UpdateDeliveredByResponseIdAsync(string ResponseId, string EmailId = null)
        {
            string storeProcCommand = "select mail_sent_updatedeliveredbyresponseid(@ResponseId, @EmailId)";
            object? param = new { ResponseId, EmailId };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> ElasticDeliveredUpdateAsync(string ResponseId, string Emailid, DateTime? datetime = null)
        {
            string storeProcCommand = "select mail_sent_elasticdeliveredupdate(@ResponseId, @Emailid, @datetime)";
            object? param = new { ResponseId, Emailid, datetime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> ElasticOpenUpdateAsync(string ResponseId, string Emailid, DateTime? datetime = null)
        {
            string storeProcCommand = "select mail_sent_elasticopenupdate(@ResponseId, @Emailid, @datetime)";
            object? param = new { ResponseId, Emailid, datetime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<MailSent?> ElasticClickUpdateAsync(string ResponseId, string Emailid, DateTime? datetime = null)
        {
            string storeProcCommand = "select * from mail_sent_elasticclickupdate(@ResponseId, @Emailid, @datetime)";
            object? param = new { ResponseId, Emailid, datetime };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailSent?>(storeProcCommand, param);
        }

        public async Task<bool> ElasticUnsubscribeUpdateAsync(string ResponseId, string Emailid)
        {
            string storeProcCommand = "select mail_sent_elasticunsubscribebyidupdate(@ResponseId, @Emailid)";
            object? param = new { ResponseId, Emailid };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task ElasticIsBouncedUpdateAsync(string ResponseId, string Emailid, string BouncedCategory, string BouncedReason, string BouncedType)
        {
            string storeProcCommand = "select mail_sent_elasticisbouncedupdate(@ResponseId, @Emailid, @BouncedCategory, @BouncedReason, @BouncedType)";
            object? param = new { ResponseId, Emailid, BouncedCategory, BouncedReason, BouncedType };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task UpdateIsBouncedAsync(string ResponseId, string Emailid, string BouncedCategory, string BouncedReason)
        {
            string storeProcCommand = "select mail_sent_updateisbounced(@ResponseId, @Emailid, @BouncedCategory, @BouncedReason)";
            object? param = new { ResponseId, Emailid, BouncedCategory, BouncedReason };

            using var db = GetDbConnection(connection.Connection);
            await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> UpdateOpenAsync(string ResponseId, string DeviceName, string DeviceType, string UserAgent)
        {
            string storeProcCommand = "select mail_sent_updateopen(@ResponseId, @DeviceName, @DeviceType, @UserAgent)";
            object? param = new { ResponseId, DeviceName, DeviceType, UserAgent };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<MailSent?> UpdateClickAsync(string ResponseId, string DeviceName, string DeviceType, string UserAgent)
        {
            string storeProcCommand = "select * from mail_sent_updateclick(@ResponseId, @DeviceName, @DeviceType, @UserAgent)";
            object? param = new { ResponseId, DeviceName, DeviceType, UserAgent };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailSent?>(storeProcCommand, param);
        }

        public async Task<MailSent?> UpdateUnsubscribeAsync(string ResponseId, string DeviceName, string DeviceType, string UserAgent)
        {
            string storeProcCommand = "select * from mail_sent_updateunsubscribebyid(@ResponseId, @DeviceName, @DeviceType, @UserAgent)";
            object? param = new { ResponseId, DeviceName, DeviceType, UserAgent };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailSent?>(storeProcCommand, param);
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
