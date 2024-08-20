namespace Plumb5.Areas.ManageContact.Models
{
    public class FtpContactImport
    {
        public int ConnectionId { get; set; }
        public string Path { get; set; }
        public string[] Files { get; set; }
        public int GroupId { get; set; }
        public int LmsGroupId { get; set; }
        public bool OverrideAssignment { get; set; }
        public bool OverrideSources { get; set; }
        public string UserIdList { get; set; }
        public bool AssociateContactsToGrp { get; set; }
        public bool RemoveOldContactsFromTheGroup { get; set; }
        public string ImportSource { get; set; }

        public int SourceType { get; set; }
    }
}
