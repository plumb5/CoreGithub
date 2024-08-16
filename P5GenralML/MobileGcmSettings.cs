using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MobileGcmSettings
    {
        public int Id { get; set; }
        public string GcmProjectNo { get; set; }
        public string GcmApiKey { get; set; }
        public string PackageName { get; set; }

        public string IosPackageName { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Type { get; set; }
        public byte Status { get; set; }
        public byte IsDefault { get; set; }
    }
}
