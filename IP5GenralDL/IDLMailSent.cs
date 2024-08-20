using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMailSent : IDisposable
    {
        Task<Int32> Send(MailSent mailSent);
        Task<bool> UpdateOpen(string ResponseId, string DeviceName = null, string DeviceType = null, string UserAgent = null);
        Task<MailSent?> UpdateClick(string ResponseId, string DeviceName = null, string DeviceType = null, string UserAgent = null);
        Task<MailSent?> UpdateUnsubscribe(string ResponseId, string DeviceName = null, string DeviceType = null, string UserAgent = null);
        Task UpdateIsBounced(string ResponseId, string Emailid, string BouncedCategory, string BouncedReason);
        Task<List<GroupMember>> GetContactIdList(int[] MailSendingSettingId, int[] CampaignResponseValue);
        Task<int> IndividualMaxCount(int mailCampaignId, DateTime FromDateTime, DateTime ToDateTime, string Emailid);
        Task<List<MailSent>> GetIndividualResponseData(int mailCampaignId, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, string Emailid);
        Task<bool> ElasticOpenUpdate(string ResponseId, string Emailid);
        Task<MailSent?> ElasticClickUpdate(string ResponseId, string Emailid);
        Task<bool> ElasticUnsubscribeUpdate(string ResponseId, string Emailid);
        Task ElasticIsBouncedUpdate(string ResponseId, string Emailid, string BouncedCategory, string BouncedReason, string BouncedType);
        Task UpdateDeliveredByResponseId(string ResponseId, string EmailId = null);
        Task<object> GetOpenAndClickedRate(string GroupIds);
        Task<int> GetConsumptionCount(DateTime FromDateTime, DateTime ToDateTime);
        Task<List<MLMailCampaign>> GetCampaignResponseData(int MailSendingSettingId);
        Task UpdateDeliveredByResponseIdAsync(string ResponseId, string EmailId = null);
        Task<bool> ElasticDeliveredUpdateAsync(string ResponseId, string Emailid, DateTime? datetime = null);
        Task<bool> ElasticOpenUpdateAsync(string ResponseId, string Emailid, DateTime? datetime = null);
        Task<MailSent?> ElasticClickUpdateAsync(string ResponseId, string Emailid, DateTime? datetime = null);
        Task<bool> ElasticUnsubscribeUpdateAsync(string ResponseId, string Emailid);
        Task ElasticIsBouncedUpdateAsync(string ResponseId, string Emailid, string BouncedCategory, string BouncedReason, string BouncedType);
        Task UpdateIsBouncedAsync(string ResponseId, string Emailid, string BouncedCategory, string BouncedReason);
        Task<bool> UpdateOpenAsync(string ResponseId, string DeviceName, string DeviceType, string UserAgent);
        Task<MailSent?> UpdateClickAsync(string ResponseId, string DeviceName, string DeviceType, string UserAgent);
    }
}
