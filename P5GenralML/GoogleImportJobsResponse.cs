using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class GoogleImportJobsResponse
    {
        public int Id { get; set; }
        public int GoogleImportsettingsId { get; set; }
        public string ResourceName { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Status { get; set; }
    }
}
