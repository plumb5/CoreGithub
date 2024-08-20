using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public static class LmsUserInfoFieldReplacement
    {
        public  static async Task<StringBuilder> LmsUserInfoFieldsReplacement(this StringBuilder Bodydata, int accountId, int lmsGroupMemberId, int contactId,string SqlVendor)
        {
            if (lmsGroupMemberId == 0 && !(Bodydata.ToString().Contains("[{*")) && !(Bodydata.ToString().Contains("*}]")))
                return Bodydata;

            LmsGroupMembers lmsDetails = null;
            using (var objDL =   DLLmsGroupMembers.GetDLLmsGroupMembers(accountId, SqlVendor))
                lmsDetails = await objDL.GetLmsDetails(lmsGroupMemberId, contactId);

            if (lmsDetails is null)
                return Bodydata;

            if (Bodydata.ToString().ToLower().Contains("[{*lmscustomfield"))
                ReplaceLmsDetails(Bodydata, lmsDetails);

            if (lmsDetails.UserInfoUserId > 0 && Bodydata.ToString().ToLower().Contains("[{*userinfo^"))
            {
                using (var objDL = DLUserInfo.GetDLUserInfo(SqlVendor))
                {
                    var userDetailsContact = await objDL.GetDetail(lmsDetails.UserInfoUserId);
                    if (userDetailsContact != null)
                        ReplaceUserInfoDetails(Bodydata, userDetailsContact);
                }
            }
            return Bodydata;
        }

        public static void ReplaceLmsDetails(this StringBuilder Body, LmsGroupMembers contactDetails)
        {
            StringBuilder data = new StringBuilder();

            var contactMemberList = contactDetails.GetType().GetProperties().Select(x => new { Name = x.Name }).ToList();

            for (int i = 0; i < contactMemberList.Count && (Body.ToString().Contains("<!--") || Body.ToString().Contains("[{*")); i++)
            {
                var Name = contactMemberList[i].Name;

                if ((Body.ToString().IndexOf("<!--" + Name + "-->", StringComparison.InvariantCultureIgnoreCase) > -1) || (Body.ToString().IndexOf("[{*" + Name + "*}]", StringComparison.InvariantCultureIgnoreCase) > -1))
                {
                    var OriginalValue = contactDetails.GetType().GetProperty(Name, BindingFlags.SetProperty | BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(contactDetails);
                    string ReplacingValue = (OriginalValue == null || string.IsNullOrEmpty(OriginalValue.ToString())) ? "" : OriginalValue.ToString();

                    if (!string.IsNullOrEmpty(ReplacingValue))
                    {
                        data.Clear().Append(Regex.Replace(Body.ToString(), "<!--" + Name + "-->", ReplacingValue, RegexOptions.IgnoreCase));
                        Body.Clear().Append(data);

                        data.Clear();
                        data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*" + Name + @"\*\}\]", ReplacingValue, RegexOptions.IgnoreCase));
                        Body.Clear().Append(data);
                    }

                }
            }
            data = null;
        }

        public static void ReplaceUserInfoDetails(StringBuilder Body, UserInfo userInfoDetails)
        {
            StringBuilder data = new StringBuilder();

            var userinfoList = userInfoDetails.GetType().GetProperties().Select(x => new { Name = x.Name }).ToList();

            foreach (Match m in Regex.Matches(Body.ToString(), "\\[{.*?}\\]", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace))
            {
                if (m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('^').Length == 2)
                {
                    Body.Replace(m.Value, "[{*" + m.Value.ToString().Replace("[{*", "").Replace("*}]", "").Split('~')[0].Replace("^", "_") + "*}]");
                }
            }

            for (int i = 0; i < userinfoList.Count && (Body.ToString().Contains("<!--") || Body.ToString().Contains("[{*")); i++)
            {
                var Name = userinfoList[i].Name;

                if ((Body.ToString().IndexOf("<!--UserInfo_" + Name + "-->", StringComparison.InvariantCultureIgnoreCase) > -1) || (Body.ToString().IndexOf("[{*UserInfo_" + Name + "*}]", StringComparison.InvariantCultureIgnoreCase) > -1))
                {
                    var OriginalValue = userInfoDetails.GetType().GetProperty(Name, BindingFlags.SetProperty | BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(userInfoDetails);
                    string ReplacingValue = (OriginalValue == null || string.IsNullOrEmpty(OriginalValue.ToString())) ? "" : OriginalValue.ToString();

                    if (!string.IsNullOrEmpty(ReplacingValue))
                    {
                        data.Clear().Append(Regex.Replace(Body.ToString(), "<!--UserInfo^" + Name + "-->", ReplacingValue, RegexOptions.IgnoreCase));
                        Body.Clear().Append(data);

                        data.Clear();
                        data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*UserInfo_" + Name + @"\*\}\]", ReplacingValue, RegexOptions.IgnoreCase));
                        Body.Clear().Append(data);

                        data.Clear();
                        data.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*UserInfo_" + Name.ToLower() + @"\*\}\]", ReplacingValue, RegexOptions.IgnoreCase));
                        Body.Clear().Append(data);
                    }
                }
            }
            data = null;
        }
    }
}
