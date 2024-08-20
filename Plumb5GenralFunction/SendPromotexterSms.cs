        "locale": "fr"
          },
          "lib/net8.0/it/Microsoft.Data.SqlClient.resources.dll": {
            "locale": "it"
          },
          "lib/net8.0/ja/Microsoft.Data.SqlClient.resources.dll": {
            "locale": "ja"
          },
          "lib/net8.0/ko/Microsoft.Data.SqlClient.resources.dll": {
            "locale": "ko"
          },
          "lib/net8.0/pt-BR/Microsoft.Data.SqlClient.resources.dll": {
            "locale": "pt-BR"
          },
          "lib/net8.0/ru/Microsoft.Data.SqlClient.resources.dll": {
            "locale": "ru"
          },
          "lib/net8.0/zh-Hans/Microsoft.Data.SqlClient.resources.dll": {
            "locale": "zh-Hans"
          },
          "lib/net8.0/zh-Hant/Microsoft.Data.SqlClient.resources.dll": {
            "locale": "zh-Hant"
          }
        },
        "runtimeTargets": {
          "runtimes/unix/lib/net8.0/Microsoft.Data.SqlClient.dll": {
            "assetType": "runtime",
            "rid": "unix"
          },
          "runtimes/win/lib/net8.0/Microsoft.Data.SqlClient.dll": {
            "assetType": "runtime",
            "rid": "win"
          }
        }
      },
      "Microsoft.Data.SqlClient.SNI.runtime/5.2.0": {
        "type": "package",
        "runtimeTargets": {
          "runtimes/win-arm/native/Microsoft.Data.SqlClient.SNI.dll": {
            "assetType": "native",
            "rid": "win-arm"
          },
          "runtimes/win-arm64/native/Microsoft.Data.SqlClient.SNI.dll": {
            "assetType": "native",
            "rid": "win-arm64"
          },
          "runtimes/win-x64/native/Microsoft.Data.SqlClient.SNI.dll": {
            "assetType": "native",
            "rid": "win-x64"
          },
          "runtimes/win-x86/native/Microsoft.Data.SqlClient.SNI.dll": {
            "assetType": "native",
            "rid": "win-x86"
          }
        }
      },
      "Microsoft.DiaSymReader/2.0.0": {
        "type": "package",
        "compile": {
          "lib/netstandard2.0/Microsoft.DiaSymReader.dll": {
            "related": ".pdb;.xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.DiaSymReader.dll": {
            "related": ".pdb;.xml"
          }
        }
      },
      "Microsoft.DotNet.Scaffolding.Shared/8.0.3": {
        "type": "package",
        "dependencies": {
          "Humanizer": "2.14.1",
          "Microsoft.CodeAnalysis.CSharp.Features": "4.8.0",
          "Microsoft.Extensions.DependencyModel": "8.0.0",
          "Mono.TextTemplating": "2.3.1",
          "Newtonsoft.Json": "13.0.3",
          "NuGet.ProjectModel": "6.9.1"
        },
        "compile": {
          "lib/netstandard2.0/Microsoft.DotNet.Scaffolding.Shared.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.DotNet.Scaffolding.Shared.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.Extensions.Caching.Abstractions/8.0.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.Extensions.Primitives": "8.0.0"
        },
        "compile": {
          "lib/net8.0/Microsoft.Extensions.Caching.Abstractions.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.Extensions.Caching.Abstractions.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        }
      },
      "Microsoft.Extensions.Caching.Memory/8.0.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.Extensions.Caching.Abstractions": "8.0.0",
          "Microsoft.Extensions.DependencyInjection.Abstractions": "8.0.0",
          "Microsoft.Extensions.Logging.Abstractions": "8.0.0",
          "Microsoft.Extensions.Options": "8.0.0",
          "Microsoft.Extensions.Primitives": "8.0.0"
        },
        "compile": {
          "lib/net8.0/Microsoft.Extensions.Caching.Memory.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.Extensions.Caching.Memory.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        }
      },
      "Microsoft.Extensions.Configuration/8.0.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.Extensions.Configuration.Abstractions": "8.0.0",
          "Microsoft.Extensions.Primitives": "8.0.0"
        },
        "compile": {
          "lib/net8.0/Microsoft.Extensions.Configuration.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.Extensions.Configuration.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        }
      },
      "Microsoft.Extensions.Configuration.Abstractions/8.0.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.Extensions.Primitives": "8.0.0"
        },
        "compile": {
          "lib/net8.0/Microsoft.Extensions.Configuration.Abstractions.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.Extensions.Configuration.Abstractions.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        }
      },
      "Microsoft.Extensions.Configuration.FileExtensions/8.0.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.Extensions.Configuration": "8.0.0",
          "Microsoft.Extensions.Configuration.Abstractions": "8.0.0",
          "Microsoft.Extensions.FileProviders.Abstractions": "8.0.0",
          "Microsoft.Extensions.FileProviders.Physical": "8.0.0",
          "Microsoft.Extensions.Primitives": "8.0.0"
        },
        "compile": {
          "lib/net8.0/Microsoft.Extensions.Configuration.FileExtensions.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.Extensions.Configuration.FileExtensions.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        }
      },
      "Microsoft.Extensions.Configuration.Json/8.0.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.Extensions.Configuration": "8.0.0",
          "Microsoft.Extensions.Configuration.Abstractions": "8.0.0",
          "Microsoft.Extensions.Configuration.FileExtensions": "8.0.0",
          "Microsoft.Extensions.FileProviders.Abstractions": "8.0.0",
          "System.Text.Json": "8.0.0"
        },
        "compile": {
          "lib/net8.0/Microsoft.Extensions.Configuration.Json.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.Extensions.Configuration.Json.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        }
      },
      "Microsoft.Extensions.DependencyInjection/8.0.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.Extensions.DependencyInjection.Abstractions": "8.0.0"
        },
        "compile": {
          "lib/net8.0/Microsoft.Extensions.DependencyInjection.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.Extensions.DependencyInjection.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        }
      },
      "Microsoft.Extensions.DependencyInjection.Abstractions/8.0.0": {
        "type": "package",
        "compile": {
          "lib/net8.0/Microsoft.Extensions.DependencyInjection.Abstractions.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.Extensions.DependencyInjection.Abstractions.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        }
      },
      "Microsoft.Extensions.DependencyModel/8.0.0": {
        "type": "package",
        "dependencies": {
          "System.Text.Encodings.Web": "8.0.0",
          "System.Text.Json": "8.0.0"
        },
        "compile": {
          "lib/net8.0/Microsoft.Extensions.DependencyModel.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.Extensions.DependencyModel.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        }
      },
      "Microsoft.Extensions.FileProviders.Abstractions/8.0.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.Extensions.Primitives": "8.0.0"
        },
        "compile": {
          "lib/net8.0/Microsoft.Extensions.FileProviders.Abstractions.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.Extensions.FileProviders.Abstractions.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        }
      },
      "Microsoft.Extensions.FileProviders.Physical/8.0.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.Extensions.FileProviders.Abstractions": "8.0.0",
          "Microsoft.Extensions.FileSystemGlobbing": "8.0.0",
          "Microsoft.Extensions.Primitives": "8.0.0"
        },
        "compile": {
          "lib/net8.0/Microsoft.Extensions.FileProviders.Physical.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.Extensions.FileProviders.Physical.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        }
      },
      "Microsoft.Extensions.FileSystemGlobbing/8.0.0": {
        "type": "package",
        "compile": {
          "lib/net8.0/Microsoft.Extensions.FileSystemGlobbing.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.Extensions.FileSystemGlobbing.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        }
      },
      "Microsoft.Extensions.Hosting.Abstractions/2.2.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.Extensions.Configuration.Abstractions": "2.2.0",
          "Microsoft.Extensions.DependencyInjection.Abstractions": "2.2.0",
          "Microsoft.Extensions.FileProviders.Abstractions": "2.2.0",
          "Microsoft.Extensions.Logging.Abstractions": "2.2.0"
        },
        "compile": {
          "lib/netstandard2.0/Microsoft.Extensions.Hosting.Abstractions.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.Extensions.Hosting.Abstractions.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.Extensions.Logging.Abstractions/8.0.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.Extensions.DependencyInjection.Abstractions": "8.0.0"
        },
        "compile": {
          "lib/net8.0/Microsoft.Extensions.Logging.Abstractions.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.Extensions.Logging.Abstractions.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/Microsoft.Extensions.Logging.Abstractions.targets": {}
        }
      },
      "Microsoft.Extensions.ObjectPool/2.2.0": {
        "type": "package",
        "compile": {
          "lib/netstandard2.0/Microsoft.Extensions.ObjectPool.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.Extensions.ObjectPool.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.Extensions.Options/8.0.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.Extensions.DependencyInjection.Abstractions": "8.0.0",
          "Microsoft.Extensions.Primitives": "8.0.0"
        },
        "compile": {
          "lib/net8.0/Microsoft.Extensions.Options.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.Extensions.Options.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/Microsoft.Extensions.Options.targets": {}
        }
      },
      "Microsoft.Extensions.Primitives/8.0.0": {
        "type": "package",
        "compile": {
          "lib/net8.0/Microsoft.Extensions.Primitives.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.Extensions.Primitives.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        }
      },
      "Microsoft.Identity.Client/4.56.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.IdentityModel.Abstractions": "6.22.0"
        },
        "compile": {
          "lib/net6.0/Microsoft.Identity.Client.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net6.0/Microsoft.Identity.Client.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.Identity.Client.Extensions.Msal/4.56.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.Identity.Client": "4.56.0",
          "System.IO.FileSystem.AccessControl": "5.0.0",
          "System.Security.Cryptography.ProtectedData": "4.5.0"
        },
        "compile": {
          "lib/netstandard2.0/Microsoft.Identity.Client.Extensions.Msal.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.Identity.Client.Extensions.Msal.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.IdentityModel.Abstractions/6.35.0": {
        "type": "package",
        "compile": {
          "lib/net6.0/Microsoft.IdentityModel.Abstractions.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net6.0/Microsoft.IdentityModel.Abstractions.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.IdentityModel.JsonWebTokens/6.35.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.IdentityModel.Tokens": "6.35.0",
          "System.Text.Encoding": "4.3.0",
          "System.Text.Encodings.Web": "4.7.2",
          "System.Text.Json": "4.7.2"
        },
        "compile": {
          "lib/net6.0/Microsoft.IdentityModel.JsonWebTokens.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net6.0/Microsoft.IdentityModel.JsonWebTokens.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.IdentityModel.Logging/6.35.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.IdentityModel.Abstractions": "6.35.0"
        },
        "compile": {
          "lib/net6.0/Microsoft.IdentityModel.Logging.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net6.0/Microsoft.IdentityModel.Logging.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.IdentityModel.Protocols/6.35.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.IdentityModel.Logging": "6.35.0",
          "Microsoft.IdentityModel.Tokens": "6.35.0"
        },
        "compile": {
          "lib/net6.0/Microsoft.IdentityModel.Protocols.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net6.0/Microsoft.IdentityModel.Protocols.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.IdentityModel.Protocols.OpenIdConnect/6.35.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.IdentityModel.Protocols": "6.35.0",
          "System.IdentityModel.Tokens.Jwt": "6.35.0"
        },
        "compile": {
          "lib/net6.0/Microsoft.IdentityModel.Protocols.OpenIdConnect.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net6.0/Microsoft.IdentityModel.Protocols.OpenIdConnect.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.IdentityModel.Tokens/6.35.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.CSharp": "4.5.0",
          "Microsoft.IdentityModel.Logging": "6.35.0",
          "System.Security.Cryptography.Cng": "4.5.0"
        },
        "compile": {
          "lib/net6.0/Microsoft.IdentityModel.Tokens.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net6.0/Microsoft.IdentityModel.Tokens.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.IO.RecyclableMemoryStream/3.0.0": {
        "type": "package",
        "compile": {
          "lib/net6.0/Microsoft.IO.RecyclableMemoryStream.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net6.0/Microsoft.IO.RecyclableMemoryStream.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.Net.Http.Headers/2.2.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.Extensions.Primitives": "2.2.0",
          "System.Buffers": "4.5.0"
        },
        "compile": {
          "lib/netstandard2.0/Microsoft.Net.Http.Headers.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.Net.Http.Headers.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.NET.StringTools/17.8.3": {
        "type": "package",
        "compile": {
          "ref/net8.0/Microsoft.NET.StringTools.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.NET.StringTools.dll": {
            "related": ".pdb;.xml"
          }
        }
      },
      "Microsoft.NETCore.Platforms/5.0.0": {
        "type": "package",
        "compile": {
          "lib/netstandard1.0/_._": {}
        },
        "runtime": {
          "lib/netstandard1.0/_._": {}
        }
      },
      "Microsoft.NETCore.Targets/1.1.0": {
        "type": "package",
        "compile": {
          "lib/netstandard1.0/_._": {}
        },
        "runtime": {
          "lib/netstandard1.0/_._": {}
        }
      },
      "Microsoft.SqlServer.Server/1.0.0": {
        "type": "package",
        "compile": {
          "lib/netstandard2.0/Microsoft.SqlServer.Server.dll": {
            "related": ".pdb;.xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.SqlServer.Server.dll": {
            "related": ".pdb;.xml"
          }
        }
      },
      "Microsoft.VisualStudio.Web.CodeGeneration/8.0.3": {
        "type": "package",
        "dependencies": {
          "Microsoft.Extensions.DependencyInjection": "8.0.0",
          "Microsoft.VisualStudio.Web.CodeGeneration.EntityFrameworkCore": "8.0.3"
        },
        "compile": {
          "lib/net8.0/Microsoft.VisualStudio.Web.CodeGeneration.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.VisualStudio.Web.CodeGeneration.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.VisualStudio.Web.CodeGeneration.Core/8.0.3": {
        "type": "package",
        "dependencies": {
          "Microsoft.Extensions.DependencyInjection": "8.0.0",
          "Microsoft.VisualStudio.Web.CodeGeneration.Templating": "8.0.3",
          "Newtonsoft.Json": "13.0.3"
        },
        "compile": {
          "lib/net8.0/Microsoft.VisualStudio.Web.CodeGeneration.Core.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.VisualStudio.Web.CodeGeneration.Core.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.VisualStudio.Web.CodeGeneration.Design/8.0.3": {
        "type": "package",
        "dependencies": {
          "Microsoft.DotNet.Scaffolding.Shared": "8.0.3",
          "Microsoft.VisualStudio.Web.CodeGenerators.Mvc": "8.0.3"
        },
        "compile": {
          "lib/net8.0/dotnet-aspnet-codegenerator-design.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/dotnet-aspnet-codegenerator-design.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.VisualStudio.Web.CodeGeneration.EntityFrameworkCore/8.0.3": {
        "type": "package",
        "dependencies": {
          "Microsoft.DotNet.Scaffolding.Shared": "8.0.3",
          "Microsoft.VisualStudio.Web.CodeGeneration.Core": "8.0.3"
        },
        "compile": {
          "lib/net8.0/Microsoft.VisualStudio.Web.CodeGeneration.EntityFrameworkCore.dll": {
            "related": ".runtimeconfig.json;.xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.VisualStudio.Web.CodeGeneration.EntityFrameworkCore.dll": {
            "related": ".runtimeconfig.json;.xml"
          }
        }
      },
      "Microsoft.VisualStudio.Web.CodeGeneration.Templating/8.0.3": {
        "type": "package",
        "dependencies": {
          "Microsoft.AspNetCore.Razor.Language": "6.0.24",
          "Microsoft.CodeAnalysis.CSharp": "4.8.0",
          "Microsoft.CodeAnalysis.Razor": "6.0.24",
          "Microsoft.VisualStudio.Web.CodeGeneration.Utils": "8.0.3"
        },
        "compile": {
          "lib/net8.0/Microsoft.VisualStudio.Web.CodeGeneration.Templating.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.VisualStudio.Web.CodeGeneration.Templating.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.VisualStudio.Web.CodeGeneration.Utils/8.0.3": {
        "type": "package",
        "dependencies": {
          "Microsoft.Build": "17.8.3",
          "Microsoft.CodeAnalysis.CSharp.Workspaces": "4.8.0",
          "Microsoft.DotNet.Scaffolding.Shared": "8.0.3",
          "Newtonsoft.Json": "13.0.3"
        },
        "compile": {
          "lib/net8.0/Microsoft.VisualStudio.Web.CodeGeneration.Utils.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.VisualStudio.Web.CodeGeneration.Utils.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.VisualStudio.Web.CodeGenerators.Mvc/8.0.3": {
        "type": "package",
        "dependencies": {
          "Microsoft.DotNet.Scaffolding.Shared": "8.0.3",
          "Microsoft.VisualStudio.Web.CodeGeneration": "8.0.3"
        },
        "compile": {
          "lib/net8.0/Microsoft.VisualStudio.Web.CodeGenerators.Mvc.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.VisualStudio.Web.CodeGenerators.Mvc.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.Web.Administration/11.1.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.Win32.Registry": "4.0.0",
          "NETStandard.Library": "1.6.0",
          "System.Diagnostics.TraceSource": "4.0.0",
          "System.Reflection.TypeExtensions": "4.4.0",
          "System.Security.Principal.Windows": "4.0.0",
          "System.ServiceProcess.ServiceController": "4.1.0"
        },
        "compile": {
          "lib/netstandard1.5/Microsoft.Web.Administration.dll": {}
        },
        "runtime": {
          "lib/netstandard1.5/Microsoft.Web.Administration.dll": {}
        }
      },
      "Microsoft.Win32.Primitives/4.0.1": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "1.0.1",
          "Microsoft.NETCore.Targets": "1.0.1",
          "System.Runtime": "4.1.0"
        },
        "compile": {
          "ref/netstandard1.3/Microsoft.Win32.Primitives.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.Win32.Registry/4.0.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "1.0.1",
          "System.Collections": "4.0.11",
          "System.Globalization": "4.0.11",
          "System.Resources.ResourceManager": "4.0.1",
          "System.Runtime": "4.1.0",
          "System.Runtime.Extensions": "4.1.0",
          "System.Runtime.Handles": "4.0.1",
          "System.Runtime.InteropServices": "4.1.0"
        },
        "compile": {
          "ref/netstandard1.3/Microsoft.Win32.Registry.dll": {
            "related": ".xml"
          }
        },
        "runtimeTargets": {
          "runtimes/unix/lib/netstandard1.3/Microsoft.Win32.Registry.dll": {
            "assetType": "runtime",
            "rid": "unix"
          },
          "runtimes/win/lib/netstandard1.3/Microsoft.Win32.Registry.dll": {
            "assetType": "runtime",
            "rid": "win"
          }
        }
      },
      "Microsoft.Win32.SystemEvents/8.0.0": {
        "type": "package",
        "compile": {
          "lib/net8.0/Microsoft.Win32.SystemEvents.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.Win32.SystemEvents.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        },
        "runtimeTargets": {
          "runtimes/win/lib/net8.0/Microsoft.Win32.SystemEvents.dll": {
            "assetType": "runtime",
            "rid": "win"
          }
        }
      },
      "Mono.TextTemplating/2.3.1": {
        "type": "package",
        "dependencies": {
          "System.CodeDom": "5.0.0"
        },
        "compile": {
          "lib/netcoreapp3.1/Mono.TextTemplating.dll": {}
        },
        "runtime": {
          "lib/netcoreapp3.1/Mono.TextTemplating.dll": {}
        }
      },
      "NETStandard.Library/1.6.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "1.0.1",
          "Microsoft.Win32.Primitives": "4.0.1",
          "System.AppContext": "4.1.0",
          "System.Collections": "4.0.11",
          "System.Collections.Concurrent": "4.0.12",
          "System.Console": "4.0.0",
          "System.Diagnostics.Debug": "4.0.11",
          "System.Diagnostics.Tools": "4.0.1",
          "System.Diagnostics.Tracing": "4.1.0",
          "System.Globalization": "4.0.11",
          "System.Globalization.Calendars": "4.0.1",
          "System.IO": "4.1.0",
          "System.IO.Compression": "4.1.0",
          "System.IO.Compression.ZipFile": "4.0.1",
          "System.IO.FileSystem": "4.0.1",
          "System.IO.FileSystem.Primitives": "4.0.1",
          "System.Linq": "4.1.0",
          "System.Linq.Expressions": "4.1.0",
          "System.Net.Http": "4.1.0",
          "System.Net.Primitives": "4.0.11",
          "System.Net.Sockets": "4.1.0",
          "System.ObjectModel": "4.0.12",
          "System.Reflection": "4.1.0",
          "System.Reflection.Extensions": "4.0.1",
          "System.Reflection.Primitives": "4.0.1",
          "System.Resources.ResourceManager": "4.0.1",
          "System.Runtime": "4.1.0",
          "System.Runtime.Extensions": "4.1.0",
          "System.Runtime.Handles": "4.0.1",
          "System.Runtime.InteropServices": "4.1.0",
          "System.Runtime.InteropServices.Runti