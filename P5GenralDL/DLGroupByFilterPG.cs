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
    public class DLGroupByFilterPG : CommonDataBaseInteraction, IDLGroupByFilter
    {
        CommonInfo connection;
        public DLGroupByFilterPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLGroupByFilterPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> SaveUpdate(GroupByFilter groupByFilter)
        {
            string storeProcCommand = "select group_byfilter_saveupdate(@GroupId, @IsOtherGroup, @TimeInterval, @FilterContent, @FilterQuery)";
            object? param = new { groupByFilter.GroupId, groupByFilter.IsOtherGroup, groupByFilter.TimeInterval, groupByFilter.FilterContent, groupByFilter.FilterQuery };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<GroupByFilter?> Get(GroupByFilter groupByFilter)
        {
            string storeProcCommand = "select * from group_byfilter_get(@GroupId, @IsOtherGroup, @TimeInterval)";
            object? param = new { groupByFilter.GroupId, groupByFilter.IsOtherGroup, groupByFilter.TimeInterval };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<GroupByFilter?>(storeProcCommand, param);
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
