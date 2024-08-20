using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class GoogleAdWordsImportData
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public string? Name { get; set; }        
        public string? MappingFields { get; set; }        
        public string? APIResponseId { get; set; }        
        public bool Status { get; set; }
        public string? ErrorMessage { get; set; }
        public string? TimeZone { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public int LmsGroupId { get; set; }
        public int OverrideSources { get; set; }
        public string? MappingLmscustomFields { get; set; }
        public int ExcutingStatus { get; set; }
        public string? ImportType { get; set; }

        public DateTime? LastExcuteDateTime { get; set; }
        public string? Range { get; set; }
        public string? SpreadsheetId { get; set; }
    }
}
