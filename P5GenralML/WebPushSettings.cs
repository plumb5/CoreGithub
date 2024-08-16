using System;

namespace P5GenralML
{
    public class WebPushSettings
    {
        public int Id { get; set; }
        public string ProviderName { get; set; }
        public string FCMProjectNo { get; set; }
        public string FCMApiKey { get; set; }
        public DateTime CreatedDate { get; set; }
        public short Status { get; set; }
        public string VapidPublicKey { get; set; }
        public string VapidPrivateKey { get; set; }
        public string VapidSubject { get; set; }
    }
}
