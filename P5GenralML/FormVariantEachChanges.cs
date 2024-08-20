using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class FormVariantEachChanges
    {
        public int Id { get; set; }
        public int FormVariantId { get; set; }
        public string? TagSelector { get; set; }
        public string? BannerContent { get; set; }
        public string? ActionType { get; set; }
        public bool VariantStatus { get; set; }
        public string? Identifier { get; set; }
        public int ClickCount { get; set; }
    }
}
