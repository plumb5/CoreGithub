using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MobileAndroidAPIResponse
    {
        public int MobileFormId { get; set; }
        public Int64 multicast_id { get; set; }
        public int success { get; set; }
        public int failure { get; set; }
        public int canonical_ids { get; set; }
        public object[] results { get; set; }
    }
}
