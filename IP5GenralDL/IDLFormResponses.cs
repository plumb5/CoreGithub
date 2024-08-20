using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLFormResponses:IDisposable
    {
        Task<Int32> Save(FormResponses formResponses);
        Task<bool> Update(int Id);
        Task<IEnumerable<FormResponses>> GetDetails(FormResponses formResponses, int OFFSET, int FETCH, DateTime? TrackFromDate, DateTime? TrackToDate, List<string> fieldName = null, List<int> UserInfoUserIdList = null, int? IsSuperAdmin = null);
        Task<IEnumerable<string>> GetIpAddress();
        Task<Int32> MaxCount(DateTime FromDateTime, DateTime ToDateTime, string EmbeddedFormOrPopUpFormOrTaggedForm, int UserInfoUserId = 0, List<int> UserInfoUserIdList = null, int? IsSuperAdmin = null, int? VisitorType = null);
        Task<IEnumerable<MLFormResponseWithFormDetails>> FormResponseDetails(int FormId, int OffSet, int FetchNext, DateTime FromDateTime, DateTime ToDateTime, string EmbeddedFormOrPopUpFormOrTaggedForm, int UserInfoUserId = 0, List<int> UserInfoUserIdList = null, int? IsSuperAdmin = null, int? VisitorType = null);
        Task<Int32> GetCustomMaxCount(FormResponses formResponses, string StartDate, string EndDate, string EmbeddedFormOrPopUpFormOrTaggedForm, List<int> UserInfoUserIdList = null, int? IsSuperAdmin = null);
        Task<IEnumerable<MLFormResponseWithFormDetails>> GetCustomResponses(FormResponses formResponses, int OffSet, int FetchNext, string StartDate, string EndDate, string EmbeddedFormOrPopUpFormOrTaggedForm, List<int> UserInfoUserIdList = null, int? IsSuperAdmin = null);
        Task<DataSet> GetCustomisedFormReponseDetails(FormResponses formResponses, string StartDate, string EndDate);
        Task<DataSet> FilterDataBySourceCount(DateTime FromDateTime, DateTime ToDateTime);
        Task<DataSet> FilterDataByCityCount(DateTime FromDateTime, DateTime ToDateTime);
        Task<DataSet> GetFormRespondedNameByContactId(int? ContactId = null);
        Task<Int32> LeadsResponseCount(string Duration, DateTime FromDate, DateTime ToDate);

    }
}
