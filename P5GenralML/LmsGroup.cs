using System;

namespace P5GenralML
{
    public class LmsGroup
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int UserGroupId { get; set; }
        public Int16 GroupType { get; set; }
        public string? Name { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
