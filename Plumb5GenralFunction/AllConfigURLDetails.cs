using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Diagnostics;
using System.Reflection;

namespace Plumb5GenralFunction
{
    public static class AllConfigURLDetails
    {
        public static readonly ListDictionary KeyValueForConfig = new ListDictionary();

        public static async Task Get(string? SQLVendor)
        {
            string? CallingMethodName = "NA";
            string? CallingAssemblyName = "NA";
            try
            {
                StackTrace stackTrace = new StackTrace();
                CallingMethodName = stackTrace.GetFrame(1).GetMethod().Name;
                CallingAssemblyName = Assembly.GetCallingAssembly().FullName;
            }
            catch (Exception ex)
            {
                //using (ErrorUpdation objError = new ErrorUpdation("AllConfig"))
                //{
                //    objError.AddError(ex.Message.ToString(), "Getting extra info", DateTime.Now.ToString(), "Plumb5GenralFunction-AllConfigURLDetails-Get", ex.ToString());
                //}
            }

            try
            {
                StackTrace stackTrace = new StackTrace();
                CallingMethodName = stackTrace.GetFrame(1).GetMethod().Name;
                CallingAssemblyName = Assembly.GetCallingAssembly().FullName;

                List<AllConfigURL> AllConfigURL_List = null;

                using (var blAllConfigURLDetails = DLAllConfigURLDetails.GetDLAllConfigURLDetails(SQLVendor))
                {
                    AllConfigURL_List = await blAllConfigURLDetails.Get();
                }

                if (AllConfigURL_List != null && AllConfigURL_List.Count > 0)
                {
                    foreach (var item in AllConfigURL_List)
                    {
                        if (!string.IsNullOrEmpty(item.KeyName) && !KeyValueForConfig.Contains(item.KeyName.ToUpper().Trim()))
                            KeyValueForConfig.Add(item.KeyName.ToUpper().Trim(), item.KeyValue);
                    }
                }
            }
            catch (Exception ex)
            {
                // Helper.SendMailOnMajorError("Plumb5GenralFunction=>AllConfigURLDetails", "CallingMethod=>" + CallingMethodName + " From the Assembly=>" + CallingAssemblyName, Convert.ToString(ex.Message) + "<br />" + Convert.ToString(ex));

                //using (ErrorUpdation objError = new ErrorUpdation("AllConfig"))
                //{
                //    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "Plumb5GenralFunction-AllConfigURLDetails-Get", ex.ToString());
                //}
            }
        }
    }
}
