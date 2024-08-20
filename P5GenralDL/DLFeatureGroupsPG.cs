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
    public class DLFeatureGroupsPG : CommonDataBaseInteraction, IDLFeatureGroups
    {
        CommonInfo connection;

        public DLFeatureGroupsPG()
        {
            connection = GetDBConnection();
        }
        public async Task<int> MaxCount()
        {
            string storeProcCommand = "select feature_groups_maxcount()";

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand);
        }

        public async Task<List<FeatureGroups>> GetReport(int Offset, int FetchNext)
        {
            string storeProcCommand = "select * from feature_groups_get(@Offset, @FetchNext)";
            object? param = new { Offset, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<FeatureGroups>(storeProcCommand, param)).ToList();
        }

        public async Task<int> Save(FeatureGroups featureGroups)
        {
            string storeProcCommand = "select feature_groups_save(@Name, @Description, @CurrencyType)";
            object? param = new { featureGroups.Name, featureGroups.Description, featureGroups.CurrencyType };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand);
        }

        public async Task<bool> Update(FeatureGroups featureGroups)
        {
            string storeProcCommand = "select feature_groups_update(@Id, @Name, @Description, @CurrencyType)";
            object? param = new { featureGroups.Id, featureGroups.Name, featureGroups.Description, featureGroups.CurrencyType };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand) > 0;
        }

        public async Task<bool> UpdateDataPurgeSettings(int Id, string PugesettingValue)
        {
            string storeProcCommand = "select feature_groups_updatepurgesettings(@Id, @PugesettingValue)";
            object? param = new { Id, PugesettingValue };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand) > 0;
        }
        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "select feature_groups_delete(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand) > 0;
        }

        public async Task<List<FeatureGroups>> GetFeatureGroupList()
        {
            string storeProcCommand = "select * from feature_groups_getfeaturegrouplist()";

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<FeatureGroups>(storeProcCommand)).ToList();
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
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
