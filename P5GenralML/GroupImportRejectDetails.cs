using System;

namespace P5GenralML
{
    public class GroupImportRejectDetails
    {
        public int Id { get; set; }
        public int GroupImportOverviewId { get; set; }
        public int ContactImportOverviewId { get; set; }
        public int GroupId { get; set; }
        public string EmailId { get; set; }
        public string PhoneNumber { get; set; }
        public int FileRowNumber { get; set; }
        public string RejectedReason { get; set; }
        public string RejectionType { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
