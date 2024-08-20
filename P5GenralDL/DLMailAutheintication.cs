using IP5GenralDL;

namespace P5GenralDL
{
    public class DLMailAutheintication
    {
        public static IDLMailAutheintication GetMailAutheintication(int AccountId, string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLMailAutheinticationSQL(AccountId);
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLMailAutheinticationPG(AccountId);
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }       
    }
}
