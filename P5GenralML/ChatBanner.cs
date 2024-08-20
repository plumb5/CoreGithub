using System;

namespace P5GenralML
{
    public class ChatBanner
    {
        public int Id { get; set; }
        public string? BannerContent { get; set; }
        public string? RedirectUrl { get; set; }
        public DateTime? ChatBannerDate { get; set; }
        public int UserInfoUserId { get; set; }
        public string? BannerTitle { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
