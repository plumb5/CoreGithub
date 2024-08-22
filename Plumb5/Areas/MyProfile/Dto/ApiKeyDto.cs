using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using Plumb5.Controllers;
using Plumb5.Models;

namespace Plumb5.Areas.MyProfile.Dto
{
    public record ApiKey_GetApiKeyDto(int UserId);
    public record ApiKey_DevelopersDto(int UserId);
    public record ApiKey_UpdateApiKeyDto(int UserId);
}
