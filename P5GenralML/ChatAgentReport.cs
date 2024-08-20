using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class ChatAgentReport
    {
        public int ChatId { get; set; }
        public string? IpAddress { get; set; }
        public string? Name { get; set; }
        public string? AgentName { get; set; }
        public string? ChatRoom { get; set; }
        public string? ChatUserId { get; set; }
        public DateTime ChatUserTime { get; set; }
        public string? LastReplyBy { get; set; }
    }
}
