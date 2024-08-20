using System;

namespace P5GenralML
{
    public class MLConnector
    {
        public string ConfigurationType { get; set; }
        public string ConfigurationName { get; set; }
        public string ConfigurationUrl { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string TableName { get; set; }
        public DateTime Date { get; set; }
        public int Id { get; set; }
        public int Isverified { get; set; }
        public DateTime LastSynced
        {
            get;
            set;
        }
        public int TotalSync { get; set; }
        public string Type { get; set; }
    }
}
