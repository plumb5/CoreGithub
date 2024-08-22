using System.Data;

namespace Plumb5.Areas.CustomEvents.Models
{
    public class ManageCustomEventDataType
    {
        #region Members
        public string FieldName { get; set; }
        public bool? PredefinedField { get; set; }
        public string ExistingDataType { get; set; }
        public string UploadedDataType { get; set; }
        #endregion Members

        readonly int AdsId = 0;

        public ManageCustomEventDataType(int adsid)
        {
            AdsId = adsid;
        }

        public ManageCustomEventDataType()
        {
        }

        public List<ManageCustomEventDataType> GetEventDataTypeByFile(DataSet originalDataSet, List<ManageCustomEventFields> customeventfieldslist, bool RepeatOrFreshEvent)
        {
            List<ManageCustomEventDataType> eventdatatypeslist = new List<ManageCustomEventDataType>();

            for (int i = 0; i < originalDataSet.Tables[0].Columns.Count; i++)
            {
                string columnname = originalDataSet.Tables[0].Columns[i].ColumnName;

                if (columnname.ToLower() != "eventname" && columnname.ToLower() != "emailid" && columnname.ToLower() != "email-id" && columnname.ToLower() != "phonenumber" && columnname.ToLower() != "eventtime")
                {
                    if (originalDataSet.Tables[0].Rows.Count == 1)
                    {
                        ManageCustomEventDataType eachsubdatatype = new ManageCustomEventDataType();
                        eachsubdatatype.FieldName = columnname;
                        eachsubdatatype.PredefinedField = false;
                        eachsubdatatype.ExistingDataType = RepeatOrFreshEvent == true ? "" : RepeatOrFreshEvent == false ? customeventfieldslist.Where(x => x.P5ColumnName.ToLower() == columnname.ToLower()).FirstOrDefault().FieldMappingType.ToString() : "";

                        if (!String.IsNullOrEmpty(originalDataSet.Tables[0].Rows[0][columnname].ToString()))
                        {
                            Double intconditionValue = 0;
                            bool conditionValueIsInteger = double.TryParse(originalDataSet.Tables[0].Rows[0][columnname].ToString(), out intconditionValue);

                            bool boolconditionValue = false;
                            bool conditionValueIsbool = Boolean.TryParse(originalDataSet.Tables[0].Rows[0][columnname].ToString(), out boolconditionValue);

                            if (conditionValueIsbool)
                                eachsubdatatype.UploadedDataType = "boolean";
                            else if (conditionValueIsInteger)
                                eachsubdatatype.UploadedDataType = "number";
                            else
                                eachsubdatatype.UploadedDataType = "string";
                        }
                        eventdatatypeslist.Add(eachsubdatatype);
                    }
                    else if (originalDataSet.Tables[0].Rows.Count == 2)
                    {
                        string uploaddatavalue1 = "";
                        string uploaddatavalue2 = "";
                        ManageCustomEventDataType eachsubdatatype = new ManageCustomEventDataType();
                        eachsubdatatype.FieldName = columnname;
                        eachsubdatatype.PredefinedField = false;
                        eachsubdatatype.ExistingDataType = RepeatOrFreshEvent == true ? "" : RepeatOrFreshEvent == false ? customeventfieldslist.Where(x => x.P5ColumnName.ToLower() == columnname.ToLower()).FirstOrDefault().FieldMappingType.ToString() : "";

                        if (!String.IsNullOrEmpty(originalDataSet.Tables[0].Rows[0][columnname].ToString()))
                        {
                            Double intconditionValue = 0;
                            bool conditionValueIsInteger = double.TryParse(originalDataSet.Tables[0].Rows[0][columnname].ToString(), out intconditionValue);

                            bool boolconditionValue = false;
                            bool conditionValueIsbool = Boolean.TryParse(originalDataSet.Tables[0].Rows[0][columnname].ToString(), out boolconditionValue);

                            if (conditionValueIsbool)
                                uploaddatavalue1 = "boolean";
                            else if (conditionValueIsInteger)
                                uploaddatavalue1 = "number";
                            else
                                uploaddatavalue1 = "string";
                        }

                        if (!String.IsNullOrEmpty(originalDataSet.Tables[0].Rows[1][columnname].ToString()))
                        {
                            Double intconditionValue = 0;
                            bool conditionValueIsInteger = double.TryParse(originalDataSet.Tables[0].Rows[1][columnname].ToString(), out intconditionValue);

                            bool boolconditionValue = false;
                            bool conditionValueIsbool = Boolean.TryParse(originalDataSet.Tables[0].Rows[1][columnname].ToString(), out boolconditionValue);

                            if (conditionValueIsbool)
                                uploaddatavalue2 = "boolean";
                            else if (conditionValueIsInteger)
                                uploaddatavalue2 = "number";
                            else
                                uploaddatavalue2 = "string";
                        }

                        if (String.Compare(uploaddatavalue1, uploaddatavalue2) == 0)
                            eachsubdatatype.UploadedDataType = uploaddatavalue1;
                        else
                            eachsubdatatype.UploadedDataType = "NA";

                        eventdatatypeslist.Add(eachsubdatatype);
                    }
                    else if (originalDataSet.Tables[0].Rows.Count >= 3)
                    {
                        string uploaddatavalue1 = "";
                        string uploaddatavalue2 = "";
                        string uploaddatavalue3 = "";
                        ManageCustomEventDataType eachsubdatatype = new ManageCustomEventDataType();
                        eachsubdatatype.FieldName = columnname;
                        eachsubdatatype.PredefinedField = false;
                        eachsubdatatype.ExistingDataType = RepeatOrFreshEvent == true ? "" : RepeatOrFreshEvent == false ? customeventfieldslist.Where(x => x.P5ColumnName.ToLower() == columnname.ToLower()).FirstOrDefault().FieldMappingType.ToString() : "";

                        if (!String.IsNullOrEmpty(originalDataSet.Tables[0].Rows[0][columnname].ToString()))
                        {
                            Double intconditionValue = 0;
                            bool conditionValueIsInteger = double.TryParse(originalDataSet.Tables[0].Rows[0][columnname].ToString(), out intconditionValue);

                            bool boolconditionValue = false;
                            bool conditionValueIsbool = Boolean.TryParse(originalDataSet.Tables[0].Rows[0][columnname].ToString(), out boolconditionValue);

                            if (conditionValueIsbool)
                                uploaddatavalue1 = "boolean";
                            else if (conditionValueIsInteger)
                                uploaddatavalue1 = "number";
                            else
                                uploaddatavalue1 = "string";
                        }

                        if (!String.IsNullOrEmpty(originalDataSet.Tables[0].Rows[1][columnname].ToString()))
                        {
                            Double intconditionValue = 0;
                            bool conditionValueIsInteger = double.TryParse(originalDataSet.Tables[0].Rows[1][columnname].ToString(), out intconditionValue);

                            bool boolconditionValue = false;
                            bool conditionValueIsbool = Boolean.TryParse(originalDataSet.Tables[0].Rows[1][columnname].ToString(), out boolconditionValue);

                            if (conditionValueIsbool)
                                uploaddatavalue2 = "boolean";
                            else if (conditionValueIsInteger)
                                uploaddatavalue2 = "number";
                            else
                                uploaddatavalue2 = "string";
                        }

                        if (!String.IsNullOrEmpty(originalDataSet.Tables[0].Rows[2][columnname].ToString()))
                        {
                            Double intconditionValue = 0;
                            bool conditionValueIsInteger = double.TryParse(originalDataSet.Tables[0].Rows[2][columnname].ToString(), out intconditionValue);

                            bool boolconditionValue = false;
                            bool conditionValueIsbool = Boolean.TryParse(originalDataSet.Tables[0].Rows[2][columnname].ToString(), out boolconditionValue);

                            if (conditionValueIsbool)
                                uploaddatavalue3 = "boolean";
                            else if (conditionValueIsInteger)
                                uploaddatavalue3 = "number";
                            else
                                uploaddatavalue3 = "string";
                        }

                        if (String.Compare(uploaddatavalue1, uploaddatavalue2) == 0 && String.Compare(uploaddatavalue2, uploaddatavalue3) == 0)
                            eachsubdatatype.UploadedDataType = uploaddatavalue1;
                        else
                            eachsubdatatype.UploadedDataType = "NA";

                        eventdatatypeslist.Add(eachsubdatatype);
                    }
                }
                else
                {
                    ManageCustomEventDataType eachsubdatatype = new ManageCustomEventDataType();
                    eachsubdatatype.FieldName = columnname;
                    eachsubdatatype.PredefinedField = true;
                    eachsubdatatype.ExistingDataType = "string";
                    eachsubdatatype.UploadedDataType = "string";
                    eventdatatypeslist.Add(eachsubdatatype);
                }
            }
            return eventdatatypeslist;
        }
    }
}
