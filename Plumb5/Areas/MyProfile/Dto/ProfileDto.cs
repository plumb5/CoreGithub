using Microsoft.AspNetCore.Mvc;
using P5GenralML;
using Plumb5.Controllers;

namespace Plumb5.Areas.MyProfile.Dto
{
    public record Profile_GetUserDetailsDto(int UserId);
    public record Profile_UpdateProfileDetailsDto(int LoginUserId, UserInfo userInfo);
}
