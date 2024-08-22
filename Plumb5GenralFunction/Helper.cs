using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using NPOI.HSSF.UserModel;
using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.AccessControl;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Ionic.Zip;
using Ionic.Zlib;
using System.Runtime.Caching;
using System.Net.Http;
using System.Reflection;
using System.Net;
using System.Web;
using System.ComponentModel;
using Microsoft.VisualBasic.FileIO;
using System.Data.OleDb;
using NPOI.XSSF.UserModel;
using System.Net.Mail;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ExcelDataReader;

namespace Plumb5GenralFunction
{
    public static class Helper
    {
        private const int SaltSize = 8;
        private const int HashSize = 20;
        private const int HashIteration = 10000;

        #region Password Encripted/Decripted variable declaration
        // This constant is used to determine the keysize of the encryption algorithm in bits.
        // We divide this by 8 within the code below to get the equivalent number of bytes.
        private static int Keysize = 256;
        // This constant determines the number of iterations for the password bytes generation function.
        private static int DerivationIterations = 1000;
        private static string passPhrase = @"v1e2t3o4e54s43en4i6i9n10erbium92f5g7h9j0k93123globe38muggy15r3a5yi6g62de6ls52adjun6t";
        #endregion

        public static string GetTimeZonePath(string webRootPath) => Path.Combine(webRootPath, @"js\TimeZone.json");

        public static bool IsValidEmailAddress(string emailId)
        {
            if (!String.IsNullOrEmpty(emailId))
            {
                try
                {
                    if (emailId.Contains(","))
                    {
                        return false;
                    }
                    var regex = new Regex(@"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
                    return regex.IsMatch(emailId.ToLower());
                }
                catch (FormatException)
                {
                    return false;
                }
            }
            return false;
        }

        public static bool VerifyHashedString(string inputString, string hashedString)
        {
            try
            {
                byte[] hashBytes = Convert.FromBase64String(hashedString);
                var salt = new byte[SaltSize];
                System.Array.Copy(hashBytes, 0, salt, 0, SaltSize);

                var pbkdf2 = new Rfc2898DeriveBytes(inputString, salt, HashIteration);
                byte[] hash = pbkdf2.GetBytes(HashSize);

                for (var i = 0; i < HashSize; i++)
                {
                    if (hashBytes[i + SaltSize] != hash[i])
                    {
                        return false;
                    }
                }
                return true;
            }
            catch
            {
                return false;
            }
        }

        public static async Task<string?> ReadJsonFile(string webRootPath)
        {
            try
            {
                string FileFullPath = GetTimeZonePath(webRootPath);

                if (File.Exists(FileFullPath))
                {
                    var ReadJson = await File.ReadAllTextAsync(FileFullPath);
                    return System.Web.HttpUtility.HtmlDecode(Convert.ToString(ReadJson));
                }
            }
            catch { }
            return null;
        }

        public static void SaveDataSetToCSV(DataSet exportData, string filePath, string delimeter = "|")
        {
            DataTable dttb = exportData.Tables[0];

            StringBuilder sb = new StringBuilder();

            string[] columnNames = dttb.Columns.Cast<DataColumn>().
                                              Select(column => column.ColumnName).
                                              ToArray();
            sb.AppendLine(string.Join(delimeter, columnNames));

            foreach (DataRow row in dttb.Rows)
            {
                string[] fields = row.ItemArray.Select(field => field.ToString()).
                                                ToArray();
                sb.AppendLine(string.Join(delimeter, fields));
            }

            File.WriteAllText(filePath, sb.ToString());
        }

        public static void SaveDataSetToExcel(DataSet dexportData, string sfilePath)
        {
            try
            {
                DataTable dttb = dexportData.Tables[0];
                HSSFWorkbook Workbook = new HSSFWorkbook();
                var sheet = Workbook.CreateSheet("P5Sheet1");

                var col = sheet.CreateRow(0);
                for (int i = 0; i < dttb.Columns.Count; i++)
                {
                    var cell = col.CreateCell(i);
                    cell.SetCellValue(dttb.Columns[i].ColumnName.ToString());
                }
                var currentNPOIRowIndex = 1;
                for (var rowIndex = 0; rowIndex < dttb.Rows.Count && rowIndex < 65500; rowIndex++)
                {
                    var row = sheet.CreateRow(currentNPOIRowIndex);
                    currentNPOIRowIndex++;
                    for (var colIndex = 0; colIndex < dttb.Columns.Count; colIndex++)
                    {
                        var cell = row.CreateCell(colIndex);
                        cell.SetCellValue(dttb.Rows[rowIndex][colIndex].ToString());
                    }
                }

                using (FileStream file = new FileStream(sfilePath, FileMode.Create))
                {
                    Workbook.Write(file);
                    file.Close();
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SaveDataSetToExcel"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "Plumb5GenralFunction->Helper.cs->SaveDataSetToExcel", ex.ToString());
                }
            }
        }

        public static string AverageTime(decimal Desc)
        {
            string total;
            try
            {
                decimal secnew = 0, seconds = 0, days = 0, hours = 0, minutes = 0;

                if (Desc != 0)
                {
                    seconds = Desc % 60;
                    days = Math.Floor(Desc / 60 / 60 / 24);
                    hours = Math.Floor(Desc / 60 / 60) % 24;
                    minutes = Math.Floor(Desc / 60) % 60;
                    secnew = Math.Round(seconds - (days * 86400) - (hours * 3600) - (minutes * 60));
                }

                if (days == 0 && hours == 0 && minutes == 0 && secnew == 0)
                {
                    total = "less than a second";
                }
                else
                {
                    string dayString = Math.Abs(days) < 10 ? "0" + Math.Abs(days) : Math.Abs(days).ToString();
                    string hourString = Math.Abs(hours) < 10 ? "0" + Math.Abs(hours) : Math.Abs(hours).ToString();
                    string minuteString = Math.Abs(minutes) < 10 ? "0" + Math.Abs(minutes) : Math.Abs(minutes).ToString();
                    string secondString = Math.Abs(seconds) < 10 ? "0" + Math.Abs(seconds) : Math.Abs(seconds).ToString();

                    total = dayString + "d " + hourString + "h " + minuteString + "m " + secondString + "s";
                }
            }
            catch
            {
                total = "";
            }
            return (total);
        }

        public static string GenerateUniqueNumber()
        {
            return DateTime.Now.ToString("yyyyMMddHHmmssFFF");
        }

        public static string Zip(string source, string destination)
        {
            string SavedFileName = string.Empty;
            try
            {
                using (ZipFile zip = new ZipFile
                {
                    CompressionLevel = CompressionLevel.BestCompression
                })
                {
                    var files = Directory.GetFiles(source, "*",
                        System.IO.SearchOption.AllDirectories).
                        Where(f => Path.GetExtension(f).
                            ToLowerInvariant() != ".zip").ToArray();

                    foreach (var f in files)
                    {
                        zip.AddFile(f, GetCleanFolderName(source, f));
                    }

                    var destinationFilename = destination;

                    if (Directory.Exists(destination) && !destination.EndsWith(".zip"))
                    {
                        SavedFileName = $"DownloadedMailTemplate-{DateTime.Now:yyyyMMddHHmmssffffff}.zip";
                        destinationFilename += $"\\{SavedFileName}";
                    }

                    zip.Save(destinationFilename);
                }
            }
            catch (Exception ex)
            {
                SavedFileName = string.Empty;
                ErrorUpdation.AddErrorLog("DownloadZipTemplate", JsonConvert.SerializeObject(new { ErrorMessage = ex.Message, Source = source, Destination = destination }), "Download a Template Issue", DateTime.Now, "Helper-->Zip method", ex.StackTrace);
            }
            return SavedFileName;
        }

        private static string GetCleanFolderName(string source, string filepath)
        {
            if (string.IsNullOrWhiteSpace(filepath))
            {
                return string.Empty;
            }

            var result = filepath.Substring(source.Length);

            if (result.StartsWith("\\"))
            {
                result = result.Substring(1);
            }

            result = result.Substring(0, result.Length - new FileInfo(filepath).Name.Length);

            return result;
        }

        public static async Task<string> GetAccountTimeZoneFromCachedMemory(int AdsId, string provider)
        {
            string TimeZone = string.Empty;
            try
            {
                string CacheKey = $"CachedTimeZone_{AdsId}";
                ObjectCache cache = System.Runtime.Caching.MemoryCache.Default;
                if (cache.Contains(CacheKey))
                    TimeZone = cache.Get(CacheKey).ToString();

                if (String.IsNullOrEmpty(TimeZone))
                {
                    AccountTimeZone accounttimezoneDetails = new AccountTimeZone();
                    using (var objDLAccountTimeZone = DLAccountTimeZone.GetDLAccountTimeZone(AdsId, provider))
                        accounttimezoneDetails = await objDLAccountTimeZone.GET();

                    if (accounttimezoneDetails != null && !String.IsNullOrEmpty(accounttimezoneDetails.TimeZone))
                        TimeZone = accounttimezoneDetails.TimeZone;
                    else
                        TimeZone = "India Standard Time";

                    // Store data in the cache    
                    CacheItemPolicy cacheItemPolicy = new CacheItemPolicy();
                    cacheItemPolicy.AbsoluteExpiration = DateTime.Now.AddHours(1.0);
                    cache.Add(CacheKey, TimeZone, cacheItemPolicy);
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("GetAccountTimeZoneFromCachedMemory"))
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "GetAccountTimeZoneFromCachedMemory", ex.ToString());
            }

            return TimeZone;
        }

        public static Nullable<DateTime> ConvertFromUTCToLocalTimeZone(string TimeZone, DateTime utcdatetime)
        {
            DateTime? dateTime = null;
            try
            {
                if (!String.IsNullOrEmpty(TimeZone) && utcdatetime != null)
                {
                    var inTimeZone = TimeZoneInfo.FindSystemTimeZoneById(TimeZone);
                    TimeSpan utcOffset = inTimeZone.GetUtcOffset(utcdatetime);
                    dateTime = new DateTime(utcdatetime.Ticks + utcOffset.Ticks, DateTimeKind.Local);
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("ConvertFromUTCToLocalTimeZone"))
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "ConvertFromUTCToLocalTimeZone", ex.InnerException.ToString());
            }
            return dateTime;
        }

        public static string GetIpAddress(HttpContext context)
        {
            string? ipAddress = context.Request.Headers["X-Forwarded-For"];

            if (string.IsNullOrEmpty(ipAddress))
            {
                ipAddress = context.Connection.RemoteIpAddress?.ToString();
            }

            // If we got an IPv6 address, we need to check if it's an IPv4 mapped to IPv6
            if (!string.IsNullOrEmpty(ipAddress) && ipAddress.Contains(":"))
            {
                // If it's an IPv4 mapped to IPv6, convert it to IPv4
                if (IPAddress.TryParse(ipAddress, out IPAddress address) &&
                    address.IsIPv4MappedToIPv6)
                {
                    ipAddress = address.MapToIPv4().ToString();
                }
            }

            return ipAddress ?? "Unknown";
        }

        public static String GetIP()
        {
            String ip = "";// HttpContext.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            if (string.IsNullOrEmpty(ip))
            {
                ip = "";//HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
            }

            return ip;
        }

        public static async Task SaveWebLogger(WebLogger webLogger, string dbType)
        {
            using (var objDL = DLWebLogger.GetDLWebLogger(dbType))
            {
                await objDL.SaveLog(webLogger);
            }
        }

        public static byte[] ConvertHtmlStringToBytesFromPhysical(string FileFullPath = null, string HtmlContent = null)
        {
            byte[] byteArrayValue = null;
            try
            {
                StringBuilder MainContentOftheMail = new StringBuilder();
                if (!String.IsNullOrEmpty(FileFullPath))
                {
                    if (File.Exists(FileFullPath))
                    {
                        using (StreamReader rd = File.OpenText(FileFullPath))
                        {
                            MainContentOftheMail.Append(rd.ReadToEnd());
                            rd.Close();

                            byte[] byteArray = Encoding.UTF8.GetBytes(MainContentOftheMail.ToString());
                            MemoryStream stream = new MemoryStream(byteArray);
                            using (BinaryReader br = new BinaryReader(stream))
                            {
                                byteArrayValue = br.ReadBytes((Int32)stream.Length);
                            }
                        }
                    }
                }
                else if (!String.IsNullOrEmpty(HtmlContent))
                {
                    MainContentOftheMail.Append(HtmlContent);
                    byte[] byteArray = Encoding.UTF8.GetBytes(MainContentOftheMail.ToString());
                    MemoryStream stream = new MemoryStream(byteArray);
                    using (BinaryReader br = new BinaryReader(stream))
                    {
                        byteArrayValue = br.ReadBytes((Int32)stream.Length);
                    }
                }
            }
            catch
            {
                byteArrayValue = null;
            }

            return byteArrayValue;
        }

