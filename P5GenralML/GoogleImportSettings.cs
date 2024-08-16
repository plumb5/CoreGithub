using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class GoogleImportSettings
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public int GoogleAccountSettingsId { get; set; }
        public Int64 GoogleGroupId { get; set; }
        public string Days { get; set; }
        public string Times { get; set; }
        public bool IsRecurring { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool Status { get; set; }
        public string ErrorMessage { get; set; }
        public DateTime? LastExecutationTime { get; set; }
        public short? IsCompleted { get; set; }
        public string GoogleAudienceName { get; set; }

    }
}
