using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class ProductPeopleWhoViewAlsoViewed
    {
        public int Id { get; set; }

        public string ProductId { get; set; }

        public string LastViewedProduct { get; set; }

        public int Hits { get; set; }

        public string MachineId { get; set; }

        public string SessionId { get; set; }

        public int? ContactId { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}
