using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class SearchedDataTags
    {
        public int Id { get; private set; }
        public string MachineId { get; set; }
        public int ContactId { get; set; }
        public string SearchedData { get; set; }
        public string ExcludedData { get; set; }
        public string SearchedType { get; set; }
        public DateTime? SearchedDate { get; set; }
        public int Counts { get; set; }
        public string PageUrl { get; set; }
        public string SessionId { get; set; }
    }
}
