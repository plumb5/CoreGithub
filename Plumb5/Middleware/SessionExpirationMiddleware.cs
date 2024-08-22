namespace Plumb5.Middleware
{
    public class SessionExpirationMiddleware
    {
        private readonly RequestDelegate _next;

        public SessionExpirationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Check if session is available


            if (context.Request.Path.ToString().ToLower().Contains("/login"))
            {
                await _next(context);
                return;
            }

            var sessionValue = context.Session.GetString("UserInfo");

            if (sessionValue == null)
            {
                // Session has expired or is not set
                if (context.Request.Path != "/Login")
                {
                    // Redirect to login page if not already on the login page
                    context.Response.Redirect("/Login");
                    return;
                }
            }


            // Call the next middleware in the pipeline
            await _next(context);
        }
    }
}
