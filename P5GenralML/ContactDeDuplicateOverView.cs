using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class ContactDeDuplicateOverView
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public string? ImportedFileName { get; set; }
        public byte[]? ImportedFileContent { get; set; }
        public int IsCompleted { get; set; }
        public int TotalCounts{ get; set; }
        public int TotalCompleted { get; set; }
        public int ExistingCounts { get; set; }
        public int UniqueCounts { get; set; }
        public int DuplicateCounts { get; set; }
        public byte[]? ExistingFileContent { get; set; }
        public byte[]? UniqueFileContent { get; set; }
        public byte[]? DuplicateFileContent { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public Nullable<DateTime> UpdatedDate { get; set; }
        public Nullable<DateTime> ImportVerifyStartDate { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
