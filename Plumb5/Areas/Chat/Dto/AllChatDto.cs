using P5GenralML;

namespace Plumb5.Areas.Chat.Dto
{
    public record AllChat_GetDto(ChatDetails chatDetails, int OffSet, int FetchNext);
    public record AllChat_DeleteDto(Int16 chatId);
    public record AllChat_ToogleStatusDto(Int16 chatId,bool ChatStatus);
    public record AllChat_ChangePriorityDto(List<ChatDetails> chatdetails);
    public record AllChat_ChatDetailsExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
}
