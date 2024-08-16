using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class LandingPageTemplateFile
    {
        public int Id { get; set; }
        public int LandingPageId { get; set; }
        public string TemplateFileName { get; set; }
        public string TemplateFileType { get; set; }
        public byte[] TemplateFileContent { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
