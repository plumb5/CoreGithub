using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLUCPPG : CommonDataBaseInteraction, IDLUCP
    {
        readonly CommonInfo connection;
        public DLUCPPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLUCPPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<MLUCPVisitor?> GetVisitorDetail(MLUCPVisitor mLUCPVisitor)
        {
            var storeProcCommand = "select * from ucp_details_getvisitordetail(@ContactId,@MachineId,@DeviceId)";
            object? param = new { mLUCPVisitor.ContactId, mLUCPVisitor.MachineId, mLUCPVisitor.DeviceId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLUCPVisitor?>(storeProcCommand, param);

        }

        public async Task<DataSet> GetMchineIdsByContactId(MLUCPVisitor mLUCPVisitor)
        {
            var storeProcCommand = "select * from ucp_details_getmchineidsbycontactid(@ContactId,@MachineId,@DeviceId)";
            object? param = new { mLUCPVisitor.ContactId, mLUCPVisitor.MachineId, mLUCPVisitor.DeviceId };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetDevicedsByContactId(MLUCPVisitor mLUCPVisitor)
        {
            var storeProcCommand = "select * from ucp_details_getdevicedsbycontactid(@ContactId,@MachineId,@DeviceId)";
            object? param = new { mLUCPVisitor.ContactId, mLUCPVisitor.MachineId, mLUCPVisitor.DeviceId };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetBasicDetails(MLUCPVisitor mLUCPVisitor)
        {
            var storeProcCommand = mLUCPVisitor.ContactId > 0 ? "select * from ucp_details_getbasicdetails(@ContactId,@MachineId,@DeviceId)" : "select * from ucp_details_getbasicdetailswithoutcontact(@ContactId,@MachineId,@DeviceId)";

            object? param = new { mLUCPVisitor.ContactId, mLUCPVisitor.MachineId, mLUCPVisitor.DeviceId };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetWebSummary(MLUCPVisitor mLUCPVisitor)
        {
            var storeProcCommand = "select * from ucp_details_getwebsummary(@ContactId,@MachineId,@DeviceId)";
            object? param = new { mLUCPVisitor.ContactId, mLUCPVisitor.MachineId, mLUCPVisitor.DeviceId };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetMobileSummary(MLUCPVisitor mLUCPVisitor)
        {
            var storeProcCommand = "select * from ucp_details_getmobilesummary(@ContactId,@MachineId,@DeviceId)";
            object? param = new { mLUCPVisitor.ContactId, mLUCPVisitor.MachineId, mLUCPVisitor.DeviceId };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetMailDetails(MLUCPVisitor mLUCPVisitor, string CampaignJobName = null)
        {
            var storeProcCommand = "select * from  ucp_details_getmaildetails(@ContactId,@MachineId,@DeviceId,@FromDate,@ToDate,@CampaignJobName)";
            object? param = new { mLUCPVisitor.ContactId, mLUCPVisitor.MachineId, mLUCPVisitor.DeviceId, mLUCPVisitor.FromDate, mLUCPVisitor.ToDate, CampaignJobName };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetSmsDetails(MLUCPVisitor mLUCPVisitor, string CampaignJobName = null)
        {
            var storeProcCommand = "select * from ucp_details_getsmsdetails(@ContactId,@MachineId,@DeviceId,@FromDate,@ToDate,@CampaignJobName)";
            object? param = new { mLUCPVisitor.ContactId, mLUCPVisitor.MachineId, mLUCPVisitor.DeviceId, mLUCPVisitor.FromDate, mLUCPVisitor.ToDate, CampaignJobName };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetWhatsappDetails(MLUCPVisitor mLUCPVisitor, string CampaignJobName = null)
        {
            var storeProcCommand = "select * from ucp_details_getwhatsappdetails(@ContactId,@MachineId,@DeviceId,@FromDate,@ToDate,@CampaignJobName)";
            object? param = new { mLUCPVisitor.MachineId, mLUCPVisitor.DeviceId, mLUCPVisitor.ContactId, mLUCPVisitor.FromDate, mLUCPVisitor.ToDate, CampaignJobName };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetFormDetails(MLUCPVisitor mLUCPVisitor)
        {
            var storeProcCommand = "select * from ucp_details_getformdetails(@ContactId,@MachineId,@DeviceId,@FromDate,@ToDate)";
            object? param = new { mLUCPVisitor.ContactId, mLUCPVisitor.MachineId, mLUCPVisitor.DeviceId, mLUCPVisitor.FromDate, mLUCPVisitor.ToDate };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetCallDetails(MLUCPVisitor mLUCPVisitor)
        {
            var storeProcCommand = " select * from ucp_details_getcalldetails(@ContactId,@MachineId,@DeviceId,@FromDate,@ToDate)";
            object? param = new { mLUCPVisitor.ContactId, mLUCPVisitor.MachineId, mLUCPVisitor.DeviceId, mLUCPVisitor.FromDate, mLUCPVisitor.ToDate };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }
        public async Task<DataSet> GetTransactionDetails(MLUCPVisitor mLUCPVisitor)
        {
            var storeProcCommand = "select * from ucp_details_gettransactiondetails(@ContactId,@MachineId,@DeviceId,@FromDate,@ToDate)";
            object? param = new { mLUCPVisitor.ContactId, mLUCPVisitor.MachineId, mLUCPVisitor.DeviceId, mLUCPVisitor.FromDate, mLUCPVisitor.ToDate };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetClickStreamDetails(MLUCPVisitor mLUCPVisitor)
        {
            var storeProcCommand = "select * from ucp_details_getclickstreamdetails(@ContactId,@MachineId,@DeviceId,@FromDate,@ToDate)";
            object? param = new { mLUCPVisitor.ContactId, mLUCPVisitor.MachineId, mLUCPVisitor.DeviceId, mLUCPVisitor.FromDate, mLUCPVisitor.ToDate };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetMobileAppDetails(MLUCPVisitor mLUCPVisitor)
        {
            var storeProcCommand = "select * from ucp_details_getmobileappdetails(@ContactId,@MachineId,@DeviceId,@FromDate,@ToDate)";
            object? param = new { mLUCPVisitor.ContactId, mLUCPVisitor.MachineId, mLUCPVisitor.DeviceId, mLUCPVisitor.FromDate, mLUCPVisitor.ToDate };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<IEnumerable<Notes>> GetLmsNoteList(MLUCPVisitor mLUCPVisitor)
        {
            string storeProcCommand = "select * from ucp_details_getlmsnotes(@ContactId,@MachineId,@DeviceId,@FromDate,@ToDate)";
            object? param = new { mLUCPVisitor.ContactId, mLUCPVisitor.MachineId, mLUCPVisitor.DeviceId, mLUCPVisitor.FromDate, mLUCPVisitor.ToDate };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Notes>(storeProcCommand, param);

        }

        public async Task<IEnumerable<MLUserJourney>> GetUserJourney(MLUCPVisitor mLUCPVisitor)
        {
            var storeProcCommand = "select * from ucp_details_getuserjourney(@ContactId,@MachineId,@DeviceId,@Domain,@FromDate,@ToDate)";
            object? param = new { mLUCPVisitor.ContactId, mLUCPVisitor.MachineId, mLUCPVisitor.DeviceId, mLUCPVisitor.Domain, mLUCPVisitor.FromDate, mLUCPVisitor.ToDate };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLUserJourney>(storeProcCommand, param);
        }

        public async Task<IEnumerable<MLContact>> GetLmsAuditDetails(MLUCPVisitor mLUCPVisitor)
        {
            try
            {
                var storeProcCommand = "select * from ucp_details_getlmsauditdetails(@ContactId,@MachineId,@DeviceId,@FromDate,@ToDate)";

                object? param = new { mLUCPVisitor.ContactId, mLUCPVisitor.MachineId, mLUCPVisitor.DeviceId, mLUCPVisitor.FromDate, mLUCPVisitor.ToDate };
                using var db = GetDbConnection(connection.Connection);
                return await db.QueryAsync<MLContact>(storeProcCommand, param);

            }
            catch (Exception ex)
            {
                throw new Exception();

            }

        }

        public async Task<IEnumerable<ChatFullTranscipt>> GetPastChatDetails(MLUCPVisitor mLUCPVisitor)
        {
            var storeProcCommand = "select * from ucp_details_getpastchatdetails(@ContactId,@MachineId,@DeviceId ,@FromDate,@ToDate)";
            object? param = new { mLUCPVisitor.ContactId, mLUCPVisitor.MachineId, mLUCPVisitor.DeviceId, mLUCPVisitor.FromDate, mLUCPVisitor.ToDate };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<ChatFullTranscipt>(storeProcCommand, param);
        }

        public async Task<DataSet> GetWebPushDetails(MLUCPVisitor mLUCPVisitor)
        {
            var storeProcCommand = "select * from ucp_details_getwebpushdetails(@ContactId,@MachineId,@DeviceId ,@FromDate,@ToDate)";
            object? param = new { mLUCPVisitor.ContactId, mLUCPVisitor.MachineId, mLUCPVisitor.DeviceId, mLUCPVisitor.FromDate, mLUCPVisitor.ToDate };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetMobilePushDetails(MLUCPVisitor mLUCPVisitor)
        {
            var storeProcCommand = "select * from ucp_details_getmobilepushdetails(@ContactId,@MachineId,@DeviceId ,@FromDate,@ToDate)";
            object? param = new { mLUCPVisitor.ContactId, mLUCPVisitor.MachineId, mLUCPVisitor.DeviceId, mLUCPVisitor.FromDate, mLUCPVisitor.ToDate };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetFromAndToDate(MLUCPVisitor mLUCPVisitor, string Module)
        {
            try
            {
                var storeProcCommand = "select * from ucp_details_getfromandtodate(@ContactId,@MachineId,@DeviceId ,@FromDate,@ToDate,@Module)";
                object? param = new { mLUCPVisitor.ContactId, mLUCPVisitor.MachineId, mLUCPVisitor.DeviceId, mLUCPVisitor.FromDate, mLUCPVisitor.ToDate, Module };
                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch (Exception ex)
            {
                throw new Exception();
            }

        }

        public async Task<Int32> SaveContactName(int ContactId, string ContactName)
        {
            var storeProcCommand = "select ucp_details_savecontactname(@ContactId, @ContactName)";
            object? param = new { ContactId, ContactName };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }
        public async Task<IEnumerable<EventTracker>> GetEventTrackerDetails(EventTracker eVenttracker)
        {
            string storeProcCommand = "select * from event_tracker_data_getdetails(@MachineId,@SessionId)";
            object? param = new { eVenttracker.MachineId, eVenttracker.SessionId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<EventTracker>(storeProcCommand, param);

        }
        public async Task<IEnumerable<MailTemplate>> GetMailclcikstreamDetails(string MailP5UniqueID, string startdatetime, string enddatetime)
        {
            string storeProcCommand = "select * from ucp_details_getlistmail(@MailP5UniqueID)";
            object? param = new { MailP5UniqueID };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MailTemplate>(storeProcCommand, param);
        }

        public async Task<IEnumerable<SmsTemplate>> clickstreamGetSmsTemplateDetails(string SMSP5UniqueID, string startdatetime, string enddatetime)
        {
            string storeProcCommand = "select * from ucp_details_getlistsms(@SMSP5UniqueID)";
            object? param = new { SMSP5UniqueID };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsTemplate>(storeProcCommand, param);
        }
        public async Task<IEnumerable<MLWhatsAppTemplates>> clickstreamGetwhatsappTemplateDetails(string WhatsAppP5UniqueID, string startdatetime, string enddatetime)
        {
            string storeProcCommand = "select * from ucp_details_getlistwhatsapp(@WhatsAppP5UniqueID)";
            object? param = new { WhatsAppP5UniqueID };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLWhatsAppTemplates>(storeProcCommand, param);
        }
        public async Task<IEnumerable<Customevents>> GetEventdetailsClickStream(string machineid, string sessionid)
        {
            string storeProcCommand = "select * from ucp_details_getlistcustomevents( @machineid, @sessionid)";
            object? param = new { machineid, sessionid };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Customevents>(storeProcCommand, param);
        }
        public async Task<IEnumerable<MLWebPushTemplate>> GetGetWebPushClickStream(string P5WebPushUniqueID)
        {
            string storeProcCommand = "select * from  ucp_details_getlistwebpush(@P5WebPushUniqueID)";
            object? param = new { P5WebPushUniqueID };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLWebPushTemplate>(storeProcCommand, param);
        }
        public async Task<DataSet> ClickStreamGetCaptureFormDetails(string machineid, string sessionid)
        {
            var storeProcCommand = "select * from ucp_details_getclickstreamcaptureformdetails( @machineid, @sessionid)";
            object? param = new { machineid, sessionid };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }
        public async Task<IEnumerable<MLLeadScroinghistroy>> GetscroingDetails(MLUCPVisitor mLUCPVisitor)
        {
            string storeProcCommand = "select * from ucp_details_getscroinghistroydetails(@ContactId,@FromDate,@ToDate)";

            object? param = new { mLUCPVisitor.ContactId, mLUCPVisitor.FromDate, mLUCPVisitor.ToDate };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLLeadScroinghistroy>(storeProcCommand, param);
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
