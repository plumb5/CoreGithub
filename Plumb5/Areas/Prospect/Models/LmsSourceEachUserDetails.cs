using P5GenralDL;
using P5GenralML;
using System.Data;

namespace Plumb5.Areas.Prospect.Models
{
    public class LmsSourceLeads
    {
        public int UserInfoUserId { get; set; }
        public int LmsGroupId { get; set; }
        public int LeadCount { get; set; }
    }

    public class LmsSourceEachUserDetails
    {
        public string UserName { get; set; }
        public List<LmsSourceLeads> userwisesourceleads { get; set; }

        int AdsId;
        string Sqlprovider = "";
        public LmsSourceEachUserDetails(int adsId, string sqlprovider = null)
        {
            AdsId = adsId;
            Sqlprovider = sqlprovider;
        }

        public LmsSourceEachUserDetails()
        {
        }

        public async Task<List<LmsSourceEachUserDetails>> GetLmsSourceEachUserDetails(string UserIdList, string UserGroupIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, List<MLUserHierarchy> userHierarchy, int OrderBy)
        {
            List<LmsSourceEachUserDetails> finaldata = new List<LmsSourceEachUserDetails>();
            DataSet data = new DataSet();

            using (var objBL = DLLmsDashboard.GetDLLmsDashboard(AdsId, Sqlprovider))
                data = await objBL.GetAllSourceWiseLeadsCount(UserIdList, UserGroupIdList, FromDateTime, ToDateTime, OrderBy);

            if (data != null && data.Tables.Count > 0)
            {
                List<LmsSourceLeads> eachdetails = data.Tables[0].AsEnumerable().Select(r => new LmsSourceLeads
                {
                    LeadCount = r.Field<int>("LeadCount"),
                    UserInfoUserId = r.Field<int>("UserInfoUserId"),
                    LmsGroupId = r.Field<int>("LmsGroupId")
                }).ToList();

                if (eachdetails != null && eachdetails.Count() > 0)
                {
                    List<int> userList = eachdetails.Select(x => x.UserInfoUserId).Distinct().ToList();

                    if (userList != null && userList.Count() > 0)
                    {
                        for (int i = 0; i < userList.Count(); i++)
                        {
                            List<LmsSourceLeads> eachsourcedetails = new List<LmsSourceLeads>();
                            LmsSourceEachUserDetails eachuser = new LmsSourceEachUserDetails();

                            eachsourcedetails = eachdetails.Where(x => x.UserInfoUserId == userList[i]).Select(x => x).ToList();

                            eachuser.userwisesourceleads = eachsourcedetails;
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
