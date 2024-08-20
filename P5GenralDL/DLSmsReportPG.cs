using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System;

namespace P5GenralDL
{
    public class DLSmsReportPG : CommonDataBaseInteraction, IDLSmsReport
    {
        CommonInfo connection;

        public DLSmsReportPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsReportPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<int> MaxCount(DateTime FromDateTime, DateTime ToDateTime, string CampaignName, string TemplateName)
        {
            string storeProcCommand = "select * from sms_reportdetails_getmaxcount(@FromDateTime, @ToDateTime, @CampaignName, @TemplateName)";
            object? param = new { FromDateTime, ToDateTime, CampaignName, TemplateName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<List<MLSmsReport>> GetReportData(DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, string CampaignName = null, string TemplateName = null)
        {
            string storeProcCommand = "select * from sms_reportdetails_getreportdata(@FromDateTime, @ToDateTime, @OffSet, @FetchNext, @CampaignName, @TemplateName)";
            object? param = new { FromDateTime, ToDateTime, OffSet, FetchNext, CampaignName, TemplateName };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsReport>(storeProcCommand, param)).ToList();
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
