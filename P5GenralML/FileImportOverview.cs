using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class FileImportOverview
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public string FileName { get; set; }
        public string FileFullPath { get; set; }
        public string ImportFor { get; set; }
        public byte IsInitiated { get; set; }
        public bool IsCompleted { get; set; }
        public int SuccessCount { get; set; }
        public int RejectedCount { get; set; }
        public int MergeCount { get; set; }
        public string ErrorMessage { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public Nullable<DateTime> CompletedDate { get; set; }
        public bool? IsAbort { get; set; }
    }
}