using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class PhoneCallResponses
    {
        public int Id { get; set; }
        public string? Called_Sid { get; set; }
        public DateTime? CalledDate { get; set; }
        public string? PhoneNumber { get; set; }
        public string? CalledStatus { get; set; }
        public string? Pickduration { get; set; }
        public string? TotalCallDuration { get; set; }
        public string? CallEvents { get; set; }
        public string? CalledNumber { get; set; }
        public string? RecordedFileUrl { get; set; }
        public bool DownLoadStatus { get; set; }
        public int ContactId { get; set; }
        public int LmsGroupId { get; set; }
        public int Score { get; set; }
        public string? LeadLabel { get; set; }
        public string? ErrorMessage { get; set; }
        public string? P5UniqueId { get; set; }
        public Int16 SendStatus { get; set; }
        public int UserInfoUserId { get; set; }
        public string? CampaignJobName { get; set; }
        public string? Publisher { get; set; }
        public int LmsGroupMemberId { get; set; }
    }
}
