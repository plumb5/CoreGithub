using System;

namespace P5GenralML
{
    public class MailCampaign
    {
        public int Id { get; set; }
        public int UserGroupId { get; set; }
        public int UserInfoUserId { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDate { get; set; }
        public Boolean MailCampaignStatus { get; set; }
    }
}
