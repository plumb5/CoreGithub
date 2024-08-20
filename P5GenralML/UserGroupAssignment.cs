using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class UserGroupAssignment
    {
        public int Id { get; set; }
        public int ChannelId { get; set; }
        public string? ChannelType { get; set; }
        public int UserGroupId { get; set; }
        public int LastAssignUserInfoUserId { get; set; }
        public string? UserAssignedValues { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
