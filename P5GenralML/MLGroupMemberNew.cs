using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
   
    public class MLContactsAddToGroup
    {
        public int UserInfoUserId { get; set; }
        public int UserGroupId { get; set; }
        public string[] ListGroupData { get; set; }
        public System.Data.DataTable ListData { get; set; }
    }
    public class MLContactsDeleteFromGroup
    {
        public string[] ListGroupData { get; set; }
        public System.Data.DataTable ListData { get; set; }
    }

    public class MLGroupsByContacts
    {
        public System.Data.DataTable ListData { get; set; }
    }
}
