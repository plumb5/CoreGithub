using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLUserDetails
    {
        public int UserInfoUserId { get; set; }
        public string? FirstName { get; set; }
        public string? EmailId { get; set; }
        public string? MobilePhone { get; set; }
        public bool IsAdmin { get; set; }
        public bool ActiveStatus { get; set; }
    }
}
