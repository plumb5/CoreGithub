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
    public class DLCustomEventExtraFieldPG : CommonDataBaseInteraction, IDLCustomEventExtraField
    {
        CommonInfo connection = null;
        public DLCustomEventExtraFieldPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLCustomEventExtraFieldPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<Int16> Save(CustomEventExtraField contactField)
        {
            string storeProcCommand = "select customevent_extrafield_save(@UserInfoUserId, @UserGroupId, @FieldName, @FieldType, @SubFields, @HideField, @IsMandatory, @FieldMappingType, @CustomEventOverViewId)";
            object? param = new { contactField.UserInfoUserId, contactField.UserGroupId, contactField.FieldName, contactField.FieldType, contactField.SubFields, contactField.HideField, contactField.IsMandatory, contactField.FieldMappingType, contactField.CustomEventOverViewId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param);
        }

        public async Task<List<CustomEventExtraField>> GetList(int UserInfoUserId = 0, List<int> UserInfoUserIdList = null, int CustomEventOverViewId = 0)
        {
            string storeProcCommand = "select *  from customevent_extrafield_get(@UserInfoUserId, @UserInfoUserIdList, @CustomEventOverViewId)";
            object? param = new { UserInfoUserId, UserInfoUserIdList = (UserInfoUserIdList != null ? string.Join(",", UserInfoUserIdList) : null), CustomEventOverViewId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<CustomEventExtraField>(storeProcCommand, param)).ToList();
        }

        public async Task<List<CustomEventExtraField>> GetCustomEventExtraField(int customEventOverViewId, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int contactid, List<string> EventNames = null)
        {
            try
            {
                string storeProcCommand = "select *  from customevent_extrafield_geteventextrafielddetails(@CustomEventOverViewId, @FromDateTime, @ToDateTime, @Contactid, @EventNames)";
                object? param = new { customEventOverViewId, FromDateTime, ToDateTime, contactid, EventNames };

                using var db = GetDbConnection(connection.Connection);
                return (await db.QueryAsync<CustomEventExtraField>(storeProcCommand, param)).ToList();
            }
            catch(Exception ex)
            {
                throw new Exception();
            }
        }
        public async Task<List<CustomEventExtraField>> UCPGetCustomEventExtraField(int customEventOverViewId, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int contactid, List<string> EventNames = null)
        {
            string storeProcCommand = "select *  from customevent_extrafield_ucpgeteventextrafielddetails(@CustomEventOverViewId, @FromDateTime, @ToDateTime, @Contactid, @EventNames)";
            object? param = new { customEventOverViewId, FromDateTime, ToDateTime, contactid, EventNames };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<CustomEventExtraField>(storeProcCommand, param)).ToList();
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
            string storeProcCommand = "select *  from customevent_extrafield_geteventextrafielddetailsdragdrop(@EventNames)";
            object? param = new { eventname };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLCustomEventExtraField>(storeProcCommand, param)).ToList();
        }

        public async Task<List<MLCustomEventExtraField>> GetAllEventExtraFieldDataForDragDrop(int customEventOverViewId, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int contactid)
        {
            string storeProcCommand = "select *  from customevent_extrafield_getalleventextrafielddetailsdragdrop()";

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLCustomEventExtraField>(storeProcCommand)).ToList();
        }

        public async Task<List<CustomEventExtraField>> RevenueGetCustomEventExtraField(int customEventOverViewId)
        {
            string storeProcCommand = "select *  from customevent_extrafield_revenuegeteventextrafielddetails(@CustomEventOverViewId)";
            object? param = new { customEventOverViewId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<CustomEventExtraField>(storeProcCommand, param)).ToList();
        }

        public async Task<List<CustomEventExtraField>> GetCustomEventExtraField(int customEventOverViewId)
        {
            string storeProcCommand = "select *  from customevent_extrafield_ordersettings(@CustomEventOverViewId)";
            object? param = new { customEventOverViewId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<CustomEventExtraField>(storeProcCommand, param)).ToList();
        }

        public async Task UpdateDisplayOrder(CustomEventExtraField editSetting)
        {
            string storeProcCommand = "select *  from customevent_extrafield_updatedisplayorder(@Id, @DisplayOrder,@CustomEventOverViewId)";
            object? param = new { editSetting.Id, editSetting.DisplayOrder, editSetting.CustomEventOverViewId };

            using var db = GetDbConnection(connection.Connection);
            await db.QueryAsync<CustomEventExtraField>(storeProcCommand, param);
        }
        public async Task<List<CustomEventExtraField>> GetEventExtraFieldForRevenue(int customEventOverViewId, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime)
        {
            string storeProcCommand = "select *  from customevent_extrafield_forrevenue(@CustomEventOverViewId,@FromDateTime, @ToDateTime)";
            object? param = new { customEventOverViewId, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<CustomEventExtraField>(storeProcCommand, param)).ToList();
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

