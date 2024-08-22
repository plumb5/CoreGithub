using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLFormBannerLoadClickCount:IDisposable
    {
        void SaveUpdateForImpression(int FormBannerId);
        void UpdateFormResponse(int FormBannerId);
        void UpdateFormClose(int FormBannerId);
    }
}
