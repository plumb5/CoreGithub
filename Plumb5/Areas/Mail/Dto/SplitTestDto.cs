using Microsoft.AspNetCore.Mvc;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;

namespace Plumb5.Areas.Mail.Dto
{
    public record SplitTest_GetSplitTestDto(int OffSet, int FetchNext);
    public record SplitTest_ExportDto(int OffSet, int FetchNext, string FileType);
}
