using P5GenralDL;
using P5GenralML;
using System.Data;

namespace Plumb5.Areas.Prospect.Models
{
    public class Lmssourcevslabeldetails
    {
        public string LeadLabel { get; set; }
        public int LmsGroupId { get; set; }
        public int LeadCount { get; set; }
    }
    public class LeadSourceWiseVsLabelWiseDetails
    {
        public string sourceName { get; set; }
        public List<Lmssourcevslabeldetails> labeldetails { get; set; }

        int AdsId;
        string Sqlprovider = "";
        public LeadSourceWiseVsLabelWiseDetails(int adsId, string sqlprovider = null)
        {
            AdsId = adsId;
            Sqlprovider = sqlprovider;
        }

        public LeadSourceWiseVsLabelWiseDetails()
        {
        }

        public async Task<List<LeadSourceWiseVsLabelWiseDetails>> GetLeadSourceWiseVsLabelWiseDetails(string UserIdList, string UserGroupIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, List<MLLmsGroup> lmsgrplist, int OrderBy)
        {
            List<LeadSourceWiseVsLabelWiseDetails> finaldata = new List<LeadSourceWiseVsLabelWiseDetails>();
            DataSet data = new DataSet();

            using (var objBL = DLLmsDashboard.GetDLLmsDashboard(AdsId, Sqlprovider))
                data = await objBL.GetSOURCEWISEVSLABELWISE(UserIdList, UserGroupIdList, FromDateTime, ToDateTime, OrderBy);

            if (data != null && data.Tables.Count > 0 && lmsgrplist != null && lmsgrplist.Count() > 0)
            {
                List<Lmssourcevslabeldetails> eachdetails = data.Tables[0].AsEnumerable().Select(r => new Lmssourcevslabeldetails
                {
                    LeadLabel = r.Field<string>("LeadLabel"),
                    LmsGroupId = r.Field<int>("LmsGroupId"),
                    LeadCount = r.Field<int>("LeadCount")
                }).ToList();

                if (eachdetails != null && eachdetails.Count() > 0)
                {
                    List<int> sourceList = eachdetails.Select(x => x.LmsGroupId).Distinct().ToList();

                    if (sourceList != null && sourceList.Count() > 0)
                    {
                        for (int i = 0; i < sourceList.Count(); i++)
                        {
                            List<Lmssourcevslabeldetails> eachleadlabeldetails = new List<Lmssourcevslabeldetails>();
                            LeadSourceWiseVsLabelWiseDetails eachuser = new LeadSourceWiseVsLabelWiseDetails();

                            eachleadlabeldetails = eachdetails.Where(x => x.LmsGroupId == sourceList[i]).Select(x => x).ToList();

                            eachuser.labeldetails = eachleadlabeldetails;
                            //eachuser.sourceName = lmsgrplist.Where(x => x.LmsGroupId == sourceList[i]).FirstOrDefault().Name.ToString();
                            eachuser.sourceName = lmsgrplist.FirstOrDefault(x => x.LmsGroupId == sourceList[i])?.Name ?? "Unknown";

                            finaldata.Add(eachuser);
                        }
                    }
                }
            }
            return finaldata;
        }
    }
}
