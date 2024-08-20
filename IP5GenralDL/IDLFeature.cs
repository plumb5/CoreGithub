using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLFeature : IDisposable
    {
        Task<Int16> SaveDetails(Feature feature);
        Task<bool> UpdateDetails(Feature feature);
        Task<List<Feature>> GetList(int OffSet, int FetchNext);
        Task<Feature?> GetDetail(Int16 Id);
        Task<Feature?> GetDetail(string featureName);
        Task<bool> Delete(Int16 Id);
        Task<List<Feature>> GetDetailByFeatureGroupId(int FeatureGroupId);
    }
}
