using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;

namespace P5GenralDL
{
    public class DLRevenueMappingSQL : CommonDataBaseInteraction, IDLRevenueMapping
    {
        CommonInfo connection;
        public DLRevenueMappingSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public DLRevenueMappingSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<RevenueMapping>> GetSettingsFieldsName()
        {
            string storeProcCommand = "Revenue_Mapping";
            object? param = new { @Action = "GetSettingFieldNames" };
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<RevenueMapping>(storeProcCommand)).ToList();
        }

        public async Task<List<RevenueMapping>> Geteventfileds(int customeventoverviewid)
        {
            string storeProcCommand = "Revenue_Mapping";
            object? param = new { @Action = "GetRevenueFiledsName", customeventoverviewid };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<RevenueMapping>(storeProcCommand, param)).ToList();
        }

        public async Task<List<RevenueMapping>> GetSettingFieldNames()
        {
            string storeProcCommand = "Revenue_Mapping";
            object? param = new { @Action = "GetSettingFieldNamesWithCurreny" };
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<RevenueMapping>(storeProcCommand)).ToList();
        }

        public async Task<List<RevenueMapping>> GetRevenueFiledsNameById(int customeventoverviewid)
        {
            string storeProcCommand = "Revenue_Mapping";
            object? param = new { @Action = "GetRevenueFiledsNameById", customeventoverviewid };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<RevenueMapping>(storeProcCommand, param)).ToList();
        }

        public async Task<List<RevenueMapping>> GetRevenueData()
        {
            string storeProcCommand = "Revenue_Mapping";
            object? param = new { @Action = "Get" };
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<RevenueMapping>(storeProcCommand)).ToList();
        }

        public async Task<List<RevenueMapping>> GeteventfiledsbyId(int customeventoverviewid)
        {
            string storeProcCommand = "Revenue_Mapping";
            object? param = new { @Action = "GetRevenueFiledsNameById", customeventoverviewid };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<RevenueMapping>(storeProcCommand, param)).ToList();
        }

        public async Task<Int32> Save(RevenueMapping RevenueMappingFields)
        {
            string storeProcCommand = "Revenue_Mapping";
            object? param = new { @Action = "Save", RevenueMappingFields.CurrencyType, RevenueMappingFields.CustomEventOverViewId, RevenueMappingFields.CustomEventName, RevenueMappingFields.CustomEventFiledName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }
        public async Task<bool> Delete()
        {
            string storeProcCommand = "Revenue_Mapping";
            object? param = new { @Action = "Delete" };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand) > 0;
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

