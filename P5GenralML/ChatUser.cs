using System;

namespace P5GenralML
{
    public class ChatUser
    {
        public string? Id { get; set; }
        public int ChatId { get; set; }
        public string? IpAddress { get; set; }
        public string? Name { get; set; }
        public int ContactId { get; set; }
        public int? IsAdmin { get; set; }
        public DateTime UpdateDate { get; set; }
        public int? ChatRepeatTime { get; set; }
        public int? IsBlockUser { get; set; }
        public string? Comments { get; set; }
        public string? SoundNotify { get; set; }
        public string? SoundNewVisitorNotify { get; set; }
        public string? SoundNotificationOnVisitorConnect { get; set; }
        public int? DesktopNotifyForNewVisitor { get; set; }
        public int? InstantMesgOption { get; set; }
        public string? IMNetWork { get; set; }
        public string? IMEmailId { get; set; }
        public int? IMVerfication { get; set; }
        public string? City { get; set; }
        public string? StateName { get; set; }
        public string? Country { get; set; }
        public int? WhoBlocked { get; set; }
        public int LastAgentId { get; set; }
        public string? AgentsListServed { get; set; }
        public string? AgentProfileImageUrl { get; set; }
    }
}
