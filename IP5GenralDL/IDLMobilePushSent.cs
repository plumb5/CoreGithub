using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMobilePushSent : IDisposable
    {
        Task<bool> SaveBulkMobilePushCampaignResponses(DataTable MobilePushSentBulk);
        Task<List<MobilePushSent>> GetMobilePushTestCampaign(int OffSet, int FetchNext);
        Task<List<GroupMember>> GetContactIdList(int[] MobilePushSendingSettingIdList, int[] CampaignResponseValue);
        Task<bool> UpdatePushResponseView(string DeviceId, int SendingSettingId = 0, string P5UniqueId = null);
        Task<bool> UpdatePushResponseClick(string DeviceId, int SendingSettingId = 0, string P5UniqueId = null);
        Task<bool> UpdatePushResponseClose(string DeviceId, int SendingSettingId = 0, string P5UniqueId = null);
        Task<int> GetConsumptionCount(DateTime FromDateTime, DateTime ToDateTime);
    }
}
