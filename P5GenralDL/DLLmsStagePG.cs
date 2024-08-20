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
    public class DLLmsStagePG : CommonDataBaseInteraction, IDLLmsStage
    {
        CommonInfo connection;

        public DLLmsStagePG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLmsStagePG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int16> Save(LmsStage lmsStage)
        {
            string storeProcCommand = "select lms_stage_save(@UserInfoUserId, @UserGroupId, @Stage, @Score, @IsNegotiation, @IdentificationColor, @ChartId, @UserGroupIdList)";
            object? param = new { lmsStage.UserInfoUserId, lmsStage.UserGroupId, lmsStage.Stage, lmsStage.Score, lmsStage.IsNegotiation, lmsStage.IdentificationColor, lmsStage.ChartId, lmsStage.UserGroupIdList };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param);
        }

        public async Task<bool> Update(LmsStage lmsStage)
        {
            string storeProcCommand = "select lms_stage_update(@Id, @UserInfoUserId, @UserGroupId, @Stage, @Score, @IsNegotiation, @IdentificationColor, @ChartId, @UserGroupIdList)";
            object? param = new { lmsStage.Id, lmsStage.UserInfoUserId, lmsStage.UserGroupId, lmsStage.Stage, lmsStage.Score, lmsStage.IsNegotiation, lmsStage.IdentificationColor, lmsStage.ChartId, lmsStage.UserGroupIdList };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
        }


        public async Task<List<LmsStage>> GetAllList(int? Score = null)
        {
            string storeProcCommand = "select * from lms_stage_get(@Score)";
            object? param = new { Score };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<LmsStage>(storeProcCommand, param)).ToList();
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "select lms_stage_delete(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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
