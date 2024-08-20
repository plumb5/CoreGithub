using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLWorkFlowGroupSQL : CommonDataBaseInteraction, IDLWorkFlowGroup
    {
        CommonInfo connection;
        public DLWorkFlowGroupSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowGroupSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> GetMaxCount(WorkFlowGroup groups)
        {
            string storeProcCommand = "WorkFlow_GroupDetails";
            object? param = new { Action = "GetMaxCount", groups.Name, groups.Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<int> GetTotalCount(string GroupIds)
        {
            string storeProcCommand = "WorkFlow_GroupDetails";
            object? param = new { Action = "GetGroupsCount", GroupIds };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<List<WorkFlowGroup>> GetListDetails(WorkFlowGroup group, int OffSet, int FetchNext)
        {
            string storeProcCommand = "WorkFlow_GroupDetails";
            object? param = new { Action = "GetDetails", group.Name, group.Id, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WorkFlowGroup>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<DataSet> GetGroupDetails(string GroupIds, int Offset, int FetchNext, bool Isbelong, int action)
        {
            string storeProcCommand = "WorkFlow_GroupDetails";
            object? param = new { Action = "GetWorkFlowGroupsCount", GroupIds, Isbelong, Offset, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;

        }

        public async Task<int> MaxCount(string GroupIds, bool Isbelong)
        {
            string storeProcCommand = "WorkFlow_GroupDetails";
            object? param = new { Action = "MaxCount", @GroupIds, Isbelong };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<Contact>> GetContactList(int GroupId, int OffSet, int FetchNext)
        {
            string storeProcCommand = "WorkFlow_GroupDetails";
            object? param = new { Action = "GetPhoneNumbers", GroupId, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Contact>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<List<MLWorkFlowContactGroup>> GetWorkFlowContactListDetails(int GroupId, int ContactType, int OffSet = -1, int FetchNext = -1)
        {
            string storeProcCommand = "WorkFlow_GroupDetails";
            object? param = new { Action = "GetWorkFlowGroupsIndividualCount", GroupId, OffSet, FetchNext, ContactType };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWorkFlowContactGroup>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

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

