using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWhatsAppReportDetails : IDisposable
    {
        Task<int> MaxCount(MLWhatsAppReportDetails sentContactDetails, DateTime? FromDateTime, DateTime? ToDateTime);
        Task<List<MLWhatsAppReportDetails>> GetReportDetails(MLWhatsAppReportDetails sentContactDetails, DateTime? FromDateTime, DateTime? ToDateTime, int OffSet = 0, int FetchNext = 0);
        Task<List<MLMailSmsBounced>> GetBouncedDetails(int WhatsAppSendingSettingId);
        Task<List<MLWhatsAppReportDetails>> GetClickReportDetails(MLWhatsAppReportDetails sentContactDetails, int OffSet, int FetchNext, DateTime? FromDateTime, DateTime? ToDateTime);
        Task<int> GetMaxClickCount(MLWhatsAppReportDetails sentContactDetails, DateTime? FromDateTime, DateTime? ToDateTime);
    }
}
