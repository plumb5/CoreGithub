using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLSearchedDataTags:IDisposable
    {
        Task<List<MLSiteSearchPages>> GetSiteSearchPagesForExport(int OffSet, int FetchNext);
        Task<List<MLSiteSearchTerm>> GetSiteSearchTermForExport(int OffSet, int FetchNext);
        Task<Int32> IsDataExists();
        Task<object> OverViewGraphDetails(DateTime FromDateTime, DateTime ToDateTime);
        Task<object> TopSearchedPage(DateTime FromDateTime, DateTime ToDateTime);
        Task<object> TopSearchedTerm(DateTime FromDateTime, DateTime ToDateTime);
        Task<object> GetSearchTerm(DateTime FromDateTime, DateTime ToDateTime);
        Task<object> GetSearchPage(DateTime FromDateTime, DateTime ToDateTime);

    }
}
