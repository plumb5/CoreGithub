using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLContacts
    {
        public int ContactId { get; set; }
        public string Name { get; set; }
        public string EmailId { get; set; }
        public string PhoneNumber { get; set; }
        public Nullable<short> IsVerifiedMailId { get; set; }
        public Nullable<short> IsVerifiedContactNumber { get; set; }
        public string GroupName { get; set; }
    }
}
