using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWhatsAppReport : IDisposable
    {
        Task<int> MaxCount(DateTime? FromDateTime, DateTime? ToDateTime, string CampaignName, string TemplateName, int WhatsAppSendingSettingId);
        Task<List<MLWhatsAppReport>> GetReportData(DateTime? FromDateTime, DateTime? ToDateTime, int OffSet, int FetchNext, string CampaignName = null, string TemplateName = null, int WhatsAppSendingSettingId = 0);
    }
}
