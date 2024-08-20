using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.Sms.Dto
{
    public record Campaign_MaxCountDto(SmsCampaign smsCampaign);
    public record Campaign_SaveOrUpdateDetailsDto(SmsCampaign smsCampaignData);
    public record Campaign_DeleteDto(int Id);
    public record Campaign_ExportCampaignIdentifierDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);


}
