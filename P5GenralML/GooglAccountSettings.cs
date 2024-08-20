using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class GooglAccountSettings
    {
        public int Id { get; set; }
        public string GoogleAccountsId { get; set; }
        public string GoogleAccountName { get; set; }
        public bool Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
