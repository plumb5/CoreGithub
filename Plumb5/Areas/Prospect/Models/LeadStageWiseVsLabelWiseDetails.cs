using P5GenralDL;
using P5GenralML;
using System.Data;

namespace Plumb5.Areas.Prospect.Models
{
    public class Lmsstagevslabeldetails
    {
        public string LeadLabel { get; set; }
        public int Score { get; set; }
        public int LeadCount { get; set; }
    }
    public class LeadStageWiseVsLabelWiseDetails
    {
        public string stageName { get; set; }
        public List<Lmsstagevslabeldetails> labeldetails { get; set; }

        int AdsId;
        string Sqlprovider = "";
        public LeadStageWiseVsLabelWiseDetails(int adsId, string sqlprovider = null)
        {
            AdsId = adsId;
            Sqlprovider = sqlprovider;
        }

        public LeadStageWiseVsLabelWiseDetails()
        {
        }

        public async Task<List<LeadStageWiseVsLabelWiseDetails>> GetLeadStageWiseVsLabelWiseDetails(string UserIdList, string UserGroupIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, List<LmsStage> AllStageList, int OrderBy)
        {
            List<LeadStageWiseVsLabelWiseDetails> finaldata = new List<LeadStageWiseVsLabelWiseDetails>();
            DataSet data = new DataSet();

            using (var objBL = DLLmsDashboard.GetDLLmsDashboard(AdsId, Sqlprovider))
                data = await objBL.GetSTAGEWISEVSLABELWISE(UserIdList, UserGroupIdList, FromDateTime, ToDateTime, OrderBy);

            if (data != null && data.Tables.Count > 0)
            {
                List<Lmsstagevslabeldetails> eachdetails = data.Tables[0].AsEnumerable().Select(r => new Lmsstagevslabeldetails
                {
                    LeadLabel = r.Field<string>("LeadLabel"),
                    Score = r.Field<int>("Score"),
                    LeadCount = r.Field<int>("LeadCount")
                }).ToList();

                if (eachdetails != null && eachdetails.Count() > 0)
                {
                    List<int> stageList = eachdetails.Select(x => x.Score).Distinct().ToList();

                    if (stageList != null && stageList.Count() > 0)
                    {
                        for (int i = 0; i < stageList.Count(); i++)
                        {
                            List<Lmsstagevslabeldetails> eachleadlabeldetails = new List<Lmsstagevslabeldetails>();
                            LeadStageWiseVsLabelWiseDetails eachuser = new LeadStageWiseVsLabelWiseDetails();

                            eachleadlabeldetails = eachdetails.Where(x => x.Score == stageList[i]).Select(x => x).ToList();

                            eachuser.labeldetails = eachleadlabeldetails;
                            //eachuser.stageName = AllStageList.Where(x => x.Score == stageList[i]).FirstOrDefault().Stage.ToString();
                            eachuser.stageName = AllStageList.FirstOrDefault(x => x.Score == stageList[i])?.Stage ?? "Unknown";

                            finaldata.Add(eachuser);
                        }
                    }
                }
            }
            return finaldata;
        }
    }
}
