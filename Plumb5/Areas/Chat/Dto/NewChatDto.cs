using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.Chat.Dto
{
    public record NewChat_SaveChatDetailsDto(ChatDetails chat, ChatRule rulesData, List<WebHookDetails> webHookData, List<string> DeletedWebhookId);
    public record NewChat_GetChatDetailsDto(int ChatId);
}
