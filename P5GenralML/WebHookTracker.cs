using System;

namespace P5GenralML
{
    public class WebHookTracker
    {
        public string? PostedUrl { get; set; }
        public string? Response { get; set; }
        public double ResponseCode { get; set; }
        public string? ResponseFromServer { get; set; }
        public string? CallingSource { get; set; }
        public DateTime SentDate { get; set; }
        public string? RequestBody { get; set; }
        public int FormorChatId { get; set; }
        public int WebHookId { get; set; }
    }
}
