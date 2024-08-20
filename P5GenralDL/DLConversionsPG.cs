using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;

namespace P5GenralDL
{
    public class DLConversionsPG : CommonDataBaseInteraction, IDLConversions
    {
        CommonInfo connection;
        public DLConversionsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLConversionsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<object?> GoalsMaxCount(_Plumb5MLGoal mlObj)
        {
            try
            {
                var storeProcCommand = "select * from goal_setting_maxcount(@FromDate, @ToDate)";
                object? param = new { mlObj.FromDate, mlObj.ToDate };
                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
                 
            }
            catch
            {
                return 0;
            }
        }

        public async Task<object?> GetGoalsReport(_Plumb5MLGoal mlObj)
        {
            try
            {
                var storeProcCommand = "select * from goal_setting_getlist(@Start, @End)";
                object? param = new { mlObj.Start, mlObj.End };
                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch
            {
                return 0;
            }
        }

        public async Task<object?> Select_Goal(_Plumb5MLGoal mlObj)
        {
            try
            {
                var storeProcCommand = "select * from selectgoallist()";

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch
            {
                return 0;
            }
        }

        public async Task<Int32> Insert_GoalSetting(_Plumb5MLGoal mlObj)
        {
            try
            {
                var storeProcCommand = "select * from goal_setting_save(@GoalName, @GoalId, @Channel, @PageName1, @PageName2, @PageName3, @PageName4, @PageName5,@PageName6,@PageName7,@PageName8,@PageName9,@PageName10)";
                object? param = new {
                    mlObj.GoalName,
                    mlObj.GoalId,
                    mlObj.Channel,
                    mlObj.PageName1,
                    mlObj.PageName2,
                    mlObj.PageName3,
                    mlObj.PageName4,
                    mlObj.PageName5,
                    mlObj.PageName6,
                    mlObj.PageName7,
                    mlObj.PageName8,
                    mlObj.PageName9,
                    mlObj.PageName10
                };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
            }
            catch
            {
                return 0;
            }
        }

        public async Task<Int32> Delete_GoalSetting(_Plumb5MLGoal mlobj)
        {
            try
            {
                var storeProcCommand = "select * from goal_setting_delete(@GoalId)";
                object? param = new
                {
                    mlobj.GoalId
                };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
            }
            catch
            {
                return 0;
            }
        }

        public async Task<object?> Select_ForwardGoal(_Plumb5MLForwardGoal mlobj)
        {
            try
            {
                var storeProcCommand = "select * from forwardgoal(@GoalId, @FromDate, @ToDate)";
                object? param = new
                {
                    mlobj.GoalId,
                    mlobj.FromDate,
                    mlobj.ToDate
                };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch
            {
                return 0;
            }
        }

        public async Task<object?> Select_ReverseGoal(_Plumb5MLReverseGoal mlobj)
        {
            try
            {
                var storeProcCommand = "select * from forwardgoal(@GoalId, @FromDate, @ToDate)";
                object? param = new
                {
                    mlobj.GoalId,
                    mlobj.FromDate,
                    mlobj.ToDate
                };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
            catch
            {
                return 0;
            }
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

