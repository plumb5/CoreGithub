using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLControlGroups : IDisposable
    {
        Task<int> Save(ControlGroups controlGroups);
        Task<string?> GetControlGroupCampaignName(string CampaignName);
    }
}
