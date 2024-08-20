using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MailTemplateImages
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? ImageUrl { get; set; }
        public int Height { get; set; }
        public int Width { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
