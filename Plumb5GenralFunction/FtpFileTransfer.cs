using Renci.SshNet;
using Renci.SshNet.Sftp;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class FtpFileTransfer
    {
        /*you can refer here https://www.codeproject.com/Tips/443588/Simple-Csharp-FTP-Class */

        private string Host = null;
        private string UserName = null;
        private string Password = null;
        private FtpWebRequest FtpRequest = null;
        private FtpWebResponse FtpResponse = null;
        private Stream FtpStream = null;
        private int BufferSize = 2048;
        private string ServerIp = string.Empty;
        public FtpFileTransfer(string hostIP, string userName, string password)
        {
            ServerIp = hostIP;
            Host = hostIP.Contains("ftp") ? hostIP : "ftp://" + hostIP;
            UserName = userName;
            Password = password;
        }

        public void Upload(string RemoteFile, string LocalFile)
        {
            try
            {
                FtpRequest = (FtpWebRequest)FtpWebRequest.Create(Host + "/" + RemoteFile);
                FtpRequest.Credentials = new NetworkCredential(UserName, Password);
                FtpRequest.UseBinary = true;
                FtpRequest.UsePassive = true;
                FtpRequest.KeepAlive = true;
                FtpRequest.Proxy = null;
                FtpRequest.Method = WebRequestMethods.Ftp.UploadFile;
                FtpStream = FtpRequest.GetRequestStream();
                FileStream localFileStream = new FileStream(LocalFile, FileMode.Open);
                byte[] byteBuffer = new byte[BufferSize];
                int bytesSent = localFileStream.Read(byteBuffer, 0, BufferSize);
                try
                {
                    while (bytesSent != 0)
                    {
                        FtpStream.Write(byteBuffer, 0, bytesSent);
                        bytesSent = localFileStream.Read(byteBuffer, 0, BufferSize);
                    }
                }
                catch (Exception ex)
                {
                    using (ErrorUpdation err = new ErrorUpdation("FtpFileTransfer"))
                    {
                        err.AddError(ex.ToString(), "Ftp Upload Error", DateTime.Now.ToString(), "Upload function", ex.InnerException.ToString());
                    }
                }
                localFileStream.Close();
                FtpStream.Close();
                FtpRequest = null;
            }
            catch (Exception ex)
            {
                using (ErrorUpdation err = new ErrorUpdation("FtpFileTransfer"))
                {
                    err.AddError(ex.ToString(), "Ftp Upload Error", DateTime.Now.ToString(), "Upload function", ex.StackTrace.ToString());
                }
            }
        }

        public void Download(string RemoteFile, string LocalFile)
        {
            try
            {
                FtpRequest = (FtpWebRequest)FtpWebRequest.Create(Host + "/" + RemoteFile);
                FtpRequest.Credentials = new NetworkCredential(UserName, Password);
                FtpRequest.UseBinary = true;
                FtpRequest.UsePassive = true;
                FtpRequest.KeepAlive = true;
                FtpRequest.Proxy = null;
                FtpRequest.Method = WebRequestMethods.Ftp.DownloadFile;
                FtpResponse = (FtpWebResponse)FtpRequest.GetResponse();
                FtpStream = FtpResponse.GetResponseStream();
                FileStream localFileStream = new FileStream(LocalFile, FileMode.Create);
                byte[] byteBuffer = new byte[BufferSize];
                int bytesRead = localFileStream.Read(byteBuffer, 0, BufferSize);
                try
                {
                    while (bytesRead > 0)
                    {
                        localFileStream.Write(byteBuffer, 0, bytesRead);
                        bytesRead = FtpStream.Read(byteBuffer, 0, BufferSize);
                    }
                }
                catch (Exception ex)
                {
                    using (ErrorUpdation err = new ErrorUpdation("FtpFileTransfer"))
                    {
                        err.AddError(ex.ToString(), "Ftp Download Error", DateTime.Now.ToString(), "Download function", ex.InnerException.ToString());
                    }
                }
                localFileStream.Close();
                FtpStream.Close();
                FtpRequest = null;
            }
            catch (Exception ex)
            {
                using (ErrorUpdation err = new ErrorUpdation("FtpFileTransfer"))
                {
                    err.AddError(ex.ToString(), "Ftp Download Error", DateTime.Now.ToString(), "Download function", ex.StackTrace.ToString());
                }
            }
        }

        public void DownloadFile(string RemoteFile, string LocalFile)
        {
            try
            {
                using (WebClient request = new WebClient())
                {
                    request.Credentials = new NetworkCredential(UserName, Password);
                    byte[] fileData = request.DownloadData(Host + "/" + RemoteFile);
                    using (Stream file = System.IO.File.OpenWrite(LocalFile))
                    {
                        file.Write(fileData, 0, fileData.Length);
                    }
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation err = new ErrorUpdation("FtpFileTransfer"))
                {
                    err.AddError(ex.ToString(), "Ftp Download Error", DateTime.Now.ToString(), "DownloadFile function", ex.StackTrace.ToString());
                }
            }
        }


        public void DownloadFileWithSFTP(string RemoteFile, string LocalFile)
        {
            try
            {
                using (SftpClient sftp = new SftpClient(ServerIp, UserName, Password))
                {
                    sftp.Connect();
                    if (sftp.IsConnected)
                    {
                        using (var file = File.OpenWrite(LocalFile))
                        {
                            sftp.DownloadFile(RemoteFile, file);
                        }
                    }
                    sftp.Disconnect();
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation err = new ErrorUpdation("FtpFileTransfer"))
                {
                    err.AddError(ex.ToString(), "Ftp Download Error", DateTime.Now.ToString(), "DownloadFile function", ex.StackTrace.ToString());
                }
            }
        }

        public void Delete(string DeleteFile)
        {
            try
            {
                FtpRequest = (FtpWebRequest)WebRequest.Create(Host + "/" + DeleteFile);
                FtpRequest.Credentials = new NetworkCredential(UserName, Password);
                FtpRequest.UseBinary = true;
                FtpRequest.UsePassive = true;
                FtpRequest.KeepAlive = true;
                FtpRequest.Proxy = null;
                FtpRequest.Method = WebRequestMethods.Ftp.DeleteFile;
                FtpResponse = (FtpWebResponse)FtpRequest.GetResponse();
                FtpResponse.Close();
                FtpRequest = null;
            }
            catch (Exception ex)
            {
                using (ErrorUpdation err = new ErrorUpdation("FtpFileTransfer"))
                {
                    err.AddError(ex.ToString(), "Ftp Delete Error", DateTime.Now.ToString(), "Delete function", ex.StackTrace.ToString());
                }
            }
        }

        public void CreateDirectory(string NewDirectory)
        {
            try
            {
                FtpRequest = (FtpWebRequest)WebRequest.Create(Host + "/" + NewDirectory);
                FtpRequest.Credentials = new NetworkCredential(UserName, Password);
                FtpRequest.UseBinary = true;
                FtpRequest.UsePassive = true;
                FtpRequest.KeepAlive = true;
                FtpRequest.Proxy = null;
                FtpRequest.Method = WebRequestMethods.Ftp.MakeDirectory;
                FtpResponse = (FtpWebResponse)FtpRequest.GetResponse();
                FtpResponse.Close();
                FtpRequest = null;
            }
            catch (Exception ex)
            {
                using (ErrorUpdation err = new ErrorUpdation("FtpFileTransfer"))
                {
                    err.AddError(ex.ToString(), "Ftp CreateDirectory Error", DateTime.Now.ToString(), "CreateDirectory function", ex.StackTrace.ToString());
                }
            }
        }

        /* List Directory Contents File/Folder Name Only */
        public string[] DirectoryListSimple(string directory)
        {
            try
            {
                FtpRequest = (FtpWebRequest)FtpWebRequest.Create(Host + "/" + directory);
                FtpRequest.Credentials = new NetworkCredential(UserName, Password);
                FtpRequest.UseBinary = true;
                FtpRequest.UsePassive = true;
                FtpRequest.KeepAlive = true;
                FtpRequest.Proxy = null;
                FtpRequest.Method = WebRequestMethods.Ftp.ListDirectory;
                FtpResponse = (FtpWebResponse)FtpRequest.GetResponse();
                FtpStream = FtpResponse.GetResponseStream();
                StreamReader ftpReader = new StreamReader(FtpStream);
                string directoryRaw = null;
                try { while (ftpReader.Peek() != -1) { directoryRaw += ftpReader.ReadLine() + "|"; } }
                catch (Exception ex) { Console.WriteLine(ex.ToString()); }
                ftpReader.Close();
                FtpStream.Close();
                FtpResponse.Close();
                FtpRequest = null;
                try { string[] directoryList = directoryRaw.Split("|".ToCharArray()); return directoryList; }
                catch (Exception ex)
                {
                    using (ErrorUpdation err = new ErrorUpdation("FtpFileTransfer"))
                    {
                        err.AddError(ex.ToString(), "Ftp DirectoryListSimple Error", DateTime.Now.ToString(), "DirectoryListSimple function", ex.StackTrace.ToString());
                    }
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation err = new ErrorUpdation("FtpFileTransfer"))
                {
                    err.AddError(ex.ToString(), "Ftp DirectoryListSimple Error", DateTime.Now.ToString(), "DirectoryListSimple function", ex.StackTrace.ToString());
                }
            }
            return new string[] { "" };
        }

        /* List Directory Contents File/Folder Name Only */
        public string[] DirectoryListSimple()
        {
            try
            {
                FtpRequest = (FtpWebRequest)FtpWebRequest.Create(Host);
                FtpRequest.Credentials = new NetworkCredential(UserName, Password);
                FtpRequest.UseBinary = true;
                FtpRequest.UsePassive = true;
                FtpRequest.KeepAlive = true;
                FtpRequest.Proxy = null;
                FtpRequest.Method = WebRequestMethods.Ftp.ListDirectory;
                FtpResponse = (FtpWebResponse)FtpRequest.GetResponse();
                FtpStream = FtpResponse.GetResponseStream();
                StreamReader ftpReader = new StreamReader(FtpStream);
                string directoryRaw = null;
                try { while (ftpReader.Peek() != -1) { directoryRaw += ftpReader.ReadLine() + "|"; } }
                catch (Exception ex) { Console.WriteLine(ex.ToString()); }
                ftpReader.Close();
                FtpStream.Close();
                FtpResponse.Close();
                FtpRequest = null;
                try { string[] directoryList = directoryRaw.Split("|".ToCharArray()); return directoryList; }
                catch (Exception ex)
                {
                    using (ErrorUpdation err = new ErrorUpdation("FtpFileTransfer"))
                    {
                        err.AddError(ex.ToString(), "Ftp DirectoryListSimple Error", DateTime.Now.ToString(), "DirectoryListSimple function", ex.StackTrace.ToString());
                    }
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation err = new ErrorUpdation("FtpFileTransfer"))
                {
                    err.AddError(ex.ToString(), "Ftp DirectoryListSimple Error", DateTime.Now.ToString(), "DirectoryListSimple function", ex.StackTrace.ToString());
                }
            }
            return new string[] { "" };
        }


        /* List Directory Contents in Detail (Name, Size, Created, etc.) */
        public string[] DirectoryListDetailed(string directory)
        {
            try
            {
                FtpRequest = (FtpWebRequest)FtpWebRequest.Create(Host + "/" + directory);
                FtpRequest.Credentials = new NetworkCredential(UserName, Password);
                FtpRequest.UseBinary = true;
                FtpRequest.UsePassive = true;
                FtpRequest.KeepAlive = true;
                FtpRequest.Proxy = null;
                FtpRequest.Method = WebRequestMethods.Ftp.ListDirectoryDetails;
                FtpResponse = (FtpWebResponse)FtpRequest.GetResponse();
                FtpStream = FtpResponse.GetResponseStream();
                StreamReader ftpReader = new StreamReader(FtpStream);
                string directoryRaw = null;
                try { while (ftpReader.Peek() != -1) { directoryRaw += ftpReader.ReadLine() + "|"; } }
                catch (Exception ex) { Console.WriteLine(ex.ToString()); }
                ftpReader.Close();
                FtpStream.Close();
                FtpResponse.Close();
                FtpRequest = null;
                try { string[] directoryList = directoryRaw.Split("|".ToCharArray()); return directoryList; }
                catch (Exception ex)
                {
                    using (ErrorUpdation err = new ErrorUpdation("FtpFileTransfer"))
                    {
                        err.AddError(ex.ToString(), "Ftp DirectoryListDetailed Error", DateTime.Now.ToString(), "DirectoryListDetailed function", ex.StackTrace.ToString());
                    }
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation err = new ErrorUpdation("FtpFileTransfer"))
                {
                    err.AddError(ex.ToString(), "Ftp DirectoryListDetailed Error", DateTime.Now.ToString(), "DirectoryListDetailed function", ex.StackTrace.ToString());
                }
            }
            return new string[] { "" };
        }

        public string[] DirectoryListSimpleWithSFTP(string directory)
        {
            List<string> fileNames = new List<string>();
            try
            {
                using (SftpClient sftp = new SftpClient(ServerIp, UserName, Password))
                {
                    sftp.Connect();
                    if (sftp.IsConnected)
                    {
                        IEnumerable<SftpFile> sftpFile = sftp.ListDirectory(directory);

                        if (sftpFile != null && sftpFile.ToList().Count > 0)
                        {
                            foreach (var each in sftpFile)
                            {
                                fileNames.Add(each.Name);
                            }
                        }

                    }
                    sftp.Disconnect();

                    return fileNames.ToArray();
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation err = new ErrorUpdation("FtpFileTransfer"))
                {
                    err.AddError(ex.ToString(), "Ftp DirectoryListSimple Error", DateTime.Now.ToString(), "DirectoryListSimple function", ex.StackTrace.ToString());
                }
            }
            return new string[] { "" };
        }
    }
}