        public static List<string> GetFileExtensionFromFileStream(Stream fileStream)
        {
            BinaryReader chkBinary = new BinaryReader(fileStream);
            Byte[] chkBytes = chkBinary.ReadBytes(0x10);

            string dataashex = BitConverter.ToString(chkBytes);
            string magicNumber = dataashex.Substring(0, 11);

            Dictionary<string, List<String>> magicDictionary = new Dictionary<string, List<String>>();
            magicDictionary.Add("50-4B-03-04", new List<string>() { ".zip", ".docx", ".xlsx", ".pptx" });
            magicDictionary.Add("50-4B-05-06", new List<string>() { ".zip", ".docx", ".xlsx", ".pptx" });
            magicDictionary.Add("50-4B-07-08", new List<string>() { ".zip", ".docx", ".xlsx", ".pptx" });
            magicDictionary.Add("52-49-46-46", new List<string>() { ".webp" });
            magicDictionary.Add("57-45-42-50", new List<string>() { ".webp" });
            magicDictionary.Add("D0-CF-11-E0", new List<string>() { ".doc", ".xls", ".ppt" });
            magicDictionary.Add("25-50-44-46", new List<string>() { ".pdf" });
            magicDictionary.Add("89-50-4E-47", new List<string>() { ".png" });
            magicDictionary.Add("FF-D8-FF-E0", new List<string>() { ".jpg", ".jpeg" });
            magicDictionary.Add("FF-D8-FF-E1", new List<string>() { ".jpg", ".jpeg" });
            magicDictionary.Add("FF-D8-FF-E2", new List<string>() { ".jpg", ".jpeg" });
            magicDictionary.Add("FF-D8-FF-E3", new List<string>() { ".jpg", ".jpeg" });
            magicDictionary.Add("FF-D8-FF-E8", new List<string>() { ".jpg", ".jpeg" });
            magicDictionary.Add("FF-D8-FF-DB", new List<string>() { ".jpg", ".jpeg" });
            magicDictionary.Add("4A-46-49-46", new List<string>() { ".jpg", ".jpeg" });
            magicDictionary.Add("45-78-69-66", new List<string>() { ".jpg", ".jpeg" });
            magicDictionary.Add("47-49-46-38", new List<string>() { ".gif" });
            magicDictionary.Add("42-4D-1E-BB", new List<string>() { ".bmp" });//may be only 42-4D
            magicDictionary.Add("42-52-41-4E", new List<string>() { ".csv" });//Not sure
            magicDictionary.Add("2A-20-53-65", new List<string>() { ".txt" });//Not sure
            magicDictionary.Add("EF-BB-BF-3C", new List<string>() { ".htm", ".html" });//Not sure
            magicDictionary.Add("3C-21-44-4F", new List<string>() { ".htm", ".html" });//Not sure
            magicDictionary.Add("0D-0A-3C-21", new List<string>() { ".htm", ".html" });//Not sure
            magicDictionary.Add("EF-BB-BF-0D", new List<string>() { ".htm", ".html" });//Not sure
            magicDictionary.Add("70-3A-2F-2F", new List<string>() { ".htm", ".html" });//Not sure
            magicDictionary.Add("3C-68-74-6D", new List<string>() { ".htm", ".html" });//Not sure

            if (magicDictionary.ContainsKey(magicNumber))
            {
                return magicDictionary[magicNumber];
            }
            return null;
        }

        public static List<T> GetListEncodeProperties<T>(List<T> objList)
        {
            List<T> list = new List<T>();
            T obj;

            for (int i = 0; i < objList.Count; i++)
            {
                obj = objList[i];

                foreach (PropertyInfo prop in obj.GetType().GetProperties())
                {
                    if (prop.PropertyType == typeof(string) && obj.GetType().GetProperty(prop.Name).GetValue(obj, null) != null)
                    {
                        string value = obj.GetType().GetProperty(prop.Name).GetValue(obj, null).ToString();
                        if (AllConfigURLDetails.KeyValueForConfig["ENCODEKEY"].ToString().ToLower() == "yes")
                            prop.SetValue(obj, WebUtility.HtmlEncode(value.ToString()), null);
                        else
                            prop.SetValue(obj, value.ToString(), null);
                    }
                }
                list.Add(obj);
            }
            return list;
        }

        public static T GetSingleEncodeProperties<T>(T obj)
        {
            foreach (PropertyInfo prop in obj.GetType().GetProperties())
            {
                if (prop.PropertyType == typeof(string) && obj.GetType().GetProperty(prop.Name).GetValue(obj, null) != null)
                {
                    string value = obj.GetType().GetProperty(prop.Name).GetValue(obj, null).ToString();
                    if (AllConfigURLDetails.KeyValueForConfig["ENCODEKEY"].ToString().ToLower() == "yes")
                        prop.SetValue(obj, WebUtility.HtmlEncode(value.ToString()), null);
                    else
                        prop.SetValue(obj, value.ToString(), null);
                }
            }
            return obj;
        }

