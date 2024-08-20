using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
   public  class TransactionGroups
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string GroupDescription { get; set; }
        public bool? GroupStatus { get; set; }
        public string FilterContent { get; set; }
        public string FilterQuery { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
    }
}
