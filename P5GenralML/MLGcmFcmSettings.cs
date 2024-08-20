namespace P5GenralML
{
    public class MLGcmFcmSettings
    {
        public int AccountId { get; set; }
        public string Action { get; set; }
        public string SenderId { get; set; }
        public string ApiKey { get; set; }
        public string PackageName { get; set; }
        public string Type { get; set; }
        public int IsDefault { get; set; }
    }

    public class APNsettings
    {
        public int AccountId { get; set; }
        public string Action { get; set; }
        public string CertificateName { get; set; }
        public string PassPhrase { get; set; }
        public int PushMode { get; set; }
        public string IOSPackageName { get; set; }
    }
}
