using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLFormLoadCloseResponseCount:IDisposable
    {
         void SaveUpdateForImpression(int FormId);
         void UpdateFormResponse(int FormId);
         void UpdateFormClose(int FormId);
         Task<IEnumerable<FormLoadCloseResponseCount>> GET(int FormId, DateTime FromDateTime, DateTime ToDateTime);


    }
}
