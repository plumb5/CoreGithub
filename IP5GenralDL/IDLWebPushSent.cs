using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWebPushSent : IDisposable
    {
        Task<Int32> Save(WebPushSent webpushsent);
        void SaveBulkWebPushCampaignResponses(DataTable WebPushSentBulk);
        Task<bool> UpdateBulkWebPushCampaignErrorResponses(DataTable WebPushSentBulkErrorResponse);
        Task<bool> DeleteResponsesFromBulkCampaign(List<Int64> WebPushSentBulkids);
        Task<int> GetWebPushTestCampaignMaxCount(DateTime FromDateTime, DateTime ToDateTime, int WebPushTemplateId = 0, string MachineId = null);
        Task<List<WebPushSent>> GetWebPushTestCampaign(int OffSet, int FetchNext, DateTime FromDateTime, DateTime ToDateTime);
        Task<List<GroupMember>> GetContactIdList(int[] WebPushSendingSettingIdList, int[] CampaignResponseValue);
        Task<int> GetConsumptionCount(DateTime FromDateTime, DateTime ToDateTime);
        Task UpdateWebPushSent(PushNotificationResponses pushNotificationResponses);
        Task<bool> UpdateWebPushSentAsync(PushNotificationResponses pushNotificationResponses);
        Task<DataSet> GetWebPushIndividualResponses(DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, int WebPushTemplateId = 0, string MachineId = null);
    }
}
