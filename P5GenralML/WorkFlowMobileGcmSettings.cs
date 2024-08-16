using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowMobileGcmSettings
    {
        public int Id { get; set; }
        public string ProviderName { get; set; }
        public string GcmProjectNo { get; set; }
        public string GcmApiKey { get; set; }
        public string PackageName { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Type { get; set; }
        public byte Status { get; set; }
        public byte IsDefault { get; set; }
        public string VapidPublicKey { get; set; }
        public string VapidPrivateKey { get; set; }
        public string VapidSubject { get; set; }
    }
}
