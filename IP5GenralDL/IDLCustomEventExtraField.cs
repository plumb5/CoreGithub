using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLCustomEventExtraField : IDisposable
    {
        Task<Int16> Save(CustomEventExtraField contactField);
        Task<List<CustomEventExtraField>> GetList(int UserInfoUserId = 0, List<int> UserInfoUserIdList = null, int CustomEventOverViewId = 0);
        Task<List<CustomEventExtraField>> GetCustomEventExtraField(int customEventOverViewId, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int contactid, List<string> EventNames = null);
        Task<List<CustomEventExtraField>> UCPGetCustomEventExtraField(int customEventOverViewId, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int contactid, List<string> EventNames = null);
        Task<List<MLCustomEventExtraField>> GetEventExtraFieldDataForDragDrop(int customEventOverViewId, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int contactid, List<string> EventNames);
        Task<List<MLCustomEventExtraField>> GetAllEventExtraFieldDataForDragDrop(int customEventOverViewId, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int contactid);
        Task<List<CustomEventExtraField>> GetEventExtraFieldForRevenue(int customEventOverViewId, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime);
        Task<List<CustomEventExtraField>> RevenueGetCustomEventExtraField(int customEventOverViewId);
        Task UpdateDisplayOrder(CustomEventExtraField editSetting);
        Task<List<CustomEventExtraField>> GetCustomEventExtraField(int customEventOverViewId);
    }
}
