using P5GenralML;

namespace IP5GenralDL
{
    public interface IDLIpAddressDetails
    {
        Task<IpligenceDAS> IpAddressBelongsToINRorUSD(string IpAddress);
    }
}
