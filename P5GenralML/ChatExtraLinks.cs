using System;

namespace P5GenralML
{
    public class ChatExtraLinks
    {
        public Int16 Id { get; set; }
        public int UserInfoUserId { get; set; }
        public bool LinkType { get; set; }
        public string? LinkUrl { get; set; }
        public string? LinkUrlDescription { get; set; }
        public bool ToogleStatus { get; set; }
    }
}
