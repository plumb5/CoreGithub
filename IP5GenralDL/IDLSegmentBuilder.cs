using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLSegmentBuilder:IDisposable
    {
        Task<Int32> Save(SegmentBuilder segmentBuilder);
        Task<bool> Update(SegmentBuilder segmentBuilder);
        Task<IEnumerable<SegmentBuilder>> GET(int GroupId);
        Task<IEnumerable<MLSegmentOutputColumns>> GetTestResultByQuery(string FilterQuery);
        Task<IEnumerable<SegmentBuilder>> GetList(SegmentBuilder segmentBuilder, List<string> fieldName); 
        void StartFilter(int SegmentBuilderId, bool IsIntervalOrOnce);
        Task<bool> UpdateDeleteStatus(int GroupId);
        Task<IEnumerable<MLSegmentOutputColumns>> GetCustomEventsTestResultByQuery(string FilterQuery);
    }
}
