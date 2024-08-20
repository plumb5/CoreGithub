using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLCallVendorResponse
    {
        public int Id { get; set; }
        public string Called_Sid { get; set; }
        public DateTime? CalledDate { get; set; }
        public string PhoneNumber { get; set; }
        public string CalledNumber { get; set; }
        public string P5UniqueId { get; set; }
        public string ErrorMessage { get; set; }        
        public Int16 SendStatus { get; set; }
    }
}
