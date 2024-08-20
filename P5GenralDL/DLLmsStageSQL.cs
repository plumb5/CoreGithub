using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLLmsStageSQL : CommonDataBaseInteraction, IDLLmsStage
    {
        CommonInfo connection;

        public DLLmsStageSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLmsStageSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int16> Save(LmsStage lmsStage)
        {
            string storeProcCommand = "Lms_Stage";
            object? param = new { Action = "Save", lmsStage.UserInfoUserId, lmsStage.UserGroupId, lmsStage.Stage, lmsStage.Score, lmsStage.IsNegotiation, lmsStage.IdentificationColor, lmsStage.ChartId, lmsStage.UserGroupIdList };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(LmsStage lmsStage)
        {
            string storeProcCommand = "Lms_Stage";
            object? param = new { Action = "Update", lmsStage.Id, lmsStage.UserInfoUserId, lmsStage.UserGroupId, lmsStage.Stage, lmsStage.Score, lmsStage.IsNegotiation, lmsStage.IdentificationColor, lmsStage.ChartId, lmsStage.UserGroupIdList };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }


        public async Task<List<LmsStage>> GetAllList(int? Score = null)
        {
            string storeProcCommand = "Lms_Stage";
            object? param = new { Action = "GET", Score };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<LmsStage>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "Lms_Stage";
            object? param = new { Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
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
