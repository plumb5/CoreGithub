﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class LmsContactImportOverview
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int LmsGroupId { get; set; }
        public int UserGroupId { get; set; }
        public string? ContactFileName { get; set; }
        public int SuccessCount { get; set; }
        public int RejectedCount { get; set; }
        public int MergeCount { get; set; }
        public byte? IsCompleted { get; set; }
        public string? ErrorMessage { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public Nullable<DateTime> UpdatedDate { get; set; }
        public string? ImportedFileName { get; set; }
        public int TotalInputRow { get; set; }
        public int TotalCompletedRow { get; set; }
        public string? AssignUserInfoUserId { get; set; }
    }
}
