using Microsoft.AspNetCore.Mvc;

namespace Plumb5.Areas.Chat.Dto
{
    public record Dashboard_GetChatReportDto(int accountId, int ChatId, int Duration, string fromDateTime, string toDateTime);
    public record Dashboard_BindChatImpressionsCountDto(int ChatId, string fromDateTime, string toDateTime);
    public record Dashboard_TopFiveConversionDto(int accountId, string fromDateTime, string toDateTime);
    public record Dashboard_TopFiveConversionUrlDto(int accountId, string fromDateTime, string toDateTime);
    public record Dashboard_ConversationsDto(int accountId, string fromDateTime, string toDateTime);
    public record Dashboard_TopThreeAgentsDto(int accountId, string fromDateTime, string toDateTime);
}
