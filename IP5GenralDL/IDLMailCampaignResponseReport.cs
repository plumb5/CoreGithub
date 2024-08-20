using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMailCampaignResponseReport : IDisposable
    {
        Task<int> MaxCount(MLMailCampaignResponseReport sentContactDetails, DateTime? FromDateTime, DateTime? ToDateTime);
        Task<List<MLMailCampaignResponseReport>> GetReportDetails(MLMailCampaignResponseReport sentContactDetails, int OffSet, int FetchNext, DateTime? FromDateTime, DateTime? ToDateTime);
        Task<List<MLMailSmsBounced>> GetBouncedDetails(int MailSendingSettingId);
        Task<int> GetMaxClickCount(MLMailCampaignResponseReport sentContactDetails, DateTime? FromDateTime, DateTime? ToDateTime);
        Task<List<MLMailCampaignResponseReport>> GetClickReportDetails(MLMailCampaignResponseReport sentContactDetails, int OffSet, int FetchNext, DateTime? FromDateTime, DateTime? ToDateTime);
    }
}
