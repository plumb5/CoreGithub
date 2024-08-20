using IP5GenralDL;

namespace P5GenralDL
{
    public class DLAdminWebLogger
    {
        public static IDLAdminWebLogger GETDLAdminWebLogger(int AccountId, string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAdminWebLoggerSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAdminWebLoggerPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
