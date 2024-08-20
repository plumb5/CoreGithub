2.0"
        },
        "compile": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Mvc.Abstractions.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Mvc.Abstractions.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.AspNetCore.Mvc.Core/2.2.5": {
        "type": "package",
        "dependencies": {
          "Microsoft.AspNetCore.Authentication.Core": "2.2.0",
          "Microsoft.AspNetCore.Authorization.Policy": "2.2.0",
          "Microsoft.AspNetCore.Hosting.Abstractions": "2.2.0",
          "Microsoft.AspNetCore.Http": "2.2.0",
          "Microsoft.AspNetCore.Http.Extensions": "2.2.0",
          "Microsoft.AspNetCore.Mvc.Abstractions": "2.2.0",
          "Microsoft.AspNetCore.ResponseCaching.Abstractions": "2.2.0",
          "Microsoft.AspNetCore.Routing": "2.2.0",
          "Microsoft.AspNetCore.Routing.Abstractions": "2.2.0",
          "Microsoft.Extensions.DependencyInjection": "2.2.0",
          "Microsoft.Extensions.DependencyModel": "2.1.0",
          "Microsoft.Extensions.FileProviders.Abstractions": "2.2.0",
          "Microsoft.Extensions.Logging.Abstractions": "2.2.0",
          "System.Diagnostics.DiagnosticSource": "4.5.0",
          "System.Threading.Tasks.Extensions": "4.5.1"
        },
        "compile": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Mvc.Core.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Mvc.Core.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.AspNetCore.Razor.Language/6.0.24": {
        "type": "package",
        "compile": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Razor.Language.dll": {}
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Razor.Language.dll": {}
        }
      },
      "Microsoft.AspNetCore.ResponseCaching.Abstractions/2.2.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.Extensions.Primitives": "2.2.0"
        },
        "compile": {
          "lib/netstandard2.0/Microsoft.AspNetCore.ResponseCaching.Abstractions.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.AspNetCore.ResponseCaching.Abstractions.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.AspNetCore.Routing/2.2.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.AspNetCore.Http.Extensions": "2.2.0",
          "Microsoft.AspNetCore.Routing.Abstractions": "2.2.0",
          "Microsoft.Extensions.Logging.Abstractions": "2.2.0",
          "Microsoft.Extensions.ObjectPool": "2.2.0",
          "Microsoft.Extensions.Options": "2.2.0"
        },
        "compile": {
          "lib/netcoreapp2.2/Microsoft.AspNetCore.Routing.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netcoreapp2.2/Microsoft.AspNetCore.Routing.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.AspNetCore.Routing.Abstractions/2.2.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.AspNetCore.Http.Abstractions": "2.2.0"
        },
        "compile": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Routing.Abstractions.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Routing.Abstractions.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.AspNetCore.WebUtilities/2.2.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.Net.Http.Headers": "2.2.0",
          "System.Text.Encodings.Web": "4.5.0"
        },
        "compile": {
          "lib/netstandard2.0/Microsoft.AspNetCore.WebUtilities.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.AspNetCore.WebUtilities.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.Bcl.AsyncInterfaces/7.0.0": {
        "type": "package",
        "compile": {
          "lib/netstandard2.1/Microsoft.Bcl.AsyncInterfaces.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.1/Microsoft.Bcl.AsyncInterfaces.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.Build/17.8.3": {
        "type": "package",
        "dependencies": {
          "Microsoft.Build.Framework": "17.8.3",
          "Microsoft.NET.StringTools": "17.8.3",
          "System.Collections.Immutable": "7.0.0",
          "System.Configuration.ConfigurationManager": "7.0.0",
          "System.Reflection.Metadata": "7.0.0",
          "System.Reflection.MetadataLoadContext": "7.0.0",
          "System.Security.Principal.Windows": "5.0.0",
          "System.Threading.Tasks.Dataflow": "7.0.0"
        },
        "compile": {
          "ref/net8.0/Microsoft.Build.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.Build.dll": {
            "related": ".pdb;.xml"
          }
        }
      },
      "Microsoft.Build.Framework/17.8.3": {
        "type": "package",
        "compile": {
          "ref/net8.0/Microsoft.Build.Framework.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/Microsoft.Build.Framework.dll": {
            "related": ".pdb;.xml"
          }
        }
      },
      "Microsoft.CodeAnalysis.Analyzers/3.3.4": {
        "type": "package",
        "build": {
          "buildTransitive/Microsoft.CodeAnalysis.Analyzers.props": {},
          "buildTransitive/Microsoft.CodeAnalysis.Analyzers.targets": {}
        }
      },
      "Microsoft.CodeAnalysis.AnalyzerUtilities/3.3.0": {
        "type": "package",
        "compile": {
          "lib/netstandard2.0/Microsoft.CodeAnalysis.AnalyzerUtilities.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.CodeAnalysis.AnalyzerUtilities.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.CodeAnalysis.Common/4.8.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.CodeAnalysis.Analyzers": "3.3.4",
          "System.Collections.Immutable": "7.0.0",
          "System.Reflection.Metadata": "7.0.0",
          "System.Runtime.CompilerServices.Unsafe": "6.0.0"
        },
        "compile": {
          "lib/net7.0/Microsoft.CodeAnalysis.dll": {
            "related": ".pdb;.xml"
          }
        },
        "runtime": {
          "lib/net7.0/Microsoft.CodeAnalysis.dll": {
            "related": ".pdb;.xml"
          }
        },
        "resource": {
          "lib/net7.0/cs/Microsoft.CodeAnalysis.resources.dll": {
            "locale": "cs"
          },
          "lib/net7.0/de/Microsoft.CodeAnalysis.resources.dll": {
            "locale": "de"
          },
          "lib/net7.0/es/Microsoft.CodeAnalysis.resources.dll": {
            "locale": "es"
          },
          "lib/net7.0/fr/Microsoft.CodeAnalysis.resources.dll": {
            "locale": "fr"
          },
          "lib/net7.0/it/Microsoft.CodeAnalysis.resources.dll": {
            "locale": "it"
          },
          "lib/net7.0/ja/Microsoft.CodeAnalysis.resources.dll": {
            "locale": "ja"
          },
          "lib/net7.0/ko/Microsoft.CodeAnalysis.resources.dll": {
            "locale": "ko"
          },
          "lib/net7.0/pl/Microsoft.CodeAnalysis.resources.dll": {
            "locale": "pl"
          },
          "lib/net7.0/pt-BR/Microsoft.CodeAnalysis.resources.dll": {
            "locale": "pt-BR"
          },
          "lib/net7.0/ru/Microsoft.CodeAnalysis.resources.dll": {
            "locale": "ru"
          },
          "lib/net7.0/tr/Microsoft.CodeAnalysis.resources.dll": {
            "locale": "tr"
          },
          "lib/net7.0/zh-Hans/Microsoft.CodeAnalysis.resources.dll": {
            "locale": "zh-Hans"
          },
          "lib/net7.0/zh-Hant/Microsoft.CodeAnalysis.resources.dll": {
            "locale": "zh-Hant"
          }
        }
      },
      "Microsoft.CodeAnalysis.CSharp/4.8.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.CodeAnalysis.Common": "[4.8.0]"
        },
        "compile": {
          "lib/net7.0/Microsoft.CodeAnalysis.CSharp.dll": {
            "related": ".pdb;.xml"
          }
        },
        "runtime": {
          "lib/net7.0/Microsoft.CodeAnalysis.CSharp.dll": {
            "related": ".pdb;.xml"
          }
        },
        "resource": {
          "lib/net7.0/cs/Microsoft.CodeAnalysis.CSharp.resources.dll": {
            "locale": "cs"
          },
          "lib/net7.0/de/Microsoft.CodeAnalysis.CSharp.resources.dll": {
            "locale": "de"
          },
          "lib/net7.0/es/Microsoft.CodeAnalysis.CSharp.resources.dll": {
            "locale": "es"
          },
          "lib/net7.0/fr/Microsoft.CodeAnalysis.CSharp.resources.dll": {
            "locale": "fr"
          },
          "lib/net7.0/it/Microsoft.CodeAnalysis.CSharp.resources.dll": {
            "locale": "it"
          },
          "lib/net7.0/ja/Microsoft.CodeAnalysis.CSharp.resources.dll": {
            "locale": "ja"
          },
          "lib/net7.0/ko/Microsoft.CodeAnalysis.CSharp.resources.dll": {
            "locale": "ko"
          },
          "lib/net7.0/pl/Microsoft.CodeAnalysis.CSharp.resources.dll": {
            "locale": "pl"
          },
          "lib/net7.0/pt-BR/Microsoft.CodeAnalysis.CSharp.resources.dll": {
            "locale": "pt-BR"
          },
          "lib/net7.0/ru/Microsoft.CodeAnalysis.CSharp.resources.dll": {
            "locale": "ru"
          },
          "lib/net7.0/tr/Microsoft.CodeAnalysis.CSharp.resources.dll": {
            "locale": "tr"
          },
          "lib/net7.0/zh-Hans/Microsoft.CodeAnalysis.CSharp.resources.dll": {
            "locale": "zh-Hans"
          },
          "lib/net7.0/zh-Hant/Microsoft.CodeAnalysis.CSharp.resources.dll": {
            "locale": "zh-Hant"
          }
        }
      },
      "Microsoft.CodeAnalysis.CSharp.Features/4.8.0": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "2.14.1",
          "Microsoft.CodeAnalysis.CSharp": "[4.8.0]",
          "Microsoft.CodeAnalysis.CSharp.Workspaces": "[4.8.0]",
          "Microsoft.CodeAnalysis.Common": "[4.8.0]",
          "Microsoft.CodeAnalysis.Features": "[4.8.0]",
          "Microsoft.CodeAnalysis.Workspaces.Common": "[4.8.0]"
        },
        "compile": {
          "lib/net7.0/Microsoft.CodeAnalysis.CSharp.Features.dll": {
            "related": ".pdb;.xml"
          }
        },
        "runtime": {
          "lib/net7.0/Microsoft.CodeAnalysis.CSharp.Features.dll": {
            "related": ".pdb;.xml"
          }
        },
        "resource": {
          "lib/net7.0/cs/Microsoft.CodeAnalysis.CSharp.Features.resources.dll": {
            "locale": "cs"
          },
          "lib/net7.0/de/Microsoft.CodeAnalysis.CSharp.Features.resources.dll": {
            "locale": "de"
          },
          "lib/net7.0/es/Microsoft.CodeAnalysis.CSharp.Features.resources.dll": {
            "locale": "es"
          },
          "lib/net7.0/fr/Microsoft.CodeAnalysis.CSharp.Features.resources.dll": {
            "locale": "fr"
          },
          "lib/net7.0/it/Microsoft.CodeAnalysis.CSharp.Features.resources.dll": {
            "locale": "it"
          },
          "lib/net7.0/ja/Microsoft.CodeAnalysis.CSharp.Features.resources.dll": {
            "locale": "ja"
          },
          "lib/net7.0/ko/Microsoft.CodeAnalysis.CSharp.Features.resources.dll": {
            "locale": "ko"
          },
          "lib/net7.0/pl/Microsoft.CodeAnalysis.CSharp.Features.resources.dll": {
            "locale": "pl"
          },
          "lib/net7.0/pt-BR/Microsoft.CodeAnalysis.CSharp.Features.resources.dll": {
            "locale": "pt-BR"
          },
          "lib/net7.0/ru/Microsoft.CodeAnalysis.CSharp.Features.resources.dll": {
            "locale": "ru"
          },
          "lib/net7.0/tr/Microsoft.CodeAnalysis.CSharp.Features.resources.dll": {
            "locale": "tr"
          },
          "lib/net7.0/zh-Hans/Microsoft.CodeAnalysis.CSharp.Features.resources.dll": {
            "locale": "zh-Hans"
          },
          "lib/net7.0/zh-Hant/Microsoft.CodeAnalysis.CSharp.Features.resources.dll": {
            "locale": "zh-Hant"
          }
        }
      },
      "Microsoft.CodeAnalysis.CSharp.Workspaces/4.8.0": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "2.14.1",
          "Microsoft.CodeAnalysis.CSharp": "[4.8.0]",
          "Microsoft.CodeAnalysis.Common": "[4.8.0]",
          "Microsoft.CodeAnalysis.Workspaces.Common": "[4.8.0]"
        },
        "compile": {
          "lib/net7.0/Microsoft.CodeAnalysis.CSharp.Workspaces.dll": {
            "related": ".pdb;.xml"
          }
        },
        "runtime": {
          "lib/net7.0/Microsoft.CodeAnalysis.CSharp.Workspaces.dll": {
            "related": ".pdb;.xml"
          }
        },
        "resource": {
          "lib/net7.0/cs/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll": {
            "locale": "cs"
          },
          "lib/net7.0/de/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll": {
            "locale": "de"
          },
          "lib/net7.0/es/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll": {
            "locale": "es"
          },
          "lib/net7.0/fr/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll": {
            "locale": "fr"
          },
          "lib/net7.0/it/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll": {
            "locale": "it"
          },
          "lib/net7.0/ja/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll": {
            "locale": "ja"
          },
          "lib/net7.0/ko/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll": {
            "locale": "ko"
          },
          "lib/net7.0/pl/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll": {
            "locale": "pl"
          },
          "lib/net7.0/pt-BR/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll": {
            "locale": "pt-BR"
          },
          "lib/net7.0/ru/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll": {
            "locale": "ru"
          },
          "lib/net7.0/tr/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll": {
            "locale": "tr"
          },
          "lib/net7.0/zh-Hans/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll": {
            "locale": "zh-Hans"
          },
          "lib/net7.0/zh-Hant/Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll": {
            "locale": "zh-Hant"
          }
        }
      },
      "Microsoft.CodeAnalysis.Elfie/1.0.0": {
        "type": "package",
        "dependencies": {
          "System.Configuration.ConfigurationManager": "4.5.0",
          "System.Data.DataSetExtensions": "4.5.0"
        },
        "compile": {
          "lib/netstandard2.0/Microsoft.CodeAnalysis.Elfie.dll": {}
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.CodeAnalysis.Elfie.dll": {}
        }
      },
      "Microsoft.CodeAnalysis.Features/4.8.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.CodeAnalysis.AnalyzerUtilities": "3.3.0",
          "Microsoft.CodeAnalysis.Common": "[4.8.0]",
          "Microsoft.CodeAnalysis.Elfie": "1.0.0",
          "Microsoft.CodeAnalysis.Scripting.Common": "[4.8.0]",
          "Microsoft.CodeAnalysis.Workspaces.Common": "[4.8.0]",
          "Microsoft.DiaSymReader": "2.0.0",
          "System.Text.Json": "7.0.3"
        },
        "compile": {
          "lib/net7.0/Microsoft.CodeAnalysis.Features.dll": {
            "related": ".pdb;.xml"
          }
        },
        "runtime": {
          "lib/net7.0/Microsoft.CodeAnalysis.Features.dll": {
            "related": ".pdb;.xml"
          }
        },
        "resource": {
          "lib/net7.0/cs/Microsoft.CodeAnalysis.Features.resources.dll": {
            "locale": "cs"
          },
          "lib/net7.0/de/Microsoft.CodeAnalysis.Features.resources.dll": {
            "locale": "de"
          },
          "lib/net7.0/es/Microsoft.CodeAnalysis.Features.resources.dll": {
            "locale": "es"
          },
          "lib/net7.0/fr/Microsoft.CodeAnalysis.Features.resources.dll": {
            "locale": "fr"
          },
          "lib/net7.0/it/Microsoft.CodeAnalysis.Features.resources.dll": {
            "locale": "it"
          },
          "lib/net7.0/ja/Microsoft.CodeAnalysis.Features.resources.dll": {
            "locale": "ja"
          },
          "lib/net7.0/ko/Microsoft.CodeAnalysis.Features.resources.dll": {
            "locale": "ko"
          },
          "lib/net7.0/pl/Microsoft.CodeAnalysis.Features.resources.dll": {
            "locale": "pl"
          },
          "lib/net7.0/pt-BR/Microsoft.CodeAnalysis.Features.resources.dll": {
            "locale": "pt-BR"
          },
          "lib/net7.0/ru/Microsoft.CodeAnalysis.Features.resources.dll": {
            "locale": "ru"
          },
          "lib/net7.0/tr/Microsoft.CodeAnalysis.Features.resources.dll": {
            "locale": "tr"
          },
          "lib/net7.0/zh-Hans/Microsoft.CodeAnalysis.Features.resources.dll": {
            "locale": "zh-Hans"
          },
          "lib/net7.0/zh-Hant/Microsoft.CodeAnalysis.Features.resources.dll": {
            "locale": "zh-Hant"
          }
        }
      },
      "Microsoft.CodeAnalysis.Razor/6.0.24": {
        "type": "package",
        "dependencies": {
          "Microsoft.AspNetCore.Razor.Language": "6.0.24",
          "Microsoft.CodeAnalysis.CSharp": "4.0.0",
          "Microsoft.CodeAnalysis.Common": "4.0.0"
        },
        "compile": {
          "lib/netstandard2.0/Microsoft.CodeAnalysis.Razor.dll": {}
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.CodeAnalysis.Razor.dll": {}
        }
      },
      "Microsoft.CodeAnalysis.Scripting.Common/4.8.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.CodeAnalysis.Common": "[4.8.0]"
        },
        "compile": {
          "lib/net7.0/Microsoft.CodeAnalysis.Scripting.dll": {
            "related": ".pdb;.xml"
          }
        },
        "runtime": {
          "lib/net7.0/Microsoft.CodeAnalysis.Scripting.dll": {
            "related": ".pdb;.xml"
          }
        },
        "resource": {
          "lib/net7.0/cs/Microsoft.CodeAnalysis.Scripting.resources.dll": {
            "locale": "cs"
          },
          "lib/net7.0/de/Microsoft.CodeAnalysis.Scripting.resources.dll": {
            "locale": "de"
          },
          "lib/net7.0/es/Microsoft.CodeAnalysis.Scripting.resources.dll": {
            "locale": "es"
          },
          "lib/net7.0/fr/Microsoft.CodeAnalysis.Scripting.resources.dll": {
            "locale": "fr"
          },
          "lib/net7.0/it/Microsoft.CodeAnalysis.Scripting.resources.dll": {
            "locale": "it"
          },
          "lib/net7.0/ja/Microsoft.CodeAnalysis.Scripting.resources.dll": {
            "locale": "ja"
          },
          "lib/net7.0/ko/Microsoft.CodeAnalysis.Scripting.resources.dll": {
            "locale": "ko"
          },
          "lib/net7.0/pl/Microsoft.CodeAnalysis.Scripting.resources.dll": {
            "locale": "pl"
          },
          "lib/net7.0/pt-BR/Microsoft.CodeAnalysis.Scripting.resources.dll": {
            "locale": "pt-BR"
          },
          "lib/net7.0/ru/Microsoft.CodeAnalysis.Scripting.resources.dll": {
            "locale": "ru"
          },
          "lib/net7.0/tr/Microsoft.CodeAnalysis.Scripting.resources.dll": {
            "locale": "tr"
          },
          "lib/net7.0/zh-Hans/Microsoft.CodeAnalysis.Scripting.resources.dll": {
            "locale": "zh-Hans"
          },
          "lib/net7.0/zh-Hant/Microsoft.CodeAnalysis.Scripting.resources.dll": {
            "locale": "zh-Hant"
          }
        }
      },
      "Microsoft.CodeAnalysis.Workspaces.Common/4.8.0": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "2.14.1",
          "Microsoft.Bcl.AsyncInterfaces": "7.0.0",
          "Microsoft.CodeAnalysis.Common": "[4.8.0]",
          "System.Composition": "7.0.0",
          "System.IO.Pipelines": "7.0.0",
          "System.Threading.Channels": "7.0.0"
        },
        "compile": {
          "lib/net7.0/Microsoft.CodeAnalysis.Workspaces.dll": {
            "related": ".pdb;.xml"
          }
        },
        "runtime": {
          "lib/net7.0/Microsoft.CodeAnalysis.Workspaces.dll": {
            "related": ".pdb;.xml"
          }
        },
        "resource": {
          "lib/net7.0/cs/Microsoft.CodeAnalysis.Workspaces.resources.dll": {
            "locale": "cs"
          },
          "lib/net7.0/de/Microsoft.CodeAnalysis.Workspaces.resources.dll": {
            "locale": "de"
          },
          "lib/net7.0/es/Microsoft.CodeAnalysis.Workspaces.resources.dll": {
            "locale": "es"
          },
          "lib/net7.0/fr/Microsoft.CodeAnalysis.Workspaces.resources.dll": {
            "locale": "fr"
          },
          "lib/net7.0/it/Microsoft.CodeAnalysis.Workspaces.resources.dll": {
            "locale": "it"
          },
          "lib/net7.0/ja/Microsoft.CodeAnalysis.Workspaces.resources.dll": {
            "locale": "ja"
          },
          "lib/net7.0/ko/Microsoft.CodeAnalysis.Workspaces.resources.dll": {
            "locale": "ko"
          },
          "lib/net7.0/pl/Microsoft.CodeAnalysis.Workspaces.resources.dll": {
            "locale": "pl"
          },
          "lib/net7.0/pt-BR/Microsoft.CodeAnalysis.Workspaces.resources.dll": {
            "locale": "pt-BR"
          },
          "lib/net7.0/ru/Microsoft.CodeAnalysis.Workspaces.resources.dll": {
            "locale": "ru"
          },
          "lib/net7.0/tr/Microsoft.CodeAnalysis.Workspaces.resources.dll": {
            "locale": "tr"
          },
          "lib/net7.0/zh-Hans/Microsoft.CodeAnalysis.Workspaces.resources.dll": {
            "locale": "zh-Hans"
          },
          "lib/net7.0/zh-Hant/Microsoft.CodeAnalysis.Workspaces.resources.dll": {
            "locale": "zh-Hant"
          }
        }
      },
      "Microsoft.CSharp/4.5.0": {
        "type": "package",
        "compile": {
          "ref/netcoreapp2.0/_._": {}
        },
        "runtime": {
          "lib/netcoreapp2.0/_._": {}
        }
      },
      "Microsoft.Data.SqlClient/5.2.0": {
        "type": "package",
        "dependencies": {
          "Azure.Identity": "1.10.3",
          "Microsoft.Data.SqlClient.SNI.runtime": "5.2.0",
          "Microsoft.Identity.Client": "4.56.0",
          "Microsoft.IdentityModel.JsonWebTokens": "6.35.0",
          "Microsoft.IdentityModel.Protocols.OpenI