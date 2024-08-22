using P5GenralDL;
using P5GenralML;
using System.Data;

namespace Plumb5.Areas.Prospect.Models
{
    public class Lmsstagevssourcedetails
    {
        public int Score { get; set; }
        public int LmsGroupId { get; set; }
        public int TotalCount { get; set; }
    }
    public class LeadStageVsSourceWiseDetails
    {
        public string stageName { get; set; }
        public List<Lmsstagevssourcedetails> eachsourcedetails { get; set; }

        int AdsId;
        string Sqlprovider = "";
        public LeadStageVsSourceWiseDetails(int adsId, string sqlprovider = null)
        {
            AdsId = adsId;
            Sqlprovider = sqlprovider;
        }

        public LeadStageVsSourceWiseDetails()
        {
        }

        public async Task<List<LeadStageVsSourceWiseDetails>> GetLeadStageVsSourceWiseDetails(string UserIdList, string UserGroupIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, List<LmsStage> AllStageList, int OrderBy)
        {
            List<LeadStageVsSourceWiseDetails> finaldata = new List<LeadStageVsSourceWiseDetails>();
            DataSet data = new DataSet();

            using (var objBL = DLLmsDashboard.GetDLLmsDashboard(AdsId,Sqlprovider))
                data = await objBL.GetSTAGEVSSOURCEWISE(UserIdList, UserGroupIdList, FromDateTime, ToDateTime, OrderBy);

            if (data != null && data.Tables.Count > 0 && AllStageList != null && AllStageList.Count() > 0)
            {
                List<Lmsstagevssourcedetails> eachdetails = data.Tables[0].AsEnumerable().Select(r => new Lmsstagevssourcedetails
                {
                    Score = r.Field<int>("Score"),
                    LmsGroupId = r.Field<int>("LmsGroupId"),
                    TotalCount = r.Field<int>("TotalCount")
                }).ToList();

                if (eachdetails != null && eachdetails.Count() > 0)
                {
                    List<int> stageList = eachdetails.Select(x => x.Score).Distinct().ToList();

                    if (stageList != null && stageList.Count() > 0)
                    {
                        for (int i = 0; i < stageList.Count(); i++)
                        {
                            List<Lmsstagevssourcedetails> eachleadsourcedetails = new List<Lmsstagevssourcedetails>();
                            LeadStageVsSourceWiseDetails eachuser = new LeadStageVsSourceWiseDetails();

                            eachleadsourcedetails = eachdetails.Where(x => x.Score == stageList[i]).Select(x => x).ToList();

                            eachuser.eachsourcedetails = eachleadsourcedetails;
                            // eachuser.stageName = AllStageList.Where(x => x.Score == stageList[i]).FirstOrDefault().Stage;
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
