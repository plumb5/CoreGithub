using Microsoft.AspNetCore.Mvc;

namespace Plumb5.Areas.Sms.Dto
{
    public record EachSmsSentDetails_EachSmsDetailsDto(string PhoneNumber);
    public record EachSmsSentDetails_ClickStreamCampaignSmsHistoryDto(int[] ContactIds, string[] PhoneNumbers);
    public record EachSmsSentDetails_ClickStreamIndividualSmsTrackDto(int[] ContactIds, string[] PhoneNumbers);
}
