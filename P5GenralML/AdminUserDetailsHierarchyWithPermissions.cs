using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class AdminUserDetailsHierarchyWithPermissions
    {
        public int UserInfoUserId { get; set; }
        public int SeniorUserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public string Senior { get; set; }
        public bool IsAdmin { get; set; }
        public bool ActiveStatus { get; set; }
        public int PermissionLevelsId { get; set; }
    }
}
