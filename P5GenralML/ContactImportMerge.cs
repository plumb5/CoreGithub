using System;

namespace P5GenralML
{
    public class ContactImportMerge
    {
        public string? UniqueTag { get; set; }
        public int ContactImportOverviewId { get; set; }
        public int ImportFileRowNumber { get; set; }
        public string? ImportEmail { get; set; }
        public string? ImportPhoneNumber { get; set; }
        public string? MergedContactIds { get; set; }
        public int RetainContactId { get; set; }
        public string? MergedEmails { get; set; }
        public string? MergedPhoneNumbers { get; set; }
        public string? MergedAlternateEmailIds { get; set; }
        public string? MergedAlternatePhoneNumbers { get; set; }
        public string? RetainEmail { get; set; }
        public string? RetainPhoneNumber { get; set; }
        public string? RetainAlternateEmailIds { get; set; }
        public string? RetainAlternatePhoneNumbers { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
