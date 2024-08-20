using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLFeatureGroups : IDisposable
    {
        Task<int> MaxCount();
        Task<List<FeatureGroups>> GetReport(int Offset, int FetchNext);
        Task<int> Save(FeatureGroups featureGroups);
        Task<bool> Update(FeatureGroups featureGroups);
        Task<bool> UpdateDataPurgeSettings(int Id, string PugesettingValue);
        Task<bool> Delete(int Id);
        Task<List<FeatureGroups>> GetFeatureGroupList();
    }
}
