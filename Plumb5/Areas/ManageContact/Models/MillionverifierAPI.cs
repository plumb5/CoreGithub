using Newtonsoft.Json.Linq;
using P5GenralML;
using Plumb5GenralFunction;
using RestSharp;
using System.Collections.Specialized;
using System.Net;

namespace Plumb5.Areas.ManageContact.Models
{
    public class MillionverifierAPI
    {
        EmailVerifyProviderSetting _emailVerifyProviderSetting;

        public string file_id { get; set; }
        public string file_name { get; set; }
        public string status { get; set; }
        public int unique_emails { get; set; }
        public string updated_at { get; set; }
        public int percent { get; set; }
        public int verified { get; set; }
        public int unverified { get; set; }
        public int ok { get; set; }
        public int catch_all { get; set; }
        public int disposable { get; set; }
        public int invalid { get; set; }
        public int unknown { get; set; }
        public int reverify { get; set; }
        public int estimated_time_sec { get; set; }


        public MillionverifierAPI(EmailVerifyProviderSetting emailVerifyProviderSetting)
        {
            _emailVerifyProviderSetting = emailVerifyProviderSetting;
            if (!String.IsNullOrEmpty(_emailVerifyProviderSetting.APIUrl) && _emailVerifyProviderSetting.APIUrl.LastIndexOf("/") < -1)
            {
                _emailVerifyProviderSetting.APIUrl = _emailVerifyProviderSetting.APIUrl + "/";
            }
        }

        public bool UploadTheFile(string fileName, string FileFullPath)
        {
            string response = UploadFilesToRemoteUrl(fileName, FileFullPath);

            string Errormessage = "";

            try
            {
                if (response != "" && response != null)
                {
                    JObject data = JObject.Parse(response);

                    if (data["file_id"] != null)
                    {
                        this.file_id = data["file_id"].ToString();
                        this.unique_emails = Convert.ToInt32(data["unique_emails"].ToString());

                        if (_emailVerifyProviderSetting != null && !string.IsNullOrEmpty(_emailVerifyProviderSetting.ProviderName) && _emailVerifyProviderSetting.ProviderName.ToLower() == "million verifier")
                        {
                            if (!string.IsNullOrEmpty(this.file_id) && this.file_id.Length > 0)
                                return true;
                        }
                        else if (_emailVerifyProviderSetting != null && !string.IsNullOrEmpty(_emailVerifyProviderSetting.ProviderName) && _emailVerifyProviderSetting.ProviderName.ToLower() == "hubuco")
                        {
                            this.status = data["status"].ToString();

                            if (this.status.ToLower() == "in_progress")
                                return true;
                        }
                    }
                    else if (data["file_id"] == null && data["error"] != null)
                    {
                        Errormessage = data["error"].ToString();

                        using (ErrorUpdation objError = new ErrorUpdation("UploadTheFileErrorResponse"))
                        {
                            objError.AddError(Errormessage, "", DateTime.Now.ToString(), "SendContactsToValidateBatchWise->UploadTheFileErrorResponse", "");
                        }

                        string Subject = "Bulk Email Validation --> SendContactsToValidateBatchWise ==> MethodName ==> UploadTheFileErrorResponse";
                        Helper.SendMailOnMajorError(Subject, "", Errormessage);

                        return false;
                    }
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("UploadTheFile"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "SendContactsToValidateBatchWise->UploadTheFile ==> JSON Parse", ex.ToString());
                }

                string Subject = "Bulk Email Validation --> SendContactsToValidateBatchWise ==> MethodName ==> UploadTheFile";
                Helper.SendMailOnMajorError(Subject, "", ex.Message.ToString());
            }
            return false;
        }

