using System;

namespace P5GenralML
{
    public class WebLogs
    {
        public Int64 Id { get; set; }
        public Int32 AdsId { get; set; }
        public int UserInfoUserId { get; set; }
        public string? UserName { get; set; }
        public string? UserEmailId { get; set; }
        public string? ChannelType { get; set; }
        public string? Controller { get; set; }
        public string? Actions { get; set; }
        public string? RequestContent { get; set; }
        public string? ResponseContent { get; set; }
        public string? ActionDescription { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string? IpAddress { get; set; }
    }
}
