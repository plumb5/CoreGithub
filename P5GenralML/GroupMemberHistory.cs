using System;

namespace P5GenralML
{
    public class GroupMemberHistory
    {
        public int GroupId { get; set; }
        public int ContactId { get; set; }
        public Boolean IsAddorRemove { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
