using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Text.RegularExpressions;

namespace P5GenralDL
{
    public class DLGroupsSQL : CommonDataBaseInteraction, IDLGroups
    {
        CommonInfo connection;

        public DLGroupsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLGroupsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(Groups group)
        {
            group.GroupType = (short)(group.GroupType == 0 ? 1 : group.GroupType);

            string storeProcCommand = "Groups_Details";
            object? param = new { Action = "Save", group.UserInfoUserId, group.UserGroupId, group.Name, group.GroupDescription, group.AppType, group.CafeId, group.DisplayInUnscubscribe, group.GroupType };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(Groups group)
        {
            string storeProcCommand = "Groups_Details";
            object? param = new { Action = "Update", group.Id, group.UserInfoUserId, group.UserGroupId, group.Name, group.GroupDescription, group.AppType, group.CafeId, group.DisplayInUnscubscribe, group.GroupType };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<List<Groups>> GetDetails(Groups group, int FetchNext = 0, int OffSet = -1, string ListOfGroupId = "")
        {
            string storeProcCommand = "Groups_Details";
            object? param = new { Action = "GET", group.Id, group.UserInfoUserId, group.UserGroupId, group.Name, group.GroupDescription, group.AppType, group.CafeId, group.GroupType, FetchNext, OffSet, ListOfGroupId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Groups>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<Groups?> Get(Groups group)
        {
            string storeProcCommand = "Groups_Details";
            object? param = new { Action = "GET", group.Id, group.UserInfoUserId, group.UserGroupId, group.Name, group.GroupDescription, group.AppType, group.CafeId, group.GroupType };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<Groups?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<Groups>> GetGroupList(Groups group)
        {
            string storeProcCommand = "Groups_Details";
            object? param = new { Action = "GET", group.UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Groups>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<int> MaxCount(Groups group)
        {
            string storeProcCommand = "Groups_Details";
            object? param = new { Action = "MaxCount", group.Name, group.UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "Groups_Details";
            object? param = new { Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            int value = await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

            if (value > 0)
            {
                try
                {
                    string substoreProcCommand = "DM_StageWisedeletionofSegments";
                    object? paramss = new { Action = "DeleteCustomerSegments", Id };
                    return await db.ExecuteScalarAsync<int>(substoreProcCommand, paramss) > 0;
                }
                catch { }
                return true;
            }
            return false;

        }

        //Separate method
        public async Task<List<MLMailGroupsStaticContacts>> GetAllActiveInactiveCustomerCount()
        {
            string storeProcCommand = "Groups_Details";
            object? param = new { Action = "GroupContactDetails" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailGroupsStaticContacts>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<int> GetMaxCount(MLGroups group, int UserInfoUserId = 0)
        {
            string storeProcCommand = "Group_CustomDetails";
            object? param = new { Action = "GetMaxCount", group.Name, UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<List<MLGroups>> BindGroupsContact(MLGroups group, int FetchNext, int OffSet, int UserInfoUserId = 0)
        {
            string storeProcCommand = "Group_CustomDetails";
            object? param = new { Action = "BindGroupsContact", group.Name, FetchNext, OffSet, group.Id, group.DisplayInUnscubscribe, UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLGroups>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<MLGroups>> BindGroupsDetails(MLGroups group, int FetchNext, int OffSet, int UserInfoUserId = 0)
        {
            string storeProcCommand = "Group_CustomDetails";
            object? param = new { Action = "BindGroupsDetails", group.Name, FetchNext, OffSet, group.Id, group.DisplayInUnscubscribe, UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLGroups>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<MLGroups?> GetGroupsDetails(int GroupId)
        {
            string storeProcCommand = "Group_CustomDetails";
            object? param = new { Action = "GetGroupOverAll", GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLGroups?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<MLGroups?> GetContactInfoDetails()
        {
            string storeProcCommand = "Group_CustomDetails";
            object? param = new { Action = "GetContactsInfoDetails" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLGroups?>(storeProcCommand, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<MLGroupContacts>> BindGroupAllContacts(int GroupId)
        {
            string storeProcCommand = "Group_CustomDetails";
            object? param = new { Action = "BindGroupAllContacts", GroupId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLGroupContacts>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<Groups>> GetCustomisedGroupList(IEnumerable<int> ListOfId, List<string> fieldName)
        {
            string storeProcCommand = "Group_CustomDetails";
            object? param = new { Action = "GetGroupsList", _listofgroupid = string.Join(",", new List<int>(ListOfId).ToArray()) };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Groups>(storeProcCommand, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<Groups?> GetGroupsByName(Groups group)
        {
            string storeProcCommand = "Groups_Details";
            object? param = new { Action = "GetGroupsByName", group.Id, group.UserInfoUserId, group.UserGroupId, group.Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<Groups?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<MLGroups>> BindGroupsDetailsWithoutCount(MLGroups group, int FetchNext, int OffSet, int UserInfoUserId = 0)
        {
            string storeProcCommand = "Group_CustomDetails";
            object? param = new { Action = "GetGroupsDetails", group.Name, FetchNext, OffSet, group.Id, group.DisplayInUnscubscribe, UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLGroups>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<MLGroups?> GetGroupsCountByGroupId(int GroupId)
        {
            string storeProcCommand = "Group_CustomDetails";
            object? param = new { Action = "GetGroupsCountByGroupId", GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLGroups?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<Groups>> GetGroupIdsFromName(List<string> GroupNameList)
        {
            string storeProcCommand = "Groups_Details";
            object? param = new { Action = "GET", _groupnamelist = GroupNameList != null ? string.Join(",", GroupNameList.Select(x => string.Format("'{0}'", x)).ToList()) : null };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Groups>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<MLGroups>> GetGroupDetailsForExport(MLGroups group, int OffSet, int FetchNext)
        {
            string storeProcCommand = "Group_CustomDetails";
            object? param = new { Action = "GetGroupDetailsForExport", group.Name, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLGroups>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        //this method has been commneted and once who is changing please do the changes accordinly
        public async Task<List<MLGroups>> GetGroupsByStaticOrDynamic(Int16 GroupType)
        {
            string storeProcCommand = "Group_CustomDetails";
            object? param = new { Action = "GetGroupsByStaticOrDynamic", GroupType };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLGroups>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }
        // For Control Group
        public async Task<int> CheckGroupNameExistance(ControlGroups controlGroups)
        {
            string storeProcCommand = "Group_CustomDetails";
            object? param = new { Action = "CheckGroupNameExistance", controlGroups.ControlGroupName, controlGroups.NonControlGroupName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<DataSet> GetGroupEmailVerfiedCount(Groups group)
        {
            string storeProcCommand = "Groups_Details";
            object? param = new { Action = "EmailVerfiedCounts", group.Id };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
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