        private string UploadFilesToRemoteUrl(string fileName, string files)
        {
            Stream memStream = new System.IO.MemoryStream();
            ServicePointManager.Expect100Continue = true;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            try
            {
                string boundary = "----------------------------" + DateTime.Now.Ticks.ToString("x");

                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(_emailVerifyProviderSetting.APIUrl + "upload");
                request.ContentType = "multipart/form-data; boundary=" +
                                        boundary;
                request.Method = "POST";
                request.KeepAlive = true;

                var boundarybytes = System.Text.Encoding.ASCII.GetBytes("\r\n--" +
                                                                        boundary + "\r\n");
                var endBoundaryBytes = System.Text.Encoding.ASCII.GetBytes("\r\n--" +
                                                                            boundary + "--");
                NameValueCollection formFields = new NameValueCollection();
                formFields.Add("key", _emailVerifyProviderSetting.ApiKey);

                string formdataTemplate = "\r\n--" + boundary +
                                            "\r\nContent-Disposition: form-data; name=\"{0}\";\r\n\r\n{1}";

                if (formFields != null)
                {
                    foreach (string key in formFields.Keys)
                    {
                        string formitem = string.Format(formdataTemplate, key, formFields[key]);
                        byte[] formitembytes = System.Text.Encoding.UTF8.GetBytes(formitem);
                        memStream.Write(formitembytes, 0, formitembytes.Length);
                    }
                }

                string headerTemplate =
                    "Content-Disposition: form-data; name=\"{0}\"; filename=\"{1}\"\r\n" +
                    "Content-Type: application/octet-stream\r\n\r\n";


                memStream.Write(boundarybytes, 0, boundarybytes.Length);
                var header = string.Format(headerTemplate, "file_contents", fileName);
                var headerbytes = System.Text.Encoding.UTF8.GetBytes(header);

                memStream.Write(headerbytes, 0, headerbytes.Length);

                using (var fileStream = new FileStream(files, FileMode.Open, FileAccess.Read))
                {
                    var buffer = new byte[1024];
                    var bytesRead = 0;
                    while ((bytesRead = fileStream.Read(buffer, 0, buffer.Length)) != 0)
                    {
                        memStream.Write(buffer, 0, bytesRead);
                    }
                }

                memStream.Write(endBoundaryBytes, 0, endBoundaryBytes.Length);
                request.ContentLength = memStream.Length;

                using (Stream requestStream = request.GetRequestStream())
                {
                    memStream.Position = 0;
                    byte[] tempBuffer = new byte[memStream.Length];
                    memStream.Read(tempBuffer, 0, tempBuffer.Length);
                    memStream.Close();
                    requestStream.Write(tempBuffer, 0, tempBuffer.Length);
                }

                using (var response = request.GetResponse())
                {
                    Stream stream2 = response.GetResponseStream();
                    StreamReader reader2 = new StreamReader(stream2);
                    return reader2.ReadToEnd();
                }
            }
            catch (WebException webEx)
            {
                using (ErrorUpdation objError = new ErrorUpdation("UploadFilesToRemoteUrl"))
                {
                    objError.AddError(webEx.Message.ToString(), "FileName ==>" + fileName + "==> filepath==>" + files + "", DateTime.Now.ToString(), "StartGroupValidationBatchWise->Exception", webEx.ToString());
                }

                string Subject = "Error found while uploading the file to provider => MethodName ==> UploadFilesToRemoteUrl ==> FileName ==>" + fileName + "==> filepath==>" + files + "";
                Helper.SendMailOnMajorError(Subject, "", webEx.ToString());
                return "";
            }
            finally
            {
                memStream.Dispose();
            }
        }

        public string CheckStatuByFileId(string current_file_Id)
        {
            //ServicePointManager.Expect100Continue = true;
            //ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

            //var client = new RestClient(_emailVerifyProviderSetting.APIUrl + "fileinfo?key=" + _emailVerifyProviderSetting.ApiKey + "&file_id=" + current_file_Id);
            ////var request = new RestRequest(Method.Get);
            ////IRestResponse response = client.Execute(request);


            //try
            //{
            //    if (response.Content.Contains("file_not_found"))
            //    {
            //        return "file not found";
            //    }
            //    else
            //    {
            //        JObject data = JObject.Parse(response.Content);
            //        this.file_id = data["file_id"].ToString();
            //        this.file_name = data["file_name"].ToString();
            //        this.status = data["status"].ToString();
            //        this.unique_emails = Convert.ToInt32(data["unique_emails"].ToString());
            //        this.updated_at = data["updated_at"].ToString();
            //        this.percent = Convert.ToInt32(data["percent"].ToString());
            //        this.verified = Convert.ToInt32(data["verified"].ToString());
            //        this.unverified = Convert.ToInt32(data["unverified"].ToString());
            //        this.ok = Convert.ToInt32(data["ok"].ToString());
            //        this.catch_all = Convert.ToInt32(data["catch_all"].ToString());
            //        this.disposable = Convert.ToInt32(data["disposable"].ToString());
            //        this.invalid = Convert.ToInt32(data["invalid"].ToString());
            //        this.unknown = Convert.ToInt32(data["unknown"].ToString());
            //        this.reverify = Convert.ToInt32(data["reverify"].ToString());
            //        this.estimated_time_sec = Convert.ToInt32(data["estimated_time_sec"].ToString());

            //        return data["status"].ToString();
            //    }
            //}
            //catch (Exception ex)
            //{
            //    using (ErrorUpdation objError = new ErrorUpdation("MillionverifierAPI_CheckStatuByFileId"))
            //    {
            //        objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "MillionverifierAPI->CheckStatuByFileId", ex.InnerException.ToString());
            //    }
            //    return "exception";
            //}

            return null;
        }

        public string DownloadTheValidatedFile(string _folder_Path, string current_file_Id)
        {
            ServicePointManager.Expect100Continue = true;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

            var client = new RestClient(_emailVerifyProviderSetting.APIUrl + "download?filter=all&key=" + _emailVerifyProviderSetting.ApiKey + "&file_id=" + current_file_Id);
            //var request = new RestRequest(Method.GET);
            //IRestResponse response = client.Execute(request);

            string fileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + ".txt";
            string filePath = _folder_Path + "\\TempFiles\\" + fileName;
            //File.WriteAllText(filePath, response.Content);

            return filePath;
        }
    }
}
