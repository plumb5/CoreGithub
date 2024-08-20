using Amazon;  
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text; 
using Amazon.CloudWatch;
using Amazon.CloudWatch.Model;
using Microsoft.Extensions.Configuration;


namespace Plumb5GenralFunction
{
    public class P5AWSServerMonitor
    {
        IConfiguration Configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json", optional: false, reloadOnChange: true).Build();
         
        public string ec2InstanceId = null;
        private Amazon.Runtime.BasicAWSCredentials awsCredentials;
        private RegionEndpoint myRegion;
        private JObject MetricsJSON;

        public P5AWSServerMonitor(string sAccessKey, string sSecretKey, string sRegion)
        {
            awsCredentials = new Amazon.Runtime.BasicAWSCredentials(sAccessKey, sSecretKey);
            myRegion = RegionEndpoint.GetBySystemName(sRegion);

        }

        public string getAllMetrics(int NoofDays)
        {
            ec2InstanceId= Configuration.GetSection("InstanceId").Value.ToString();
            string[] instanceList = ec2InstanceId.Split(',');
            StringBuilder json = new StringBuilder("{");
            foreach (string str in instanceList)
            {

                json.Append("'" + str + "':{");
                json.Append("'cpu':[],");
                json.Append("'nw_in':[],");
                json.Append("'nw_out':[],");
                json.Append("'dsk_read':[],");
                json.Append("'dsk_write':[]");
                json.Append("},");
            }
            json.Append("}");
            MetricsJSON = JObject.Parse(json.ToString());
            foreach (string str in instanceList)
            {
                GetInstanceMetrics(str, NoofDays);
            }
            return JsonConvert.SerializeObject(MetricsJSON);
        }
        private async void GetInstanceMetrics(string instanceID, int nDays)
        {
            JObject InstanceObj = (JObject)MetricsJSON[instanceID];
            JArray statsObj = (JArray)InstanceObj["cpu"];
            string retval = string.Empty;
            Dimension filter = new Dimension
            {
                Name = "InstanceId",
                Value = instanceID
            };

            using(AmazonCloudWatchClient client  = new AmazonCloudWatchClient(awsCredentials, myRegion))
            {
                #region CPU utilization
                var request = new GetMetricStatisticsRequest
                {
                    Dimensions = new List<Dimension>() { filter },
                    EndTime = TimeZoneInfo.ConvertTimeToUtc(DateTime.Today, TimeZoneInfo.Local),
                    MetricName = "CPUUtilization",
                    Namespace = "AWS/EC2",
                    // Get statistics by day.
                    Period = (int)TimeSpan.FromDays(1).TotalSeconds,
                    // Get statistics for the past nDays.
                    StartTime = TimeZoneInfo.ConvertTimeToUtc(DateTime.Today.Subtract(TimeSpan.FromDays(nDays)), TimeZoneInfo.Local),
                    // Get Avg statistics
                    Statistics = new List<string>() { "Maximum" },
                    Unit = StandardUnit.Percent
                };

                var response = await client.GetMetricStatisticsAsync(request);
                if (response.Datapoints.Count > 0)
                {
                    List<Datapoint> SortedList = response.Datapoints.OrderByDescending(o => o.Timestamp).ToList();
                    foreach (var point in SortedList)
                    {
                        JObject tempJobj = new JObject(
                            new JProperty("TimestampUtc", point.Timestamp.ToShortDateString()),
                            new JProperty("UsedPercent", Convert.ToInt32(point.Maximum))
                            );
                        statsObj.Add(tempJobj);
                    }

                }
                #endregion
                #region Network in (Mbytes)
                statsObj = (JArray)InstanceObj["nw_in"];
                request = new GetMetricStatisticsRequest
                {
                    Dimensions = new List<Dimension>() { filter },
                    EndTime = TimeZoneInfo.ConvertTimeToUtc(DateTime.Today, TimeZoneInfo.Local),
                    MetricName = "NetworkIn",
                    Namespace = "AWS/EC2",
                    // Get statistics by day.
                    Period = (int)TimeSpan.FromDays(1).TotalSeconds,
                    // Get statistics for the past nDays.
                    StartTime = TimeZoneInfo.ConvertTimeToUtc(DateTime.Today.Subtract(TimeSpan.FromDays(nDays)), TimeZoneInfo.Local),
                    // Get Avg statistics
                    Statistics = new List<string>() { "Maximum" },
                    Unit = StandardUnit.Bytes
                };
                  response = await client.GetMetricStatisticsAsync(request);

                if (response.Datapoints.Count > 0)
                {
                    List<Datapoint> SortedList1 = response.Datapoints.OrderByDescending(o => o.Timestamp).ToList();
                    foreach (var point in SortedList1)
                    {
                        JObject tempJobj = new JObject(
                            new JProperty("TimestampUtc", point.Timestamp.ToShortDateString()),
                            new JProperty("MBytes", Convert.ToInt32(point.Maximum / 100000))
                            );
                        statsObj.Add(tempJobj);
                    }

                }
                #endregion
                #region Network out (Mbytes)
                statsObj = (JArray)InstanceObj["nw_out"];
                request = new GetMetricStatisticsRequest
                {
                    Dimensions = new List<Dimension>() { filter },
                    EndTime = TimeZoneInfo.ConvertTimeToUtc(DateTime.Today, TimeZoneInfo.Local),
                    MetricName = "NetworkOut",
                    Namespace = "AWS/EC2",
                    // Get statistics by day.
                    Period = (int)TimeSpan.FromDays(1).TotalSeconds,
                    // Get statistics for the past nDays.
                    StartTime = TimeZoneInfo.ConvertTimeToUtc(DateTime.Today.Subtract(TimeSpan.FromDays(nDays)), TimeZoneInfo.Local),
                    // Get Avg statistics
                    Statistics = new List<string>() { "Maximum" },
                    Unit = StandardUnit.Bytes
                };
                  response = await client.GetMetricStatisticsAsync(request);

                if (response.Datapoints.Count > 0)
                {
                    List<Datapoint> SortedList2 = response.Datapoints.OrderByDescending(o => o.Timestamp).ToList();
                    foreach (var point in SortedList2)
                    {
                        JObject tempJobj = new JObject(
                            new JProperty("TimestampUtc", point.Timestamp.ToShortDateString()),
                            new JProperty("MBytes", Convert.ToInt32(point.Maximum / 100000))
                            );
                        statsObj.Add(tempJobj);
                    }

                }
                #endregion
                #region Disk Read (Mbytes)
                statsObj = (JArray)InstanceObj["dsk_read"];
                request = new GetMetricStatisticsRequest
                {
                    Dimensions = new List<Dimension>() { filter },
                    EndTime = TimeZoneInfo.ConvertTimeToUtc(DateTime.Today, TimeZoneInfo.Local),
                    MetricName = "DiskReadBytes",
                    Namespace = "AWS/EC2",
                    // Get statistics by day.
                    Period = (int)TimeSpan.FromDays(1).TotalSeconds,
                    // Get statistics for the past nDays.
                    StartTime = TimeZoneInfo.ConvertTimeToUtc(DateTime.Today.Subtract(TimeSpan.FromDays(nDays)), TimeZoneInfo.Local),
                    // Get Avg statistics
                    Statistics = new List<string>() { "Maximum" },
                    Unit = StandardUnit.Bytes
                };
                  response = await client.GetMetricStatisticsAsync(request);

                if (response.Datapoints.Count > 0)
                {
                    List<Datapoint> SortedList3 = response.Datapoints.OrderByDescending(o => o.Timestamp).ToList();
                    foreach (var point in SortedList3)
                    {
                        JObject tempJobj = new JObject(
                            new JProperty("TimestampUtc", point.Timestamp.ToShortDateString()),
                            new JProperty("MBytes", Convert.ToInt32(point.Maximum / 1000000))
                            );
                        statsObj.Add(tempJobj);
                    }

                }
                #endregion
                #region Disk Write (Mbytes)
                statsObj = (JArray)InstanceObj["dsk_write"];
                request = new GetMetricStatisticsRequest
                {
                    Dimensions = new List<Dimension>() { filter },
                    EndTime = TimeZoneInfo.ConvertTimeToUtc(DateTime.Today, TimeZoneInfo.Local),
                    MetricName = "DiskWriteBytes",
                    Namespace = "AWS/EC2",
                    // Get statistics by day.
                    Period = (int)TimeSpan.FromDays(1).TotalSeconds,
                    // Get statistics for the past nDays.
                    StartTime = TimeZoneInfo.ConvertTimeToUtc(DateTime.Today.Subtract(TimeSpan.FromDays(nDays)), TimeZoneInfo.Local),
                    // Get Avg statistics
                    Statistics = new List<string>() { "Maximum" },
                    Unit = StandardUnit.Bytes
                };
                  response = await client.GetMetricStatisticsAsync(request);

                if (response.Datapoints.Count > 0)
                {

                    List<Datapoint> SortedList4 = response.Datapoints.OrderByDescending(o => o.Timestamp).ToList();
                    foreach (var point in SortedList4)
                    {
                        JObject tempJobj = new JObject(
                            new JProperty("TimestampUtc", point.Timestamp.ToShortDateString()),
                            new JProperty("MBytes", Convert.ToInt32(point.Maximum / 100000))
                            );
                        statsObj.Add(tempJobj);
                    }

                }
                #endregion
            }


        }

    }
}
