using System;

namespace P5GenralML
{
    public class MLCallApiConfiguration
    {
        public Int16 Id { get; set; }
        public int UserInfoUserId { get; set; }
        public string ProviderName { get; set; }
        public string ConfigurationUrl { get; set; }
        public string ApiKey { get; set; }
        public string ApiToken { get; set; }
        public string AccountName { get; set; }
        public string CallerId { get; set; }
        public long CallCount { get; set; }
        public long CallLimit { get; set; }
        public bool ActiveStatus { get; set; }
        public string SubDomain { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string CountryCode { get; set; }
    }
}
