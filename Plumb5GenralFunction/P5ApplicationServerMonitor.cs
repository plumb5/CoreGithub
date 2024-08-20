using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.ServiceProcess;
using System.Management;

namespace Plumb5GenralFunction
{
    public class P5ApplicationServerMonitor
    {
        #region NATIVE functions Declaration
        public const int LOGON32_LOGON_INTERACTIVE = 2;
        public const int LOGON32_PROVIDER_DEFAULT = 0;

        WindowsIdentity impersonationContext;

        [DllImport("advapi32.dll")]
        public static extern int LogonUserA(String lpszUserName,
        String lpszDomain,
        String lpszPassword,
        int dwLogonType,
        int dwLogonProvider,
        ref IntPtr phToken);

        [DllImport("advapi32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        public static extern int DuplicateToken(IntPtr hToken, int impersonationLevel, ref IntPtr hNewToken);

        [DllImport("advapi32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        public static extern bool RevertToSelf();

        [DllImport("kernel32.dll", CharSet = CharSet.Auto)]
        public static extern bool CloseHandle(IntPtr handle);

        #endregion

        private string sUserName = string.Empty;
        private string sPassword = string.Empty;
        private string sDomain = string.Empty;
        //public string ServiceList_csv = "TimerTestService";

        public P5ApplicationServerMonitor(string UserName, String Password, String Domain)
        {
            this.sDomain = Domain;
            this.sPassword = Password;
            this.sUserName = UserName;
        }
        public string getALLStats(List<WindowsServiceDetails> ServiceList)
        {
            JObject statsObj = new JObject(
                    new JProperty("CPU", getCPUUsage()),
                    new JProperty("RAM", getRAMUsage()),
                    new JProperty("DISK", getDriveInfo()),
                    new JProperty("SERVICE", getServiceDetails(ServiceList))
            );
            return JsonConvert.SerializeObject(statsObj);
        }

        public string StartService(string serviceName)
        {
            string sStatus = string.Empty;
            if (impersonateValidUser(sUserName, sDomain, sPassword))
            {
                ServiceController sc = new ServiceController(serviceName);
                TimeSpan timeout = new TimeSpan(0, 0, 15);
                if (sc.Status == ServiceControllerStatus.Stopped)
                {
                    try
                    {
                        sc.Start();
                        sc.WaitForStatus(ServiceControllerStatus.Running, timeout);
                        sStatus = sc.Status.ToString();
                    }
                    catch (Exception ex)
                    {
                        sStatus = ex.Message;
                    }
                }
                else
                {
                    sStatus = sc.Status.ToString();
                }
                undoImpersonation();
            }
            else
            {
                sStatus = "unknown";
            }
            return sStatus;
        }
        public string StopService(string serviceName)
        {
            string sStatus = string.Empty;
            if (impersonateValidUser(sUserName, sDomain, sPassword))
            {
                ServiceController sc = new ServiceController(serviceName);
                TimeSpan timeout = new TimeSpan(0, 0, 15);
                if (sc.Status == ServiceControllerStatus.Running)
                {
                    try
                    {
                        sc.Stop();
                        sc.WaitForStatus(ServiceControllerStatus.Stopped, timeout);
                        sStatus = sc.Status.ToString();
                    }
                    catch (Exception ex)
                    {
                        sStatus = ex.Message;
                    }
                }
                else
                {
                    sStatus = sc.Status.ToString();
                }
                undoImpersonation();
            }
            else
            {
                sStatus = "unknown";
            }
            return sStatus;
        }

        #region PRIVATE FUNCTIONS
        private JObject getCPUUsage()
        {
            JObject CPUobj = null;
            if (impersonateValidUser(sUserName, sDomain, sPassword))
            {
                PerformanceCounter theCPUCounter = new PerformanceCounter("Processor", "% Processor Time", "_Total");
                theCPUCounter.NextValue();
                System.Threading.Thread.Sleep(500);
                int cpu = Convert.ToInt32(theCPUCounter.NextValue());
                var searcher = new ManagementObjectSearcher("select MaxClockSpeed from Win32_Processor");
                uint clockSpeed = 0;
                foreach (var item in searcher.Get())
                {
                    clockSpeed = (uint)item["MaxClockSpeed"];
                }
                double clockGHZ = (double)clockSpeed / (double)1000;
                CPUobj = new JObject(
                        new JProperty("Datalabel", "CPU:" + cpu + "% " + Convert.ToString(Math.Round(clockGHZ, 1)) + "GHz"),
                        new JProperty("Usedpercent", Convert.ToString(cpu)));

                undoImpersonation();
            }
            else
            {

                CPUobj = new JObject(
                           new JProperty("Datalabel", "CPU: Unknown"),
                           new JProperty("Usedpercent", "0"));
            }
            return CPUobj; //JsonConvert.SerializeObject(CPUobj, Formatting.Indented);

        }
        private JObject getRAMUsage()
        {
            JObject RAMobj = null;
            if (impersonateValidUser(sUserName, sDomain, sPassword))
            {
                PerformanceCounter theMemCounter = new PerformanceCounter("Memory", "% Committed Bytes In Use");
                PerformanceCounter ramCounter = new PerformanceCounter("Memory", "Available MBytes");
                theMemCounter.NextValue();
                ramCounter.NextValue();
                System.Threading.Thread.Sleep(500);
                int usedPercent = Convert.ToInt32(theMemCounter.NextValue());
                int availableRAM = Convert.ToInt32(ramCounter.NextValue());
                int totalRAM = (100 * availableRAM) / (100 - usedPercent);
                int usedRAM = totalRAM - availableRAM;
                RAMobj = new JObject(
                        new JProperty("Datalabel", "RAM:" + usedPercent + "% " + (usedRAM / 1024) + "Gb/" + (totalRAM / 1024) + "Gb"),
                        new JProperty("Usedpercent", Convert.ToString(usedPercent)));
                undoImpersonation();
            }
            else
            {

                RAMobj = new JObject(
                           new JProperty("Datalabel", "RAM: Unknown"),
                           new JProperty("Usedpercent", "0"));
            }
            return RAMobj; //JsonConvert.SerializeObject(RAMobj, Formatting.Indented);
        }
        private JArray getDriveInfo()
        {
            DriveInfo[] drives = DriveInfo.GetDrives();
            JArray jsDriveInfo = new JArray();
            foreach (DriveInfo drive in drives)
            {
                if (drive.IsReady)
                {
                    long usedSpace = drive.TotalSize - drive.AvailableFreeSpace;
                    long usedPercent = usedSpace * 100 / drive.TotalSize;
                    string sVolumelabel = drive.VolumeLabel == "" ? "localdisk" : drive.VolumeLabel;
                    string sDriveName = drive.Name.Replace("\\", "");
                    JObject dskObj = new JObject(
                        new JProperty("Datalabel", sVolumelabel + "[" + sDriveName + "] " + ToDiskSize(drive.AvailableFreeSpace) + " free of " + ToDiskSize(drive.TotalSize)),
                        new JProperty("Usedpercent", Convert.ToString(usedPercent)));
                    jsDriveInfo.Add(dskObj);
                }
            }

            return jsDriveInfo; // JsonConvert.SerializeObject(jsDriveInfo,Formatting.Indented); 
        }
        private JArray getServiceDetails(List<WindowsServiceDetails> ServiceList)
        {
            //string[] sServiceList = ServiceList_csv.Split(',');

            JArray jsServiceInfo = new JArray();
            if (ServiceList != null && ServiceList.Count < 0) { return jsServiceInfo; }
            ServiceController[] srvList = ServiceController.GetServices();

            foreach (var sservice in ServiceList)
            {
                ServiceController sr = Array.Find(srvList, ele => ele.ServiceName.Equals(sservice.ServiceName));
                JObject srvObj = null;
                if (sr != null)
                {
                    string currentserviceExePath = string.Empty;
                    try
                    {
                        using (ManagementObject wmiService = new ManagementObject("Win32_Service.Name='" + sservice.ServiceName + "'"))
                        {
                            wmiService.Get();
                            currentserviceExePath = wmiService["PathName"].ToString();

                        }
                    }
                    catch { }

                    srvObj = new JObject(
                                        new JProperty("Installed", "yes"),
                                        new JProperty("DisplayName", sr.DisplayName),
                                        new JProperty("ServiceName", sr.ServiceName),
                                        new JProperty("ServicePath", currentserviceExePath),
                                        new JProperty("Status", sr.Status.ToString()),
                                        new JProperty("ServiceDescription", sservice.ServiceDescription));
                }
                else
                {
                    srvObj = new JObject(
                                        new JProperty("Installed", "no"),
                                        new JProperty("DisplayName", sservice.ServiceName),
                                        new JProperty("ServiceName", sservice.ServiceName),
                                        new JProperty("ServicePath", ""),
                                        new JProperty("Status", "Stopped"),
                                        new JProperty("ServiceDescription", sservice.ServiceDescription));

                }
                jsServiceInfo.Add(srvObj);
            }

            return jsServiceInfo; // JsonConvert.SerializeObject(jsServiceInfo, Formatting.Indented); ;

        }



        private string ToDiskSize(double value)
        {
            string[] suffixes = { "bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB" };
            for (int i = 0; i < suffixes.Length; i++)
            {
                if (value <= (Math.Pow(1024, i + 1)))
                {
                    return ThreeNonZeroDigits(value / Math.Pow(1024, i)) + " " + suffixes[i];
                }
            }

            return ThreeNonZeroDigits(value / Math.Pow(1024, suffixes.Length - 1)) + " " + suffixes[suffixes.Length - 1];
        }
        private string ThreeNonZeroDigits(double value)
        {
            if (value >= 100)
            {
                // No digits after the decimal.
                return value.ToString("0,0");
            }
            else if (value >= 10)
            {
                // One digit after the decimal.
                return value.ToString("0.0");
            }
            else
            {
                // Two digits after the decimal.
                return value.ToString("0.00");
            }
        }
        private bool impersonateValidUser(String userName, String domain, String password)
        {
            WindowsIdentity tempWindowsIdentity;
            IntPtr token = IntPtr.Zero;
            IntPtr tokenDuplicate = IntPtr.Zero;

            if (RevertToSelf())
            {
                if (LogonUserA(userName, domain, password, LOGON32_LOGON_INTERACTIVE,
                LOGON32_PROVIDER_DEFAULT, ref token) != 0)
                {
                    if (DuplicateToken(token, 2, ref tokenDuplicate) != 0)
                    {
                        tempWindowsIdentity = new WindowsIdentity(tokenDuplicate);
                        //impersonationContext = tempWindowsIdentity.Impersonate();
                        if (impersonationContext != null)
                        {
                            CloseHandle(token);
                            CloseHandle(tokenDuplicate);
                            return true;
                        }
                    }
                }
            }
            if (token != IntPtr.Zero)
                CloseHandle(token);
            if (tokenDuplicate != IntPtr.Zero)
                CloseHandle(tokenDuplicate);
            return false;
        }
        private void undoImpersonation()
        {
            //impersonationContext.Undo();
        }
        #endregion
    }
}
