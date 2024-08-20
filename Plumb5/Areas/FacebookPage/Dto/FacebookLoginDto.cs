using Microsoft.AspNetCore.Mvc;

namespace Plumb5.Areas.FacebookPage.Dto
{
    public record FacebookLogin_SaveFacebookTokenDto(int AdsId, string RequestAccessToken);
}
