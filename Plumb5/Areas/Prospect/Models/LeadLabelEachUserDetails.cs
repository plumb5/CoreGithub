using P5GenralDL;
using P5GenralML;
using System.Data;

namespace Plumb5.Areas.Prospect.Models
{
    public class LmsLeadLabel
    {
        public string LeadLabel { get; set; }
        public int UserInfoUserId { get; set; }
        public int LeadCount { get; set; }
    }
    public class LeadLabelEachUserDetails
    {
        public string UserName { get; set; }
        public List<LmsLeadLabel> userwiselabelleads { get; set; }

        int AdsId;
        string Sqlprovider = "";
        public LeadLabelEachUserDetails(int adsId, string sqlprovider = null)
        {
            AdsId = adsId;
            Sqlprovider = sqlprovider;
        }

        public LeadLabelEachUserDetails()
        {
        }

        public async Task<List<LeadLabelEachUserDetails>> GetLeadLabelEachUserDetails(string UserIdList, string UserGroupIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, List<MLUserHierarchy> userHierarchy, int OrderBy)
        {
            List<LeadLabelEachUserDetails> finaldata = new List<LeadLabelEachUserDetails>();
            DataSet data = new DataSet();

            using (var objBL = DLLmsDashboard.GetDLLmsDashboard(AdsId, Sqlprovider))
                data = await objBL.GetTopPerformerByLeadLabel(UserIdList, UserGroupIdList, FromDateTime, ToDateTime, OrderBy);

            if (data != null && data.Tables.Count > 0)
            {
                List<LmsLeadLabel> eachdetails = data.Tables[0].AsEnumerable().Select(r => new LmsLeadLabel
                {
                    LeadLabel = r.Field<string>("LeadLabel"),
                    UserInfoUserId = r.Field<int>("UserInfoUserId"),
                    LeadCount = r.Field<int>("LeadCount")
                }).ToList();

                if (eachdetails != null && eachdetails.Count() > 0)
                {
                    List<int> userList = eachdetails.Select(x => x.UserInfoUserId).Distinct().ToList();

                    if (userList != null && userList.Count() > 0)
                    {
                        for (int i = 0; i < userList.Count(); i++)
                        {
                            List<LmsLeadLabel> eachleadlabeldetails = new List<LmsLeadLabel>();
                            LeadLabelEachUserDetails eachuser = new LeadLabelEachUserDetails();

                            eachleadlabeldetails = eachdetails.Where(x => x.UserInfoUserId == userList[i]).Select(x => x).ToList();

                            eachuser.userwiselabelleads = eachleadlabeldetails;
                            //eachuser.UserName = userHierarchy.Where(x => x.UserInfoUserId == userList[i]).FirstOrDefault().FirstName.ToString();
                            eachuser.UserName = userHierarchy.FirstOrDefault(x => x.UserInfoUserId == userList[i])?.FirstName ?? "Unknown";

                            finaldata.Add(eachuser);
                        }
                    }
                }
            }
            return finaldata;
        }
    }
}
