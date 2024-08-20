using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLLmsCampaignReport:IDisposable
    {
        Task<Int32> GetMaxCount(string UserIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OrderbyVal, LmsCustomReport filterLead);
        Task<DataSet> GetLmsCampaignReport(string UserIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OffSet, int FetchNext, int OrderbyVal, LmsCustomReport filterLead);
        Task<DataSet> GetLmsPhoneCallResponseDetails(int UserInfoUserId, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OrderbyVal, string CalledNumber, LmsCustomReport filterLead, string CallEvents);
 
    }
}
