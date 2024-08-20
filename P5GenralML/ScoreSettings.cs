using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class ScoreSettings
    {
        public int Id { get; set; }
        public string ScoreName { get; set; }
        public string IdentifierName { get; set; }
        public string Description { get; set; }
        public string Operator { get; set; }
        public string ScoringAreaType { get; set; }
        public string Channel { get; set; }
        public string Event { get; set; }
        public string Value { get; set; }
        public int Score { get; set; }
        public int CampaignId { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
