using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLCustomEventExtraFieldSQL : CommonDataBaseInteraction, IDLCustomEventExtraField
    {
        CommonInfo connection = null;
        public DLCustomEventExtraFieldSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLCustomEventExtraFieldSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<Int16> Save(CustomEventExtraField contactField)
        {
            string storeProcCommand = "CustomEvent_ExtraField";
            object? param = new { @Action = "Save", contactField.UserInfoUserId, contactField.UserGroupId, contactField.FieldName, contactField.FieldType, contactField.SubFields, contactField.HideField, contactField.IsMandatory, contactField.FieldMappingType, contactField.CustomEventOverViewId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<CustomEventExtraField>> GetList(int UserInfoUserId = 0, List<int> UserInfoUserIdList = null, int CustomEventOverViewId = 0)
        {
            string storeProcCommand = "CustomEvent_ExtraField";
            object? param = new { @Action = "GET", UserInfoUserId, UserInfoUserIdList = (UserInfoUserIdList != null ? string.Join(",", UserInfoUserIdList) : null), CustomEventOverViewId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<CustomEventExtraField>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<CustomEventExtraField>> GetCustomEventExtraField(int customEventOverViewId, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int contactid, List<string> EventNames = null)
        {
            string storeProcCommand = "CustomEvent_ExtraField";
            object? param = new { @Action = "GetEventExtraFieldDetails", customEventOverViewId, FromDateTime, ToDateTime, contactid, EventNames };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<CustomEventExtraField>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }
        public async Task<List<CustomEventExtraField>> UCPGetCustomEventExtraField(int customEventOverViewId, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int contactid, List<string> EventNames = null)
        {
            string storeProcCommand = "CustomEvent_ExtraField";
            object? param = new { @Action = "UCPGetEventExtraFieldDetails", customEventOverViewId, FromDateTime, ToDateTime, contactid, EventNames };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<CustomEventExtraField>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<MLCustomEventExtraField>> GetEventExtraFieldDataForDragDrop(int customEventOverViewId, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int contactid, List<string> EventNames)
        {
            string eventname = "";
            if (EventNames.Count > 0)
            {
                foreach (var multipleevntname in EventNames)
                {
                    eventname += "'" + multipleevntname + "',";
                }
            }
            eventname = eventname.Remove(eventname.Length - 1);
            string storeProcCommand = "CustomEvent_ExtraField";
            object? param = new { @Action = "GetEventExtraFieldDetailsDragDrop", eventname };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLCustomEventExtraField>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<MLCustomEventExtraField>> GetAllEventExtraFieldDataForDragDrop(int customEventOverViewId, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int contactid)
        {
            string storeProcCommand = "CustomEvent_ExtraField";
            object? param = new { @Action = "GetAllEventExtraFieldDetailsDragDrop", customEventOverViewId, FromDateTime, ToDateTime, contactid };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLCustomEventExtraField>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<CustomEventExtraField>> RevenueGetCustomEventExtraField(int customEventOverViewId)
        {
            string storeProcCommand = "CustomEvent_ExtraField";
            object? param = new { @Action = "RevenueGetEventExtraFieldDetails", customEventOverViewId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<CustomEventExtraField>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<CustomEventExtraField>> GetCustomEventExtraField(int customEventOverViewId)
        {
            string storeProcCommand = "CustomEvent_ExtraField";
            object? param = new { @Action = "GetEventExtraFieldDetails", customEventOverViewId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<CustomEventExtraField>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task UpdateDisplayOrder(CustomEventExtraField editSetting)
        {
            string storeProcCommand = "customevent_extrafield";
            object? param = new { editSetting.Id, editSetting.DisplayOrder, editSetting.CustomEventOverViewId };

            using var db = GetDbConnection(connection.Connection);
            await db.QueryAsync<CustomEventExtraField>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<List<CustomEventExtraField>> GetEventExtraFieldForRevenue(int customEventOverViewId, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime)
        {
            string storeProcCommand = "CustomEvent_ExtraField";
            object? param = new { @Action = "GetRevenueEventExtraFieldDetails", customEventOverViewId, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<CustomEventExtraField>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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


