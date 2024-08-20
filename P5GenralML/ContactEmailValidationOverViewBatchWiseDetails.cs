using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class ContactEmailValidationOverViewBatchWiseDetails
    {
        public int Id { get; set; }
        public int ContactEmailValidationOverViewId { get; set; }
        public int GroupId { get; set; }
        public int IsCompleted { get; set; }
        public string? ErrorMessage { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? File_Id { get; set; }
        public string? File_Name { get; set; }
        public string? Status { get; set; }
        public int Unique_Emails { get; set; }
        public DateTime Updated_At { get; set; }
        public int Percent { get; set; }
        public int Verified { get; set; }
        public int Unverified { get; set; }
        public int Ok { get; set; }
        public int Catch_All { get; set; }
        public int Disposable { get; set; }
        public int Invalid { get; set; }
        public int Unknown { get; set; }
        public int Reverify { get; set; }
        public int Estimated_Time_Sec { get; set; }
        public DateTime UpdatedDate { get; set; }

    }
}
