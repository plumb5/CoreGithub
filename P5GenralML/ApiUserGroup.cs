using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class ApiUserGroup
    {
        public int Id { get; set; }
        public int LastAssignUserInfoUserId { get; set; }
        public string UserGroupId { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
