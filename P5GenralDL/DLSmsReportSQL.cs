using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;


namespace P5GenralDL
{
    public class DLSmsReportSQL : CommonDataBaseInteraction, IDLSmsReport
    {
        CommonInfo connection;

        public DLSmsReportSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsReportSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<int> MaxCount(DateTime FromDateTime, DateTime ToDateTime, string CampaignName, string TemplateName)
        {
            string storeProcCommand = "SMS_ReportDetails";
            object? param = new { @Action = "GetMaxCount", FromDateTime, ToDateTime, CampaignName, TemplateName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<MLSmsReport>> GetReportData(DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, string CampaignName = null, string TemplateName = null)
        {
            string storeProcCommand = "SMS_ReportDetails";
            object? param = new { @Action = "GetReportData", FromDateTime, ToDateTime, OffSet, FetchNext, CampaignName, TemplateName };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsReport>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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