        public static string Decrypt(string cipherText)
        {

            try
            {
                // Get the complete stream of bytes that represent:
                // [32 bytes of Salt] + [32 bytes of IV] + [n bytes of CipherText]
                var cipherTextBytesWithSaltAndIv = Convert.FromBase64String(cipherText);
                // Get the saltbytes by extracting the first 32 bytes from the supplied cipherText bytes.
                var saltStringBytes = cipherTextBytesWithSaltAndIv.Take(Keysize / 8).ToArray();
                // Get the IV bytes by extracting the next 32 bytes from the supplied cipherText bytes.
                var ivStringBytes = cipherTextBytesWithSaltAndIv.Skip(Keysize / 8).Take(Keysize / 8).ToArray();
                // Get the actual cipher text bytes by removing the first 64 bytes from the cipherText string.
                var cipherTextBytes = cipherTextBytesWithSaltAndIv.Skip((Keysize / 8) * 2).Take(cipherTextBytesWithSaltAndIv.Length - ((Keysize / 8) * 2)).ToArray();

                using (var password = new Rfc2898DeriveBytes(passPhrase, saltStringBytes, DerivationIterations))
                {
                    var keyBytes = password.GetBytes(Keysize / 8);
                    using (var symmetricKey = new RijndaelManaged())
                    {
                        symmetricKey.BlockSize = 256;
                        symmetricKey.Mode = CipherMode.CBC;
                        symmetricKey.Padding = PaddingMode.PKCS7;
                        using (var decryptor = symmetricKey.CreateDecryptor(keyBytes, ivStringBytes))
                        {
                            using (var memoryStream = new MemoryStream(cipherTextBytes))
                            {
                                using (var cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read))
                                {
                                    var plainTextBytes = new byte[cipherTextBytes.Length];
                                    var decryptedByteCount = cryptoStream.Read(plainTextBytes, 0, plainTextBytes.Length);
                                    memoryStream.Close();
                                    cryptoStream.Close();
                                    cipherText = Encoding.UTF8.GetString(plainTextBytes, 0, decryptedByteCount);
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("EncryptDecrypt"))
                {
                    objError.AddError(ex.ToString(), cipherText, DateTime.Now.ToString(), "Error", "Heler-->Decrypt function");
                }
                cipherText = "";
            }
            return cipherText;
        }

        public static string GetHashedShortenUrl(string input)
        {
            return input;
        }

        public static string ChangeUrlToAnalyticTrackUrl(StringBuilder MailBody)
        {
            try
            {
                string Body = MailBody.ToString();
                string ClkUrlText = "";

                if (Body.ToString().Contains("</a") == true)
                {
                    string[] spit = Regex.Split(Body, "<a ");
                    Body = "";
                    foreach (string spits in spit)
                    {
                        if (spits != "")
                        {
                            if (spits.Contains("</a") == true)    //if (spits.Contains("href=\"") == true || spits.Contains("href='") == true)
                            {
                                try
                                {
                                    String title1 = spits.Substring(spits.IndexOf(">"));
                                    if (title1.Contains("<img") == true)
                                    {
                                        string searchSrc = title1.Substring(title1.IndexOf("src="));
                                        string GetSrc = searchSrc.Substring(5);
                                        int Srcleng = GetSrc.IndexOf("\"");
                                        ClkUrlText = searchSrc.Substring(5, Srcleng);
                                    }
                                    else
                                    {
                                        string name = title1.Substring(title1.IndexOf(">"));
                                        int len = name.IndexOf("</a>");
                                        name = name.Substring(0, len + 5);
                                        len = name.IndexOf("</a>");
                                    }

                                    string OriginalUrl = "";

                                    if (spits.Contains("href=\"") == true)
                                    {
                                        string Url = spits.Substring(spits.IndexOf("href=\""));
                                        string GetSrc = Url.Substring(6);
                                        int Srcleng = GetSrc.IndexOf("\"");
                                        OriginalUrl = Url.Substring(6, Srcleng);
                                    }

                                    Body += "<a ";

                                    if (spits.Contains("mailto:") == false && !spits.Contains("mailresponses.plumb5.com") && !spits.Contains("mailtrack.plumb5.com") && spits.Contains("tel:") == false)
                                    {
                                        if (spits.Contains("href=\"") == true)
                                        {
                                            var data = spits.Split('>');
                                            if (!string.IsNullOrEmpty(OriginalUrl) && OriginalUrl.IndexOf("?") > -1)
                                            {
                                                var replaced = data[0].Replace(OriginalUrl, OriginalUrl + "&p5contactid=[{*ContactId*}]&p5Source=mail&p5uniqueid={p5uniqueid}");
                                                Body += spits.Replace(data[0], replaced);
                                            }
                                            else
                                            {
                                                var replaced = data[0].Replace(OriginalUrl, OriginalUrl + "?p5contactid=[{*ContactId*}]&p5Source=mail&p5uniqueid={p5uniqueid}");
                                                Body += spits.Replace(data[0], replaced);
                                            }
                                        }
                                        else
                                        {
                                            Body += spits;
                                        }
                                    }
                                    else
                                    {
                                        Body += spits;
                                    }
                                }
                                catch (Exception ex)
                                {
                                }
                            }
                            else
                            {
                                Body += spits;
                            }
                        }
                    }
                }
                MailBody.Clear().Append(Body);
            }
            catch
            {

            }

            return MailBody.ToString();
        }

        public static string Base64Encode(string plainText)
        {
            try
            {
                if (!string.IsNullOrEmpty(plainText))
                {
                    var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
                    return System.Convert.ToBase64String(plainTextBytes);
                }
                else
                {
                    return plainText;
                }
            }
            catch
            {
                return plainText;
            }
        }

        public static string MaskEmailAddress(string EmailIds)
        {
            StringBuilder result = new StringBuilder();
            try
            {
                if (AllConfigURLDetails.KeyValueForConfig["ISMASKINGENCODEDTRUE"] != null && AllConfigURLDetails.KeyValueForConfig["ISMASKINGENCODEDTRUE"].ToString() != string.Empty && Convert.ToBoolean(AllConfigURLDetails.KeyValueForConfig["ISMASKINGENCODEDTRUE"].ToString()))
                {
                    string[] EmailId = EmailIds.Split(',');
                    for (int i = 0; i < EmailId.Length; i++)
                    {
                        result.Append(Regex.Replace(EmailId[i], @"(?<=[\w]{2})[\w-\._\+%]*(?=[\w]{0}@)", m => new string('*', m.Length)) + ",");
                    }
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("MaskEmailAddress"))
                {
                    objError.AddError(ex.ToString(), "", DateTime.Now.ToString(), "Helper-->MaskEmailAddress", ex.StackTrace);
                }
                result.Clear().Append("");
            }
            return string.IsNullOrEmpty(result.ToString()) ? EmailIds : result.ToString().TrimEnd(',');
        }
        public static string MaskPhoneNumber(string Phonenumbers)
        {
            StringBuilder result = new StringBuilder();

            try
            {
                if (AllConfigURLDetails.KeyValueForConfig["ISMASKINGENCODEDTRUE"] != null && AllConfigURLDetails.KeyValueForConfig["ISMASKINGENCODEDTRUE"].ToString() != string.Empty && Convert.ToBoolean(AllConfigURLDetails.KeyValueForConfig["ISMASKINGENCODEDTRUE"].ToString()))
                {
                    string[] Phonenumber = Phonenumbers.Split(',');
                    for (int i = 0; i < Phonenumber.Length; i++)
                    {
                        result.Append(Regex.Replace(Phonenumber[i], @".(?=.{4,}$)", m => new string('*', m.Length)) + ",");
                    }
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("MaskPhoneNumber"))
                {
                    objError.AddError(ex.ToString(), "", DateTime.Now.ToString(), "Helper-->MaskPhoneNumber", ex.StackTrace);
                }
            }
            return string.IsNullOrEmpty(result.ToString()) ? Phonenumbers : result.ToString().TrimEnd(',');
        }

        public static string MaskName(string Name)
        {
            StringBuilder result = new StringBuilder();

            try
            {
                if (AllConfigURLDetails.KeyValueForConfig["ISMASKINGENCODEDTRUE"] != null && AllConfigURLDetails.KeyValueForConfig["ISMASKINGENCODEDTRUE"].ToString() != string.Empty && Convert.ToBoolean(AllConfigURLDetails.KeyValueForConfig["ISMASKINGENCODEDTRUE"].ToString()))
                {
                    string[] name = Name.Split(',');
                    for (int i = 0; i < name.Length; i++)
                    {
                        result.Append(Regex.Replace(name[i], @".*", m => new string('*', m.Length)) + ",");
                    }
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("MaskName"))
                {
                    objError.AddError(ex.ToString(), "", DateTime.Now.ToString(), "Helper-->MaskName", ex.StackTrace);
                }
            }

            return string.IsNullOrEmpty(result.ToString()) ? Name : result.ToString().TrimEnd(',');
        }

        public static Tuple<StringBuilder, List<Contact>, List<string>> GetCustomEventReplaceFieldList(int AccountId, StringBuilder htmlContent, List<Contact> contactsList, List<string> fieldNames, string SQLProvider)
        {
            Tuple<List<string>, List<string>> fieldreplace = new Tuple<List<string>, List<string>>(new List<string>(), new List<string>());

            for (int i = 0; i < contactsList.Count; i++)
            {
                fieldreplace.Item1.Clear();
                fieldreplace.Item2.Clear();
                foreach (Match m in Regex.Matches(htmlContent.ToString(), "\\{{.*?}\\}", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace))
                {
                    string[] CustomEventNameList = m.Value.ToString().Replace("{{*", "").Replace("*}}", "").Split('~');

                    string customEventName = String.Empty;
                    string customEventColumnName = String.Empty;
                    string topData = String.Empty;
                    string desascData = String.Empty;
                    string fallbackColumn = null;
                    string DataSeparator = String.Empty;
                    string StaticStartWords = String.Empty;
                    string StaticEndWords = String.Empty;
                    if (CustomEventNameList.Length == 2)
                    {
                        StaticStartWords = CustomEventNameList[0].Substring(0, CustomEventNameList[0].IndexOf("["));
                        StaticEndWords = CustomEventNameList[1].Substring(CustomEventNameList[1].IndexOf("]") + 1);
                        customEventName = CustomEventNameList[0].Substring(CustomEventNameList[0].IndexOf("[")).Replace("[", "").Replace("]", "");

                        //fieldNames.Add(customEventColumnName);
                        //htmlContent.Replace(m.Value.ToString(), "[{*" + customEventColumnName + "*}]");
                        fieldreplace.Item1.Add(m.Value.ToString());
                        customEventColumnName = CustomEventNameList[1].Replace("[", "").Replace("]", "").Replace("&amp;", "&");

                        int Index = -1;
                        if (customEventColumnName.IndexOf('(') > -1 && customEventColumnName.IndexOf(')') > -1)
                        {
                            var customEventColumnNames = customEventColumnName.Substring(0, customEventColumnName.IndexOf('('));
                            Index = Convert.ToInt32(customEventColumnName.Substring(customEventColumnName.IndexOf('(')).Replace("(", "").Replace(")", "").Replace("[", "").Replace("]", ""));
                            customEventColumnName = customEventColumnNames;
                        }

                        using (var objD = DLCustomEvents.GetDLCustomEvents(AccountId, SQLProvider))
                        {
                            var customEventColumnNames = customEventColumnName.Split('&');

                            for (int k = 0; k < customEventColumnNames.Length; k++)
                            {
                                Customevents customevents = objD.GetCustomevents(contactsList[i].ContactId, customEventName, customEventColumnNames[k], topData, desascData);
                                if (customevents != null)
                                {
                                    string ReplacedCustomFieldValue = string.Empty;

                                    ReplacedCustomFieldValue = Convert.ToString(customevents.GetType().GetProperty(customEventColumnNames[k]).GetValue(customevents, null));

                                    if (!String.IsNullOrEmpty(ReplacedCustomFieldValue))
                                    {
                                        var Tuple = AssignCustomEventsDataToContact(htmlContent, customevents, contactsList[i], customEventColumnNames[k], fieldNames, StaticStartWords: StaticStartWords, StaticEndWords: StaticEndWords, customEventFields: fieldreplace.Item2); //soure to destinataion                                
                                        contactsList[i] = Tuple.Item2;
                                        fieldreplace.Item2.Add(Tuple.Item3);
                                        break;
                                    }
                                    else
                                    {
                                        if (k == (customEventColumnNames.Length - 1))
                                        {
                                            var Tuple = AssignCustomEventsDataToContact(htmlContent, customevents, contactsList[i], customEventColumnNames[k], fieldNames, Index, DataSeparator: DataSeparator, StaticStartWords: StaticStartWords, StaticEndWords: StaticEndWords, customEventFields: fieldreplace.Item2); //soure to destinataion                                
                                            contactsList[i] = Tuple.Item2;
                                            fieldreplace.Item2.Add(Tuple.Item3);
                                        }
                                    }
                                }
                            }
                        }

                    } //CustomEvents | EventColumn
                    else if (CustomEventNameList.Length == 3)
                    {
                        StaticStartWords = CustomEventNameList[0].Substring(0, CustomEventNameList[0].IndexOf("["));
                        StaticEndWords = CustomEventNameList[2].Substring(CustomEventNameList[2].IndexOf("]") + 1);
                        customEventName = CustomEventNameList[0].Substring(CustomEventNameList[0].IndexOf("[")).Replace("[", "").Replace("]", "");

                        topData = "TOP " + CustomEventNameList[2].Replace("[", "").Replace("]", "").Split('.')[0].ToString().ToLower().Replace("top", "").Trim();
                        desascData = CustomEventNameList[2].Substring(1, CustomEventNameList[2].IndexOf("]") - 1).Split('.')[1].ToString().ToUpper().Trim();

                        if (CustomEventNameList[2].Replace("[", "").Replace("]", "").Split('.').Length == 3)
                            DataSeparator = DataSeparator = CustomEventNameList[2].Substring(1, CustomEventNameList[2].IndexOf("]") - 1).Split('.')[2].ToString().Trim();

                        customEventColumnName = CustomEventNameList[1].Replace("[", "").Replace("]", "").Replace("&amp;", "&");

                        int Index = -1;
                        if (customEventColumnName.IndexOf('(') > -1 && customEventColumnName.IndexOf(')') > -1)
                        {
                            var customEventColumnNames = customEventColumnName.Substring(0, customEventColumnName.IndexOf('('));
                            Index = Convert.ToInt32(customEventColumnName.Substring(customEventColumnName.IndexOf('(')).Replace("(", "").Replace(")", "").Replace("[", "").Replace("]", ""));
                            customEventColumnName = customEventColumnNames;
                        }

                        //fieldNames.Add(customEventColumnName);
                        //htmlContent.Replace(m.Value.ToString(), "[{*" + customEventColumnName + "*}]");
                        fieldreplace.Item1.Add(m.Value.ToString());
                        using (var objD = DLCustomEvents.GetDLCustomEvents(AccountId, SQLProvider))
                        {
                            var customEventColumnNames = customEventColumnName.Split('&');

                            for (int k = 0; k < customEventColumnNames.Length; k++)
                            {
                                Customevents customevents = objD.GetCustomevents(contactsList[i].ContactId, customEventName, customEventColumnNames[k], topData, desascData);
                                if (customevents != null)
                                {
                                    string ReplacedCustomFieldValue = string.Empty;

                                    ReplacedCustomFieldValue = Convert.ToString(customevents.GetType().GetProperty(customEventColumnNames[k]).GetValue(customevents, null));

                                    if (!String.IsNullOrEmpty(ReplacedCustomFieldValue))
                                    {
                                        var Tuple = AssignCustomEventsDataToContact(htmlContent, customevents, contactsList[i], customEventColumnNames[k], fieldNames, Index, DataSeparator: DataSeparator, StaticStartWords: StaticStartWords, StaticEndWords: StaticEndWords, customEventFields: fieldreplace.Item2); //soure to destinataion                                
                                        contactsList[i] = Tuple.Item2;
                                        fieldreplace.Item2.Add(Tuple.Item3);
                                        break;
                                    }
                                    else
                                    {
                                        if (k == (customEventColumnNames.Length - 1))
                                        {
                                            var Tuple = AssignCustomEventsDataToContact(htmlContent, customevents, contactsList[i], customEventColumnNames[k], fieldNames, Index, DataSeparator: DataSeparator, StaticStartWords: StaticStartWords, StaticEndWords: StaticEndWords, customEventFields: fieldreplace.Item2); //soure to destinataion                                
                                            contactsList[i] = Tuple.Item2;
                                            fieldreplace.Item2.Add(Tuple.Item3);
                                        }
                                    }
                                }
                            }
                        }
                    } //CustomEvents | EventColumn | TOP.DESC
                    else if (CustomEventNameList.Length == 4) //CustomEvents | EventColumn | TOP.DESC | FallBackData
                    {
                        StaticStartWords = CustomEventNameList[0].Substring(0, CustomEventNameList[0].IndexOf("["));
                        StaticEndWords = CustomEventNameList[3].Substring(CustomEventNameList[3].IndexOf("]") + 1);
                        customEventName = CustomEventNameList[0].Substring(CustomEventNameList[0].IndexOf("[")).Replace("[", "").Replace("]", "");

                        topData = "TOP " + CustomEventNameList[2].Replace("[", "").Replace("]", "").Split('.')[0].ToString().ToLower().Replace("top", "").Trim();
                        desascData = CustomEventNameList[2].Substring(1, CustomEventNameList[2].IndexOf("]") - 1).Split('.')[1].ToString().ToUpper().Trim();

                        if (CustomEventNameList[2].Replace("[", "").Replace("]", "").Split('.').Length == 3)
                            DataSeparator = DataSeparator = CustomEventNameList[2].Substring(1, CustomEventNameList[2].IndexOf("]") - 1).Split('.')[2].ToString().Trim();

                        fallbackColumn = CustomEventNameList[3].Substring(1, CustomEventNameList[3].IndexOf("]") - 1);

                        customEventColumnName = CustomEventNameList[1].Replace("[", "").Replace("]", "").Replace("&amp;", "&");

                        int Index = -1;
                        if (customEventColumnName.IndexOf('(') > -1 && customEventColumnName.IndexOf(')') > -1)
                        {
                            var customEventColumnNames = customEventColumnName.Substring(0, customEventColumnName.IndexOf('('));
                            Index = Convert.ToInt32(customEventColumnName.Substring(customEventColumnName.IndexOf('(')).Replace("(", "").Replace(")", "").Replace("[", "").Replace("]", ""));
                            customEventColumnName = customEventColumnNames;
                        }

                        //fieldNames.Add(customEventColumnName);
                        //htmlContent.Replace(m.Value.ToString(), "[{*" + customEventColumnName + "*}]");
                        fieldreplace.Item1.Add(m.Value.ToString());
                        if (contactsList[i].ContactId > 0)
                        {
                            using (var objD = DLCustomEvents.GetDLCustomEvents(AccountId, SQLProvider))
                            {
                                var customEventColumnNames = customEventColumnName.Split('&');

                                for (int k = 0; k < customEventColumnNames.Length; k++)
                                {
                                    Customevents customevents = objD.GetCustomevents(contactsList[i].ContactId, customEventName, customEventColumnNames[k], topData, desascData);
                                    if (customevents != null)
                                    {
                                        try
                                        {
                                            string ReplacedCustomFieldValue = string.Empty;
                                            if (Index > -1)
                                            {
                                                ReplacedCustomFieldValue = Convert.ToString(customevents.GetType().GetProperty(customEventColumnNames[k]).GetValue(customevents, null));
                                                if (!String.IsNullOrEmpty(ReplacedCustomFieldValue))
                                                {
                                                    var Tuple = AssignCustomEventsDataToContact(htmlContent, customevents, contactsList[i], customEventColumnNames[k], fieldNames, Index, fallbackData: fallbackColumn, DataSeparator: DataSeparator, StaticStartWords: StaticStartWords, StaticEndWords: StaticEndWords, customEventFields: fieldreplace.Item2); //soure to destinataion                                
                                                    contactsList[i] = Tuple.Item2;
                                                    fieldreplace.Item2.Add(Tuple.Item3);
                                                    break;
                                                }
                                                else
                                                {

                                                    if (k == (customEventColumnNames.Length - 1))
                                                    {
                                                        if (fallbackColumn != null && fallbackColumn.Length > 0)
                                                        {
                                                            try
                                                            {
                                                                var Tuple = AssignCustomEventsDataToContact(htmlContent, customevents, contactsList[i], customEventColumnNames[k], fieldNames, Index, fallbackColumn, DataSeparator, StaticStartWords: StaticStartWords, StaticEndWords: StaticEndWords, customEventFields: fieldreplace.Item2); //soure to destinataion                                
                                                                contactsList[i] = Tuple.Item2;
                                                                fieldreplace.Item2.Add(Tuple.Item3);
                                                            }
                                                            catch { }
                                                        }
                                                        else if (fallbackColumn != null && fallbackColumn.Length == 0)
                                                        {
                                                            try
                                                            {
                                                                var Tuple = AssignCustomEventsDataToContact(htmlContent, customevents, contactsList[i], customEventColumnNames[k], fieldNames, Index, "", DataSeparator, StaticStartWords: StaticStartWords, StaticEndWords: StaticEndWords, customEventFields: fieldreplace.Item2); //soure to destinataion                                
                                                                contactsList[i] = Tuple.Item2;
                                                                fieldreplace.Item2.Add(Tuple.Item3);
                                                            }
                                                            catch { }
                                                        }
                                                        else
                                                        {
                                                            for (int j = 1; j < 100; i++)
                                                            {
                                                                if (fieldNames.Contains("CustomField" + j) == false)
                                                                {
                                                                    htmlContent.Replace("[{*" + customEventColumnName + "*}]", "{CustomField" + j + "}");
                                                                    fieldNames.Add("CustomField" + j);
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            else
                                            {
                                                ReplacedCustomFieldValue = Convert.ToString(customevents.GetType().GetProperty(customEventColumnNames[k]).GetValue(customevents, null));
                                                if (!String.IsNullOrEmpty(ReplacedCustomFieldValue))
                                                {
                                                    var Tuple = AssignCustomEventsDataToContact(htmlContent, customevents, contactsList[i], customEventColumnNames[k], fieldNames, Index, fallbackData: fallbackColumn, DataSeparator: DataSeparator, StaticStartWords: StaticStartWords, StaticEndWords: StaticEndWords, customEventFields: fieldreplace.Item2); //soure to destinataion                                
                                                    contactsList[i] = Tuple.Item2;
                                                    fieldreplace.Item2.Add(Tuple.Item3);
                                                    break;
                                                }
                                                else
                                                {

                                                    if (k == (customEventColumnNames.Length - 1))
                                                    {
                                                        if (fallbackColumn != null && fallbackColumn.Length > 0)
                                                        {
                                                            try
                                                            {
                                                                var Tuple = AssignCustomEventsDataToContact(htmlContent, customevents, contactsList[i], customEventColumnNames[k], fieldNames, Index, fallbackColumn, DataSeparator: DataSeparator, StaticStartWords: StaticStartWords, StaticEndWords: StaticEndWords, customEventFields: fieldreplace.Item2); //soure to destinataion                                
                                                                contactsList[i] = Tuple.Item2;
                                                                fieldreplace.Item2.Add(Tuple.Item3);
                                                            }
                                                            catch { }
                                                        }
                                                        else if (fallbackColumn != null && fallbackColumn.Length == 0)
                                                        {
                                                            try
                                                            {
                                                                var Tuple = AssignCustomEventsDataToContact(htmlContent, customevents, contactsList[i], customEventColumnNames[k], fieldNames, Index, "", DataSeparator: DataSeparator, StaticStartWords: StaticStartWords, StaticEndWords: StaticEndWords, customEventFields: fieldreplace.Item2); //soure to destinataion                                
                                                                contactsList[i] = Tuple.Item2;
                                                                fieldreplace.Item2.Add(Tuple.Item3);
                                                            }
                                                            catch { }
                                                        }
                                                        else
                                                        {
                                                            for (int j = 1; j < 100; i++)
                                                            {
                                                                if (fieldNames.Contains("CustomField" + j) == false)
                                                                {
                                                                    htmlContent.Replace("[{*" + customEventColumnName + "*}]", "{CustomField" + j + "}");
                                                                    fieldNames.Add("CustomField" + j);
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        catch
                                        {

                                        }
                                    }
                                }
                            }

                        }
                        else
                        {
                            if (fallbackColumn != null && fallbackColumn.Length > 0)
                            {
                                try
                                {
                                    var Tuple = AssignCustomEventsDataToContact(htmlContent, null, contactsList[i], customEventColumnName, fieldNames, Index, fallbackColumn, DataSeparator: DataSeparator, StaticStartWords: StaticStartWords, StaticEndWords: StaticEndWords, customEventFields: fieldreplace.Item2); //soure to destinataion                                
                                    contactsList[i] = Tuple.Item2;
                                    fieldreplace.Item2.Add(Tuple.Item3);
                                }
                                catch { }
                            }
                            else if (fallbackColumn != null && fallbackColumn.Length == 0)
                            {
                                try
                                {
                                    var Tuple = AssignCustomEventsDataToContact(htmlContent, null, contactsList[i], customEventColumnName, fieldNames, Index, "", DataSeparator: DataSeparator, StaticStartWords: StaticStartWords, StaticEndWords: StaticEndWords, customEventFields: fieldreplace.Item2); //soure to destinataion                                
                                    contactsList[i] = Tuple.Item2;
                                    fieldreplace.Item2.Add(Tuple.Item3);
                                }
                                catch { }
                            }
                        }
                    }
                }
            }

            if (fieldreplace != null && fieldreplace.Item1.Count > 0 && fieldreplace.Item2.Count > 0)
            {
                for (int i = 0; i < fieldreplace.Item1.Count; i++)
                {
                    fieldNames.Add(fieldreplace.Item2[i]);
                    htmlContent.Replace(fieldreplace.Item1[i].ToString(), "[{*" + fieldreplace.Item2[i] + "*}]");
                }
            }

            return Tuple.Create(htmlContent, contactsList, fieldNames.Distinct().ToList());
        }

        public static Tuple<StringBuilder, Contact, string> AssignCustomEventsDataToContact(StringBuilder htmlContent, Customevents customevents, Contact contact, string customEventColumnName, List<string> fieldNames, int Index = -1, string fallbackData = null, string DataSeparator = null, string StaticStartWords = "", string StaticEndWords = "", List<string> customEventFields = null)
        {
            StaticStartWords = HttpUtility.HtmlDecode(StaticStartWords);
            StaticEndWords = HttpUtility.HtmlDecode(StaticEndWords);

            StaticStartWords = StaticStartWords.Replace("\"", "'");
            StaticEndWords = StaticEndWords.Replace("\"", "'");

            string customFields = string.Empty;
            for (int i = 1; i < 100; i++)
            {
                try
                {
                    if (customEventFields != null && customEventFields.Contains("CustomField" + i) == false)
                    {
                        string ReplacedCustomFieldValue = string.Empty;
                        if (customevents != null)
                        {
                            if (Index > -1)
                            {
                                ReplacedCustomFieldValue = Convert.ToString(customevents.GetType().GetProperty(customEventColumnName).GetValue(customevents, null));
                                if (!String.IsNullOrEmpty(ReplacedCustomFieldValue))
                                {

                                    try
                                    {
                                        ReplacedCustomFieldValue = ReplacedCustomFieldValue.Split('$')[Index].Trim();
                                    }
                                    catch
                                    {
                                        if (fallbackData != null && fallbackData.Length > 0)
                                            ReplacedCustomFieldValue = fallbackData;
                                        else if (fallbackData != null && fallbackData.Length == 0)
                                            ReplacedCustomFieldValue = "";
                                        else
                                            ReplacedCustomFieldValue = null;
                                    }
                                }
                                else if (fallbackData != null && fallbackData.Length > 0)
                                    ReplacedCustomFieldValue = fallbackData;
                                else if (fallbackData != null && fallbackData.Length == 0)
                                    ReplacedCustomFieldValue = "";
                                else
                                    ReplacedCustomFieldValue = null;
                            }
                            else
                            {
                                ReplacedCustomFieldValue = Convert.ToString(customevents.GetType().GetProperty(customEventColumnName).GetValue(customevents, null));

                                if (String.IsNullOrEmpty(ReplacedCustomFieldValue) && fallbackData != null && fallbackData.Length > 0)
                                    ReplacedCustomFieldValue = fallbackData;
                                else if (String.IsNullOrEmpty(ReplacedCustomFieldValue) && fallbackData != null && fallbackData.Length == 0)
                                    ReplacedCustomFieldValue = "";
                                else if (String.IsNullOrEmpty(ReplacedCustomFieldValue))
                                    ReplacedCustomFieldValue = null;
                            }


                            if (ReplacedCustomFieldValue != null && ReplacedCustomFieldValue.Length > 0)
                            {
                                if (!String.IsNullOrEmpty(DataSeparator))
                                    contact.GetType().GetProperty("CustomField" + i).SetValue(contact, StaticStartWords + ReplacedCustomFieldValue.Replace("$", DataSeparator) + StaticEndWords, null);
                                else
                                    contact.GetType().GetProperty("CustomField" + i).SetValue(contact, StaticStartWords + ReplacedCustomFieldValue.Replace("$", "&") + StaticEndWords, null);
                            }
                            else if (ReplacedCustomFieldValue != null && ReplacedCustomFieldValue.Length == 0)
                                contact.GetType().GetProperty("CustomField" + i).SetValue(contact, "", null);
                            else
                                contact.GetType().GetProperty("CustomField" + i).SetValue(contact, null, null);
                        }
                        else
                        {
                            if (fallbackData != null && fallbackData.Length > 0)
                            {
                                ReplacedCustomFieldValue = fallbackData;
                                if (!String.IsNullOrEmpty(DataSeparator))
                                    contact.GetType().GetProperty("CustomField" + i).SetValue(contact, StaticStartWords + ReplacedCustomFieldValue.Replace("$", DataSeparator) + StaticEndWords, null);
                                else
                                    contact.GetType().GetProperty("CustomField" + i).SetValue(contact, StaticStartWords + ReplacedCustomFieldValue.Replace("$", "&") + StaticEndWords, null);
                            }
                            else if (fallbackData != null && fallbackData.Length == 0)
                            {
                                contact.GetType().GetProperty("CustomField" + i).SetValue(contact, "", null);
                            }
                            else
                                contact.GetType().GetProperty("CustomField" + i).SetValue(contact, null, null);
                        }

                        //htmlContent.Replace("[{*" + customEventColumnName + "*}]", "{CustomField" + i + "}");
                        //fieldNames.Add("CustomField" + i);
                        customFields = "CustomField" + i;
                        break;
                    }

                }
                catch (Exception ex)
                {
                    //fieldNames.Add("CustomField" + i);
                    customFields = "CustomField" + i;
                    ErrorUpdation.AddErrorLog("CustomEventFieldReplace", ex.Message, "CustomEvent Data Replace issue", DateTime.Now, "Helper-->AssignCustomEventsDataToContact", ex.StackTrace);
                    break;
                }
            }

            return Tuple.Create(htmlContent, contact, customFields);
        }

        public static List<T> GetListDecodeProperties<T>(List<T> objList)
        {
            List<T> list = new List<T>();
            T obj;

            for (int i = 0; i < objList.Count; i++)
            {
                obj = objList[i];

                foreach (PropertyInfo prop in obj.GetType().GetProperties())
                {
                    if (prop.PropertyType == typeof(string) && obj.GetType().GetProperty(prop.Name).GetValue(obj, null) != null)
                    {
                        string value = obj.GetType().GetProperty(prop.Name).GetValue(obj, null).ToString();
                        prop.SetValue(obj, WebUtility.HtmlDecode(value.ToString()), null);
                    }
                }
                list.Add(obj);
            }

            return list;
        }
        public static DataTable ToDataTables<T>(IList<T> data)
        {
            PropertyDescriptorCollection props = TypeDescriptor.GetProperties(typeof(T));
            DataTable table = new DataTable();
            for (int i = 0; i < props.Count; i++)
            {
                PropertyDescriptor prp = props[i];
                table.Columns.Add(prp.Name, Nullable.GetUnderlyingType(prp.PropertyType) ?? prp.PropertyType);
            }
            object[] values = new object[props.Count];
            foreach (T item in data)
            {
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = props[i].GetValue(item);
                }
                table.Rows.Add(values);
            }
            return table;
        }

        public static string findFileDelimiter(string strFilename)
        {
            // define delimiters of interest
            string[] delimiters = new string[] { ",", "|", ";" };

            // test file against delimiters
            for (int delcnt = 0; delcnt < delimiters.Length; delcnt++)
            {
                using (TextFieldParser parser = new TextFieldParser(strFilename))
                {
                    parser.TextFieldType = FieldType.Delimited;
                    parser.SetDelimiters(delimiters[delcnt]);

                    if (!parser.EndOfData)
                    {
                        string[] fields = parser.ReadFields();
                        // if we get more than one field, we have found the correct delimiter
                        if (fields.Length > 1)
                            return delimiters[delcnt];
                    }
                }
            } // end_of_for (int delcnt = 0; delcnt < delimiters.Length; delcnt++)
            return delimiters[0];
        }

        public static DataSet GetCSVDataSetWithSpecifiedRows(string fileFullPath, int rowsNumber)
        {
            try
            {
                string delimiter = findFileDelimiter(fileFullPath);
                using (var myCsvFile = new TextFieldParser(fileFullPath))
                {
                    myCsvFile.TextFieldType = FieldType.Delimited;
                    myCsvFile.SetDelimiters(delimiter);

                    //convert to dataset:
                    DataSet ds = new DataSet("Plumb5");
                    ds.Tables.Add("Table");

                    String[] stringRow = myCsvFile.ReadFields();
                    foreach (String field in stringRow)
                    {
                        ds.Tables[0].Columns.Add(field, Type.GetType("System.String"));
                    }
                    //populate with data:
                    int currentRowNumber = 1;
                    while (!myCsvFile.EndOfData && currentRowNumber <= rowsNumber)
                    {
                        stringRow = myCsvFile.ReadFields();

                        bool result = false;
                        foreach (var rowdata in stringRow)
                        {
                            if (!String.IsNullOrEmpty(rowdata.ToString()))
                            {
                                result = true;
                                break;
                            }
                        }

                        if (result)
                        {
                            ds.Tables[0].Rows.Add(stringRow);
                            currentRowNumber++;
                        }
                    }
                    return ds;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public static DataSet ExcelOrCsvConnReadDs(string fileFullPath)  //Here File Full path is passed and dataset is returned//
        {
            try
            {
                string extension = Path.GetExtension(fileFullPath).ToLower();
                string delimiter = ",";

                if (extension == ".csv")
                {
                    delimiter = findFileDelimiter(fileFullPath);
                }

                if (delimiter == null)
                    delimiter = ",";

                if (extension == ".csv" && delimiter != ",")
                {
                    return GetDataSetFromCSVUsingParser(fileFullPath, delimiter);
                }
                else if (extension == ".csv" && delimiter == ",")
                {
                    ErrorUpdation.AddErrorLog("ContactImportLive", "step2(dddd) ==> yeild iteration", "", DateTime.Now, "StartImport Method", "comma");
                    DataSet dsExcelFields = new DataSet();
                    DataTable dataTableContact = new DataTable();
                    bool IsHeaderInBatch = true;
                    foreach (IEnumerable<string> batch in ReadBatches(fileFullPath))
                    {
                        FromStringToTableData(ref dataTableContact, IsHeaderInBatch, batch);
                        IsHeaderInBatch = false;
                    }

                    if (dataTableContact != null && dataTableContact.Rows.Count > 0)
                        dsExcelFields.Tables.Add(dataTableContact);

                    return dsExcelFields;
                }
                //else if (extension == ".xlsx")
                //{
                //    DataSet dataSet = new DataSet();
                //    DataTable dataTable = ReadExcelFiles(fileFullPath);
                //    dataSet.Tables.Add(dataTable.Copy());
                //    return dataSet;
                //}
                else
                {
                    OleDbCommand cmd = GetImportCommand(fileFullPath);
                    try
                    {                       
                        DataSet ds = new DataSet();
                        DataSet dsClone = new DataSet();
                        using (OleDbDataAdapter oleda = new OleDbDataAdapter())
                        {
                            if (cmd.Connection.State == ConnectionState.Closed)
                                cmd.Connection.Open();
                            oleda.SelectCommand = cmd;
                            oleda.Fill(ds);

                            if (ds != null && ds.Tables.Count > 0)
                            {
                                for (int i = 0; i < ds.Tables[0].Columns.Count; i++)
                                {
                                    if (!String.IsNullOrEmpty(ds.Tables[0].Columns[i].ColumnName))
                                        ds.Tables[0].Columns[i].ColumnName = ds.Tables[0].Columns[i].ColumnName.Trim();
                                }

                                //To make all column as a type of string
                                dsClone = ds.Clone(); //just copy structure, no data
                                for (int i = 0; i < dsClone.Tables[0].Columns.Count; i++)
                                {
                                    if (dsClone.Tables[0].Columns[i].DataType != typeof(string))
                                        dsClone.Tables[0].Columns[i].DataType = typeof(string);
                                }

                                //Copy All data row by row
                                foreach (DataRow dr in ds.Tables[0].Rows)
                                {
                                    bool result = false;
                                    foreach (var rowdata in dr.ItemArray)
                                    {
                                        if (!String.IsNullOrEmpty(rowdata.ToString()))
                                        {
                                            result = true;
                                            break;
                                        }
                                    }

                                    if (result)
                                        dsClone.Tables[0].ImportRow(dr);
                                }
                            }
                        }
                        return dsClone;
                    }
                    catch (Exception ex)
                    {
                        using (ErrorUpdation objError = new ErrorUpdation("ExcelOrCsvConnReadDs"))
                        {
                            objError.AddError(ex.Message, "Not able to convert DataSet from file", DateTime.Now.ToString(), "Helper->ExcelOrCsvConnReadDs->Inner", ex.ToString(), true);
                        }
                        return null;
                    }
                    finally
                    {
                        cmd.Connection.Close();
                    }
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("ExcelOrCsvConnReadDs"))
                {
                    objError.AddError(ex.Message, "Not able to convert DataSet from file", DateTime.Now.ToString(), "Helper->ExcelOrCsvConnReadDs->Outer", ex.ToString(), true);
                }
                return null;
            }
        }

        private static DataSet GetDataSetFromCSVUsingParser(string fileFullPath, string delimiter)
        {
            try
            {
                using (var myCsvFile = new TextFieldParser(fileFullPath))
                {
                    myCsvFile.TextFieldType = FieldType.Delimited;
                    myCsvFile.SetDelimiters(delimiter);

                    //convert to dataset:
                    DataSet ds = new DataSet("Plumb5");
                    ds.Tables.Add("DataList");

                    String[] stringRow = myCsvFile.ReadFields();
                    foreach (String field in stringRow)
                    {
                        ds.Tables[0].Columns.Add(field, Type.GetType("System.String"));
                    }
                    //populate with data:
                    while (!myCsvFile.EndOfData)
                    {
                        stringRow = myCsvFile.ReadFields();

                        bool result = false;
                        foreach (var rowdata in stringRow)
                        {
                            if (!String.IsNullOrEmpty(rowdata.ToString()))
                            {
                                result = true;
                                break;
                            }
                        }

                        if (result)
                            ds.Tables[0].Rows.Add(stringRow);
                    }
                    return ds;
                }
            }
            catch
            {
                return null;
            }
        }

        private static IEnumerable<IEnumerable<string>> ReadBatches(string fileName)
        {
            var file = File.OpenText(fileName);
            var batchItems = new List<string>();

            while (!file.EndOfStream)
            {
                // clear the batch list
                batchItems.Clear();

                // read file in batches of 3
                // your logic on splitting batches might differ
                for (int i = 0; i < 50000; i++)
                {
                    if (file.EndOfStream)
                        break;

                    batchItems.Add(file.ReadLine());
                }

                // this allows the caller to perform processing, and only
                // returns back here when they pull on the next item in the
                // IEnumerable
                yield return batchItems;
            }

            file.Close();
        }

        private static void FromStringToTableData(ref DataTable dataTableContact, bool IsHeaderInBatch, IEnumerable<string> batch)
        {
            try
            {
                foreach (var eachRow in batch)
                {
                    string[] rows = eachRow.Split(',');
                    if (IsHeaderInBatch)
                    {
                        foreach (var columns in rows)
                        {
                            dataTableContact.Columns.Add(columns);
                        }
                        IsHeaderInBatch = false;
                    }
                    else
                    {
                        DataRow dataRow = dataTableContact.NewRow();
                        int i = 0;
                        foreach (var cell in rows)
                        {
                            try
                            {
                                dataRow[i] = cell;
                                i++;
                            }
                            catch { }
                        }
                        dataTableContact.Rows.Add(dataRow);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private static OleDbCommand GetImportCommand(string fileFullPath)
        {
            string connString = ExcelorCSVConnection(fileFullPath);

            OleDbConnection oledbConn = new OleDbConnection(connString);

            oledbConn.Open();

            string extension = Path.GetExtension(fileFullPath).ToLower();
            if (extension == ".csv")
            {
                using (DataTable Sheets = oledbConn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null))
                {
                    OleDbCommand cmd = new OleDbCommand("SELECT * FROM [" + Path.GetFileName(fileFullPath) + "]", oledbConn);

                    return cmd;
                }
            }
            else if (extension == ".xls" || extension == ".xlsx")
            {
                using (DataTable Sheets = oledbConn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null))
                {
                    foreach (DataRow dr in Sheets.Rows)
                    {
                        string sht = dr[2].ToString().Replace("'", "");
                        OleDbCommand cmd = new OleDbCommand("SELECT * FROM [" + sht + "]", oledbConn);
                        return cmd;
                    }
                }
            }
            return null;
        }

        public static DataTable ReadExcelFiles(string filePath)
        {
            using (var stream = File.Open(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
            {
                Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
                var encoding = Encoding.GetEncoding("UTF-8");
                using (var reader = ExcelReaderFactory.CreateReader(stream,
                  new ExcelReaderConfiguration() { FallbackEncoding = encoding }))
                {
                    var result = reader.AsDataSet(new ExcelDataSetConfiguration
                    {
                        ConfigureDataTable = _ => new ExcelDataTableConfiguration { UseHeaderRow = true }
                    });

                    if (result.Tables.Count > 0)
                    {
                        return result.Tables[0];
                    }
                }
            }
            return null;
        }
        private static string ExcelorCSVConnection(string fileFullPath)
        {
            string connString = "";

            string extension = Path.GetExtension(fileFullPath).ToLower();
            if (extension == ".csv")
            {
                connString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + Path.GetDirectoryName(fileFullPath) + ";Extended Properties =\"Text;HDR=YES;FMT=Delimited\"";
            }
            else if (extension == ".xls")
            {
                connString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + fileFullPath + ";Extended Properties=Excel 12.0;";
            }
            else if (extension == ".xlsx")
            {
                connString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + fileFullPath + ";Extended Properties=Excel 12.0;";
            }
            return connString;
        }

        public static void SaveDataSetToExcel_XLSX(DataSet dexportData, string sfilePath)
        {
            try
            {
                DataTable ExportDataTable = dexportData.Tables[0];
                var Workbook = new XSSFWorkbook();
                var sheet = Workbook.CreateSheet("P5Sheet1");

                var col = sheet.CreateRow(0);
                for (int i = 0; i < ExportDataTable.Columns.Count; i++)
                {
                    var cell = col.CreateCell(i);
                    cell.SetCellValue(ExportDataTable.Columns[i].ColumnName.ToString());
                }

                for (var rowIndex = 0; rowIndex < ExportDataTable.Rows.Count; rowIndex++)
                {
                    var row = sheet.CreateRow(rowIndex + 1);
                    for (var colIndex = 0; colIndex < ExportDataTable.Columns.Count; colIndex++)
                    {
                        var cell = row.CreateCell(colIndex);
                        cell.SetCellValue(ExportDataTable.Rows[rowIndex][colIndex].ToString());
                    }
                }

                using (FileStream file = new FileStream(sfilePath, FileMode.Create))
                {
                    Workbook.Write(file);
                    file.Close();
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SaveDataSetToExcel_XLSX"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "Plumb5GenralFunction->Helper.cs->SaveDataSetToExcel_XLSX", ex.ToString());
                }
            }
        }

        public static void SendMailOnMajorError(string functioName, string Build, string error)
        {
            try
            {
                MailMessage mail = new MailMessage();
                mail.To.Add("chandan@decisive.in");
                SmtpClient client = new SmtpClient();
                mail.Subject = "Error found in =>" + Build + "====>" + functioName;
                mail.Body = error;
                mail.IsBodyHtml = true;
                client.Send(mail);
            }
            catch (Exception ex)
            {
                using (ErrorUpdation err = new ErrorUpdation("SendMailOnMajorError"))
                {
                    err.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "Helper->SendMailOnMajorError", ex.ToString());
                }
            }
        }

        public static void Copy(object Source, object Destination)
        {
            foreach (PropertyInfo propA in Source.GetType().GetProperties())
            {
                if (Destination.GetType().GetProperty(propA.Name) != null)
                {
                    PropertyInfo propB = Destination.GetType().GetProperty(propA.Name);
                    propB.SetValue(Destination, propA.GetValue(Source, null), null);
                }
            }
        }

        public static void CopyWithDateTimeWhenString(object Source, object Destination)
        {
            foreach (PropertyInfo sourceProp in Source.GetType().GetProperties())
            {
                PropertyInfo destProp = Destination.GetType().GetProperty(sourceProp.Name);
                if (destProp != null && destProp.CanWrite)
                {
                    object value = sourceProp.GetValue(Source, null);
                    if (value != null)
                    {
                        // Check if we're assigning a string to a DateTime or DateTime?
                        if (sourceProp.PropertyType == typeof(string) &&
                            (destProp.PropertyType == typeof(DateTime) || destProp.PropertyType == typeof(DateTime?)))
                        {
                            if (DateTime.TryParse((string)value, out DateTime dateTimeValue))
                            {
                                destProp.SetValue(Destination, dateTimeValue, null);
                            }
                            // If parsing fails, we don't set the value
                        }
                        else
                        {
                            // For all other cases, try to set the value directly
                            try
                            {
                                destProp.SetValue(Destination, value, null);
                            }
                            catch (ArgumentException)
                            {
                                // Handle or log any type mismatches
                            }
                        }
                    }
                }
            }
        }

        public static bool IsValidPhoneNumber(ref string? phoneNumber)
        {
            StringBuilder phoneNumberString = new StringBuilder(phoneNumber);
            if (IsValidPhoneNumber(phoneNumberString))
            {
                phoneNumber = Convert.ToString(phoneNumberString);
                return true;
            }
            else
            {
                phoneNumber = Convert.ToString(phoneNumberString);
                return false;
            }

        }
        public static bool IsValidPhoneNumber(StringBuilder phoneNumber)
        {
            bool result = false;
            if (!string.IsNullOrEmpty(Convert.ToString(phoneNumber)))
            {
                phoneNumber.Replace(" ", "").Replace("(", "").Replace(")", "").Replace("-", "").Replace("/", "").Replace("'", "").Replace("+", "");
                long phoneNumberInInteger = 0;
                bool isInterger = long.TryParse(Convert.ToString(phoneNumber), out phoneNumberInInteger);
                if (!isInterger)
                {
                    phoneNumber.Clear().Append("");
                    return false;
                }

                if (phoneNumberInInteger <= 0)
                {
                    phoneNumber.Clear().Append("");
                    return false;
                }

                string phnum = Convert.ToString(phoneNumberInInteger);
                if (AllConfigURLDetails.KeyValueForConfig["PHONENUMBERVALIDATIONTYPE"] != null && AllConfigURLDetails.KeyValueForConfig["PHONENUMBERVALIDATIONTYPE"].ToString() != string.Empty && AllConfigURLDetails.KeyValueForConfig["PHONENUMBERVALIDATIONTYPE"].ToString() != "27")
                {
                    //Bcz shortest phonenuber in entire world is 4 digit.
                    if (phnum.Length > 4)
                    {
                        phoneNumber.Clear().Append(phnum);
                        return true;
                    }
                    else
                    {
                        phoneNumber.Clear().Append("");
                        return false;
                    }
                }
                else if (AllConfigURLDetails.KeyValueForConfig["PHONENUMBERVALIDATIONTYPE"] != null && AllConfigURLDetails.KeyValueForConfig["PHONENUMBERVALIDATIONTYPE"].ToString() != string.Empty && AllConfigURLDetails.KeyValueForConfig["PHONENUMBERVALIDATIONTYPE"].ToString() == "27")
                {
                    if (phnum.Length == 9)
                    {
                        phnum = "27" + phnum;
                        result = true;
                    }
                    else if (phnum.Length == 10 && phnum[0].ToString() == "0")
                    {
                        phnum = phnum.Substring(1);
                        phnum = "27" + phnum;
                        result = true;
                    }
                    else if (phnum.Length == 11 && phnum.Substring(0, 2) == "27")
                    {
                        result = true;
                    }

                    if (result)
                    {
                        phoneNumber.Clear().Append(phnum);
                        Regex regex = new Regex(@"^(27)\d{9}$");
                        if (!regex.IsMatch(phoneNumber.ToString()))
                        {
                            result = false;
                            phoneNumber.Clear().Append("");
                        }
                    }
                    else
                    {
                        phoneNumber.Clear().Append("");
                    }
                    return result;
                }
                else
                {
                    if (phnum.Length > 1)
                    {
                        phoneNumber.Clear().Append(phnum);
                        return true;
                    }
                }
            }
            phoneNumber.Clear().Append("");
            return false;
        }

        public static async Task<string> Getshortlinkbyvalue(int AccountId, Contact contactDetails, string content, int TemplateId, int SendingSettingId, string P5UniqueID, string channeltype = null, bool IsConvertURLToShortUrl = false, int workflowid = 0, string? sqlVendor = null)
        {
            string shortenlink = "";

            if (IsConvertURLToShortUrl && TemplateId > 0)
            {
                bool result = ValidHttpURL(content);

                if (result)
                {
                    if (channeltype == "whatsapp")
                    {
                        WhatsAppTemplateUrl? whatsappTemplateUrl = new WhatsAppTemplateUrl();
                        whatsappTemplateUrl.WhatsAppTemplatesId = TemplateId;
                        whatsappTemplateUrl.UrlContent = content;

                        using (var objBL = DLWhatsappTemplateUrl.GetDLWhatsappTemplateUrl(AccountId, sqlVendor))
                        {
                            whatsappTemplateUrl.Id = await objBL.SaveWhatsappTemplateUrl(whatsappTemplateUrl);

                            if (whatsappTemplateUrl.Id <= 0)
                                whatsappTemplateUrl = await objBL.GetDetailByUrl(whatsappTemplateUrl.UrlContent);

                            if (whatsappTemplateUrl != null && whatsappTemplateUrl.Id > 0)
                                shortenlink = await Getshortenlink(AccountId, contactDetails.ContactId, whatsappTemplateUrl.Id, SendingSettingId, P5UniqueID, channeltype, workflowid, sqlVendor: sqlVendor);

                            shortenlink = Convert.ToString(AllConfigURLDetails.KeyValueForConfig["WHATSAPP_RESPONSES"]) + shortenlink;
                        }
                    }
                    else if (channeltype == "sms")
                    {
                        SmsTemplateUrl? smsTemplateUrl = new SmsTemplateUrl();
                        smsTemplateUrl.SmsTemplateId = TemplateId;
                        smsTemplateUrl.UrlContent = content;

                        using (var objBL = DLSmsTemplateUrl.GetDLSmsTemplateUrl(AccountId, sqlVendor))
                        {
                            smsTemplateUrl.Id = await objBL.SaveSmsTemplateUrl(smsTemplateUrl);

                            if (smsTemplateUrl.Id <= 0)
                                smsTemplateUrl = await objBL.GetDetailByUrl(smsTemplateUrl.UrlContent);

                            if (smsTemplateUrl != null && smsTemplateUrl.Id > 0)
                                shortenlink = await Getshortenlink(AccountId, contactDetails.ContactId, smsTemplateUrl.Id, SendingSettingId, P5UniqueID, channeltype, workflowid, sqlVendor: sqlVendor);

                            shortenlink = Convert.ToString(AllConfigURLDetails.KeyValueForConfig["SMS_CLICKURL"]) + shortenlink;
                        }
                    }
                    else
                    {
                        shortenlink = content;
                    }
                }
                else
                {
                    shortenlink = content;
                }
            }
            else
            {
                shortenlink = content;
            }

            return shortenlink;
        }
        public static bool ValidHttpURL(string s)
        {
            string Pattern = @"^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$";
            Regex Rgx = new Regex(Pattern, RegexOptions.Compiled | RegexOptions.IgnoreCase);
            return Rgx.IsMatch(s);
        }
        public static async Task<string> Getshortenlink(int AccountId, int ContactId, int whatsappid, int WhatsAppSendingSettingId, string P5WhatsappUniqueID, string Channel, int workflowid = 0, string? sqlVendor = null)
        {
            HelperForSMS helpsms = new HelperForSMS(AccountId, sqlVendor);
            string trackingCode = "";

            if (!String.IsNullOrEmpty(Channel.ToLower()) && Channel.ToLower() == "whatsapp")
            {
                long SavedShortUrlId = 0;

                if (workflowid > 0)
                    SavedShortUrlId = await helpsms.SaveWhatsAppShortUrl(new WhatsappShortUrl() { AccountId = AccountId, CampaignType = "workflow", URLId = whatsappid, WhatsappSendingSettingId = WhatsAppSendingSettingId, WorkflowId = workflowid, P5WhatsappUniqueID = P5WhatsappUniqueID });
                else
                    SavedShortUrlId = await helpsms.SaveWhatsAppShortUrl(new WhatsappShortUrl() { AccountId = AccountId, CampaignType = "campaign", URLId = whatsappid, WhatsappSendingSettingId = WhatsAppSendingSettingId, WorkflowId = 0, P5WhatsappUniqueID = P5WhatsappUniqueID });


                if (SavedShortUrlId > 0)
                {
                    string whatsappShortUrlString = helpsms.URLfromID(SavedShortUrlId);
                    string ContactIdString = helpsms.URLfromID(ContactId);
                    trackingCode = whatsappShortUrlString + "-" + ContactIdString;
                }
            }
            else if (!String.IsNullOrEmpty(Channel.ToLower()) && Channel.ToLower() == "sms")
            {
                long SavedShortUrlId = 0;

                if (workflowid > 0)
                    SavedShortUrlId = await helpsms.SaveSmsShortUrl(new SmsShortUrl() { AccountId = AccountId, CampaignType = "workflow", URLId = whatsappid, SMSSendingSettingId = WhatsAppSendingSettingId, WorkflowId = workflowid, P5SMSUniqueID = P5WhatsappUniqueID });
                else
                    SavedShortUrlId = await helpsms.SaveSmsShortUrl(new SmsShortUrl() { AccountId = AccountId, CampaignType = "campaign", URLId = whatsappid, SMSSendingSettingId = WhatsAppSendingSettingId, WorkflowId = 0, P5SMSUniqueID = P5WhatsappUniqueID });


                if (SavedShortUrlId > 0)
                {
                    string whatsappShortUrlString = helpsms.URLfromID(SavedShortUrlId);
                    string ContactIdString = helpsms.URLfromID(ContactId);
                    trackingCode = whatsappShortUrlString + "-" + ContactIdString;
                }
            }

            return trackingCode;
        }

        public static async Task<string> ReplaceCustomEventDetails(int AccountId, StringBuilder htmlContent, Contact contactsList = null, string MachineId = null, int TemplateId = 0, int SendingSettingId = 0, string P5UniqueID = null, string channeltype = null, bool IsConvertURLToShortUrl = false, string campaignType = "campaign", int workflowid = 0, string? SQLVendor = null)
        {
            StringBuilder data = new StringBuilder();
            foreach (Match m in Regex.Matches(htmlContent.ToString(), "\\{{.*?}\\}", RegexOptions.IgnoreCase | RegexOptions.Singleline | RegexOptions.Multiline | RegexOptions.IgnorePatternWhitespace))
            {
                string[] CustomEventNameList = m.Value.ToString().Replace("{{*", "").Replace("*}}", "").Split('~');

                string customEventName = String.Empty;
                string customEventColumnName = String.Empty;
                string topData = String.Empty;
                string desascData = String.Empty;
                string fallbackColumn = null;
                string DataSeparator = String.Empty;
                string StaticStartWords = String.Empty;
                string StaticEndWords = String.Empty;
                if (CustomEventNameList.Length == 2)
                {
                    StaticStartWords = CustomEventNameList[0].Substring(0, CustomEventNameList[0].IndexOf("["));
                    StaticEndWords = CustomEventNameList[1].Substring(CustomEventNameList[1].IndexOf("]") + 1);
                    customEventName = CustomEventNameList[0].Substring(CustomEventNameList[0].IndexOf("[")).Replace("[", "").Replace("]", "");

                    //customEventName = CustomEventNameList[0].Replace("[", "").Replace("]", "");
                    //fieldNames.Add(customEventColumnName);                    

                    customEventColumnName = CustomEventNameList[1].Replace("[", "").Replace("]", "");

                    //htmlContent.Replace(m.Value.ToString(), "[{*" + customEventColumnName + "*}]");

                    int Index = -1;
                    if (customEventColumnName.IndexOf('(') > -1 && customEventColumnName.IndexOf(')') > -1)
                    {
                        var customEventColumnNames = customEventColumnName.Substring(0, customEventColumnName.IndexOf('('));

                        int startIndex = customEventColumnName.IndexOf('(');
                        int endIndex = customEventColumnName.IndexOf(')');

                        if (startIndex != -1 && endIndex != -1 && endIndex > startIndex)
                            Index = Convert.ToInt32(customEventColumnName.Substring(startIndex + 1, endIndex - startIndex - 1));

                        customEventColumnName = customEventColumnNames;
                    }

                    htmlContent.Replace(m.Value.ToString(), "[{*" + customEventColumnName + "*}]");
                    using (var objD = DLCustomEvents.GetDLCustomEvents(AccountId, SQLVendor))
                    {

                        var customEventColumnNames = customEventColumnName.Split('&');

                        for (int i = 0; i < customEventColumnNames.Length; i++)
                        {
                            Customevents? customevents = null;
                            if (contactsList != null && contactsList.ContactId > 0)
                                customevents = objD.GetCustomevents(contactsList.ContactId, customEventName, customEventColumnNames[i], topData, desascData);
                            else if (!String.IsNullOrEmpty(MachineId))
                                customevents = objD.GetCustomevents(0, customEventName, customEventColumnNames[i], topData, desascData, MachineId);

                            if (customevents != null)
                            {
                                try
                                {
                                    string? ReplacedCustomFieldValue = string.Empty;
                                    if (Index > -1)
                                    {
                                        ReplacedCustomFieldValue = Convert.ToString(customevents.GetType().GetProperty(customEventColumnNames[i]).GetValue(customevents, null));
                                        if (!String.IsNullOrEmpty(ReplacedCustomFieldValue))
                                        {
                                            try
                                            {
                                                ReplacedCustomFieldValue = ReplacedCustomFieldValue.Split('$')[Index].Trim();
                                                ReplacedCustomFieldValue = await Getshortlinkbyvalue(AccountId, contactsList, ReplacedCustomFieldValue, TemplateId, SendingSettingId, P5UniqueID, channeltype, IsConvertURLToShortUrl, workflowid, sqlVendor: SQLVendor);
                                                data.Clear().Append(Regex.Replace(htmlContent.ToString(), @"\[\{\*" + customEventColumnName + @"\*\}\]", StaticStartWords + ReplacedCustomFieldValue + StaticEndWords, RegexOptions.IgnoreCase));
                                                htmlContent.Clear().Append(data);
                                                break;
                                            }
                                            catch
                                            {
                                                if (fallbackColumn != null && fallbackColumn.Length > 0)
                                                {
                                                    ReplacedCustomFieldValue = fallbackColumn;
                                                    ReplacedCustomFieldValue = await Getshortlinkbyvalue(AccountId, contactsList, ReplacedCustomFieldValue, TemplateId, SendingSettingId, P5UniqueID, channeltype, IsConvertURLToShortUrl, workflowid, sqlVendor: SQLVendor);
                                                    data.Clear().Append(Regex.Replace(htmlContent.ToString(), @"\[\{\*" + customEventColumnName + @"\*\}\]", StaticStartWords + ReplacedCustomFieldValue + StaticEndWords, RegexOptions.IgnoreCase));
                                                    htmlContent.Clear().Append(data);
                                                }
                                                else if (fallbackColumn != null && fallbackColumn.Length == 0)
                                                {
                                                    ReplacedCustomFieldValue = fallbackColumn;
                                                    ReplacedCustomFieldValue = await Getshortlinkbyvalue(AccountId, contactsList, ReplacedCustomFieldValue, TemplateId, SendingSettingId, P5UniqueID, channeltype, IsConvertURLToShortUrl, workflowid, sqlVendor: SQLVendor);
                                                    data.Clear().Append(Regex.Replace(htmlContent.ToString(), @"\[\{\*" + customEventColumnName + @"\*\}\]", "", RegexOptions.IgnoreCase));
                                                    htmlContent.Clear().Append(data);
                                                }
                                            }
                                        }
                                    }
                                    else
                                    {
                                        ReplacedCustomFieldValue = Convert.ToString(customevents.GetType().GetProperty(customEventColumnNames[i]).GetValue(customevents, null));
                                        if (!String.IsNullOrEmpty(ReplacedCustomFieldValue))
                                        {
                                            ReplacedCustomFieldValue = await Getshortlinkbyvalue(AccountId, contactsList, ReplacedCustomFieldValue, TemplateId, SendingSettingId, P5UniqueID, channeltype, IsConvertURLToShortUrl, workflowid, sqlVendor: SQLVendor);
                                            data.Clear().Append(Regex.Replace(htmlContent.ToString(), @"\[\{\*" + customEventColumnName + @"\*\}\]", StaticStartWords + ReplacedCustomFieldValue.Replace("$", "&") + StaticEndWords, RegexOptions.IgnoreCase));
                                            htmlContent.Clear().Append(data);
                                            break;
                                        }

                                    }
                                }
                                catch { }
                            }
                        }
                    }

                }
                else if (CustomEventNameList.Length == 3)
                {
                    StaticStartWords = CustomEventNameList[0].Substring(0, CustomEventNameList[0].IndexOf("["));
                    StaticEndWords = CustomEventNameList[2].Substring(CustomEventNameList[2].IndexOf("]") + 1);
                    customEventName = CustomEventNameList[0].Substring(CustomEventNameList[0].IndexOf("[")).Replace("[", "").Replace("]", "");

                    //customEventName = CustomEventNameList[0].Replace("[", "").Replace("]", "");
                    topData = "TOP " + CustomEventNameList[2].Replace("[", "").Replace("]", "").Split('.')[0].ToString().ToLower().Replace("top", "").Trim();
                    desascData = CustomEventNameList[2].Substring(1, CustomEventNameList[2].IndexOf("]") - 1).Split('.')[1].ToString().ToUpper().Trim();

                    if (CustomEventNameList[2].Replace("[", "").Replace("]", "").Split('.').Length == 3)
                        DataSeparator = CustomEventNameList[2].Substring(1, CustomEventNameList[2].IndexOf("]") - 1).Split('.')[2].ToString().Trim();

                    customEventColumnName = CustomEventNameList[1].Replace("[", "").Replace("]", "");

                    int Index = -1;
                    if (customEventColumnName.IndexOf('(') > -1 && customEventColumnName.IndexOf(')') > -1)
                    {
                        var customEventColumnNames = customEventColumnName.Substring(0, customEventColumnName.IndexOf('('));

                        int startIndex = customEventColumnName.IndexOf('(');
                        int endIndex = customEventColumnName.IndexOf(')');

                        if (startIndex != -1 && endIndex != -1 && endIndex > startIndex)
                            Index = Convert.ToInt32(customEventColumnName.Substring(startIndex + 1, endIndex - startIndex - 1));

                        //Index = Convert.ToInt32(customEventColumnName.Substring(customEventColumnName.IndexOf('(')).Replace("(", "").Replace(")", "").Replace("[", "").Replace("]", ""));
                        customEventColumnName = customEventColumnNames;
                    }

                    //fieldNames.Add(customEventColumnName);
                    htmlContent.Replace(m.Value.ToString(), "[{*" + customEventColumnName + "*}]");
                    using (var objD = DLCustomEvents.GetDLCustomEvents(AccountId, SQLVendor))
                    {
                        var customEventColumnNames = customEventColumnName.Split('&');

                        for (int i = 0; i < customEventColumnNames.Length; i++)
                        {
                            Customevents? customevents = null;
                            if (contactsList != null && contactsList.ContactId > 0)
                                customevents = objD.GetCustomevents(contactsList.ContactId, customEventName, customEventColumnNames[i], topData, desascData);
                            else if (!String.IsNullOrEmpty(MachineId))
                                customevents = objD.GetCustomevents(0, customEventName, customEventColumnNames[i], topData, desascData, MachineId);

                            if (customevents != null)
                            {
                                try
                                {
                                    string? ReplacedCustomFieldValue = string.Empty;
                                    if (Index > -1)
                                    {
                                        ReplacedCustomFieldValue = Convert.ToString(customevents.GetType().GetProperty(customEventColumnNames[i]).GetValue(customevents, null));
                                        if (!String.IsNullOrEmpty(ReplacedCustomFieldValue))
                                        {
                                            try
                                            {
                                                ReplacedCustomFieldValue = ReplacedCustomFieldValue.Split('$')[Index].Trim();
                                                ReplacedCustomFieldValue = await Getshortlinkbyvalue(AccountId, contactsList, ReplacedCustomFieldValue, TemplateId, SendingSettingId, P5UniqueID, channeltype, IsConvertURLToShortUrl, workflowid, sqlVendor: SQLVendor);
                                                data.Clear().Append(Regex.Replace(htmlContent.ToString(), @"\[\{\*" + customEventColumnName + @"\*\}\]", StaticStartWords + ReplacedCustomFieldValue + StaticEndWords, RegexOptions.IgnoreCase));
                                                htmlContent.Clear().Append(data);
                                                break;
                                            }
                                            catch
                                            {
                                                if (fallbackColumn != null && fallbackColumn.Length > 0)
                                                {
                                                    ReplacedCustomFieldValue = fallbackColumn;
                                                    ReplacedCustomFieldValue = await Getshortlinkbyvalue(AccountId, contactsList, ReplacedCustomFieldValue, TemplateId, SendingSettingId, P5UniqueID, channeltype, IsConvertURLToShortUrl, workflowid, sqlVendor: SQLVendor);
                                                    data.Clear().Append(Regex.Replace(htmlContent.ToString(), @"\[\{\*" + customEventColumnName + @"\*\}\]", StaticStartWords + ReplacedCustomFieldValue + StaticEndWords, RegexOptions.IgnoreCase));
                                                    htmlContent.Clear().Append(data);
                                                }
                                                else if (fallbackColumn != null && fallbackColumn.Length == 0)
                                                {
                                                    ReplacedCustomFieldValue = fallbackColumn;
                                                    ReplacedCustomFieldValue = await Getshortlinkbyvalue(AccountId, contactsList, ReplacedCustomFieldValue, TemplateId, SendingSettingId, P5UniqueID, channeltype, IsConvertURLToShortUrl, workflowid, sqlVendor: SQLVendor);
                                                    data.Clear().Append(Regex.Replace(htmlContent.ToString(), @"\[\{\*" + customEventColumnName + @"\*\}\]", "", RegexOptions.IgnoreCase));
                                                    htmlContent.Clear().Append(data);
                                                }
                                            }
                                        }
                                    }
                                    else
                                    {
                                        ReplacedCustomFieldValue = Convert.ToString(customevents.GetType().GetProperty(customEventColumnNames[i]).GetValue(customevents, null));
                                        if (!String.IsNullOrEmpty(ReplacedCustomFieldValue))
                                        {
                                            ReplacedCustomFieldValue = await Getshortlinkbyvalue(AccountId, contactsList, ReplacedCustomFieldValue, TemplateId, SendingSettingId, P5UniqueID, channeltype, IsConvertURLToShortUrl, workflowid, sqlVendor: SQLVendor);

                                            if (!String.IsNullOrEmpty(DataSeparator))
                                                data.Clear().Append(Regex.Replace(htmlContent.ToString(), @"\[\{\*" + customEventColumnName + @"\*\}\]", StaticStartWords + ReplacedCustomFieldValue.Replace("$", DataSeparator) + StaticEndWords, RegexOptions.IgnoreCase));
                                            else
                                                data.Clear().Append(Regex.Replace(htmlContent.ToString(), @"\[\{\*" + customEventColumnName + @"\*\}\]", StaticStartWords + ReplacedCustomFieldValue.Replace("$", "&") + StaticEndWords, RegexOptions.IgnoreCase));
                                            htmlContent.Clear().Append(data);
                                            break;
                                        }
                                    }
                                }
                                catch { }
                            }
                        }
                    }
                }
                else if (CustomEventNameList.Length == 4)
                {
                    StaticStartWords = CustomEventNameList[0].Substring(0, CustomEventNameList[0].IndexOf("["));
                    StaticEndWords = CustomEventNameList[3].Substring(CustomEventNameList[3].IndexOf("]") + 1);
                    customEventName = CustomEventNameList[0].Substring(CustomEventNameList[0].IndexOf("[")).Replace("[", "").Replace("]", "");

                    //customEventName = CustomEventNameList[0].Replace("[", "").Replace("]", "");
                    topData = "TOP " + CustomEventNameList[2].Replace("[", "").Replace("]", "").Split('.')[0].ToString().ToLower().Replace("top", "").Trim();
                    desascData = CustomEventNameList[2].Substring(1, CustomEventNameList[2].IndexOf("]") - 1).Split('.')[1].ToString().ToUpper().Trim();

                    if (CustomEventNameList[2].Replace("[", "").Replace("]", "").Split('.').Length == 3)
                        DataSeparator = CustomEventNameList[2].Substring(1, CustomEventNameList[2].IndexOf("]") - 1).Split('.')[2].ToString().Trim();

                    fallbackColumn = CustomEventNameList[3].Substring(1, CustomEventNameList[3].IndexOf("]") - 1);

                    customEventColumnName = CustomEventNameList[1].Replace("[", "").Replace("]", "");

                    int Index = -1;
                    if (customEventColumnName.IndexOf('(') > -1 && customEventColumnName.IndexOf(')') > -1)
                    {
                        var customEventColumnNames = customEventColumnName.Substring(0, customEventColumnName.IndexOf('('));

                        int startIndex = customEventColumnName.IndexOf('(');
                        int endIndex = customEventColumnName.IndexOf(')');

                        if (startIndex != -1 && endIndex != -1 && endIndex > startIndex)
                            Index = Convert.ToInt32(customEventColumnName.Substring(startIndex + 1, endIndex - startIndex - 1));

                        //Index = Convert.ToInt32(customEventColumnName.Substring(customEventColumnName.IndexOf('(')).Replace("(", "").Replace(")", "").Replace("[", "").Replace("]", ""));
                        customEventColumnName = customEventColumnNames;
                    }

                    //fieldNames.Add(customEventColumnName);
                    htmlContent.Replace(m.Value.ToString(), "[{*" + customEventColumnName + "*}]");

                    using (var objD = DLCustomEvents.GetDLCustomEvents(AccountId, SQLVendor))
                    {
                        var customEventColumnNames = customEventColumnName.Split('&');

                        for (int i = 0; i < customEventColumnNames.Length; i++)
                        {
                            Customevents? customevents = null;
                            if (contactsList != null && contactsList.ContactId > 0)
                                customevents = objD.GetCustomevents(contactsList.ContactId, customEventName, customEventColumnNames[i], topData, desascData);
                            else if (!String.IsNullOrEmpty(MachineId))
                                customevents = objD.GetCustomevents(0, customEventName, customEventColumnNames[i], topData, desascData, MachineId);

                            if (customevents != null)
                            {
                                try
                                {
                                    string? ReplacedCustomFieldValue = string.Empty;
                                    if (Index > -1)
                                    {
                                        ReplacedCustomFieldValue = Convert.ToString(customevents.GetType().GetProperty(customEventColumnNames[i]).GetValue(customevents, null));
                                        if (!String.IsNullOrEmpty(ReplacedCustomFieldValue))
                                        {
                                            try
                                            {
                                                ReplacedCustomFieldValue = ReplacedCustomFieldValue.Split('$')[Index].Trim();
                                                ReplacedCustomFieldValue = await Getshortlinkbyvalue(AccountId, contactsList, ReplacedCustomFieldValue, TemplateId, SendingSettingId, P5UniqueID, channeltype, IsConvertURLToShortUrl, workflowid, sqlVendor: SQLVendor);
                                                data.Clear().Append(Regex.Replace(htmlContent.ToString(), @"\[\{\*" + customEventColumnName + @"\*\}\]", StaticStartWords + ReplacedCustomFieldValue + StaticEndWords, RegexOptions.IgnoreCase));
                                                htmlContent.Clear().Append(data);
                                                break;
                                            }
                                            catch
                                            {
                                                if (fallbackColumn != null && fallbackColumn.Length > 0)
                                                {
                                                    ReplacedCustomFieldValue = fallbackColumn;
                                                    ReplacedCustomFieldValue = await Getshortlinkbyvalue(AccountId, contactsList, ReplacedCustomFieldValue, TemplateId, SendingSettingId, P5UniqueID, channeltype, IsConvertURLToShortUrl, workflowid, sqlVendor: SQLVendor);
                                                    data.Clear().Append(Regex.Replace(htmlContent.ToString(), @"\[\{\*" + customEventColumnName + @"\*\}\]", StaticStartWords + ReplacedCustomFieldValue + StaticEndWords, RegexOptions.IgnoreCase));
                                                    htmlContent.Clear().Append(data);
                                                }
                                                else if (fallbackColumn != null && fallbackColumn.Length == 0)
                                                {
                                                    ReplacedCustomFieldValue = fallbackColumn;
                                                    ReplacedCustomFieldValue = await Getshortlinkbyvalue(AccountId, contactsList, ReplacedCustomFieldValue, TemplateId, SendingSettingId, P5UniqueID, channeltype, IsConvertURLToShortUrl, workflowid, sqlVendor: SQLVendor);
                                                    data.Clear().Append(Regex.Replace(htmlContent.ToString(), @"\[\{\*" + customEventColumnName + @"\*\}\]", "", RegexOptions.IgnoreCase));
                                                    htmlContent.Clear().Append(data);
                                                }
                                            }
                                        }
                                        else
                                        {
                                            if (i == (customEventColumnNames.Length - 1))
                                            {
                                                if (fallbackColumn != null && fallbackColumn.Length > 0)
                                                {
                                                    try
                                                    {
                                                        ReplacedCustomFieldValue = fallbackColumn;
                                                        ReplacedCustomFieldValue = await Getshortlinkbyvalue(AccountId, contactsList, ReplacedCustomFieldValue, TemplateId, SendingSettingId, P5UniqueID, channeltype, IsConvertURLToShortUrl, workflowid, sqlVendor: SQLVendor);
                                                        data.Clear().Append(Regex.Replace(htmlContent.ToString(), @"\[\{\*" + customEventColumnName + @"\*\}\]", StaticStartWords + ReplacedCustomFieldValue + StaticEndWords, RegexOptions.IgnoreCase));
                                                        htmlContent.Clear().Append(data);
                                                        break;
                                                    }
                                                    catch { }
                                                }
                                                else if (fallbackColumn != null && fallbackColumn.Length == 0)
                                                {
                                                    try
                                                    {
                                                        ReplacedCustomFieldValue = fallbackColumn;
                                                        ReplacedCustomFieldValue = await Getshortlinkbyvalue(AccountId, contactsList, ReplacedCustomFieldValue, TemplateId, SendingSettingId, P5UniqueID, channeltype, IsConvertURLToShortUrl, workflowid, sqlVendor: SQLVendor);
                                                        data.Clear().Append(Regex.Replace(htmlContent.ToString(), @"\[\{\*" + customEventColumnName + @"\*\}\]", "", RegexOptions.IgnoreCase));
                                                        htmlContent.Clear().Append(data);
                                                        break;
                                                    }
                                                    catch { }
                                                }
                                            }
                                        }
                                    }
                                    else
                                    {
                                        ReplacedCustomFieldValue = Convert.ToString(customevents.GetType().GetProperty(customEventColumnNames[i]).GetValue(customevents, null));
                                        if (!String.IsNullOrEmpty(ReplacedCustomFieldValue))
                                        {
                                            ReplacedCustomFieldValue = await Getshortlinkbyvalue(AccountId, contactsList, ReplacedCustomFieldValue, TemplateId, SendingSettingId, P5UniqueID, channeltype, IsConvertURLToShortUrl, workflowid, sqlVendor: SQLVendor);

                                            if (!String.IsNullOrEmpty(DataSeparator))
                                                data.Clear().Append(Regex.Replace(htmlContent.ToString(), @"\[\{\*" + customEventColumnName + @"\*\}\]", StaticStartWords + ReplacedCustomFieldValue.Replace("$", DataSeparator) + StaticEndWords, RegexOptions.IgnoreCase));
                                            else
                                                data.Clear().Append(Regex.Replace(htmlContent.ToString(), @"\[\{\*" + customEventColumnName + @"\*\}\]", StaticStartWords + ReplacedCustomFieldValue.Replace("$", "&") + StaticEndWords, RegexOptions.IgnoreCase));
                                            htmlContent.Clear().Append(data);
                                            break;
                                        }
                                        else
                                        {
                                            if (i == (customEventColumnNames.Length - 1))
                                            {
                                                if (fallbackColumn != null && fallbackColumn.Length > 0)
                                                {
                                                    try
                                                    {
                                                        ReplacedCustomFieldValue = fallbackColumn;
                                                        ReplacedCustomFieldValue = await Getshortlinkbyvalue(AccountId, contactsList, ReplacedCustomFieldValue, TemplateId, SendingSettingId, P5UniqueID, channeltype, IsConvertURLToShortUrl, workflowid, sqlVendor: SQLVendor);
                                                        if (!String.IsNullOrEmpty(DataSeparator))
                                                            data.Clear().Append(Regex.Replace(htmlContent.ToString(), @"\[\{\*" + customEventColumnName + @"\*\}\]", StaticStartWords + ReplacedCustomFieldValue.Replace("$", DataSeparator) + StaticEndWords, RegexOptions.IgnoreCase));
                                                        else
                                                            data.Clear().Append(Regex.Replace(htmlContent.ToString(), @"\[\{\*" + customEventColumnName + @"\*\}\]", StaticStartWords + ReplacedCustomFieldValue.Replace("$", "&") + StaticEndWords, RegexOptions.IgnoreCase));
                                                        htmlContent.Clear().Append(data);
                                                        break;

                                                    }
                                                    catch { }
                                                }
                                                else if (fallbackColumn != null && fallbackColumn.Length == 0)
                                                {
                                                    try
                                                    {
                                                        data.Clear().Append(Regex.Replace(htmlContent.ToString(), @"\[\{\*" + customEventColumnName + @"\*\}\]", "", RegexOptions.IgnoreCase));
                                                        htmlContent.Clear().Append(data);
                                                        break;
                                                    }
                                                    catch { }
                                                }
                                            }

                                        }
                                    }
                                }
                                catch
                                {

                                }
                            }
                            else
                            {
                                string ReplacedCustomFieldValue = string.Empty;

                                if (i == (customEventColumnNames.Length - 1))
                                {
                                    if (fallbackColumn != null && fallbackColumn.Length > 0)
                                    {
                                        ReplacedCustomFieldValue = fallbackColumn;
                                        ReplacedCustomFieldValue = await Getshortlinkbyvalue(AccountId, contactsList, ReplacedCustomFieldValue, TemplateId, SendingSettingId, P5UniqueID, channeltype, IsConvertURLToShortUrl, workflowid, sqlVendor: SQLVendor);
                                        if (!String.IsNullOrEmpty(DataSeparator))
                                            data.Clear().Append(Regex.Replace(htmlContent.ToString(), @"\[\{\*" + customEventColumnName + @"\*\}\]", StaticStartWords + ReplacedCustomFieldValue.Replace("$", DataSeparator) + StaticEndWords, RegexOptions.IgnoreCase));
                                        else
                                            data.Clear().Append(Regex.Replace(htmlContent.ToString(), @"\[\{\*" + customEventColumnName + @"\*\}\]", StaticStartWords + ReplacedCustomFieldValue.Replace("$", "&") + StaticEndWords, RegexOptions.IgnoreCase));
                                        htmlContent.Clear().Append(data);
                                        break;
                                    }
                                    else if (fallbackColumn != null && fallbackColumn.Length == 0)
                                    {
                                        data.Clear().Append(Regex.Replace(htmlContent.ToString(), @"\[\{\*" + customEventColumnName + @"\*\}\]", "", RegexOptions.IgnoreCase));
                                        htmlContent.Clear().Append(data);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return htmlContent.ToString();
        }

        public static string RemoveSpecialCharacters(string str)
        {
            return str.Replace("'", "''");
        }

        public static string GeneratePassword()
        {
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            var NewPassword = new string(
           Enumerable.Repeat(chars, 8)
                     .Select(s => s[random.Next(s.Length)])
                     .ToArray());
            return NewPassword;
        }

        public static string GetHashedString(string inputString)
        {
            string hashedString = string.Empty;
            try
            {
                byte[] salt;
                new RNGCryptoServiceProvider().GetBytes(salt = new byte[SaltSize]);
                var pbkdf2 = new Rfc2898DeriveBytes(inputString, salt, HashIteration);
                byte[] hash = pbkdf2.GetBytes(HashSize);

                byte[] hashBytes = new byte[SaltSize + HashSize];
                System.Array.Copy(salt, 0, hashBytes, 0, SaltSize);
                System.Array.Copy(hash, 0, hashBytes, SaltSize, HashSize);

                hashedString = Convert.ToBase64String(hashBytes);
            }
            catch
            {
                hashedString = string.Empty;
            }
            return hashedString;
        }
        public static bool VerifyPassword(string inputString)
        {
            try
            {
                var regex = new Regex(@"^(?=.*\d)(?=(.*[a-z]){3})(?=(.*[A-Z]){3})(?=(.*[0-9]){3})(?=(.*[!@@#\$%\^&\*]){3})(?!.*\s).{12,}$");
                return regex.IsMatch(inputString);
            }
            catch
            {
                return false;
            }
        }

        public static bool ContainsUnicodeCharacter(string input)
        {
            bool isUnicode = System.Text.ASCIIEncoding.GetEncoding(0).GetString(System.Text.ASCIIEncoding.GetEncoding(0).GetBytes(input)) != input;
            return isUnicode;
        }
        public static bool IsSmsSendingTime(SmsConfiguration configuration)
        {
            bool result = true;
            try
            {
                if (configuration != null && configuration.IsTimeRestriction != null && configuration.IsTimeRestriction.HasValue && configuration.IsTimeRestriction.Value)
                {
                    if (configuration.HolidayListJson != null && configuration.HolidayListJson != string.Empty && configuration.Holiday != null && configuration.Holiday.HasValue)
                    {
                        try
                        {
                            JArray HolidayListArray = JArray.Parse(configuration.HolidayListJson);
                            foreach (JToken item in HolidayListArray)
                            {
                                if (item["HolidayDate"].ToString() == DateTime.Now.ToString("yyyy-MM-dd"))
                                {
                                    if (configuration.Holiday.Value)
                                    {
                                        if (DateTime.Now.TimeOfDay >= configuration.HolidayStartTime.Value && DateTime.Now.TimeOfDay <= configuration.HolidayEndTime.Value)
                                        {
                                            result = true;
                                        }
                                        else
                                        {
                                            result = false;
                                        }
                                    }
                                    else
                                    {
                                        result = false;
                                    }
                                    return result;
                                }
                            }
                        }
                        catch
                        {
                            //Ignore
                        }
                    }

                    switch (DateTime.Now.DayOfWeek)
                    {
                        case DayOfWeek.Monday:
                        case DayOfWeek.Tuesday:
                        case DayOfWeek.Wednesday:
                        case DayOfWeek.Thursday:
                        case DayOfWeek.Friday:
                            if (configuration.WeekDays != null && configuration.WeekDays.HasValue && configuration.WeekDays.Value)
                            {
                                if (DateTime.Now.TimeOfDay >= configuration.WeekDayStartTime.Value && DateTime.Now.TimeOfDay <= configuration.WeekDayEndTime.Value)
                                {
                                    result = true;
                                }
                                else
                                {
                                    result = false;
                                }
                            }
                            else if (configuration.WeekDays != null && configuration.WeekDays.HasValue && !configuration.WeekDays.Value)
                            {
                                result = false;
                            }
                            break;
                        case DayOfWeek.Saturday:
                            if (configuration.Saturday != null && configuration.Saturday.HasValue && configuration.Saturday.Value)
                            {
                                if (DateTime.Now.TimeOfDay >= configuration.SaturdayStartTime.Value && DateTime.Now.TimeOfDay <= configuration.SaturdayEndTime.Value)
                                {
                                    result = true;
                                }
                                else
                                {
                                    result = false;
                                }
                            }
                            else if (configuration.Saturday != null && configuration.Saturday.HasValue && !configuration.Saturday.Value)
                            {
                                result = false;
                            }
                            break;
                        case DayOfWeek.Sunday:
                            if (configuration.Sunday != null && configuration.Sunday.HasValue && configuration.Sunday.Value)
                            {
                                if (DateTime.Now.TimeOfDay >= configuration.SundayStartTime.Value && DateTime.Now.TimeOfDay <= configuration.SundayEndTime.Value)
                                {
                                    result = true;
                                }
                                else
                                {
                                    result = false;
                                }
                            }
                            else if (configuration.Sunday != null && configuration.Sunday.HasValue && !configuration.Sunday.Value)
                            {
                                result = false;
                            }
                            break;
                    }
                }
            }
            catch
            {
                result = true;
            }
            return result;
        }
        public static Int16 GetTotalMessageParts(string MessageContent)
        {
            Int16 MessagePart = 0;
            try
            {
                bool IsUnicodeMessage = ContainsUnicodeCharacter(MessageContent);
                if (IsUnicodeMessage)
                    MessagePart = Convert.ToInt16(Math.Ceiling((double)MessageContent.Length / 70));
                else
                    MessagePart = Convert.ToInt16(Math.Ceiling((double)MessageContent.Length / 160));
            }
            catch
            {
                MessagePart = 0;
            }

            return MessagePart;
        }
        public static bool IsWhatsAppSendingTime(WhatsAppConfiguration configuration)
        {
            bool result = true;
            try
            {
                if (configuration != null && configuration.IsTimeRestriction != null && configuration.IsTimeRestriction.HasValue && configuration.IsTimeRestriction.Value)
                {
                    if (configuration.HolidayListJson != null && configuration.HolidayListJson != string.Empty && configuration.Holiday != null && configuration.Holiday.HasValue)
                    {
                        try
                        {
                            JArray HolidayListArray = JArray.Parse(configuration.HolidayListJson);
                            foreach (JToken item in HolidayListArray)
                            {
                                if (item["HolidayDate"].ToString() == DateTime.Now.ToString("yyyy-MM-dd"))
                                {
                                    if (configuration.Holiday.Value)
                                    {
                                        if (DateTime.Now.TimeOfDay >= configuration.HolidayStartTime.Value && DateTime.Now.TimeOfDay <= configuration.HolidayEndTime.Value)
                                        {
                                            result = true;
                                        }
                                        else
                                        {
                                            result = false;
                                        }
                                    }
                                    else
                                    {
                                        result = false;
                                    }
                                    return result;
                                }
                            }
                        }
                        catch
                        {
                            //Ignore
                        }
                    }

                    switch (DateTime.Now.DayOfWeek)
                    {
                        case DayOfWeek.Monday:
                        case DayOfWeek.Tuesday:
                        case DayOfWeek.Wednesday:
                        case DayOfWeek.Thursday:
                        case DayOfWeek.Friday:
                            if (configuration.WeekDays != null && configuration.WeekDays.HasValue && configuration.WeekDays.Value)
                            {
                                if (DateTime.Now.TimeOfDay >= configuration.WeekDayStartTime.Value && DateTime.Now.TimeOfDay <= configuration.WeekDayEndTime.Value)
                                {
                                    result = true;
                                }
                                else
                                {
                                    result = false;
                                }
                            }
                            else if (configuration.WeekDays != null && configuration.WeekDays.HasValue && !configuration.WeekDays.Value)
                            {
                                result = false;
                            }
                            break;
                        case DayOfWeek.Saturday:
                            if (configuration.Saturday != null && configuration.Saturday.HasValue && configuration.Saturday.Value)
                            {
                                if (DateTime.Now.TimeOfDay >= configuration.SaturdayStartTime.Value && DateTime.Now.TimeOfDay <= configuration.SaturdayEndTime.Value)
                                {
                                    result = true;
                                }
                                else
                                {
                                    result = false;
                                }
                            }
                            else if (configuration.Saturday != null && configuration.Saturday.HasValue && !configuration.Saturday.Value)
                            {
                                result = false;
                            }
                            break;
                        case DayOfWeek.Sunday:
                            if (configuration.Sunday != null && configuration.Sunday.HasValue && configuration.Sunday.Value)
                            {
                                if (DateTime.Now.TimeOfDay >= configuration.SundayStartTime.Value && DateTime.Now.TimeOfDay <= configuration.SundayEndTime.Value)
                                {
                                    result = true;
                                }
                                else
                                {
                                    result = false;
                                }
                            }
                            else if (configuration.Sunday != null && configuration.Sunday.HasValue && !configuration.Sunday.Value)
                            {
                                result = false;
                            }
                            break;
                    }
                }
            }
            catch
            {
                result = true;
            }
            return result;
        }

        public static string Base64Decode(string base64EncodedData)
        {
            try
            {
                if (!string.IsNullOrEmpty(base64EncodedData))
                {
                    var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
                    return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
                }
                else
                {
                    return base64EncodedData;
                }
            }
            catch (Exception EX)
            {
                return base64EncodedData;
            }
        }

        public static Stream ToStream(this string str)
        {
            MemoryStream stream = new MemoryStream();
            StreamWriter writer = new StreamWriter(stream);
            writer.Write(str);
            writer.Flush();
            stream.Position = 0;
            return stream;
        }

        public static bool SendMail(MailMessage msg)
        {
            try
            {
                IConfiguration Configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json", optional: false, reloadOnChange: true).Build();

                SmtpClient mailclient = new SmtpClient
                {
                    Host = Configuration.GetSection("SmtpConfiguration:Host").Value,
                    EnableSsl = true,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(Configuration.GetSection("SmtpConfiguration:From").Value, Configuration.GetSection("SmtpConfiguration:Password").Value),
                    Port = Convert.ToInt32(Configuration.GetSection("SmtpConfiguration:Port").Value)


                };
                mailclient.Send(msg);
                return true;
            }
            catch (Exception ex)
            {
                try
                {
                    using (ErrorUpdation err = new ErrorUpdation("SMTPMailSend"))
                    {
                        err.AddError(ex.Message.ToString(), "SMTP Mail not working", DateTime.Now.ToString(), "Helper->SendMail", ex.ToString());
                        err.AddXlmErrorLog(ex.Message.ToString(), "SMTP Mail not working", DateTime.Now.ToString(), "Helper->SendMail", ex.ToString());
                    }
                }
                catch
                {
                    //ignore
                }
                return false;
            }
        }

        public static bool DeleteFile(string fileFullPath)
        {
            FileInfo fileName = new FileInfo(fileFullPath);
            if (fileName.Exists)
            {
                try
                {
                    fileName.Delete();
                    return true;
                }
                catch
                {
                    return false;
                }
                finally
                {
                    fileName = null;
                }
            }
            return false;
        }

        public static void WindowsServiceStoppedMail(string serviceName)
        {
            string MessageBody = "";
            string serverName = Convert.ToString(AllConfigURLDetails.KeyValueForConfig["SERVERNAME"]);
            string EmailId = Convert.ToString(AllConfigURLDetails.KeyValueForConfig["SUPPORTEMAILID"]);
            if (EmailId != null && EmailId != string.Empty)
            {
                MessageBody = "Dear Team, Please check the " + serviceName + " in the " + serverName + " server and act accordingly. Once done reply to this mail for confirmation.";
            }
            else
            {
                EmailId = "support@plumb5.com";
                MessageBody = "Dear Team, Please check the " + serviceName + " in the " + serverName + " server and act accordingly. Also, Please add the support emailid key in 'AllConfigURL' table with the keyName 'SupportEmailId'. Once done reply to this mail for confirmation.";
            }

            string StoppedDate = DateTime.Now.ToString("MMM dd yyyy HH:mm") + " UTC";

            MailMessage mail = new MailMessage();
            mail.To.Add(EmailId);
            mail.Subject = "Windows Service " + serviceName + " has been stopped at " + StoppedDate;
            mail.Body = MessageBody;
            SendMail(mail);
        }

        public static Tuple<string, string> GetDeviceDetailsByUserAgent(string HTTP_USER_AGENT)
        {
            if (!string.IsNullOrEmpty(HTTP_USER_AGENT))
            {
                Tuple<string, string> DeviceDetails;

                string UserAgent = HTTP_USER_AGENT.ToLower();
                bool IsMobile = false;
                string MobileType = "";
                if (UserAgent.Contains("mobile"))
                {
                    IsMobile = true;
                    if (UserAgent.Contains("android"))
                        MobileType = "android";
                    else if (UserAgent.Contains("iphone"))
                        MobileType = "iphone";
                    else
                        MobileType = "Other";
                }

                DeviceDetails = new Tuple<string, string>(IsMobile ? "Mobile" : "Desktop", MobileType);
                return DeviceDetails;
            }
            return new Tuple<string, string>("", "");
        }
    }
}
