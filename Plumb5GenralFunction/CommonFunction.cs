using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class CommonFunction
    {
        public DataSet Decode(DataSet data)
        {
            DataSet ds = data.Copy();

            try
            {
                for (int T = 0; T < ds.Tables.Count; T++)
                {
                    if (ds != null && ds.Tables.Count > 0 && ds.Tables[T].Columns.Count > 0)
                    {
                        for (int op = 0; op < ds.Tables[T].Rows.Count; op++)
                        {
                            for (int i = 0; i < ds.Tables[T].Columns.Count; i++)
                            {
                                if (ds.Tables[T].Rows[op][i].ToString() != null && !string.IsNullOrEmpty(ds.Tables[T].Rows[op][i].ToString()))
                                {
                                    System.Type type = ds.Tables[T].Rows[op][i].GetType();
                                    if (type == typeof(string) && !String.IsNullOrEmpty(ds.Tables[T].Rows[op][i].ToString()))
                                    {
                                        ds.Tables[T].Rows[op][i] = System.Web.HttpUtility.HtmlDecode(ds.Tables[T].Rows[op][i].ToString());
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch
            {
                return data;
            }
            return ds;
        }
        public static bool IsVulnerableContentForSql(string inputContent)
        {
            try
            {
                if (inputContent != null && !string.IsNullOrEmpty(inputContent))
                {
                    string[] VulnerableContentArray = { "select", "delete", "truncate", "insert", "drop", "union", "--" };
                    if (VulnerableContentArray.Any(s => inputContent.ToLower().Contains(s)))
                    {
                        return true;
                    }
                }
                return false;
            }
            catch
            {
                return false;
            }
        }
        public static string GenerateOtp()
        {
            string otp = String.Empty;
            try
            {
                string _numbers = "0123456789";
                Random random = new Random();
                StringBuilder builder = new StringBuilder(6);
                for (var i = 0; i < 6; i++)
                {
                    builder.Append(_numbers[random.Next(0, _numbers.Length)]);
                }
                otp = builder.ToString();
            }
            catch { }
            return otp;
        }
    }
}
