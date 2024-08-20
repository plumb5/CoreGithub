using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.Prospect.Dto
{
    public record LmsCustomFields_SaveLmsCustomFieldsDto(List<LmsCustomFields> LmsCustomFields, int accountId);
    public record LmsCustomFields_GetLmsCustomFieldsDto(int accountId);
}
