using System.Data;
using System.Text.RegularExpressions;

namespace Plumb5.Areas.Analytics.Models
{
    public class MaskEmailPhoneNumber
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="ds"></param>
        /// <returns></returns>
        public static DataSet MaskEmailId(DataSet ds)
        {
            if (ds == null || ds.Tables == null || ds.Tables.Count == 0)
                return ds;
            var len = ds.Tables.Count;
            DataTable dt = ds.Tables[0];
            string result = "", contact = "";
            for (int i = 0; i <= dt.Rows.Count - 1; i++)
            {
                contact = dt.Rows[i]["Email"].ToString();
                try
                {
                    if (dt.Rows[i]["ContactInformation"] != null && dt.Rows[i]["ContactInformation"].ToString() != "")
                    {
                        var contactInfo = dt.Rows[i]["ContactInformation"].ToString();
                        var res = Regex.Replace(contactInfo, @"(?<=[\w]{2})[\w-\._\+%]*(?=[\w]{0}@)", m => new string('*', m.Length)) + "";
                        dt.Rows[i]["ContactInformation"] = dt.Rows[i]["ContactInformation"].ToString().Replace(dt.Rows[i]["ContactInformation"].ToString(), res);
                    }
                }
                catch
                { }
                try
                {
                    if (dt.Rows[i]["MachineIdLink"] != null && dt.Rows[i]["MachineIdLink"].ToString() != "")
                    {
                        var machineIdLink = dt.Rows[i]["MachineIdLink"].ToString();
                        var res1 = Regex.Replace(machineIdLink, @"(?<=[\w]{2})[\w-\._\+%]*(?=[\w]{0}@)", m => new string('*', m.Length)) + "";
                        dt.Rows[i]["MachineIdLink"] = dt.Rows[i]["MachineIdLink"].ToString().Replace(dt.Rows[i]["MachineIdLink"].ToString(), res1);
                    }
                }
                catch
                { }
                if (contact != "")
                {
                    var Email = contact.Split('~');
                    if (Email.Length > 0 && Email[0] != "")
                        result = Regex.Replace(Email[0], @"(?<=[\w]{2})[\w-\._\+%]*(?=[\w]{0}@)", m => new string('*', m.Length)) + "";
                    //else
                    //    result = Email[0];
                    if (Email.Length > 1 && Email[1] != "")
                        result += "~" + Regex.Replace(Email[1], @"(?<=[\w]{2})[\w-\._\+%]*(?=[\w]{0}@)", m => new string('*', m.Length)) + "";
                    if (Email.Length > 2 && Email[2] != "")
                        result += "~" + Regex.Replace(Email[2], @".(?=.{4,}$)", m => new string('*', m.Length)) + "";
                    dt.Rows[i]["Email"] = dt.Rows[i]["Email"].ToString().Replace(dt.Rows[i]["Email"].ToString(), result);
                }
            }
            var dsEmailReturn = new DataSet();
            var table1 = new DataTable();
            var table2 = new DataTable();
            var table3 = new DataTable();
            dsEmailReturn.Tables.Add(dt.Copy());

            if (len > 1)
            {
                var dt1 = ds.Tables[1];
                dsEmailReturn.Tables.Add(dt1.Copy());
            }
            if (len > 2)
            {
                var dt2 = ds.Tables[2];
                dsEmailReturn.Tables.Add(dt2.Copy());
            }
            if (len > 3)
            {
                var dt3 = ds.Tables[3];
                dsEmailReturn.Tables.Add(dt3.Copy());
            }
            return dsEmailReturn;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="ds"></param>
        /// <returns></returns>
        public static DataSet UCPMaskEmailId(DataSet ds)
        {
            if (ds == null || ds.Tables == null || ds.Tables.Count == 0)
                return ds;
            var len = ds.Tables.Count;
            DataTable dt = ds.Tables[1];
            DataTable dt2 = ds.Tables[2];
            string email = "", phonenumber = "";
            for (int i = 0; i <= dt.Rows.Count - 1; i++)
            {
                email = dt.Rows[i]["EmailId"].ToString();
                phonenumber = dt.Rows[i]["PhoneNumber"].ToString();
                if (email != "")
                {
                    email = Regex.Replace(email, @"(?<=[\w]{2})[\w-\._\+%]*(?=[\w]{0}@)", m => new string('*', m.Length)) + "";
                    dt.Rows[i]["EmailId"] = dt.Rows[i]["EmailId"].ToString().Replace(dt.Rows[i]["EmailId"].ToString(), email);
                }
                if (phonenumber != "")
                {
                    phonenumber = Regex.Replace(phonenumber, @".(?=.{4,}$)", m => new string('*', m.Length)) + "";
                    dt.Rows[i]["PhoneNumber"] = dt.Rows[i]["PhoneNumber"].ToString().Replace(dt.Rows[i]["PhoneNumber"].ToString(), phonenumber);
                }
                //if (contact != "")
                //{
                //    var Email = contact.Split('~');
                //    if (Email.Length > 0 && Email[0] != "")
                //        result = Regex.Replace(Email[0], @"(?<=[\w]{2})[\w-\._\+%]*(?=[\w]{0}@)", m => new string('*', m.Length)) + "";
                //    if (Email.Length > 1 && Email[1] != "")
                //        result += "~" + Regex.Replace(Email[1], @"(?<=[\w]{2})[\w-\._\+%]*(?=[\w]{0}@)", m => new string('*', m.Length)) + "";
                //    if (Email.Length > 2 && Email[2] != "")
                //        result += "~" + Regex.Replace(Email[2], @".(?=.{4,}$)", m => new string('*', m.Length)) + "";
                //    dt.Rows[i]["EmailId"] = dt.Rows[i]["EmailId"].ToString().Replace(dt.Rows[i]["EmailId"].ToString(), result);
                //}
            }

            for (int i = 0; i <= dt2.Rows.Count - 1; i++)
            {
                email = dt2.Rows[i]["EmailId"].ToString();
                phonenumber = dt2.Rows[i]["PhoneNumber"].ToString();
                if (email != "")
                {
                    email = Regex.Replace(email, @"(?<=[\w]{2})[\w-\._\+%]*(?=[\w]{0}@)", m => new string('*', m.Length)) + "";
                    dt2.Rows[i]["EmailId"] = dt2.Rows[i]["EmailId"].ToString().Replace(dt2.Rows[i]["EmailId"].ToString(), email);
                }
                if (phonenumber != "")
                {
                    phonenumber = Regex.Replace(phonenumber, @".(?=.{4,}$)", m => new string('*', m.Length)) + "";
                    dt2.Rows[i]["PhoneNumber"] = dt2.Rows[i]["PhoneNumber"].ToString().Replace(dt2.Rows[i]["PhoneNumber"].ToString(), phonenumber);
                }
                //contact = dt2.Rows[i]["EmailId"].ToString();
                //if (contact != "")
                //{
                //    var Email = contact.Split('~');
                //    if (Email.Length > 0 && Email[0] != "")
                //        result = Regex.Replace(Email[0], @"(?<=[\w]{2})[\w-\._\+%]*(?=[\w]{0}@)", m => new string('*', m.Length)) + "";
                //    if (Email.Length > 1 && Email[1] != "")
                //        result += "~" + Regex.Replace(Email[1], @"(?<=[\w]{2})[\w-\._\+%]*(?=[\w]{0}@)", m => new string('*', m.Length)) + "";
                //    if (Email.Length > 2 && Email[2] != "")
                //        result += "~" + Regex.Replace(Email[2], @".(?=.{4,}$)", m => new string('*', m.Length)) + "";
                //    dt2.Rows[i]["EmailId"] = dt2.Rows[i]["EmailId"].ToString().Replace(dt2.Rows[i]["EmailId"].ToString(), result);
                //}
            }

            var dsEmailReturn = new DataSet();
            var table1 = new DataTable();
            var table2 = new DataTable();
            var table3 = new DataTable();
            //dsEmailReturn.Tables.Add(dt.Copy());

            if (len > 0)
                dsEmailReturn.Tables.Add(ds.Tables[0].Copy());

            if (len > 1)
                dsEmailReturn.Tables.Add(dt.Copy());

            if (len > 2)
                dsEmailReturn.Tables.Add(dt2.Copy());

            if (len > 3)
            {
                var dt3 = ds.Tables[3];
                dsEmailReturn.Tables.Add(dt3.Copy());
            }
            return dsEmailReturn;
        }
    }
}
