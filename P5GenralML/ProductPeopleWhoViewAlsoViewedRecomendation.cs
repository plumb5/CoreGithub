using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class ProductPeopleWhoViewAlsoViewedRecomendation
    {
        public int Id { get; set; }

        public string ProductId { get; set; }

        public string LastViewedProduct { get; set; }

        public int Hits { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}
