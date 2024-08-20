using System;

namespace P5GenralML
{
    public class WebLogger
    {
        public long LogId { get; set; }
        public string? LogUniqueId { get; set; }
        public string? RequestType { get; set; }
        public int AccountId { get; set; }
        public int UserInfoUserId { get; set; }
        public string? UserName { get; set; }
        public string? UserEmail { get; set; }
        public string? ChannelName { get; set; }
        public string? ControllerName { get; set; }
        public string? ActionName { get; set; }
        public string? IpAddress { get; set; }
        public string? LogContent { get; set; }
        public string? Headers { get; set; }
        public string? RequestedMethod { get; set; }
        public string? Useragent { get; set; }
        public string? AbsoluteUri { get; set; }
        public string? CallType { get; set; }
        public string? StatusCode { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CustomMessage { get; set; }
    }
}
