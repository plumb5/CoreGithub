using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWhatsAppSent : IDisposable
    {
        Task<Int32> Save(WhatsappSent watsAppSent);
        Task<List<MLWhatsaAppCampaign>> GetWhatsAppCampaignResponseData(int whatsappSendingSettingId);
        Task<List<GroupMember>> GetContactIdList(int[] WhatsAppSendingSettingIdList, int[] CampaignResponseValue);
        Task<int> IndividualMaxCount(DateTime FromDateTime, DateTime ToDateTime, int WATemplateId = 0, string PhoneNumber = null);
        Task<List<WhatsappSent>> GetIndividualResponseData(DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, int WATemplateId = 0, string PhoneNumber = null);
        Task<bool> SentResponseAsync(string ResponseId, DateTime? received_at_utc);
        Task<bool> DeliveredResponseAsync(string ResponseId, DateTime? delivered_at_utc);
        Task<bool> ReadResponseAsync(string ResponseId, DateTime? seen_at_utc);
        Task<bool> FailedResponseAsync(string ResponseId, string failReason, DateTime? received_at_utc);
        Task<bool> SaveBulkWhatsAppResponsesForCampaign(DataTable whatsappSentBulk);
        Task<bool> DeleteResponsesFromBulkCampaign(DataTable whatsappSentBulk);
        Task<int> GetConsumptionCount(DateTime FromDateTime, DateTime ToDateTime);
        Task<bool> SaveWorkFlowBulk(DataTable WhatsAppSentBulk);
        Task<bool> UpdateTotalCounts(DataTable WhatsAppSentBulk, int WhatsAppSendingSettingId);
        Task<bool> DeleteFromWorkFlowBulkWhatsAppSent(DataTable WhatsAppSentBulk);
        Task<WhatsappSent?> ClickAsync(int WhatsappSendingSettingId, int ContactId, int WorkFlowId = 0, string DeviceName = null, string DeviceType = null, string UserAgent = null, string P5WhatsappUniqueID = null);
        Task<bool> UnsubscribedResponseAsync(string PhoneNumber);
    }
}
