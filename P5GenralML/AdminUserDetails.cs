using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class AdminUserDetails
    {
        public int MainUserId { get; set; }
        public int UserInfoUserId { get; set; }
        public int SeniorUserId { get; set; }
        public int AccountId { get; set; }
        public List<int> GroupId { get; set; }
        public int CreatedByUserId { get; set; }
        public int PermissionLevelsId { get; set; }
    }
}
