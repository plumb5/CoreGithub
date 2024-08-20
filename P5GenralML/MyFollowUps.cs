using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MyFollowUps
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int ContactId { get; set; }
        public string FollowUpContent { get; set; }
        public Int16 FollowUpStatus { get; set; }
        public int FollowUpUserId { get; set; }
        public DateTime FollowUpDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public int PrevFollowUpUserId { get; set; }
        public DateTime PrevFollowUpDate { get; set; }
    }
}
