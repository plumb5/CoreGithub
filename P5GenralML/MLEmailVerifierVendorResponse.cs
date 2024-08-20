using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLEmailVerifierVendorResponse
    {
        public int ContactId { get; set; }
        public string EmailId { get; set; }
        public bool Result { get; set; }
        public string Message { get; set; }        
        public short? IsVerifiedMailId { get; set; }
    }
}
