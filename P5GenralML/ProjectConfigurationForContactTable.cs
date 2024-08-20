using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class ProjectConfigurationForContactTable
    {
        public int Id { get; set; }
        public int UserGroupId { get; set; }
        public int UserInfoUserId { get; set; }
        public string? Name { get; set; }
        public string? Type { get; set; }
        public string? Content { get; set; }
        public bool? ProjectStatus { get; set; }
        public bool? IsArchive { get; set; }
        public Int16 ProjectPriority { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool IsPageUrlContainsQueryString { get; set; }
    }
}
