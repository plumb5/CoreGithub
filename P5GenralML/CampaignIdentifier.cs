using System;

namespace P5GenralML
{
    public class CampaignIdentifier
    {
        public int Id { get; set; }
        public int UserGroupId { get; set; }
        public int UserInfoUserId { get; set; }
        public string? Name { get; set; }
        public string? CampaignDescription { get; set; }
        public bool? CampaignStatus { get; set; }
        public bool? IsDeleted { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
    }
}
