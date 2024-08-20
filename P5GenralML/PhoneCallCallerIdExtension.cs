using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class PhoneCallCallerIdExtension
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public string? PhoneNumber { get; set; }
        public string? CallerId { get; set; }
        public string? Extension { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
