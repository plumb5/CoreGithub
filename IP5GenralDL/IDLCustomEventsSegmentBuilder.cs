using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLCustomEventsSegmentBuilder:IDisposable
    {
        Task<Int32> Save(CustomEventsSegmentBuilder segmentBuilder);
        Task<bool> Update(CustomEventsSegmentBuilder segmentBuilder);
        Task<IEnumerable<CustomEventsSegmentBuilder>> GET(int GroupId);
        Task<IEnumerable<MLSegmentOutputColumns>> GetTestResultByQuery(string FilterQuery);
        Task<IEnumerable<CustomEventsSegmentBuilder>> GetList(CustomEventsSegmentBuilder segmentBuilder, List<string> fieldName);
        void StartFilter(int SegmentBuilderId);
        Task<bool> UpdateDeleteStatus(int GroupId);
    }
}
