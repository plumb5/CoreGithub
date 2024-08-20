using System;
namespace P5GenralML
{
    public class FormExtraLinks
    {
        public Int16 Id { get; set; }
        public int UserInfoUserId { get; set; }
        public bool LinkType { get; set; }
        public string LinkUrl { get; set; }
        public bool ToogleStatus { get; set; }
        public string LinkUrlDescription { get; set; }
        public string LinkPlacecode { get; set; }
        public string LinkAddCsscode { get; set; }
        public string FormId { get; set; }
    }
}
