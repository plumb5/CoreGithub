using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLLandingPage : IDisposable
    {
        Task<Int32> Save(LandingPage landingPage);
        Task<bool> Update(LandingPage landingPage);

        Task<bool> UpdateIsTemplateSaved(LandingPage landingPage);

        Task<int> MaxCount(LandingPage landingPage);

        Task<List<MLLandingPage>> GetDetails(MLLandingPage landingPage, int FetchNext, int OffSet);

        Task<LandingPage> GetSingle(LandingPage landingPage);

        Task<bool> Delete(int Id);
    }
}
