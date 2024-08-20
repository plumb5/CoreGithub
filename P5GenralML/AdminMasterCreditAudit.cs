using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class AdminMasterCreditAudit
    {
        public int Id { get; set; }
        public int ConsumableType { get; set; }
        public string? ProviderName { get; set; }
        public Int64 CreditAllocated { get; set; }
        public Int64 CreditConsumed { get; set; }
        public string? LastModifiedByUserName { get; set; }
        public DateTime MasterCreditCreatedDate { get; set; }
        public DateTime MasterCreditUpdatedDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? Remarks { get; set; }
    }
}
