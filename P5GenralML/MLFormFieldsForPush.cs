using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class FormFieldsForPsuh
    {
        public Int16 Id { get; set; }
        public int UserInfoUserId { get; set; }
        public Int32 FormId { get; set; }
        public string? Name { get; set; }
        public byte FieldType { get; set; }
        public string? SubFields { get; set; }
        public Int16 RelationField { get; set; }
        public bool Mandatory { get; set; }
        public string? FormScore { get; set; }
    }

    public class FormDetailsForPsuh
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int UserGroupId { get; set; }
        public Int16 FormCampaignId { get; set; }
        public byte FormType { get; set; }
        public Boolean? FormStatus { get; set; }
        public Int16 FormPriority { get; set; }
    }
}
