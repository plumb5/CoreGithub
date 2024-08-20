using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLAppMessengerTrackForIndividual : IDisposable
    {
        Task<Int32> Save(AppMessengerTrackForIndividual messengerTrack);
        Task<IEnumerable<AppMessengerTrackForIndividual>> GetSmsTrackForIndividual(string PhoneNumber);
    }
}
