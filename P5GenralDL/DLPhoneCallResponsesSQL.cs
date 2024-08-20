using Dapper;
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
    public class DLPhoneCallResponsesSQL : CommonDataBaseInteraction, IDLPhoneCallResponses
    {
        CommonInfo connection;
        public DLPhoneCallResponsesSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLPhoneCallResponsesSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<Int32> Save(PhoneCallResponses phoneCallResponses)
        {
            string storeProcCommand = "PhoneCall_Responses";

            object? param = new
            {   Action="Save",
                phoneCallResponses.Called_Sid,
                phoneCallResponses.CalledDate,
                phoneCallResponses.PhoneNumber,
                phoneCallResponses.CalledStatus,
                phoneCallResponses.Pickduration,
                phoneCallResponses.TotalCallDuration,
                phoneCallResponses.CallEvents,
                phoneCallResponses.CalledNumber,
                phoneCallResponses.RecordedFileUrl,
                phoneCallResponses.DownLoadStatus,
                phoneCallResponses.ContactId,
                phoneCallResponses.LmsGroupId,
                phoneCallResponses.Score,
                phoneCallResponses.LeadLabel,
                phoneCallResponses.ErrorMessage,
                phoneCallResponses.P5UniqueId,
                phoneCallResponses.SendStatus,
                phoneCallResponses.UserInfoUserId,
                phoneCallResponses.CampaignJobName,
                phoneCallResponses.Publisher,
                phoneCallResponses.LmsGroupMemberId
            };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<Int32> Update(PhoneCallResponses phoneCallResponses)
        {
            string storeProcCommand = "PhoneCall_Responses";

            object? param = new
            {
                Action = "Update",
                phoneCallResponses.Called_Sid,
                phoneCallResponses.CalledDate,
                phoneCallResponses.PhoneNumber,
                phoneCallResponses.CalledStatus,
                phoneCallResponses.Pickduration,
                phoneCallResponses.TotalCallDuration,
                phoneCallResponses.CallEvents,
                phoneCallResponses.CalledNumber,
                phoneCallResponses.RecordedFileUrl,
                phoneCallResponses.DownLoadStatus
            };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<PhoneCallResponses>> GetDetails(PhoneCallResponses phoneCallResponses)
        {
            string storeProcCommand = "PhoneCall_Responses";
            object? param = new { Action = "Get", phoneCallResponses.PhoneNumber, phoneCallResponses.DownLoadStatus };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<PhoneCallResponses>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
