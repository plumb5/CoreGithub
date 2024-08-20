using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class RevenueMapping
    {
        public int Id { get; set; }
        public string? CurrencyType { get; set; }
        public int CustomEventOverViewId { get; set; }
        public string? CustomEventName { get; set; }
        public string? CustomEventFiledName { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
