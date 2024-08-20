using P5GenralML;

namespace Plumb5.Areas.Chat.Dto
{
    public record AgentReport_GetAllAgentsNameDto(int AdsId, MLChatAgentReport agentReport);
    public record AgentReport_GetImpressionListDto(int AdsId, ChatInteractionOverView chatOverView, string FromDateTime, string ToDateTime, int OffSet, int FetchNext);
    public record AgentReport_GetAutoPingOverViewListDto(int AdsId, ChatAutoPingOverView AutoPingOverView, string FromDateTime, string ToDateTime, int OffSet, int FetchNext);
    public record AgentReport_GetChatCompletedListDto(int AdsId, ChatInteractionOverView chatOverView, string FromDateTime, string ToDateTime);
    public record AgentReport_GetAgentPerformanceDto(int AdsId, ChatInteractionOverView chatOverView, string fromDateTime, string toDateTime);
    public record AgentReport_AgentPerformanceExportDto(ChatInteractionOverView chatOverView, string FromDateTime, string ToDateTime, string FileType);
    public record AgentReport_ChatCompletedExportDto(ChatInteractionOverView chatOverView, string FromDateTime, string ToDateTime, string FileType);
    public record AgentReport_ChatInitiatedExportDto(ChatInteractionOverView chatOverView, string FromDateTime, string ToDateTime, string FileType);
    public record AgentReport_PingToChatExportDto(ChatAutoPingOverView AutoPingOverView, string FromDateTime, string ToDateTime, int OffSet, int FetchNext, string FileType);
}
