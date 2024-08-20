using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLChatLoadCloseResponse
    {
        Task<int> SaveUpdateForImpression(int ChatId, string TrackIp, string MachineId, string SessionRefeer, string City, string State, string Country);
        void UpdateFormClose(int ChatId, string TrackIp, string MachineId, string SessionRefeer);
    }
}
