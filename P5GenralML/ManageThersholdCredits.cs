using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class ManageThersholdCredits
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public int UserId { get; set; }
        public string? ConsumableType { get; set; }
        public string? ProviderName { get; set; }
        public Int64 ThresholdCredit { get; set; }
        public bool IsEmailNotification { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
