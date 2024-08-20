namespace Plumb5.Configuration
{
    public static class OutputCacheConfig
    {
        public static IServiceCollection AddOutPutPolicy(this IServiceCollection Services)
        {
            int Seconds = 10;
            Services.AddOutputCache(options =>
            {
                options.AddBasePolicy(builder =>
                    builder.Expire(TimeSpan.FromSeconds(5)));

                options.AddPolicy("DashboardOverViewOutputCacheDuration", builder =>
                    builder.Expire(TimeSpan.FromSeconds(Seconds)));
            });

            return new ServiceCollection();
        }

    }
}
