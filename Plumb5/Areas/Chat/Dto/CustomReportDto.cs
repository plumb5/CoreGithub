using P5GenralML;

namespace Plumb5.Areas.Chat.Dto
{
    public record CustomReport_IpAddressDto(int ChatId);
    public record CustomReport_GetCountOfSelecCampDto(MLChatCustomeReport chatCustomReport);
    public record CustomReport_GetDataDto(MLChatCustomeReport chatCustomReport, int OffSet, int FetchNext);
    public record CustomReport_ChatExportDto(int OffSet, int FetchNext, string FileType);
}
