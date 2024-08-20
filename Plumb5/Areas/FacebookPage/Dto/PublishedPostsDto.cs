using Microsoft.AspNetCore.Mvc;

namespace Plumb5.Areas.FacebookPage.Dto
{
    public record PublishedPosts_GetMaxCountDto(int PageIndex, string Duration);
    public record PublishedPosts_GetScheduledPostsDto(int PageIndex, string Duration, int OffSet, int FetchNext);
    public record PublishedPosts_GetPostPreviewDto(int PageIndex, string PostLink);
}
