using Google.Ads.GoogleAds;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using P5GenralDL;
using Plumb5.Configuration;
using Plumb5GenralFunction;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = null;
    options.JsonSerializerOptions.DictionaryKeyPolicy = null;
});
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Set timeout for session data
    options.Cookie.HttpOnly = true; // Make the session cookie HTTP only
    options.Cookie.IsEssential = true; // Ensure the session cookie is essential
});
builder.Services.AddHttpContextAccessor();
builder.Services.AddOutputCache(options =>
{
    // Add a base policy that applies to all endpoints
    options.AddBasePolicy(basePolicy => basePolicy.Expire(TimeSpan.FromMinutes(5)));

});
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Login/Index";
        options.AccessDeniedPath = "/Login/AccessDenied";
    });
builder.Services.AddOutPutPolicy();
//builder.Services.Configure<IISServerOptions>(options =>
//{
//    options.MaxRequestBodySize = int.MaxValue;
//});
//builder.Services.Configure<KestrelServerOptions>(options =>
//{
//    options.Limits.MaxRequestBodySize = int.MaxValue;
//});
builder.Services.Configure<FormOptions>(options =>
{
    options.ValueLengthLimit = int.MaxValue;
    options.MultipartBodyLengthLimit = int.MaxValue;
    options.MultipartHeadersLengthLimit = int.MaxValue;
});
builder.Services.AddInfrastructure(builder.Configuration);
await builder.Services.AddGeneralInfrastructure(builder.Configuration);
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}
app.UseStaticFiles();
app.UseRouting();

app.UseAuthorization();
app.UseSession();

//app.MapControllerRoute(
//    name: "default",
//    pattern: "{controller=Login}/{action=Index}/{id?}");

app.UseOutputCache();


//app.UseEndpoints(endpoints =>
//{
//    endpoints.MapControllerRoute(
//      name: "Dashboard",
//      pattern: "{area:exists}/{controller=DashboardOverview}/{action=Index}/{id?}");
//    endpoints.MapControllerRoute(
//      name: "default",
//      pattern: "{controller=Login}/{action=Index}/{id?}");

//});

#pragma warning disable ASP0014
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
            name: "areas",
            pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}"
          );

    endpoints.MapControllerRoute(
         name: "default",
         pattern: "{controller=Login}/{action=Index}/{id?}"
        );
});
#pragma warning restore ASP0014


app.Run();
