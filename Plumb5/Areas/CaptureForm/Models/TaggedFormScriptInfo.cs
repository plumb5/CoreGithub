using P5GenralML;

namespace Plumb5.Areas.CaptureForm.Models
{
    public class TaggedFormScriptInfo
    {
        public int AdsId { get; set; }

        public string AuthenticationTokenId { get; set; }

        public FormScripts formscript { get; set; }

        public FormDetails formdetails { get; set; }

        public List<FormFields> formfields { get; set; }
    }
}
