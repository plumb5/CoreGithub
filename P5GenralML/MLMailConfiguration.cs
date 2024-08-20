using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLMailConfiguration
    {
        public int Id { get; set; }
        public string? ProviderName { get; set; }
        public string? PromotionalAPIKey { get; set; }
        public string? TransactionalAPIKey { get; set; }
        public string? ConfigurationName { get; set; }
        public bool IsDefaultProvider { get; set; }
        public string? MailConfigurationNameId { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
