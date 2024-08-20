using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLFormBannerLoadClick
    {
        void SaveUpdateForImpression(int FormBannerId, string TrackIp, string MachineId, string SessionRefeer);
        void UpdateFormResponse(int FormBannerId, string TrackIp, string MachineId = null, string SessionRefeer = null);
        void UpdateFormClose(int FormBannerId, string TrackIp, string MachineId, string SessionRefeer);
    }
}
