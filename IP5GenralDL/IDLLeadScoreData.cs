using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLLeadScoreData:IDisposable
    {
        void SaveScore(LeadScoreData leadScoreData, string ScoreAction, DateTime? FromDateTime, DateTime? ToDateTime);
    }
}
