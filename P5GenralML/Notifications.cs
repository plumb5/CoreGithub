using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class Notifications
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int ContactId { get; set; }
        public string? Heading { get; set; }
        public string? Details { get; set; }
        public string? PageUrl { get; set; }
        public bool? IsThatSeen { get; set; }
        public DateTime CreatedDate { get; set; }

    }
}
