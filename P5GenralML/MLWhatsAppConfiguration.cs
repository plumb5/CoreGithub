using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWhatsAppConfiguration
    {
        public int Id { get; set; }
        public string? ProviderName { get; set; }
        public string? ApiKey { get; set; }
        public string? WhatsappBussinessNumber { get; set; }
        public string? ConfigurationUrl { get; set; }
        public string? CountryCode { get; set; }
        public string? ConfigurationName { get; set; }
        public bool IsDefaultProvider { get; set; }
        public string? WhatsAppConfigurationNameId { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
