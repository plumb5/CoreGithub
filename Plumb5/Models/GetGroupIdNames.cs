using P5GenralDL;
using P5GenralML;
using System.Text;

namespace Plumb5.Models
{
    public class GetGroupIdNames
    {
        public string? SqlProvider;
        public GetGroupIdNames(string? sqlProvider)
        {
            SqlProvider = sqlProvider;
        }

        public async Task<string> GetGroupNames(int AdsId, int UserInfoUserId, string groupids)
        {
            StringBuilder groupidnames = new StringBuilder();

            if (groupids != null && groupids != "" && groupids.Length > 0)
            {
                using var GetGroups = DLGroups.GetDLGroups(AdsId, SqlProvider);
                Groups group = new Groups() { UserInfoUserId = UserInfoUserId };
                List<Groups> groupsList = await GetGroups.GetDetails(group, 0, 0, null);

                if (groupsList != null && groupsList.Count() > 0)
                {
                    if (groupids.IndexOf(",") <= 0)
                    {
                        for (int i = 0; i < groupsList.Count(); i++)
                        {
                            if (Convert.ToInt32(groupids) == groupsList[i].Id)
                                groupidnames.Append(groupids.ToString() + "-" + groupsList[i].Name.ToString());
                        }
                    }
                    else if (groupids.IndexOf(",") > 0)
                    {
                        string[] conditionPageParameters = groupids.Split(',');

                        for (int i = 0; i < conditionPageParameters.Length; i++)
                        {
                            for (int j = 0; j < groupsList.Count(); j++)
                            {
                                if (Convert.ToInt32(conditionPageParameters[i]) == groupsList[j].Id)
                                    groupidnames.Append(conditionPageParameters[i].ToString() + "-" + groupsList[j].Name.ToString() + "@#");
                            }
                        }
                    }
                }
            }
            return groupidnames.ToString();
        }
    }
}
