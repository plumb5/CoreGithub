using Microsoft.AspNetCore.Mvc;

namespace Plumb5.Areas.FacebookPage.Dto
{
    public record ScheduledPosts_PostFacebookDto(string Id, int PageIndex, string Message, string PostDate, string Link);
    public record ScheduledPosts_GetMetaTagDto(string Link);
    public record ScheduledPosts_GetScheduledPostsDto(int PageIndex);
    public record ScheduledPosts_DeleteScheduledPostDto(int PageIndex, string Id);
}
