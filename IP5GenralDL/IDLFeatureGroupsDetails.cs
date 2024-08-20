using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLFeatureGroupsDetails : IDisposable
    {
        Task<int> Save(FeatureGroupsDetails featureGroups);
        Task<List<FeatureGroupsDetails>> GetFeatureGroupsDetails(int Id);
        Task<bool> Delete(int FeatureGroupId);
        Task<List<FeatureGroupsDetails>> GetFeatureDetails(int FeatureId, int FeatureGroupId);
    }
}
