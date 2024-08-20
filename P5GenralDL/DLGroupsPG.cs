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
    public class DLGroupsPG : CommonDataBaseInteraction, IDLGroups
    {
        CommonInfo connection;

        public DLGroupsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLGroupsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(Groups group)
        {
            try
            {
                group.GroupType = (short)(group.GroupType == 0 ? 1 : group.GroupType);

                string storeProcCommand = "select groups_details_save(@UserInfoUserId, @UserGroupId, @Name, @GroupDescription, @AppType, @CafeId, @DisplayInUnscubscribe, @GroupType)";
                object? param = new { group.UserInfoUserId, group.UserGroupId, group.Name, group.GroupDescription, group.AppType, group.CafeId, group.DisplayInUnscubscribe, group.GroupType };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
            }
           catch(Exception ex)
            {
                throw new Exception();
            }
        }

        public async Task<bool> Update(Groups group)
        {
            string storeProcCommand = "select groups_details_update(@Id, @UserInfoUserId, @UserGroupId, @Name, @GroupDescription, @AppType, @CafeId, @DisplayInUnscubscribe, @GroupType)";
            object? param = new { group.Id, group.UserInfoUserId, group.UserGroupId, group.Name, group.GroupDescription, group.AppType, group.CafeId, group.DisplayInUnscubscribe, group.GroupType };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param) > 0;
        }

        public async Task<List<Groups>> GetDetails(Groups group, int FetchNext = 0, int OffSet = -1, string ListOfGroupId = "")
        {
            string storeProcCommand = "select * from groups_details_getdetails(@Id, @UserInfoUserId, @UserGroupId, @Name, @GroupDescription, @AppType, @CafeId, @GroupType, @FetchNext, @OffSet, @ListOfGroupId)";
            object? param = new { group.Id, group.UserInfoUserId, group.UserGroupId, group.Name, group.GroupDescription, group.AppType, group.CafeId, group.GroupType, FetchNext, OffSet, ListOfGroupId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Groups>(storeProcCommand, param)).ToList();
        }

        public async Task<Groups?> Get(Groups group)
        {
            string storeProcCommand = "select * from groups_details_get(@Id, @UserInfoUserId, @UserGroupId, @Name, @GroupDescription, @AppType, @CafeId, @GroupType)";
            object? param = new { group.Id, group.UserInfoUserId, group.UserGroupId, group.Name, group.GroupDescription, group.AppType, group.CafeId, group.GroupType };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<Groups?>(storeProcCommand, param);
        }

        public async Task<List<Groups>> GetGroupList(Groups group)
        {
            string storeProcCommand = "select * from groups_details_getbyid(@UserInfoUserId)";
            object? param = new { group.UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Groups>(storeProcCommand, param)).ToList();
        }

        public async Task<int> MaxCount(Groups group)
        {
            string storeProcCommand = "select * from groups_details_maxcount(@Name,@UserInfoUserId)";
            object? param = new { group.Name, group.UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "select groups_details_delete(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            int value = await db.ExecuteScalarAsync<int>(storeProcCommand, param);

            if (value > 0)
            {
                try
                {
                    string substoreProcCommand = "select dm_stagewisedeletionofsegments_deletecustomersegments(@Id)";
                    object? paramss = new { Id };
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
            string storeProcCommand = "select * from group_customdetails_groupcontactdetails()";

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailGroupsStaticContacts>(storeProcCommand)).ToList();
        }

        public async Task<int> GetMaxCount(MLGroups group, int UserInfoUserId = 0)
        {
            string storeProcCommand = "select group_customdetails_getmaxcount(@Name, @UserInfoUserId)";
            object? param = new { group.Name, UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<List<MLGroups>> BindGroupsContact(MLGroups group, int FetchNext, int OffSet, int UserInfoUserId = 0)
        {
            string storeProcCommand = "select * from group_customdetails_bindgroupscontact(@Name, @FetchNext, @OffSet, @Id, @DisplayInUnscubscribe, @UserInfoUserId)";
            object? param = new { group.Name, FetchNext, OffSet, group.Id, group.DisplayInUnscubscribe, UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLGroups>(storeProcCommand, param)).ToList();
        }

        public async Task<List<MLGroups>> BindGroupsDetails(MLGroups group, int FetchNext, int OffSet, int UserInfoUserId = 0)
        {
            string storeProcCommand = "select * from group_customdetails_bindgroupsdetails(@Name, @FetchNext, @OffSet, @Id, @DisplayInUnscubscribe, @UserInfoUserId)";
            object? param = new { group.Name, FetchNext, OffSet, group.Id, group.DisplayInUnscubscribe, UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLGroups>(storeProcCommand, param)).ToList();
        }

        public async Task<MLGroups?> GetGroupsDetails(int GroupId)
        {
            string storeProcCommand = "select * from group_customdetails_getgroupoverall(@GroupId)";
            object? param = new { GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLGroups?>(storeProcCommand, param);
        }

        public async Task<MLGroups?> GetContactInfoDetails()
        {
            string storeProcCommand = "select * from group_customdetails_getcontactsinfodetails()";

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLGroups?>(storeProcCommand);
        }

        public async Task<List<MLGroupContacts>> BindGroupAllContacts(int GroupId)
        {
            string storeProcCommand = "select * from group_customdetails_bindgroupallcontacts(@GroupId)";
            object? param = new { GroupId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLGroupContacts>(storeProcCommand, param)).ToList();
        }

        public async Task<List<Groups>> GetCustomisedGroupList(IEnumerable<int> ListOfId, List<string> fieldName)
        {
            try
            {
                string storeProcCommand = "select * from group_customdetails_getgroupslist(@_listofgroupid)";
                object? param = new { _listofgroupid = string.Join(",", new List<int>(ListOfId).ToArray()) };

                using var db = GetDbConnection(connection.Connection);
                return (await db.QueryAsync<Groups>(storeProcCommand, param)).ToList();
            }
           catch(Exception ex)
            {
                throw new Exception();
            }
        }

        public async Task<Groups?> GetGroupsByName(Groups group)
        {
            string storeProcCommand = "select * from groups_details_getgroupsbyname(@Id, @UserInfoUserId, @UserGroupId, @Name)";
            object? param = new { group.Id, group.UserInfoUserId, group.UserGroupId, group.Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<Groups?>(storeProcCommand, param);
        }

        public async Task<List<MLGroups>> BindGroupsDetailsWithoutCount(MLGroups group, int FetchNext, int OffSet, int UserInfoUserId = 0)
        {
            string storeProcCommand = "select * from group_customdetails_getgroupsdetails(@Name, @FetchNext, @OffSet, @Id, @DisplayInUnscubscribe, @UserInfoUserId)";
            object? param = new { group.Name, FetchNext, OffSet, group.Id, group.DisplayInUnscubscribe, UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLGroups>(storeProcCommand, param)).ToList();
        }

        public async Task<MLGroups?> GetGroupsCountByGroupId(int GroupId)
        {
            string storeProcCommand = "select * from group_customdetails_getgroupscountbygroupid(@GroupId)";
            object? param = new { GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLGroups?>(storeProcCommand, param);
        }

        public async Task<List<Groups>> GetGroupIdsFromName(List<string> GroupNameList)
        {
            string storeProcCommand = "select * from groups_details_get(@_groupnamelist)";
            object? param = new { _groupnamelist = GroupNameList != null ? string.Join(",", GroupNameList.Select(x => string.Format("'{0}'", x)).ToList()) : null };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Groups>(storeProcCommand, param)).ToList();
        }

        public async Task<List<MLGroups>> GetGroupDetailsForExport(MLGroups group, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from group_customdetails_getgroupdetailsforexport(@Name,@OffSet,@FetchNext)";
            object? param = new { group.Name, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLGroups>(storeProcCommand, param)).ToList();
        }

        //this method has been commneted and once who is changing please do the changes accordinly
        public async Task<List<MLGroups>> GetGroupsByStaticOrDynamic(Int16 GroupType)
        {
            string storeProcCommand = "select * from group_customdetails_getgroupsbystaticordynamic(@GroupType)";
            object? param = new { GroupType };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLGroups>(storeProcCommand, param)).ToList();
        }
        // For Control Group
        public async Task<int> CheckGroupNameExistance(ControlGroups controlGroups)
        {
            string storeProcCommand = "select groups_details_checkgroupnameexistance(@ControlGroupName, @NonControlGroupName)";
            object? param = new { controlGroups.ControlGroupName, controlGroups.NonControlGroupName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<DataSet> GetGroupEmailVerfiedCount(Groups group)
        {
            string storeProcCommand = "select * from groups_details_emailverfiedcounts(@Id)";
            object? param = new { group.Id };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
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
