using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class FacebookAssignmentSettings
    {
        public int Id { get; set; }
        public string PageId { get; set; }
        public string PageName { get; set; }
        public bool IsAssignIndividualOrRoundRobin { get; set; }
        public int UserId { get; set; }
        public int UserGroupId { get; set; }
        public int GroupId { get; set; }
        public int LastAssignUserInfoUserId { get; set; }
        public int LmsGroupId { get; set; }
    }
}
