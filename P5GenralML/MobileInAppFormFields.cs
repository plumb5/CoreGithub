using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MobileInAppFormFields
    {
        public Int16 Id { get; set; }
        public int UserInfoUserId { get; set; }
        public Int32 InAppCampaignId { get; set; }
        public string Name { get; set; }
        public byte FieldType { get; set; }
        public string SubFields { get; set; }
        public Int16 RelationField { get; set; }
        public bool Mandatory { get; set; }
        public string FormScore { get; set; }
        public string PhoneValidationType { get; set; }
        public string FieldDisplay { get; set; }
        public byte CalendarDisplayType { get; set; }
        public string ContactMappingField { get; set; }
        public Int16 FieldPriority { get; set; }
    }
}
