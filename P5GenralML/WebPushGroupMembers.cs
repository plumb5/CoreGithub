using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WebPushGroupMembers
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int UserGroupId { get; set; }
        public int ContactId { get; set; }
        public int GroupId { get; set; }
        public string? MachineId { get; set; }
        public DateTime Date { get; set; }
    }
}
