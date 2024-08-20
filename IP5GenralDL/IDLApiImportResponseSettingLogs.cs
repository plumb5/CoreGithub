using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLApiImportResponseSettingLogs : IDisposable
    {
        Task<bool> Save(string RequestContent, int ApiImportResponseId, bool? iscontactsuccess = false, string contacterrormessage = null, bool? islmssuccess = false, string lmserrormessage = null, string p5uniqueid = null, string errormessage = null, string sourcetype = null);
        Task<bool> Update(int ApiImportResponseId, bool? iscontactsuccess = false, string contacterrormessage = null, bool? islmssuccess = false, string lmserrormessage = null, string p5uniqueid = null, string errormessage = null);
        Task<Int32> MaxCount(int ApiImportResponseId);
        Task<IEnumerable<ApiImportResponseSettingLogs>> GetDetails(int ApiImportResponseId, int OffSet, int FetchNext);

    }
}
