using Dapper;
using DBInteraction;
using IP5GenralDL;
using Newtonsoft.Json;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLRevenueMappingPG : CommonDataBaseInteraction, IDLRevenueMapping
    {
        CommonInfo connection;
        public DLRevenueMappingPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public DLRevenueMappingPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<RevenueMapping>> GetSettingsFieldsName()
        {
            string storeProcCommand = "select * from revenue_mapping_getsettingfieldnames()";
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<RevenueMapping>(storeProcCommand)).ToList();
        }

        public async Task<List<RevenueMapping>> Geteventfileds(int customeventoverviewid)
        {
            string storeProcCommand = "select * from revenue_mapping_getrevenuefiledsname(@Customeventoverviewid)";
            object? param = new { customeventoverviewid };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<RevenueMapping>(storeProcCommand, param)).ToList();
        }

        public async Task<List<RevenueMapping>> GetSettingFieldNames()
        {
            string storeProcCommand = "select * from revenue_mapping_getsettingfieldnameswithcurreny()";
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<RevenueMapping>(storeProcCommand)).ToList();
        }

        public async Task<List<RevenueMapping>> GetRevenueFiledsNameById(int customeventoverviewid)
        {
            string storeProcCommand = "select * from revenue_mapping_getrevenuefiledsnamebyid(@Customeventoverviewid)";
            object? param = new { customeventoverviewid };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<RevenueMapping>(storeProcCommand, param)).ToList();
        }

        public async Task<List<RevenueMapping>> GetRevenueData()
        {
            string storeProcCommand = "select * from revenue_mapping_get()";
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<RevenueMapping>(storeProcCommand)).ToList();
        }

        public async Task<List<RevenueMapping>> GeteventfiledsbyId(int customeventoverviewid)
        {
            string storeProcCommand = "select * from revenue_mapping_getrevenuefiledsnamebyid(@Customeventoverviewid)";
            object? param = new { customeventoverviewid };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<RevenueMapping>(storeProcCommand, param)).ToList();
        }

        public async Task<Int32> Save(RevenueMapping RevenueMappingFields)
        {
            string storeProcCommand = "select revenue_mapping_save(@CurrencyType, @CustomEventOverViewId, @CustomEventName, @CustomEventFiledName)";
            object? param = new { RevenueMappingFields.CurrencyType, RevenueMappingFields.CustomEventOverViewId, RevenueMappingFields.CustomEventName, RevenueMappingFields.CustomEventFiledName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }
        public async Task<bool> Delete()
        {
            string storeProcCommand = "select revenue_mapping_delete()";

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

