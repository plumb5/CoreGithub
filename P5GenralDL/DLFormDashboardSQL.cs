using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLFormDashboardSQL : CommonDataBaseInteraction, IDLFormDashboard
    {
        CommonInfo connection = null;
        public DLFormDashboardSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public DLFormDashboardSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<List<MLFormDashboardDetails>> GetTotalFormSubmissions(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Form_Dashbord";
            object? param = new { @Action = "TotalFormSubmissions", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLFormDashboardDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }
        public async Task<List<MLFormDashboardDetails>> GetTopFivePerFormingForms(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Form_Dashbord";
            object? param = new { @Action = "TopFivePerFormingForms", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLFormDashboardDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<MLFormDashboardDetails?> GetPlatformDistribution(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Form_Dashbord";
            object? param = new { @Action = "PlatformDistribution", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLFormDashboardDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<MLFormDashboardDetails?> GetAggregateFormsData(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Form_Dashbord";
            object? param = new { @Action = "AggregateFormsData", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLFormDashboardDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<int> GetMaxCount(DateTime FromDateTime, DateTime ToDateTime, string EmbeddedFormOrPopUpFormOrTaggedForm, int FormId)
        {
            string storeProcCommand = "FormReports_ByForms";
            object? param = new { @Action = "MaxCount", FromDateTime, ToDateTime, FormId, EmbeddedFormOrPopUpFormOrTaggedForm };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<List<MLFormDashboard>> GetFormByReport(int OffSet, int FetchNext, DateTime FromDateTime, DateTime ToDateTime, string EmbeddedFormOrPopUpFormOrTaggedForm, int FormId)
        {
            string storeProcCommand = "FormReports_ByForms";
            object? param = new { @Action = "GetFormReport", FromDateTime, ToDateTime, FormId, EmbeddedFormOrPopUpFormOrTaggedForm, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLFormDashboard>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<FormDetails>> GetFormDetailsByReport(DateTime FromDateTime, DateTime ToDateTime, string EmbeddedFormOrPopUpFormOrTaggedForm)
        {
            string storeProcCommand = "FormReports_ByForms";
            object? param = new { @Action = "GetFormDetails", FromDateTime, ToDateTime, EmbeddedFormOrPopUpFormOrTaggedForm };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<FormDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
