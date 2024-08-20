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
    public class DLWorkFlowDataSQL : CommonDataBaseInteraction, IDLWorkFlowData
    {
        CommonInfo connection;
        public DLWorkFlowDataSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowDataSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(WorkFlowData workFlowData)
        {
            string storeProcCommand = "WorkFlow_Data";
            object? param = new { Action= "Save", workFlowData.WorkFlowId, workFlowData.Channel, workFlowData.ChannelName, workFlowData.ConfigId, workFlowData.Segment, workFlowData.SegmentId, workFlowData.Rules, workFlowData.RulesId, workFlowData.IsRuleSatisfy, workFlowData.PreChannel, workFlowData.PreConfigId, workFlowData.Condition, workFlowData.Time, workFlowData.Date, workFlowData.DateValue, workFlowData.DateValueTo, workFlowData.DateCondition, workFlowData.IsGroupOrIndividual, workFlowData.IsBelongToGroup, workFlowData.RulesName, workFlowData.SegmentName, workFlowData.ConfigName, workFlowData.TimeType, workFlowData.DaysOfWeek, workFlowData.DaysOfMonth, workFlowData.IsDynamicGroup, workFlowData.SlotTime, workFlowData.SlotTime1 };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure); 
        }


        public async Task<bool> Delete(int WorkFlowId)
        {
            string storeProcCommand = "WorkFlow_Data";
            object? param = new { Action = "Delete", WorkFlowId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0; 
        }

        public async Task<IEnumerable<WorkFlowData>> GetDetails(WorkFlowData workFlowData)
        {
            string storeProcCommand = "WorkFlow_Data";
            object? param = new { Action = "GetDetails", workFlowData.WorkFlowDataId, workFlowData.WorkFlowId, workFlowData.Channel };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowData>(storeProcCommand, param, commandType: CommandType.StoredProcedure); 

        }

        public async Task<IEnumerable<WorkFlowData>> GetDetailsList(int WorkFlowId)
        {
            string storeProcCommand = "WorkFlow_Data";
            object? param = new { Action = "GetDetailsList", WorkFlowId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowData>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<WorkFlowData>> GetruleforEdit(int WorkflowId)
        {
            string storeProcCommand = "WorkFlow_Data";
            object? param = new { Action = "GetruleforEdit", WorkflowId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowData>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<IEnumerable<WorkFlowData>> GetConfigDetail(int WorkFlowId)
        {
            string storeProcCommand = "WorkFlow_Data";

            object? param = new { Action = "GetConfigDetail", WorkFlowId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowData>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<WorkFlowData>> GetConfigDetailByWorkFlowId(int WorkFlowId)
        {
            string storeProcCommand = "WorkFlow_Data";
            object? param = new { Action = "GetConfigDetailByWorkFlowId", WorkFlowId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowData>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<IEnumerable<WorkFlowData>> GetDateandTime(int WorkFlowId, string NodeId)
        {
            string storeProcCommand = "WorkFlow_Data";
            object? param = new { Action = "GetDateData", WorkFlowId, NodeId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowData>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<bool> UpdateDateandTime(WorkFlowData workFlowData)
        {
            string storeProcCommand = "WorkFlow_Data";
            object? param = new { Action = "UpdateDate", workFlowData.WorkFlowId, workFlowData.Date, workFlowData.Time, workFlowData.DateValue, workFlowData.DateValueTo, workFlowData.DateCondition, workFlowData.TimeType, workFlowData.DaysOfWeek, workFlowData.DaysOfMonth, workFlowData.SlotTime, workFlowData.SlotTime1 };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<bool> UpdateGroupsIndividual(WorkFlowData workFlowData)
        {
            string storeProcCommand = "WorkFlow_Data";
            object? param = new { Action = "UpdateSegement", workFlowData.WorkFlowId, workFlowData.SegmentId, workFlowData.SegmentName, workFlowData.Segment, workFlowData.IsBelongToGroup, workFlowData.IsGroupOrIndividual };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<Int32> GetTempId(string Action, WorkFlowData workflow)
        {
            string storeProcCommand = "WorkFlow_Data)";
            object? param = new {  Action, workflow.ConfigId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
                    connection = null;
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
