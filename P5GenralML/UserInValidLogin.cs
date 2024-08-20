using System;

namespace P5GenralML
{
    public class UserInValidLogin
    {
        public int UserInfoUserId { get; set; }
        public DateTime? InValidLoginDate { get; set; }
        public int InValidLoginCount { get; set; }
        public bool? IsLocked { get; set; }
    }
}
