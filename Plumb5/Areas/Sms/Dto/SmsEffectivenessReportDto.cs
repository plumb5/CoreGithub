using P5GenralML;

namespace Plumb5.Areas.Sms.Dto
{
    public record SmsEffectivenessReport_MaxCountDto(int accountId, MLSmsCampaignEffectivenessReport smsCampaignEffectivenessReport);
    public record SmsEffectivenessReport_GetReportDetailsDto(int accountId, MLSmsCampaignEffectivenessReport smsCampaignEffectivenessReport, int OffSet, int FetchNext);
}
