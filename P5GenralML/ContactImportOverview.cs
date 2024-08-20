using System;

namespace P5GenralML
{
    public class ContactImportOverview
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int GroupId { get; set; }
        public int UserGroupId { get; set; }
        public string ContactFileName { get; set; }
        public int SuccessCount { get; set; }
        public int RejectedCount { get; set; }
        public int MergeCount { get; set; }
        public short? IsCompleted { get; set; }
        public string ErrorMessage { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public Nullable<DateTime> UpdatedDate { get; set; }
        public string ImportSource { get; set; }
        public bool AssociateContactsToGroup { get; set; }
        public int GroupAddSuccessCount { get; set; }
        public int GroupAddRejectCount { get; set; }
        public string ImportedFileName { get; set; }
        public int TotalInputRow { get; set; }
        public int TotalCompletedRow { get; set; }
        public int LmsGroupId { get; set; }
        public bool OverrideAssignment { get; set; }
        public string UserIdList { get; set; }
        public int LmsGroupAddSuccessCount { get; set; }
        public int LmsGroupAddRejectCount { get; set; }
        public bool OverrideSources { get; set; }
        public bool NotoptedforEmailValidation { get; set; }
        public bool IgnoreUpdateContact { get; set; }
        public int SourceType { get; set; }
        
    }
}
