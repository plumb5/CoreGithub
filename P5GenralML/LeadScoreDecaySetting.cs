using System;

namespace P5GenralML
{
    public class LeadScoreDecaySetting
    {
        public int Id { get; set; }
        public int NonActivityDays { get; set; }
        public bool IsActive { get; set; }
        public bool IsClearScore { get; set; }
        public int ScoreSubstract { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int CreatedUserInfoUserId { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int UpdatedUserInfoUserId { get; set; }
    }
}
