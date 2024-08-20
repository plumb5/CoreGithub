using System;

namespace P5GenralML
{
    public class GroupImportOverview
    {
        public int Id { get; set; }
        public int ContactImportOverviewId { get; set; }
        public int GroupId { get; set; }
        public int SuccessCount { get; set; }
        public int RejectedCount { get; set; }
        public int ContactErrorRejectedCount { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
