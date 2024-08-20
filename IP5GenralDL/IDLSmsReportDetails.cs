using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLSmsReportDetails:IDisposable
    {
        Task<Int32> MaxCount(MLSmsReportDetails sentContactDetails, DateTime? FromDateTime, DateTime? ToDateTime);
        Task<IEnumerable<MLSmsReportDetails>> GetReportDetails(MLSmsReportDetails sentContactDetails, int OffSet, int FetchNext, DateTime? FromDateTime, DateTime? ToDateTime);
        Task<Int32> GetMaxClickCount(MLSmsReportDetails sentContactDetails, DateTime? FromDateTime, DateTime? ToDateTime);
        Task<IEnumerable<MLSmsReportDetails>> GetClickReportDetails(MLSmsReportDetails sentContactDetails, int OffSet, int FetchNext, DateTime? FromDateTime, DateTime? ToDateTime);
        Task<IEnumerable<MLMailSmsBounced>> GetBouncedDetails(int SMSSendingSettingId);

    }
}
