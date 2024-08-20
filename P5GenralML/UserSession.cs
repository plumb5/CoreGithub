using System;

namespace P5GenralML
{
    public class UserSession
    {
        public int UserInfoUserId { get; set; }
        public int? UserGroupId { get; set; }
        public string SessionId { get; set; }
        public string AuthValue { get; set; }
        public string SecureKey { get; set; }
        public bool? IsLocked { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
