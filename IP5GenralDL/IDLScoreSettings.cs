using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLScoreSettings:IDisposable
    {
        Task<Int32> Save(ScoreSettings scoreSettings);
        Task<IEnumerable<ScoreSettings>> GetDetails(string ScoringAreaType, string ScoreName);
        Task<bool> Delete(string ScoringAreaType);
        Task<IEnumerable<ScoreSettings>> GetSettingForAssignment();
    }
}
