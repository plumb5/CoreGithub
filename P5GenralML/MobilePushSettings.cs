using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MobilePushSettings
    {
        public int Id { get; set; }
        public string? AndroidPackageName { get; set; }
        public string? FcmProjectNo { get; set; }
        public string? FcmApiKey { get; set; }
        public string? FcmConfigurationUrl { get; set; }
        public string? IosPackageName { get; set; }
        public string? IosPushType { get; set; }
        public string? IosCertificate { get; set; }
        public string? IosPassword { get; set; }
        public string? IosPushMode { get; set; }
        public string? IosFcmConfigFile { get; set; }
        public string? IosFcmTeamId { get; set; }
        public string? IosFcmBundleIdentifier { get; set; }
        public bool? Status { get; set; }
        public bool? IsFcmAndroidAndIOS { get; set; }
        public string? Type { get; set; }
        public int HybridApp { get; set; }
        public string? ProviderName { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
