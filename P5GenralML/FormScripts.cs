using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class FormScripts
    {
        public int Id { get; set; }
        public int FormId { get; set; }
        public Int16 FormType { get; set; }
        public string FormScript { get; set; }
        public string Description { get; set; }
        public bool? FormScriptStatus { get; set; }
        public Int16 FormScriptType { get; set; }
        public string ConfigurationDetails { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public Nullable<DateTime> UpdatedDate { get; set; }
        public string PageUrl { get; set; }
        public string AlternatePageUrls { get; set; }
    }

    public class MLFormScripts : FormScripts
    {
        public string FormIdentifier { get; set; }
        public string Heading { get; set; }
    }
}
