using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLP5SqlJobs
    {
        Task<List<P5SqlJobs>> GetJobsDetails(P5SqlJobs p5SqlJobs);
        Task<bool> UpdateStatus(P5SqlJobs p5SqlJobs);
        Task<bool> ResetStatus(bool iscached);
        Task<bool> UpdateLastExecutedDate();
        Task<P5SqlJobs?> GetRestartDetails();
        Task<P5SqlJobsForAnalytics?> GetDetails(int AccountId, int p5sqljobsid);
        Task<bool> UpdateLastExecutedDateForAnalytics(int AccountId, int p5sqljobsid);
    }
}
