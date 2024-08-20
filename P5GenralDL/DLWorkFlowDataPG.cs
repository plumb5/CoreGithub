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
    public class DLWorkFlowDataPG : CommonDataBaseInteraction, IDLWorkFlowData
    {
        CommonInfo connection;
        public DLWorkFlowDataPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowDataPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(WorkFlowData workFlowData)
        {
            string storeProcCommand = "select workflow_data_save(@WorkFlowId, @Channel, @ChannelName, @ConfigId, @Segment, @SegmentId, @Rules, @RulesId, @IsRuleSatisfy, @PreChannel, @PreConfigId, @Condition, @Time, @Date, @DateValue, @DateValueTo, @DateCondition, @IsGroupOrIndividual, @IsBelongToGroup, @RulesName, @SegmentName, @ConfigName, @TimeType, @DaysOfWeek, @DaysOfMonth, @IsDynamicGroup, @SlotTime, @SlotTime1)";
            object? param = new { workFlowData.WorkFlowId, workFlowData.Channel, workFlowData.ChannelName, workFlowData.ConfigId, workFlowData.Segment, workFlowData.SegmentId, workFlowData.Rules, workFlowData.RulesId, workFlowData.IsRuleSatisfy, workFlowData.PreChannel, workFlowData.PreConfigId, workFlowData.Condition, workFlowData.Time, workFlowData.Date, workFlowData.DateValue, workFlowData.DateValueTo, workFlowData.DateCondition, workFlowData.IsGroupOrIndividual, workFlowData.IsBelongToGroup, workFlowData.RulesName, workFlowData.SegmentName, workFlowData.ConfigName, workFlowData.TimeType, workFlowData.DaysOfWeek, workFlowData.DaysOfMonth, workFlowData.IsDynamicGroup, workFlowData.SlotTime, workFlowData.SlotTime1 };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
         

        public async Task<bool>  Delete(int WorkFlowId)
        {
            string storeProcCommand = "select workflow_data_delete(@WorkFlowId)"; 
            object? param = new { WorkFlowId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
        }

        public async Task<IEnumerable<WorkFlowData>> GetDetails(WorkFlowData workFlowData)
        {
            string storeProcCommand = "select * from workflow_data_getdetails(@WorkFlowDataId, @WorkFlowId, @Channel)"; 
            object? param = new {  workFlowData.WorkFlowDataId, workFlowData.WorkFlowId, workFlowData.Channel };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowData>(storeProcCommand, param);

        }

        public async Task<IEnumerable<WorkFlowData>> GetDetailsList(int WorkFlowId)
        {
            string storeProcCommand = "select * from workflow_data_getdetailslist(@WorkFlowId)"; 
            object? param = new { WorkFlowId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowData>(storeProcCommand, param);
        }

        public async Task<IEnumerable<WorkFlowData>> GetruleforEdit(int WorkflowId)
        {
            string storeProcCommand = "select * from workflow_data_getruleforedit(@WorkflowId)"; 
            object? param = new { WorkflowId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowData>(storeProcCommand, param);
        }
        public async Task<IEnumerable<WorkFlowData>> GetConfigDetail(int WorkFlowId)
        {
            string storeProcCommand = "select * from workflow_data_getconfigdetail(@WorkFlowId)";
             
            object? param = new { WorkFlowId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowData>(storeProcCommand, param);
        }

        public async Task<IEnumerable<WorkFlowData>> GetConfigDetailByWorkFlowId(int WorkFlowId)
        {
            string storeProcCommand = "select * from workflow_data_getconfigdetailbyworkflowid(@WorkFlowId)"; 
            object? param = new { WorkFlowId }; 
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowData>(storeProcCommand, param);
        }
        public async Task<IEnumerable<WorkFlowData>> GetDateandTime(int WorkFlowId, string NodeId)
        {
            string storeProcCommand = "select * from workflow_data_getdatedata( @WorkFlowId, @NodeId)"; 
            object? param = new { WorkFlowId, NodeId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<WorkFlowData>(storeProcCommand, param);
        }
        public async Task<bool> UpdateDateandTime(WorkFlowData workFlowData)
        {
            string storeProcCommand = "select workflow_data_updatedate(@WorkFlowId, @Date, @Time, @DateValue, @DateValueTo, @DateCondition, @TimeType, @DaysOfWeek, @DaysOfMonth, @SlotTime, @SlotTime1)";
            object? param = new { workFlowData.WorkFlowId, workFlowData.Date, workFlowData.Time, workFlowData.DateValue, workFlowData.DateValueTo, workFlowData.DateCondition, workFlowData.TimeType, workFlowData.DaysOfWeek, workFlowData.DaysOfMonth, workFlowData.SlotTime, workFlowData.SlotTime1 };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;

        }

        public async Task<bool> UpdateGroupsIndividual(WorkFlowData workFlowData)
        {
            string storeProcCommand = "select workflow_data_updatesegement(@WorkFlowId, @SegmentId, @SegmentName, @Segment, @IsBelongToGroup, @IsGroupOrIndividual)";
            object? param = new { workFlowData.WorkFlowId, workFlowData.SegmentId, workFlowData.SegmentName, workFlowData.Segment, workFlowData.IsBelongToGroup, workFlowData.IsGroupOrIndividual };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }
          
        public async Task<Int32> GetTempId(string Action, WorkFlowData workflow)
        {
            string storeProcCommand = "select workflow_data_gettemplatids(@Action, @ConfigId )"; 
            object? param = new { Action, workflow.ConfigId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
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
