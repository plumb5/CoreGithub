using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class FormCampaign
    {
        public Int16 Id { get; set; }

        public int UserInfoUserId { get; set; }

        public string Name { get; set; }

        public string CampaignDescription { get; set; }

        public DateTime CreatedDate { get; set; }

        public Boolean FormCampaignStatus { get; set; }
    }
}
