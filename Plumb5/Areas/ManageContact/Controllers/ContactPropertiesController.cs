using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Globalization;
using System.Data;
using System.IO.Compression;
using Plumb5.Areas.ManageContact.Dto;
namespace Plumb5.Areas.ManageContact.Controllers
{
    [Area("ManageContact")]
    public class ContactPropertiesController : BaseController
    {
        public ContactPropertiesController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /ManageContact/ContactProperties/

        public IActionResult Index()
        {
            return View("ContactProperties");
        }

    }
}
