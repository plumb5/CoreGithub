using System;

namespace P5GenralML
{
    public class MLLmsGroup
    {
        public int LmsGroupId { get; set; }
        public int UserInfoUserId { get; set; }
        public int GroupType { get; set; }
        public string Name { get; set; }
        public int LeadCount { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
