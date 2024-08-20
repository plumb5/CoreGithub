using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLUserGroup
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public string? Name { get; set; }
        public string? UserGroupDescription { get; set; }
        public int UserGroupId { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public int CreatedByUserId { get; set; }
        public int PermissionLevelsId { get; set; }
    }
}
