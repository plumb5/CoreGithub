using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class Groups
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int UserGroupId { get; set; }
        public string Name { get; set; }
        public string GroupDescription { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public Int16 AppType { get; set; }
        public int CafeId { get; set; }
        public Boolean DisplayInUnscubscribe { get; set; }
        public Int16 GroupType { get; set; }
        public int TotalEmailVerfied { get; set; }
    }
}
