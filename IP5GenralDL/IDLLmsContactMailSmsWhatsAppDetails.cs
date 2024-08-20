using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLLmsContactMailSmsWhatsAppDetails:IDisposable
    {
        Task<Int32> Save(int apiid, int contactid, int lmsgroupid, int templateid, string channel, string p5field, string p5value);
        Task<Int32> CheckCommunicationSent(int apiid, int contactid, int lmsgroupid, int templateid, string channel, string p5field, string p5value);
    }
}
