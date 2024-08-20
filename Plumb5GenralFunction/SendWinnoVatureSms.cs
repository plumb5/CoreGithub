ext.RegularExpressions.dll": {}
        }
      },
      "System.Threading/4.0.11": {
        "type": "package",
        "dependencies": {
          "System.Runtime": "4.1.0",
          "System.Threading.Tasks": "4.0.11"
        },
        "compile": {
          "ref/netstandard1.3/System.Threading.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard1.3/System.Threading.dll": {}
        }
      },
      "System.Threading.Channels/7.0.0": {
        "type": "package",
        "compile": {
          "lib/net7.0/System.Threading.Channels.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net7.0/System.Threading.Channels.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        }
      },
      "System.Threading.Tasks/4.0.11": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "1.0.1",
          "Microsoft.NETCore.Targets": "1.0.1",
          "System.Runtime": "4.1.0"
        },
        "compile": {
          "ref/netstandard1.3/System.Threading.Tasks.dll": {
            "related": ".xml"
          }
        }
      },
      "System.Threading.Tasks.Dataflow/7.0.0": {
        "type": "package",
        "compile": {
          "lib/net7.0/System.Threading.Tasks.Dataflow.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net7.0/System.Threading.Tasks.Dataflow.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        }
      },
      "System.Threading.Tasks.Extensions/4.5.4": {
        "type": "package",
        "compile": {
          "ref/netcoreapp2.1/_._": {}
        },
        "runtime": {
          "lib/netcoreapp2.1/_._": {}
        }
      },
      "System.Threading.Timer/4.0.1": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "1.0.1",
          "Microsoft.NETCore.Targets": "1.0.1",
          "System.Runtime": "4.1.0"
        },
        "compile": {
          "ref/netstandard1.2/System.Threading.Timer.dll": {
            "related": ".xml"
          }
        }
      },
      "System.Xml.ReaderWriter/4.0.11": {
        "type": "package",
        "dependencies": {
          "System.Collections": "4.0.11",
          "System.Diagnostics.Debug": "4.0.11",
          "System.Globalization": "4.0.11",
          "System.IO": "4.1.0",
          "System.IO.FileSystem": "4.0.1",
          "System.IO.FileSystem.Primitives": "4.0.1",
          "System.Resources.ResourceManager": "4.0.1",
          "System.Runtime": "4.1.0",
          "System.Runtime.Extensions": "4.1.0",
          "System.Runtime.InteropServices": "4.1.0",
          "System.Text.Encoding": "4.0.11",
          "System.Text.Encoding.Extensions": "4.0.11",
          "System.Text.RegularExpressions": "4.1.0",
          "System.Threading.Tasks": "4.0.11",
          "System.Threading.Tasks.Extensions": "4.0.0"
        },
        "compile": {
          "ref/netstandard1.3/System.Xml.ReaderWriter.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard1.3/System.Xml.ReaderWriter.dll": {}
        }
      },
      "System.Xml.XDocument/4.0.11": {
        "type": "package",
        "dependencies": {
          "System.Collections": "4.0.11",
          "System.Diagnostics.Debug": "4.0.11",
          "System.Diagnostics.Tools": "4.0.1",
          "System.Globalization": "4.0.11",
          "System.IO": "4.1.0",
          "System.Reflection": "4.1.0",
          "System.Resources.ResourceManager": "4.0.1",
          "System.Runtime": "4.1.0",
          "System.Runtime.Extensions": "4.1.0",
          "System.Text.Encoding": "4.0.11",
          "System.Threading": "4.0.11",
          "System.Xml.ReaderWriter": "4.0.11"
        },
        "compile": {
          "ref/netstandard1.3/System.Xml.XDocument.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard1.3/System.Xml.XDocument.dll": {}
        }
      },
      "WebPush/1.0.12": {
        "type": "package",
        "dependencies": {
          "Newtonsoft.Json": "10.0.3",
          "Portable.BouncyCastle": "1.8.1.3"
        },
        "compile": {
          "lib/net5.0/WebPush.dll": {}
        },
        "runtime": {
          "lib/net5.0/WebPush.dll": {}
        }
      },
      "DBInteraction/1.0.0": {
        "type": "project",
        "framework": ".NETCoreApp,Version=v8.0",
        "dependencies": {
          "Dapper": "2.1.35",
          "Microsoft.Data.SqlClient": "5.2.0",
          "Microsoft.Extensions.Configuration": "8.0.0",
          "Microsoft.Extensions.Configuration.Abstractions": "8.0.0",
          "Microsoft.Extensions.Configuration.Json": "8.0.0",
          "Newtonsoft.Json": "13.0.3",
          "Npgsql": "8.0.3",
          "P5GenralML": "1.0.0"
        },
        "compile": {
          "bin/placeholder/DBInteraction.dll": {}
        },
        "runtime": {
          "bin/placeholder/DBInteraction.dll": {}
        }
      },
      "IP5GenralDL/1.0.0": {
        "type": "project",
        "framework": ".NETCoreApp,Version=v8.0",
        "dependencies": {
          "DBInteraction": "1.0.0",
          "P5GenralML": "1.0.0"
        },
        "compile": {
          "bin/placeholder/IP5GenralDL.dll": {}
        },
        "runtime": {
          "bin/placeholder/IP5GenralDL.dll": {}
        }
      },
      "P5GenralDL/1.0.0": {
        "type": "project",
        "framework": ".NETCoreApp,Version=v8.0",
        "dependencies": {
          "DBInteraction": "1.0.0",
          "Dapper": "2.1.35",
          "IP5GenralDL": "1.0.0",
          "P5GenralML": "1.0.0",
          "WebPush": "1.0.12"
        },
        "compile": {
          "bin/placeholder/P5GenralDL.dll": {}
        },
        "runtime": {
          "bin/placeholder/P5GenralDL.dll": {}
        }
      },
      "P5GenralML/1.0.0": {
        "type": "project",
        "framework": ".NETCoreApp,Version=v8.0",
        "compile": {
          "bin/placeholder/P5GenralML.dll": {}
        },
        "runtime": {
          "bin/placeholder/P5GenralML.dll": {}
        }
      },
      "Plumb5GenralFunction/1.0.0": {
        "type": "project",
        "framework": ".NETCoreApp,Version=v8.0",
        "dependencies": {
          "AWSSDK.CloudWatch": "3.7.401.5",
          "AWSSDK.Core": "3.7.400.7",
          "DBInteraction": "1.0.0",
          "DocumentFormat.OpenXml": "3.1.0",
          "ExcelDataReader": "3.7.0",
          "ExcelDataReader.DataSet": "3.7.0",
          "Ionic.Zip": "1.9.1.8",
          "Microsoft.AspNet.WebApi": "5.3.0",
          "Microsoft.AspNetCore.Http.Abstractions": "2.2.0",
          "Microsoft.AspNetCore.Mvc.Core": "2.2.5",
          "Microsoft.Extensions.Caching.Memory": "8.0.0",
          "NPOI": "2.7.0",
          "P5GenralDL": "1.0.0",
          "P5GenralML": "1.0.0",
          "System.Data.OleDb": "8.0.0",
          "System.Management": "8.0.0",
          "System.Runtime.Caching": "8.0.0",
          "System.ServiceProcess.ServiceController": "8.0.0"
        },
        "compile": {
          "bin/placeholder/Plumb5GenralFunction.dll": {}
        },
        "runtime": {
          "bin/placeholder/Plumb5GenralFunction.dll": {}
        }
      }
    }
  },
  "libraries": {
    "AWSSDK.CloudWatch/3.7.401.5": {
      "sha512": "a9NsdOWaC7zh+of2ry/I9L6I09Xb9zAPdVvws7UkzBGJMKGC9RUiwYucsRZMRBQDBrYJzjoHjjbOx368/GJDDw==",
      "type": "package",
      "path": "awssdk.cloudwatch/3.7.401.5",
      "hasTools": true,
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "analyzers/dotnet/cs/AWSSDK.CloudWatch.CodeAnalysis.dll",
        "analyzers/dotnet/cs/SharedAnalysisCode.dll",
        "awssdk.cloudwatch.3.7.401.5.nupkg.sha512",
        "awssdk.cloudwatch.nuspec",
        "images/AWSLogo.png",
        "lib/net35/AWSSDK.CloudWatch.dll",
        "lib/net35/AWSSDK.CloudWatch.pdb",
        "lib/net35/AWSSDK.CloudWatch.xml",
        "lib/net45/AWSSDK.CloudWatch.dll",
        "lib/net45/AWSSDK.CloudWatch.pdb",
        "lib/net45/AWSSDK.CloudWatch.xml",
        "lib/net8.0/AWSSDK.CloudWatch.dll",
        "lib/net8.0/AWSSDK.CloudWatch.pdb",
        "lib/net8.0/AWSSDK.CloudWatch.xml",
        "lib/netcoreapp3.1/AWSSDK.CloudWatch.dll",
        "lib/netcoreapp3.1/AWSSDK.CloudWatch.pdb",
        "lib/netcoreapp3.1/AWSSDK.CloudWatch.xml",
        "lib/netstandard2.0/AWSSDK.CloudWatch.dll",
        "lib/netstandard2.0/AWSSDK.CloudWatch.pdb",
        "lib/netstandard2.0/AWSSDK.CloudWatch.xml",
        "tools/install.ps1",
        "tools/uninstall.ps1"
      ]
    },
    "AWSSDK.Core/3.7.400.7": {
      "sha512": "tq3I/PaDMyq+E6wxFiu72kf/rsElHKRuYlmET33ISZ9x5nDje7yg3efEri0TP5PmmLoqBchfcfa0J6Eet4O1MA==",
      "type": "package",
      "path": "awssdk.core/3.7.400.7",
      "hasTools": true,
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "awssdk.core.3.7.400.7.nupkg.sha512",
        "awssdk.core.nuspec",
        "images/AWSLogo.png",
        "lib/net35/AWSSDK.Core.dll",
        "lib/net35/AWSSDK.Core.pdb",
        "lib/net35/AWSSDK.Core.xml",
        "lib/net45/AWSSDK.Core.dll",
        "lib/net45/AWSSDK.Core.pdb",
        "lib/net45/AWSSDK.Core.xml",
        "lib/net8.0/AWSSDK.Core.dll",
        "lib/net8.0/AWSSDK.Core.pdb",
        "lib/net8.0/AWSSDK.Core.xml",
        "lib/netcoreapp3.1/AWSSDK.Core.dll",
        "lib/netcoreapp3.1/AWSSDK.Core.pdb",
        "lib/netcoreapp3.1/AWSSDK.Core.xml",
        "lib/netstandard2.0/AWSSDK.Core.dll",
        "lib/netstandard2.0/AWSSDK.Core.pdb",
        "lib/netstandard2.0/AWSSDK.Core.xml",
        "tools/account-management.ps1"
      ]
    },
    "Azure.Core/1.35.0": {
      "sha512": "hENcx03Jyuqv05F4RBEPbxz29UrM3Nbhnr6Wl6NQpoU9BCIbL3XLentrxDCTrH54NLS11Exxi/o8MYgT/cnKFA==",
      "type": "package",
      "path": "azure.core/1.35.0",
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "CHANGELOG.md",
        "README.md",
        "azure.core.1.35.0.nupkg.sha512",
        "azure.core.nuspec",
        "azureicon.png",
        "lib/net461/Azure.Core.dll",
        "lib/net461/Azure.Core.xml",
        "lib/net472/Azure.Core.dll",
        "lib/net472/Azure.Core.xml",
        "lib/net5.0/Azure.Core.dll",
        "lib/net5.0/Azure.Core.xml",
        "lib/net6.0/Azure.Core.dll",
        "lib/net6.0/Azure.Core.xml",
        "lib/netcoreapp2.1/Azure.Core.dll",
        "lib/netcoreapp2.1/Azure.Core.xml",
        "lib/netstandard2.0/Azure.Core.dll",
        "lib/netstandard2.0/Azure.Core.xml"
      ]
    },
    "Azure.Identity/1.10.3": {
      "sha512": "l1Xm2MWOF2Mzcwuarlw8kWQXLZk3UeB55aQXVyjj23aBfDwOZ3gu5GP2kJ6KlmZeZv2TCzw7x4L3V36iNr3gww==",
      "type": "package",
      "path": "azure.identity/1.10.3",
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "CHANGELOG.md",
        "README.md",
        "azure.identity.1.10.3.nupkg.sha512",
        "azure.identity.nuspec",
        "azureicon.png",
        "lib/netstandard2.0/Azure.Identity.dll",
        "lib/netstandard2.0/Azure.Identity.xml"
      ]
    },
    "BouncyCastle.Cryptography/2.3.0": {
      "sha512": "IaVIiYxZLaBulveGDRUx/pBoW/Rc8QeXGF5u2E8xL8RWhVKCgfmtX9NUyGRbnSqnbFQU2zyP3MkXIdH+jUuQBw==",
      "type": "package",
      "path": "bouncycastle.cryptography/2.3.0",
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "LICENSE.md",
        "README.md",
        "bouncycastle.cryptography.2.3.0.nupkg.sha512",
        "bouncycastle.cryptography.nuspec",
        "lib/net461/BouncyCastle.Cryptography.dll",
        "lib/net461/BouncyCastle.Cryptography.xml",
        "lib/net6.0/BouncyCastle.Cryptography.dll",
        "lib/net6.0/BouncyCastle.Cryptography.xml",
        "lib/netstandard2.0/BouncyCastle.Cryptography.dll",
        "lib/netstandard2.0/BouncyCastle.Cryptography.xml",
        "packageIcon.png"
      ]
    },
    "Dapper/2.1.35": {
      "sha512": "YKRwjVfrG7GYOovlGyQoMvr1/IJdn+7QzNXJxyMh0YfFF5yvDmTYaJOVYWsckreNjGsGSEtrMTpnzxTUq/tZQw==",
      "type": "package",
      "path": "dapper/2.1.35",
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "Dapper.png",
        "dapper.2.1.35.nupkg.sha512",
        "dapper.nuspec",
        "lib/net461/Dapper.dll",
        "lib/net461/Dapper.xml",
        "lib/net5.0/Dapper.dll",
        "lib/net5.0/Dapper.xml",
        "lib/net7.0/Dapper.dll",
        "lib/net7.0/Dapper.xml",
        "lib/netstandard2.0/Dapper.dll",
        "lib/netstandard2.0/Dapper.xml",
        "readme.md"
      ]
    },
    "DocumentFormat.OpenXml/3.1.0": {
      "sha512": "J+GtIzVJpj6Wbhc2sYqmXEqAi2LYgWkU5LdVE/vCtNRr8WHDLHRL0lTbSlvTeLzSI5Ws6AC6TPuJR68/3wsa4A==",
      "type": "package",
      "path": "documentformat.openxml/3.1.0",
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "README.md",
        "documentformat.openxml.3.1.0.nupkg.sha512",
        "documentformat.openxml.nuspec",
        "icon.png",
        "lib/net35/DocumentFormat.OpenXml.dll",
        "lib/net35/DocumentFormat.OpenXml.xml",
        "lib/net40/DocumentFormat.OpenXml.dll",
        "lib/net40/DocumentFormat.OpenXml.xml",
        "lib/net46/DocumentFormat.OpenXml.dll",
        "lib/net46/DocumentFormat.OpenXml.xml",
        "lib/net8.0/DocumentFormat.OpenXml.dll",
        "lib/net8.0/DocumentFormat.OpenXml.xml",
        "lib/netstandard2.0/DocumentFormat.OpenXml.dll",
        "lib/netstandard2.0/DocumentFormat.OpenXml.xml"
      ]
    },
    "DocumentFormat.OpenXml.Framework/3.1.0": {
      "sha512": "yz78IAteV+/jdpmQRlBIfhsmYfDYqgPSyPUsyT7KnfDlTTvqY6Zf5inMjTSwe2bnN8wv9dLD0C2sAkActXIy/A==",
      "type": "package",
      "path": "documentformat.openxml.framework/3.1.0",
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "README.md",
        "documentformat.openxml.framework.3.1.0.nupkg.sha512",
        "documentformat.openxml.framework.nuspec",
        "icon.png",
        "lib/net35/DocumentFormat.OpenXml.Framework.dll",
        "lib/net35/DocumentFormat.OpenXml.Framework.xml",
        "lib/net40/DocumentFormat.OpenXml.Framework.dll",
        "lib/net40/DocumentFormat.OpenXml.Framework.xml",
        "lib/net46/DocumentFormat.OpenXml.Framework.dll",
        "lib/net46/DocumentFormat.OpenXml.Framework.xml",
        "lib/net6.0/DocumentFormat.OpenXml.Framework.dll",
        "lib/net6.0/DocumentFormat.OpenXml.Framework.xml",
        "lib/net8.0/DocumentFormat.OpenXml.Framework.dll",
        "lib/net8.0/DocumentFormat.OpenXml.Framework.xml",
        "lib/netstandard2.0/DocumentFormat.OpenXml.Framework.dll",
        "lib/netstandard2.0/DocumentFormat.OpenXml.Framework.xml"
      ]
    },
    "Enums.NET/4.0.1": {
      "sha512": "OUGCd5L8zHZ61GAf436G0gf/H6yrSUkEpV5vm2CbCUuz9Rx7iLFLP5iHSSfmOtqNpuyo4vYte0CvYEmPZXRmRQ==",
      "type": "package",
      "path": "enums.net/4.0.1",
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "enums.net.4.0.1.nupkg.sha512",
        "enums.net.nuspec",
        "lib/net45/Enums.NET.dll",
        "lib/net45/Enums.NET.pdb",
        "lib/net45/Enums.NET.xml",
        "lib/netcoreapp3.0/Enums.NET.dll",
        "lib/netcoreapp3.0/Enums.NET.pdb",
        "lib/netcoreapp3.0/Enums.NET.xml",
        "lib/netstandard1.0/Enums.NET.dll",
        "lib/netstandard1.0/Enums.NET.pdb",
        "lib/netstandard1.0/Enums.NET.xml",
        "lib/netstandard1.1/Enums.NET.dll",
        "lib/netstandard1.1/Enums.NET.pdb",
        "lib/netstandard1.1/Enums.NET.xml",
        "lib/netstandard1.3/Enums.NET.dll",
        "lib/netstandard1.3/Enums.NET.pdb",
        "lib/netstandard1.3/Enums.NET.xml",
        "lib/netstandard2.0/Enums.NET.dll",
        "lib/netstandard2.0/Enums.NET.pdb",
        "lib/netstandard2.0/Enums.NET.xml",
        "lib/netstandard2.1/Enums.NET.dll",
        "lib/netstandard2.1/Enums.NET.pdb",
        "lib/netstandard2.1/Enums.NET.xml"
      ]
    },
    "ExcelDataReader/3.7.0": {
      "sha512": "AMv3oDETRHSRyXC17rBtKH45qIfFyo433LMeaMB3u4RNr/c9Luuc0Z+JMP6+3Cx9n4wXqFqcrEIVxrf/GgYnZg==",
      "type": "package",
      "path": "exceldatareader/3.7.0",
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "ExcelDataReader.png",
        "README.md",
        "exceldatareader.3.7.0.nupkg.sha512",
        "exceldatareader.nuspec",
        "lib/net462/ExcelDataReader.dll",
        "lib/net462/ExcelDataReader.pdb",
        "lib/net462/ExcelDataReader.xml",
        "lib/netstandard2.0/ExcelDataReader.dll",
        "lib/netstandard2.0/ExcelDataReader.pdb",
        "lib/netstandard2.0/ExcelDataReader.xml",
        "lib/netstandard2.1/ExcelDataReader.dll",
        "lib/netstandard2.1/ExcelDataReader.pdb",
        "lib/netstandard2.1/ExcelDataReader.xml"
      ]
    },
    "ExcelDataReader.DataSet/3.7.0": {
      "sha512": "zA2/CVzbMspkNg0qf0/Zp+eU6VxYP5PtiJSErLDP46d/Y7F6of/NCcSGeXjs97KDq7UiEf6XJe+89s/92n2GYg==",
      "type": "package",
      "path": "exceldatareader.dataset/3.7.0",
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "ExcelDataReader.png",
        "README.md",
        "exceldatareader.dataset.3.7.0.nupkg.sha512",
        "exceldatareader.dataset.nuspec",
        "lib/net462/ExcelDataReader.DataSet.dll",
        "lib/net462/ExcelDataReader.DataSet.pdb",
        "lib/net462/ExcelDataReader.DataSet.xml",
        "lib/netstandard2.0/ExcelDataReader.DataSet.dll",
        "lib/netstandard2.0/ExcelDataReader.DataSet.pdb",
        "lib/netstandard2.0/ExcelDataReader.DataSet.xml",
        "lib/netstandard2.1/ExcelDataReader.DataSet.dll",
        "lib/netstandard2.1/ExcelDataReader.DataSet.pdb",
        "lib/netstandard2.1/ExcelDataReader.DataSet.xml"
      ]
    },
    "ExtendedNumerics.BigDecimal/2023.1000.0.230": {
      "sha512": "kbEPff0V3AOgVpOidwEvB/k4d/74h6NgUbnHp3ZvPxz6QqsKXP5Zry2zUroyQUyztp3yDLtFT89XY5rfaShZAw==",
      "type": "package",
      "path": "extendednumerics.bigdecimal/2023.1000.0.230",
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "README.md",
        "extendednumerics.bigdecimal.2023.1000.0.230.nupkg.sha512",
        "extendednumerics.bigdecimal.nuspec",
        "lib/net45/ExtendedNumerics.BigDecimal.dll",
        "lib/net45/ExtendedNumerics.BigDecimal.xml",
        "lib/net46/ExtendedNumerics.BigDecimal.dll",
        "lib/net46/ExtendedNumerics.BigDecimal.xml",
        "lib/net472/ExtendedNumerics.BigDecimal.dll",
        "lib/net472/ExtendedNumerics.BigDecimal.xml",
        "lib/net48/ExtendedNumerics.BigDecimal.dll",
        "lib/net48/ExtendedNumerics.BigDecimal.xml",
        "lib/net5.0/ExtendedNumerics.BigDecimal.dll",
        "lib/net5.0/ExtendedNumerics.BigDecimal.xml",
        "lib/net6.0/ExtendedNumerics.BigDecimal.dll",
        "lib/net6.0/ExtendedNumerics.BigDecimal.xml",
        "lib/net7.0/ExtendedNumerics.BigDecimal.dll",
        "lib/net7.0/ExtendedNumerics.BigDecimal.xml",
        "lib/netcoreapp3.1/ExtendedNumerics.BigDecimal.dll",
        "lib/netcoreapp3.1/ExtendedNumerics.BigDecimal.xml",
        "lib/netstandard2.0/ExtendedNumerics.BigDecimal.dll",
        "lib/netstandard2.0/ExtendedNumerics.BigDecimal.xml",
        "lib/netstandard2.1/ExtendedNumerics.BigDecimal.dll",
        "lib/netstandard2.1/ExtendedNumerics.BigDecimal.xml"
      ]
    },
    "FirebaseAdmin/3.0.0": {
      "sha512": "6aNnm+RzH3ZQEprwDfJui83edH0M3ydbqx0zOCdc1ZaVyDuXB5bYhuh6dVPCHEhb8zeL+ZNySpx0cZDWJk8/vw==",
      "type": "package",
      "path": "firebaseadmin/3.0.0",
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "README.md",
        "firebaseadmin.3.0.0.nupkg.sha512",
        "firebaseadmin.nuspec",
        "lib/net462/FirebaseAdmin.dll",
        "lib/net462/FirebaseAdmin.xml",
        "lib/net6.0/FirebaseAdmin.dll",
        "lib/net6.0/FirebaseAdmin.xml",
        "lib/netstandard2.0/FirebaseAdmin.dll",
        "lib/netstandard2.0/FirebaseAdmin.xml"
      ]
    },
    "Google.Api.Gax/4.8.0": {
      "sha512": "xlV8Jq/G5CQAA3PwYAuKGjfzGOP7AvjhREnE6vgZlzxREGYchHudZWa2PWSqFJL+MBtz9YgitLpRogANN3CVvg==",
      "type": "package",
      "path": "google.api.gax/4.8.0",
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "LICENSE",
        "NuGetIcon.png",
        "google.api.gax.4.8.0.nupkg.sha512",
        "google.api.gax.nuspec",
        "lib/net462/Google.Api.Gax.dll",
        "lib/net462/Google.Api.Gax.pdb",
        "lib/net462/Google.Api.Gax.xml",
        "lib/netstandard2.0/Google.Api.Gax.dll",
        "lib/netstandard2.0/Google.Api.Gax.pdb",
        "lib/netstandard2.0/Google.Api.Gax.xml"
      ]
    },
    "Google.Api.Gax.Rest/4.8.0": {
      "sha512": "zaA5LZ2VvGj/wwIzRB68swr7khi2kWNgqWvsB0fYtScIAl3kGkGtqiBcx63H1YLeKr5xau1866bFjTeReH6FSQ==",
      "type": "package",
      "path": "google.api.gax.rest/4.8.0",
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "LICENSE",
        "NuGetIcon.png",
        "google.api.gax.rest.4.8.0.nupkg.sha512",
        "google.api.gax.rest.nuspec",
        "lib/net462/Google.Api.Gax.Rest.dll",
        "lib/net462/Google.Api.Gax.Rest.pdb",
        "lib/net462/Google.Api.Gax.Rest.xml",
        "lib/netstandard2.0/Google.Api.Gax.Rest.dll",
        "lib/netstandard2.0/Google.Api.Gax.Rest.pdb",
        "lib/netstandard2.0/Google.Api.Gax.Rest.xml"
      ]
    },
    "Google.Apis/1.67.0": {
      "sha512": "XM8/fViJaB1pN61OdXy5RMZoQEqd3hKlWvA/K431gFSb5XtQ48BynfgrbBkUtFcPbSRa4BdjBHzSbkBh/skyMg==",
      "type": "package",
      "path": "google.apis/1.67.0",
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "LICENSE",
        "NuGetIcon.png",
        "google.apis.1.67.0.nupkg.sha512",
        "google.apis.nuspec",
        "lib/net462/Google.Apis.dll",
        "lib/net462/Google.Apis.pdb",
        "lib/net462/Google.Apis.xml",
        "lib/net6.0/Google.Apis.dll",
        "lib/net6.0/Google.Apis.pdb",
        "lib/net6.0/Google.Apis.xml",
        "lib/netstandard2.0/Google.Apis.dll",
        "lib/netstandard2.0/Google.Apis.pdb",
        "lib/netstandard2.0/Google.Apis.xml"
      ]
    },
    "Google.Apis.Auth/1.67.0": {
      "sha512": "Bs9BlbZ12Y4NXzMONjpzQhZr9VbwLUTGMHkcQRF36aYnk2fYrmj5HNVNh7PPHDDq1fcEQpCtPic2nSlpYQLKXw==",
      "type": "package",
      "path": "google.apis.auth/1.67.0",
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "LICENSE",
        "NuGetIcon.png",
        "google.apis.auth.1.67.0.nupkg.sha512",
        "google.apis.auth.nuspec",
        "lib/net462/Google.Apis.Auth.dll",
        "lib/net462/Google.Apis.Auth.pdb",
        "lib/net462/Google.Apis.Auth.xml",
        "lib/net6.0/Google.Apis.Auth.dll",
        "lib/net6.0/Google.Apis.Auth.pdb",
        "lib/net6.0/Google.Apis.Auth.xml",
        "lib/netstandard2.0/Google.Apis.Auth.dll",
        "lib/netstandard2.0/Google.Apis.Auth.pdb",
        "lib/netstandard2.0/Google.Apis.Auth.xml"
      ]
    },
    "Google.Apis.Core/1.67.0": {
      "sha512": "IPq0I3B01NYZraPoMl8muELFLg4Vr2sbfyZp4PR2Xe3MAhHkZCiKyV28Yh1L14zIKUb0X0snol1sR5/mx4S6Iw==",
      "type": "package",
      "path": "google.apis.core/1.67.0",
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "LICENSE",
        "NuGetIcon.png",
        "google.apis.core.1.67.0.nupkg.sha512",
        "google.apis.core.nuspec",
        "lib/net462/Google.Apis.Core.dll",
        "lib/net462/Google.Apis.Core.pdb",
        "lib/net462/Google.Apis.Core.xml",
        "lib/net6.0/Google.Apis.Core.dll",
        "lib/net6.0/Google.Apis.Core.pdb",
        "lib/net6.0/Google.Apis.Core.xml",
        "lib/netstandard2.0/Google.Apis.Core.dll",
        "lib/netstandard2.0/Google.Apis.Core.pdb",
        "lib/netstandard2.0/Google.Apis.Core.xml"
      ]
    },
    "Humanizer/2.14.1": {
      "sha512": "/FUTD3cEceAAmJSCPN9+J+VhGwmL/C12jvwlyM1DFXShEMsBzvLzLqSrJ2rb+k/W2znKw7JyflZgZpyE+tI7lA==",
      "type": "package",
      "path": "humanizer/2.14.1",
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "humanizer.2.14.1.nupkg.sha512",
        "humanizer.nuspec",
        "logo.png"
      ]
    },
    "Humanizer.Core/2.14.1": {
      "sha512": "lQKvtaTDOXnoVJ20ibTuSIOf2i0uO0MPbDhd1jm238I+U/2ZnRENj0cktKZhtchBMtCUSRQ5v4xBCUbKNmyVMw==",
      "type": "package",
      "path": "humanizer.core/2.14.1",
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "humanizer.core.2.14.1.nupkg.sha512",
        "humanizer.core.nuspec",
        "lib/net6.0/Humanizer.dll",
        "lib/net6.0/Humanizer.xml",
        "lib/netstandard1.0/Humanizer.dll",
        "lib/netstandard1.0/Humanizer.xml",
        "lib/netstandard2.0/Humanizer.dll",
        "lib/netstandard2.0/Humanizer.xml",
        "logo.png"
      ]
    },
    "Humanizer.Core.af/2.14.1": {
      "sha512": "BoQHyu5le+xxKOw+/AUM7CLXneM/Bh3++0qh1u0+D95n6f9eGt9kNc8LcAHLIOwId7Sd5hiAaaav0Nimj3peNw==",
      "type": "package",
      "path": "humanizer.core.af/2.14.1",
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "humanizer.core.af.2.14.1.nupkg.sha512",
        "humanizer.core.af.nuspec",
        "lib/net6.0/af/Humanizer.resources.dll",
        "lib/netstandard1.0/af/Humanizer.resources.dll",
        "lib/netstandard2.0/af/Humanizer.resources.dll",
        "logo.png"
      ]
    },
    "Humanizer.Core.ar/2.14.1": {
      "sha512": "3d1V10LDtmqg5bZjWkA/EkmGFeSfNBcyCH+TiHcHP+HGQQmRq3eBaLcLnOJbVQVn3Z6Ak8GOte4RX4kVCxQlFA==",
      "type": "package",
      "path": "humanizer.core.ar/2.14.1",
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "humanizer.core.ar.2.14.1.nupkg.sha512",
        "humanizer.core.ar.nuspec",
        "lib/net6.0/ar/Humanizer.resources.dll",
        "lib/netstandard1.0/ar/Humanizer.resources.dll",
        "lib/netstandard2.0/ar/Humanizer.resources.dll",
        "logo.png"
      ]
    },
    "Humanizer.Core.az/2.14.1": {
      "sha512": "8Z/tp9PdHr/K2Stve2Qs/7uqWPWLUK9D8sOZDNzyv42e20bSoJkHFn7SFoxhmaoVLJwku2jp6P7HuwrfkrP18Q==",
      "type": "package",
      "path": "humanizer.core.az/2.14.1",
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "humanizer.core.az.2.14.1.nupkg.sha512",
        "humanizer.core.az.nuspec",
        "lib/net6.0/az/Humanizer.resources.dll",
        "lib/netstandard1.0/az/Humanizer.resources.dll",
        "lib/netstandard2.0/az/Humanizer.resources.dll",
        "logo.png"
      ]
    },
    "Humanizer.Core.bg/2.14.1": {
      "sha512": "S+hIEHicrOcbV2TBtyoPp1AVIGsBzlarOGThhQYCnP6QzEYo/5imtok6LMmhZeTnBFoKhM8yJqRfvJ5yqVQKSQ==",
      "type": "package",
      "path": "humanizer.core.bg/2.14.1",
      "files": [
        ".nupkg.metadata",
        ".signature.p7s",
        "humanizer.core.bg.2.14.1.nupkg.sha512",
        "humanizer.core.bg.nuspec",
        "lib/net6.0/bg/Humanizer.resources.dll",
        "lib/netstandard1.0/bg/Humanizer.resources.dll",
        "lib/netstandard2.0/bg/Humanizer.resources.dll",
        "logo.png"
      ]
    },
    "Humanizer.Core.bn-BD/2.14.1": {
      "sha512": "U3bfj90tnUDRKlL1ZFlzhCHoVgpTcqUl