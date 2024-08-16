using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLManageGroups
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string GroupDescription { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public int Total { get; set; }
        public Int16 GroupType { get; set; }
    }
}
