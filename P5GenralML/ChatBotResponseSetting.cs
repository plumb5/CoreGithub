using System;

namespace P5GenralML
{
    public class ChatBotResponseSetting
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int ChatBotId { get; set; }
        public string? ReportToMailIds { get; set; }
        public int AssignToUserId { get; set; }
        public int AssignToGroupId { get; set; }
        public int AssignToLmsGroupId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public Int16 IsAssignIndividualOrBasedOnRule { get; set; }
        public int SourceType { get; set; }
    }
}
