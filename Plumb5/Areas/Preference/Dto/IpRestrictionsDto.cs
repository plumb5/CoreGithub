using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.Preference.Dto
{
    public record IpRestrictions_GetRestrictionsDto(int AccountId);
    public record IpRestrictions_SaveOrUpdateRestrictionsDto(int AccountId, IpRestrictions IpRestrictions);
}
