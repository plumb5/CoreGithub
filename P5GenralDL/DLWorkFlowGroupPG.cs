﻿using Dapper;
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
    public class DLWorkFlowGroupPG : CommonDataBaseInteraction, IDLWorkFlowGroup
    {
        CommonInfo connection;
        public DLWorkFlowGroupPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowGroupPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> GetMaxCount(WorkFlowGroup groups)
        {
            string storeProcCommand = "select * from workflow_groupdetails_getmaxcount(@Name,@Id)";
            object? param = new { groups.Name, groups.Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }
        public async Task<int> GetTotalCount(string GroupIds)
        {
            string storeProcCommand = "select * from workflow_groupdetails_getgroupscount(@GroupIds)";
            object? param = new { GroupIds };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }
        public async Task<List<WorkFlowGroup>> GetListDetails(WorkFlowGroup group, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from workflow_groupdetails_getdetail(@Name,@Id, @OffSet, @FetchNext)";
            object? param = new { group.Name, group.Id, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WorkFlowGroup>(storeProcCommand, param)).ToList();

        }

        public async Task<DataSet> GetGroupDetails(string GroupIds, int Offset, int FetchNext, bool Isbelong, int action)
        {
            string storeProcCommand = "select * from workflow_groupdetails_getworkflowgroupscount(@GroupIds, @Isbelong, @Offset, @FetchNext)";
            object? param = new { GroupIds, Isbelong, Offset, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;

        }

        public async Task<int> MaxCount(string GroupIds, bool Isbelong)
        {
            string storeProcCommand = "select * from WorkFlow_GroupDetails(@MachineId,@Key)";
            object? param = new { Action = "MaxCount", @GroupIds, Isbelong };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<List<Contact>> GetContactList(int GroupId, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from WorkFlow_GroupDetails(@Action,@GroupId, @OffSet, @FetchNext )";
            object? param = new { Action = "GetPhoneNumbers", GroupId, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Contact>(storeProcCommand, param)).ToList();

        }

        public async Task<List<MLWorkFlowContactGroup>> GetWorkFlowContactListDetails(int GroupId, int ContactType, int OffSet = -1, int FetchNext = -1)
        {
            string storeProcCommand = "select * from WorkFlow_GroupDetails(@Action,@GroupId, @OffSet, @FetchNext, @ContactType)";
            object? param = new { Action = "GetWorkFlowGroupsIndividualCount", GroupId, OffSet, FetchNext, ContactType };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWorkFlowContactGroup>(storeProcCommand, param)).ToList();

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
