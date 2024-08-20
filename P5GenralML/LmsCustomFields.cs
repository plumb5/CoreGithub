using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class LmsCustomFields
    {
        public int Id { get; set; }
        public string? FieldDisplayName { get; set; }
        public string? Position { get; set; }
        public bool OverrideBy { get; set; }
        public bool SearchBy { get; set; }
        public string? FieldName { get; set; }
        public bool PublisherField { get; set; }
        public bool PublisherSearchBy { get; set; }
    }
}
