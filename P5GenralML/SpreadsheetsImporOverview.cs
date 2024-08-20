using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class SpreadsheetsImporOverview
    {
        public int Id { get; set; }
        public int SpreadsheetsImportId { get; set; }
        public string? ServerResponses { get; set; }
        public DateTime ReceivedDate { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
