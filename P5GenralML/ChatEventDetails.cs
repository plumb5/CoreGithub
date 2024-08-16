using System;

namespace P5GenralML
{
    public class ChatEventDetails
    {
        public string ChatUserId { get; set; }
        public int AgentId { get; set; }
        public string Url { get; set; }
        public Int16 EventType { get; set; }
        public DateTime CreatedDate { get; set; }
        public int ChatBannerId { get; set; }
        public string BannerTitle { get; set; }
        public string RedirectUrl { get; set; }
    }

    public class MLChatEventDetails
    {
        public string ChatUserId { get; set; }
        public int ChatBannerId { get; set; }
        public string Url { get; set; }
        public string BannerTitle { get; set; }
        public string RedirectUrl { get; set; }
        public int TotalSent { get; set; }
        public int TotalClicked { get; set; }
    }
}
