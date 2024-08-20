using P5GenralDL;
using P5GenralML;
using System.Data;

namespace Plumb5.Areas.Prospect.Models
{
    public class LmsStageLeads
    {
        public string Stage { get; set; }
        public string IdentificationColor { get; set; }
        public int UserInfoUserId { get; set; }
        public int NumberOfLead { get; set; }
    }
    public class LmsStageEachUserDetails
    {
        public string UserName { get; set; }
        public List<LmsStageLeads> userwisestageleads { get; set; }

        int AdsId;
        string Sqlprovider = "";
        public LmsStageEachUserDetails(int adsId, string sqlprovider = null)
        {
            AdsId = adsId;
            Sqlprovider = sqlprovider;
        }

        public LmsStageEachUserDetails()
        {
        }

        public async Task<List<LmsStageEachUserDetails>> GetLmsStageEachUserDetails(string UserIdList, string UserGroupIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, List<MLUserHierarchy> userHierarchy, int OrderBy)
        {
            List<LmsStageEachUserDetails> finaldata = new List<LmsStageEachUserDetails>();
            DataSet data = new DataSet();

            using (var objBL = DLLmsDashboard.GetDLLmsDashboard(AdsId, Sqlprovider))
                data = await objBL.GetAllStageWiseLeadsCount(UserIdList, UserGroupIdList, FromDateTime, ToDateTime, OrderBy);

            if (data != null && data.Tables.Count > 0)
            {
                List<LmsStageLeads> eachdetails = data.Tables[0].AsEnumerable().Select(r => new LmsStageLeads
                {
                    Stage = r.Field<string>("Stage"),
                    IdentificationColor = r.Field<string>("IdentificationColor"),
                    UserInfoUserId = r.Field<int>("UserInfoUserId"),
                    NumberOfLead = r.Field<int>("NumberOfLead")
                }).ToList();

                if (eachdetails != null && eachdetails.Count() > 0)
                {
                    List<int> userList = eachdetails.Select(x => x.UserInfoUserId).Distinct().ToList();

                    if (userList != null && userList.Count() > 0)
                    {
                        for (int i = 0; i < userList.Count(); i++)
                        {
                            List<LmsStageLeads> eachstagedetails = new List<LmsStageLeads>();
                            LmsStageEachUserDetails eachuser = new LmsStageEachUserDetails();
                            List<LmsStageLeads> finaleachdetails = new List<LmsStageLeads>();

                            eachstagedetails = eachdetails.Where(x => x.UserInfoUserId == userList[i]).Select(x => x).ToList();

                            eachuser.userwisestageleads = eachstagedetails;
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
