using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLLandingPageConfiguration:IDisposable
    {
        Task<Int32> Save(LandingPageConfiguration landingPageConfiguration);
        Task<LandingPageConfiguration> GetLandingPageConfiguration();
        Task<LandingPageConfiguration> GetConfigByLandingPage(string LandingPageName);
        Task<bool> UpdateStatus(bool IsLandingPageConfigEnabled, string LandingPageName);
    }
}
