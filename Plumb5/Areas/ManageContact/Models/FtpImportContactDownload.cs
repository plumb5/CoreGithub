using P5GenralDL;
using P5GenralML;
using Plumb5GenralFunction;
using System.Data;

namespace Plumb5.Areas.ManageContact.Models
{
    public class FtpImportContactDownload
    {
        private readonly int AdsId;
        private readonly string Protocol;
        private readonly string SQLProvider;
        public FtpImportContactDownload(int adsId, string protocol = null, string sqlprovider = null)
        {
            AdsId = adsId;
            Protocol = protocol;
            SQLProvider = sqlprovider;
        }
        public Tuple<bool, string, List<string>> DownloadAndMoveToTempFiles(int connectionid, string path, string[] files)
        {
            bool result = true;
            string message = "";
            List<string> filedSaved = new List<string>();
            FtpImportSettings ftpImportSettings = null;
            try
            {
                using (var objBL = DLFtpImportSettings.GetDLFtpImportSettings(AdsId, SQLProvider))
                {
                    ftpImportSettings = objBL.GetFtpImportSettingsDetails(connectionid);
                }

                if (ftpImportSettings != null && ftpImportSettings.Id > 0)
                {
                    FtpFileTransfer ftp = new FtpFileTransfer(ftpImportSettings.ServerIP, ftpImportSettings.UserName, ftpImportSettings.Password);

                    string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString() + "\\TempFiles\\ContactImport";
                    if (!(Directory.Exists(MainPath)))
                    {
                        Directory.CreateDirectory(MainPath);
                    }

                    foreach (var file in files)
                    {
                        try
                        {
                            string fileName = "_P5Temp_ContactImport_" + AdsId + "_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + Path.GetExtension(file);
                            string SavedPath = (MainPath + "\\" + fileName);
                            if (Protocol.ToLower().Contains("sftp"))
                            {
                                ftp.DownloadFileWithSFTP($"{ftpImportSettings.FolderPath}/{path}/{file}", SavedPath);
                            }
                            else
                            {
                                ftp.DownloadFile($"{path}/{file}", SavedPath);
                            }

                            filedSaved.Add(SavedPath);
                        }
                        catch (Exception ex)
                        {
                            using (ErrorUpdation err = new ErrorUpdation("FtpImportContactDownload"))
                            {
                                err.AddError(ex.ToString(), "Ftp Download Error", DateTime.Now.ToString(), "DownloadAndMoveToTempFiles function", ex.StackTrace.ToString());
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result = false;
                message = ex.Message;
            }

            return Tuple.Create(result, message, filedSaved);
        }

        public List<ContactImportFileFieldMapping> MappingFTPFile(DataSet dataset, List<ContactPropertyList> ContactPropertyList)
        {
            List<ContactImportFileFieldMapping> mappingList = new List<ContactImportFileFieldMapping>();
            try
            {
                for (int i = 0; i < dataset.Tables[0].Columns.Count; i++)
                {
                    ContactImportFileFieldMapping contactImportFileFieldMapping = IsMatched(dataset.Tables[0].Columns[i].ToString(), i, ContactPropertyList);

                    if (contactImportFileFieldMapping != null)
                    {
                        mappingList.Add(contactImportFileFieldMapping);
                    }
                }
            }
            catch (Exception ex)
            {
                mappingList = null;

                using (ErrorUpdation err = new ErrorUpdation("FtpImportContactDownload"))
                {
                    err.AddError(ex.ToString(), "Ftp Download Error", DateTime.Now.ToString(), "MappingFTPFile function", ex.StackTrace.ToString());
                }
            }

            return mappingList;
        }

        private ContactImportFileFieldMapping IsMatched(string FiledName, int FiledIndex, List<ContactPropertyList> ContactPropertyList)
        {
            ContactImportFileFieldMapping contactImportFileFieldMapping = new ContactImportFileFieldMapping();
            try
            {
                for (int i = 0; i < ContactPropertyList.Count; i++)
                {
                    if (FiledName == ContactPropertyList[i].FrontEndName)
                    {
                        if (FiledName == ContactPropertyList[i].P5ColumnName)
                            contactImportFileFieldMapping.IsNameChanged = false;
                        else
                            contactImportFileFieldMapping.IsNameChanged = true;

                        contactImportFileFieldMapping.P5ColumnName = ContactPropertyList[i].P5ColumnName;
                        contactImportFileFieldMapping.FrontEndName = ContactPropertyList[i].FrontEndName;
                        contactImportFileFieldMapping.FileFieldName = FiledName;
                        contactImportFileFieldMapping.IsMapped = true;
                        contactImportFileFieldMapping.FileFieldIndex = FiledIndex;

                        break;
                    }
                }


                if (contactImportFileFieldMapping.IsMapped == null || contactImportFileFieldMapping.IsMapped == false)
                {
                    contactImportFileFieldMapping.P5ColumnName = ContactPropertyList.Where(x => x.P5ColumnName == FiledName).ToList()[0].P5ColumnName;
                    contactImportFileFieldMapping.FrontEndName = ContactPropertyList.Where(x => x.FrontEndName == FiledName).ToList()[0].FrontEndName;
                    contactImportFileFieldMapping.FileFieldName = FiledName;
                    contactImportFileFieldMapping.IsNameChanged = null;
                    contactImportFileFieldMapping.IsMapped = false;
                }

            }
            catch (Exception ex)
            {
                contactImportFileFieldMapping = null;
                using (ErrorUpdation err = new ErrorUpdation("FtpImportContactDownload"))
                {
                    err.AddError(ex.ToString(), "Ftp Download Error", DateTime.Now.ToString(), "contactImportFileFieldMapping function", ex.StackTrace.ToString());
                }
            }

            return contactImportFileFieldMapping;
        }
    }
}
