using System;

namespace P5GenralML
{
    public class MobileEventSetting
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public string? EventIdentifier { get; set; }
        public string? EventName { get; set; }
        public string? EventSpecifier { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int UpdatedUserInfoUserId { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
