using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLFormLoadCloseResponse:IDisposable
    {
        void SaveUpdateForImpression(int FormId, string TrackIp, string MachineId, string SessionRefeer);
        void UpdateFormResponse(int FormId, string TrackIp, string MachineId, string SessionRefeer);
        void UpdateFormClose(int FormId, string TrackIp, string MachineId, string SessionRefeer);
    }
}
