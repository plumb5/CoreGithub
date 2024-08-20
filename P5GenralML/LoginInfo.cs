using System.Collections.Generic;

namespace P5GenralML
{
    public class LoginInfo
    {
        public int UserId { get; set; }
        public int IsSuperAdmin { get; set; }
        public string? UserName { get; set; }
        public string? EmailId { get; set; }
        public List<int>? UserGroupIdList { get; set; }
        public List<Members> Members { get; set; }
        public List<UserPermissions> UserPermissions { get; set; }
        public List<MLUserHierarchy> UserMembers { get; set; }
        public bool FirstTimePasswordReset { get; set; }
        public string? UserAccountType { get; set; }
        public int PreferredAccountId { get; set; }
    }

    public class PublisherValue
    {
        public int userinfoid { get; set; }
        public string? field { get; set; }
        public string? value { get; set; }
        public bool IsMasking { get; set; }

    }
}
