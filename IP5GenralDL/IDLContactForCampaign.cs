using P5GenralML;

namespace P5GenralDL
{
    public interface IDLContactForCampaign
    {
        Task<int> GetContactsCount(int GroupId);
        Task<List<MLContactForCampaign>> GetEmailIdContacts(int GroupId, int MailSendingSettingId, int OffSet, int FetchNext);
        Task<List<MLContactForCampaign>> GetPhoneContacts(int GroupId, int SmsSendingSettingId, bool IsPromotionalOrTransactionalType, int OffSet, int FetchNext);
        Task<List<MLContactForCampaign>> GetRemainingContacts(int GroupId, int MailSendingSettingId, int SMSSendingSettingId);
    }
}