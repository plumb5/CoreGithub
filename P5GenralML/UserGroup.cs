using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class UserGroup
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public string Name { get; set; }
        public string UserGroupDescription { get; set; }
        public int UserGroupId { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
