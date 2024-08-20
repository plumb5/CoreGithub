{
  "format": 1,
  "restore": {
    "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\Plumb5\\Plumb5.csproj": {}
  },
  "projects": {
    "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\DBInteraction\\DBInteraction.csproj": {
      "version": "1.0.0",
      "restore": {
        "projectUniqueName": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\DBInteraction\\DBInteraction.csproj",
        "projectName": "DBInteraction",
        "projectPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\DBInteraction\\DBInteraction.csproj",
        "packagesPath": "C:\\Users\\Plumb5\\.nuget\\packages\\",
        "outputPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\DBInteraction\\obj\\",
        "projectStyle": "PackageReference",
        "configFilePaths": [
          "C:\\Users\\Plumb5\\AppData\\Roaming\\NuGet\\NuGet.Config",
          "C:\\Program Files (x86)\\NuGet\\Config\\Microsoft.VisualStudio.Offline.config"
        ],
        "originalTargetFrameworks": [
          "net8.0"
        ],
        "sources": {
          "C:\\Program Files (x86)\\Microsoft SDKs\\NuGetPackages\\": {},
          "C:\\Program Files\\dotnet\\library-packs": {},
          "https://api.nuget.org/v3/index.json": {}
        },
        "frameworks": {
          "net8.0": {
            "targetAlias": "net8.0",
            "projectReferences": {
              "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\P5GenralML\\P5GenralML.csproj": {
                "projectPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\P5GenralML\\P5GenralML.csproj"
              }
            }
          }
        },
        "warningProperties": {
          "warnAsError": [
            "NU1605"
          ]
        },
        "restoreAuditProperties": {
          "enableAudit": "true",
          "auditLevel": "low",
          "auditMode": "direct"
        }
      },
      "frameworks": {
        "net8.0": {
          "targetAlias": "net8.0",
          "dependencies": {
            "Dapper": {
              "target": "Package",
              "version": "[2.1.35, )"
            },
            "Microsoft.Data.SqlClient": {
              "target": "Package",
              "version": "[5.2.0, )"
            },
            "Microsoft.Extensions.Configuration": {
              "target": "Package",
              "version": "[8.0.0, )"
            },
            "Microsoft.Extensions.Configuration.Abstractions": {
              "target": "Package",
              "version": "[8.0.0, )"
            },
            "Microsoft.Extensions.Configuration.Json": {
              "target": "Package",
              "version": "[8.0.0, )"
            },
            "Newtonsoft.Json": {
              "target": "Package",
              "version": "[13.0.3, )"
            },
            "Npgsql": {
              "target": "Package",
              "version": "[8.0.3, )"
            }
          },
          "imports": [
            "net461",
            "net462",
            "net47",
            "net471",
            "net472",
            "net48",
            "net481"
          ],
          "assetTargetFallback": true,
          "warn": true,
          "frameworkReferences": {
            "Microsoft.NETCore.App": {
              "privateAssets": "all"
            }
          },
          "runtimeIdentifierGraphPath": "C:\\Program Files\\dotnet\\sdk\\8.0.300/PortableRuntimeIdentifierGraph.json"
        }
      }
    },
    "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\IP5GenralDL\\IP5GenralDL.csproj": {
      "version": "1.0.0",
      "restore": {
        "projectUniqueName": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\IP5GenralDL\\IP5GenralDL.csproj",
        "projectName": "IP5GenralDL",
        "projectPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\IP5GenralDL\\IP5GenralDL.csproj",
        "packagesPath": "C:\\Users\\Plumb5\\.nuget\\packages\\",
        "outputPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\IP5GenralDL\\obj\\",
        "projectStyle": "PackageReference",
        "configFilePaths": [
          "C:\\Users\\Plumb5\\AppData\\Roaming\\NuGet\\NuGet.Config",
          "C:\\Program Files (x86)\\NuGet\\Config\\Microsoft.VisualStudio.Offline.config"
        ],
        "originalTargetFrameworks": [
          "net8.0"
        ],
        "sources": {
          "C:\\Program Files (x86)\\Microsoft SDKs\\NuGetPackages\\": {},
          "C:\\Program Files\\dotnet\\library-packs": {},
          "https://api.nuget.org/v3/index.json": {}
        },
        "frameworks": {
          "net8.0": {
            "targetAlias": "net8.0",
            "projectReferences": {
              "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\DBInteraction\\DBInteraction.csproj": {
                "projectPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\DBInteraction\\DBInteraction.csproj"
              },
              "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\P5GenralML\\P5GenralML.csproj": {
                "projectPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\P5GenralML\\P5GenralML.csproj"
              }
            }
          }
        },
        "warningProperties": {
          "warnAsError": [
            "NU1605"
          ]
        },
        "restoreAuditProperties": {
          "enableAudit": "true",
          "auditLevel": "low",
          "auditMode": "direct"
        }
      },
      "frameworks": {
        "net8.0": {
          "targetAlias": "net8.0",
          "imports": [
            "net461",
            "net462",
            "net47",
            "net471",
            "net472",
            "net48",
            "net481"
          ],
          "assetTargetFallback": true,
          "warn": true,
          "frameworkReferences": {
            "Microsoft.NETCore.App": {
              "privateAssets": "all"
            }
          },
          "runtimeIdentifierGraphPath": "C:\\Program Files\\dotnet\\sdk\\8.0.300/PortableRuntimeIdentifierGraph.json"
        }
      }
    },
    "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\P5GenralDL\\P5GenralDL.csproj": {
      "version": "1.0.0",
      "restore": {
        "projectUniqueName": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\P5GenralDL\\P5GenralDL.csproj",
        "projectName": "P5GenralDL",
        "projectPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\P5GenralDL\\P5GenralDL.csproj",
        "packagesPath": "C:\\Users\\Plumb5\\.nuget\\packages\\",
        "outputPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\P5GenralDL\\obj\\",
        "projectStyle": "PackageReference",
        "configFilePaths": [
          "C:\\Users\\Plumb5\\AppData\\Roaming\\NuGet\\NuGet.Config",
          "C:\\Program Files (x86)\\NuGet\\Config\\Microsoft.VisualStudio.Offline.config"
        ],
        "originalTargetFrameworks": [
          "net8.0"
        ],
        "sources": {
          "C:\\Program Files (x86)\\Microsoft SDKs\\NuGetPackages\\": {},
          "C:\\Program Files\\dotnet\\library-packs": {},
          "https://api.nuget.org/v3/index.json": {}
        },
        "frameworks": {
          "net8.0": {
            "targetAlias": "net8.0",
            "projectReferences": {
              "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\DBInteraction\\DBInteraction.csproj": {
                "projectPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\DBInteraction\\DBInteraction.csproj"
              },
              "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\IP5GenralDL\\IP5GenralDL.csproj": {
                "projectPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\IP5GenralDL\\IP5GenralDL.csproj"
              },
              "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\P5GenralML\\P5GenralML.csproj": {
                "projectPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\P5GenralML\\P5GenralML.csproj"
              }
            }
          }
        },
        "warningProperties": {
          "warnAsError": [
            "NU1605"
          ]
        },
        "restoreAuditProperties": {
          "enableAudit": "true",
          "auditLevel": "low",
          "auditMode": "direct"
        }
      },
      "frameworks": {
        "net8.0": {
          "targetAlias": "net8.0",
          "dependencies": {
            "Dapper": {
              "target": "Package",
              "version": "[2.1.35, )"
            },
            "WebPush": {
              "target": "Package",
              "version": "[1.0.12, )"
            }
          },
          "imports": [
            "net461",
            "net462",
            "net47",
            "net471",
            "net472",
            "net48",
            "net481"
          ],
          "assetTargetFallback": true,
          "warn": true,
          "frameworkReferences": {
            "Microsoft.NETCore.App": {
              "privateAssets": "all"
            }
          },
          "runtimeIdentifierGraphPath": "C:\\Program Files\\dotnet\\sdk\\8.0.300/PortableRuntimeIdentifierGraph.json"
        }
      }
    },
    "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\P5GenralML\\P5GenralML.csproj": {
      "version": "1.0.0",
      "restore": {
        "projectUniqueName": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\P5GenralML\\P5GenralML.csproj",
        "projectName": "P5GenralML",
        "projectPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\P5GenralML\\P5GenralML.csproj",
        "packagesPath": "C:\\Users\\Plumb5\\.nuget\\packages\\",
        "outputPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\P5GenralML\\obj\\",
        "projectStyle": "PackageReference",
        "configFilePaths": [
          "C:\\Users\\Plumb5\\AppData\\Roaming\\NuGet\\NuGet.Config",
          "C:\\Program Files (x86)\\NuGet\\Config\\Microsoft.VisualStudio.Offline.config"
        ],
        "originalTargetFrameworks": [
          "net8.0"
        ],
        "sources": {
          "C:\\Program Files (x86)\\Microsoft SDKs\\NuGetPackages\\": {},
          "C:\\Program Files\\dotnet\\library-packs": {},
          "https://api.nuget.org/v3/index.json": {}
        },
        "frameworks": {
          "net8.0": {
            "targetAlias": "net8.0",
            "projectReferences": {}
          }
        },
        "warningProperties": {
          "warnAsError": [
            "NU1605"
          ]
        },
        "restoreAuditProperties": {
          "enableAudit": "true",
          "auditLevel": "low",
          "auditMode": "direct"
        }
      },
      "frameworks": {
        "net8.0": {
          "targetAlias": "net8.0",
          "imports": [
            "net461",
            "net462",
            "net47",
            "net471",
            "net472",
            "net48",
            "net481"
          ],
          "assetTargetFallback": true,
          "warn": true,
          "frameworkReferences": {
            "Microsoft.NETCore.App": {
              "privateAssets": "all"
            }
          },
          "runtimeIdentifierGraphPath": "C:\\Program Files\\dotnet\\sdk\\8.0.300/PortableRuntimeIdentifierGraph.json"
        }
      }
    },
    "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\Plumb5GenralFunction\\Plumb5GenralFunction.csproj": {
      "version": "1.0.0",
      "restore": {
        "projectUniqueName": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\Plumb5GenralFunction\\Plumb5GenralFunction.csproj",
        "projectName": "Plumb5GenralFunction",
        "projectPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\Plumb5GenralFunction\\Plumb5GenralFunction.csproj",
        "packagesPath": "C:\\Users\\Plumb5\\.nuget\\packages\\",
        "outputPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\Plumb5GenralFunction\\obj\\",
        "projectStyle": "PackageReference",
        "configFilePaths": [
          "C:\\Users\\Plumb5\\AppData\\Roaming\\NuGet\\NuGet.Config",
          "C:\\Program Files (x86)\\NuGet\\Config\\Microsoft.VisualStudio.Offline.config"
        ],
        "originalTargetFrameworks": [
          "net8.0"
        ],
        "sources": {
          "C:\\Program Files (x86)\\Microsoft SDKs\\NuGetPackages\\": {},
          "C:\\Program Files\\dotnet\\library-packs": {},
          "https://api.nuget.org/v3/index.json": {}
        },
        "frameworks": {
          "net8.0": {
            "targetAlias": "net8.0",
            "projectReferences": {
              "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\DBInteraction\\DBInteraction.csproj": {
                "projectPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\DBInteraction\\DBInteraction.csproj"
              },
              "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\P5GenralDL\\P5GenralDL.csproj": {
                "projectPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\P5GenralDL\\P5GenralDL.csproj"
              },
              "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\P5GenralML\\P5GenralML.csproj": {
                "projectPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\P5GenralML\\P5GenralML.csproj"
              }
            }
          }
        },
        "warningProperties": {
          "warnAsError": [
            "NU1605"
          ]
        },
        "restoreAuditProperties": {
          "enableAudit": "true",
          "auditLevel": "low",
          "auditMode": "direct"
        }
      },
      "frameworks": {
        "net8.0": {
          "targetAlias": "net8.0",
          "dependencies": {
            "AWSSDK.CloudWatch": {
              "target": "Package",
              "version": "[3.7.401.5, )"
            },
            "AWSSDK.Core": {
              "target": "Package",
              "version": "[3.7.400.7, )"
            },
            "DocumentFormat.OpenXml": {
              "target": "Package",
              "version": "[3.1.0, )"
            },
            "ExcelDataReader": {
              "target": "Package",
              "version": "[3.7.0, )"
            },
            "ExcelDataReader.DataSet": {
              "target": "Package",
              "version": "[3.7.0, )"
            },
            "Ionic.Zip": {
              "target": "Package",
              "version": "[1.9.1.8, )"
            },
            "Microsoft.AspNet.WebApi": {
              "target": "Package",
              "version": "[5.3.0, )"
            },
            "Microsoft.AspNetCore.Http.Abstractions": {
              "target": "Package",
              "version": "[2.2.0, )"
            },
            "Microsoft.AspNetCore.Mvc.Core": {
              "target": "Package",
              "version": "[2.2.5, )"
            },
            "Microsoft.Extensions.Caching.Memory": {
              "target": "Package",
              "version": "[8.0.0, )"
            },
            "NPOI": {
              "target": "Package",
              "version": "[2.7.0, )"
            },
            "System.Data.OleDb": {
              "target": "Package",
              "version": "[8.0.0, )"
            },
            "System.Management": {
              "target": "Package",
              "version": "[8.0.0, )"
            },
            "System.Runtime.Caching": {
              "target": "Package",
              "version": "[8.0.0, )"
            },
            "System.ServiceProcess.ServiceController": {
              "target": "Package",
              "version": "[8.0.0, )"
            }
          },
          "imports": [
            "net461",
            "net462",
            "net47",
            "net471",
            "net472",
            "net48",
            "net481"
          ],
          "assetTargetFallback": true,
          "warn": true,
          "frameworkReferences": {
            "Microsoft.NETCore.App": {
              "privateAssets": "all"
            }
          },
          "runtimeIdentifierGraphPath": "C:\\Program Files\\dotnet\\sdk\\8.0.300/PortableRuntimeIdentifierGraph.json"
        }
      }
    },
    "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\Plumb5\\Plumb5.csproj": {
      "version": "1.0.0",
      "restore": {
        "projectUniqueName": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\Plumb5\\Plumb5.csproj",
        "projectName": "Plumb5",
        "projectPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\Plumb5\\Plumb5.csproj",
        "packagesPath": "C:\\Users\\Plumb5\\.nuget\\packages\\",
        "outputPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\Plumb5\\obj\\",
        "projectStyle": "PackageReference",
        "configFilePaths": [
          "C:\\Users\\Plumb5\\AppData\\Roaming\\NuGet\\NuGet.Config",
          "C:\\Program Files (x86)\\NuGet\\Config\\Microsoft.VisualStudio.Offline.config"
        ],
        "originalTargetFrameworks": [
          "net8.0"
        ],
        "sources": {
          "C:\\Program Files (x86)\\Microsoft SDKs\\NuGetPackages\\": {},
          "C:\\Program Files\\dotnet\\library-packs": {},
          "https://api.nuget.org/v3/index.json": {}
        },
        "frameworks": {
          "net8.0": {
            "targetAlias": "net8.0",
            "projectReferences": {
              "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\DBInteraction\\DBInteraction.csproj": {
                "projectPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\DBInteraction\\DBInteraction.csproj"
              },
              "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\P5GenralDL\\P5GenralDL.csproj": {
                "projectPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\P5GenralDL\\P5GenralDL.csproj"
              },
              "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\P5GenralML\\P5GenralML.csproj": {
                "projectPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\P5GenralML\\P5GenralML.csproj"
              },
              "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\Plumb5GenralFunction\\Plumb5GenralFunction.csproj": {
                "projectPath": "D:\\P5_Core_7\\MailBranch_UI_Core\\Plumb5MainBuild\\Plumb5GenralFunction\\Plumb5GenralFunction.csproj"
              }
            }
          }
        },
        "warningProperties": {
          "warnAsError": [
            "NU1605"
          ]
        },
        "restoreAuditProperties": {
          "enableAudit": "true",
          "auditLevel": "low",
          "auditMode": "direct"
        }
      },
      "frameworks": {
        "net8.0": {
          "targetAlias": "net8.0",
          "dependencies": {
            "FirebaseAdmin": {
              "target": "Package",
              "version": "[3.0.0, )"
            },
            "Microsoft.AspNetCore.Http": {
              "target": "Package",
              "version": "[2.2.2, )"
            },
            "Microsoft.VisualStudio.Web.CodeGeneration.Design": {
              "target": "Package",
              "version": "[8.0.3, )"
            },
            "Microsoft.Web.Administration": {
              "target": "Package",
              "version": "[11.1.0, )"
            },
            "System.Drawing.Common": {
              "target": "Package",
              "version": "[8.0.6, )"
            },
            "System.Runtime.Caching": {
              "target": "Package",
              "version": "[8.0.0, )"
            }
          },
          "imports": [
            "net461",
            "net462",
            "net47",
            "net471",
            "net472",
            "net48",
            "net481"
          ],
          "assetTargetFallback": true,
          "warn": true,
          "frameworkReferences": {
            "Microsoft.AspNetCore.App": {
              "privateAssets": "none"
            },
            "Microsoft.NETCore.App": {
              "privateAssets": "all"
            }
          },
          "runtimeIdentifierGraphPath": "C:\\Program Files\\dotnet\\sdk\\8.0.300/PortableRuntimeIdentifierGraph.json"
        }
      }
    }
  }
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            ﻿<?xml version="1.0" encoding="utf-8" standalone="no"?>
<Project ToolsVersion="14.0" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <PropertyGroup Condition=" '$(ExcludeRestorePackageImports)' != 'true' ">
    <RestoreSuccess Condition=" '$(RestoreSuccess)' == '' ">True</RestoreSuccess>
    <RestoreTool Condition=" '$(RestoreTool)' == '' ">NuGet</RestoreTool>
    <ProjectAssetsFile Condition=" '$(ProjectAssetsFile)' == '' ">$(MSBuildThisFileDirectory)project.assets.json</ProjectAssetsFile>
    <NuGetPackageRoot Condition=" '$(NuGetPackageRoot)' == '' ">$(UserProfile)\.nuget\packages\</NuGetPackageRoot>
    <NuGetPackageFolders Condition=" '$(NuGetPackageFolders)' == '' ">C:\Users\Plumb5\.nuget\packages\</NuGetPackageFolders>
    <NuGetProjectStyle Condition=" '$(NuGetProjectStyle)' == '' ">PackageReference</NuGetProjectStyle>
    <NuGetToolVersion Condition=" '$(NuGetToolVersion)' == '' ">6.10.0</NuGetToolVersion>
  </PropertyGroup>
  <ItemGroup Condition=" '$(ExcludeRestorePackageImports)' != 'true' ">
    <SourceRoot Include="C:\Users\Plumb5\.nuget\packages\" />
  </ItemGroup>
  <ImportGroup Condition=" '$(ExcludeRestorePackageImports)' != 'true' ">
    <Import Project="$(NuGetPackageRoot)microsoft.codeanalysis.analyzers\3.3.4\buildTransitive\Microsoft.CodeAnalysis.Analyzers.props" Condition="Exists('$(NuGetPackageRoot)microsoft.codeanalysis.analyzers\3.3.4\buildTransitive\Microsoft.CodeAnalysis.Analyzers.props')" />
  </ImportGroup>
  <PropertyGroup Condition=" '$(ExcludeRestorePackageImports)' != 'true' ">
    <PkgAWSSDK_Core Condition=" '$(PkgAWSSDK_Core)' == '' ">C:\Users\Plumb5\.nuget\packages\awssdk.core\3.7.400.7</PkgAWSSDK_Core>
    <PkgAWSSDK_CloudWatch Condition=" '$(PkgAWSSDK_CloudWatch)' == '' ">C:\Users\Plumb5\.nuget\packages\awssdk.cloudwatch\3.7.401.5</PkgAWSSDK_CloudWatch>
    <PkgMicrosoft_CodeAnalysis_Analyzers Condition=" '$(PkgMicrosoft_CodeAnalysis_Analyzers)' == '' ">C:\Users\Plumb5\.nuget\packages\microsoft.codeanalysis.analyzers\3.3.4</PkgMicrosoft_CodeAnalysis_Analyzers>
    <PkgMicrosoft_CodeAnalysis_AnalyzerUtilities Condition=" '$(PkgMicrosoft_CodeAnalysis_AnalyzerUtilities)' == '' ">C:\Users\Plumb5\.nuget\packages\microsoft.codeanalysis.analyzerutilities\3.3.0</PkgMicrosoft_CodeAnalysis_AnalyzerUtilities>
  </PropertyGroup>
</Project>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ﻿<?xml version="1.0" encoding="utf-8" standalone="no"?>
<Project ToolsVersion="14.0" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <ImportGroup Condition=" '$(ExcludeRestorePackageImports)' != 'true' ">
    <Import Project="$(NuGetPackageRoot)system.text.json\8.0.0\buildTransitive\net6.0\System.Text.Json.targets" Condition="Exists('$(NuGetPackageRoot)system.text.json\8.0.0\buildTransitive\net6.0\System.Text.Json.targets')" />
    <Import Project="$(NuGetPackageRoot)microsoft.extensions.logging.abstractions\8.0.0\buildTransitive\net6.0\Microsoft.Extensions.Logging.Abstractions.targets" Condition="Exists('$(NuGetPackageRoot)microsoft.extensions.logging.abstractions\8.0.0\buildTransitive\net6.0\Microsoft.Extensions.Logging.Abstractions.targets')" />
    <Import Project="$(NuGetPackageRoot)microsoft.extensions.options\8.0.0\buildTransitive\net6.0\Microsoft.Extensions.Options.targets" Condition="Exists('$(NuGetPackageRoot)microsoft.extensions.options\8.0.0\buildTransitive\net6.0\Microsoft.Extensions.Options.targets')" />
    <Import Project="$(NuGetPackageRoot)microsoft.codeanalysis.analyzers\3.3.4\buildTransitive\Microsoft.CodeAnalysis.Analyzers.targets" Condition="Exists('$(NuGetPackageRoot)microsoft.codeanalysis.analyzers\3.3.4\buildTransitive\Microsoft.CodeAnalysis.Analyzers.targets')" />
  </ImportGroup>
</Project>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             {
  "version": 3,
  "targets": {
    "net8.0": {
      "AWSSDK.CloudWatch/3.7.401.5": {
        "type": "package",
        "dependencies": {
          "AWSSDK.Core": "[3.7.400.7, 4.0.0)"
        },
        "compile": {
          "lib/net8.0/AWSSDK.CloudWatch.dll": {
            "related": ".pdb;.xml"
          }
        },
        "runtime": {
          "lib/net8.0/AWSSDK.CloudWatch.dll": {
            "related": ".pdb;.xml"
          }
        }
      },
      "AWSSDK.Core/3.7.400.7": {
        "type": "package",
        "compile": {
          "lib/net8.0/AWSSDK.Core.dll": {
            "related": ".pdb;.xml"
          }
        },
        "runtime": {
          "lib/net8.0/AWSSDK.Core.dll": {
            "related": ".pdb;.xml"
          }
        }
      },
      "Azure.Core/1.35.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.Bcl.AsyncInterfaces": "1.1.1",
          "System.Diagnostics.DiagnosticSource": "6.0.1",
          "System.Memory.Data": "1.0.2",
          "System.Numerics.Vectors": "4.5.0",
          "System.Text.Encodings.Web": "4.7.2",
          "System.Text.Json": "4.7.2",
          "System.Threading.Tasks.Extensions": "4.5.4"
        },
        "compile": {
          "lib/net6.0/Azure.Core.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net6.0/Azure.Core.dll": {
            "related": ".xml"
          }
        }
      },
      "Azure.Identity/1.10.3": {
        "type": "package",
        "dependencies": {
          "Azure.Core": "1.35.0",
          "Microsoft.Identity.Client": "4.56.0",
          "Microsoft.Identity.Client.Extensions.Msal": "4.56.0",
          "System.Memory": "4.5.4",
          "System.Security.Cryptography.ProtectedData": "4.7.0",
          "System.Text.Json": "4.7.2",
          "System.Threading.Tasks.Extensions": "4.5.4"
        },
        "compile": {
          "lib/netstandard2.0/Azure.Identity.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Azure.Identity.dll": {
            "related": ".xml"
          }
        }
      },
      "BouncyCastle.Cryptography/2.3.0": {
        "type": "package",
        "compile": {
          "lib/net6.0/BouncyCastle.Cryptography.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net6.0/BouncyCastle.Cryptography.dll": {
            "related": ".xml"
          }
        }
      },
      "Dapper/2.1.35": {
        "type": "package",
        "compile": {
          "lib/net7.0/Dapper.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net7.0/Dapper.dll": {
            "related": ".xml"
          }
        }
      },
      "DocumentFormat.OpenXml/3.1.0": {
        "type": "package",
        "dependencies": {
          "DocumentFormat.OpenXml.Framework": "3.1.0"
        },
        "compile": {
          "lib/net8.0/DocumentFormat.OpenXml.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/DocumentFormat.OpenXml.dll": {
            "related": ".xml"
          }
        }
      },
      "DocumentFormat.OpenXml.Framework/3.1.0": {
        "type": "package",
        "dependencies": {
          "System.IO.Packaging": "8.0.0"
        },
        "compile": {
          "lib/net8.0/DocumentFormat.OpenXml.Framework.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/DocumentFormat.OpenXml.Framework.dll": {
            "related": ".xml"
          }
        }
      },
      "Enums.NET/4.0.1": {
        "type": "package",
        "compile": {
          "lib/netcoreapp3.0/Enums.NET.dll": {
            "related": ".pdb;.xml"
          }
        },
        "runtime": {
          "lib/netcoreapp3.0/Enums.NET.dll": {
            "related": ".pdb;.xml"
          }
        }
      },
      "ExcelDataReader/3.7.0": {
        "type": "package",
        "compile": {
          "lib/netstandard2.1/ExcelDataReader.dll": {
            "related": ".pdb;.xml"
          }
        },
        "runtime": {
          "lib/netstandard2.1/ExcelDataReader.dll": {
            "related": ".pdb;.xml"
          }
        }
      },
      "ExcelDataReader.DataSet/3.7.0": {
        "type": "package",
        "dependencies": {
          "ExcelDataReader": "3.7.0"
        },
        "compile": {
          "lib/netstandard2.1/ExcelDataReader.DataSet.dll": {
            "related": ".pdb;.xml"
          }
        },
        "runtime": {
          "lib/netstandard2.1/ExcelDataReader.DataSet.dll": {
            "related": ".pdb;.xml"
          }
        }
      },
      "ExtendedNumerics.BigDecimal/2023.1000.0.230": {
        "type": "package",
        "compile": {
          "lib/net7.0/ExtendedNumerics.BigDecimal.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net7.0/ExtendedNumerics.BigDecimal.dll": {
            "related": ".xml"
          }
        }
      },
      "FirebaseAdmin/3.0.0": {
        "type": "package",
        "dependencies": {
          "Google.Api.Gax.Rest": "4.8.0",
          "Google.Apis.Auth": "1.67.0",
          "System.Collections.Immutable": "8.0.0"
        },
        "compile": {
          "lib/net6.0/FirebaseAdmin.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net6.0/FirebaseAdmin.dll": {
            "related": ".xml"
          }
        }
      },
      "Google.Api.Gax/4.8.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.Bcl.AsyncInterfaces": "6.0.0",
          "Newtonsoft.Json": "13.0.3"
        },
        "compile": {
          "lib/netstandard2.0/Google.Api.Gax.dll": {
            "related": ".pdb;.xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Google.Api.Gax.dll": {
            "related": ".pdb;.xml"
          }
        }
      },
      "Google.Api.Gax.Rest/4.8.0": {
        "type": "package",
        "dependencies": {
          "Google.Api.Gax": "4.8.0",
          "Google.Apis.Auth": "[1.67.0, 2.0.0)",
          "Microsoft.Extensions.DependencyInjection.Abstractions": "6.0.0"
        },
        "compile": {
          "lib/netstandard2.0/Google.Api.Gax.Rest.dll": {
            "related": ".pdb;.xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Google.Api.Gax.Rest.dll": {
            "related": ".pdb;.xml"
          }
        }
      },
      "Google.Apis/1.67.0": {
        "type": "package",
        "dependencies": {
          "Google.Apis.Core": "1.67.0"
        },
        "compile": {
          "lib/net6.0/Google.Apis.dll": {
            "related": ".pdb;.xml"
          }
        },
        "runtime": {
          "lib/net6.0/Google.Apis.dll": {
            "related": ".pdb;.xml"
          }
        }
      },
      "Google.Apis.Auth/1.67.0": {
        "type": "package",
        "dependencies": {
          "Google.Apis": "1.67.0",
          "Google.Apis.Core": "1.67.0",
          "System.Management": "7.0.2"
        },
        "compile": {
          "lib/net6.0/Google.Apis.Auth.dll": {
            "related": ".pdb;.xml"
          }
        },
        "runtime": {
          "lib/net6.0/Google.Apis.Auth.dll": {
            "related": ".pdb;.xml"
          }
        }
      },
      "Google.Apis.Core/1.67.0": {
        "type": "package",
        "dependencies": {
          "Newtonsoft.Json": "13.0.3"
        },
        "compile": {
          "lib/net6.0/Google.Apis.Core.dll": {
            "related": ".pdb;.xml"
          }
        },
        "runtime": {
          "lib/net6.0/Google.Apis.Core.dll": {
            "related": ".pdb;.xml"
          }
        }
      },
      "Humanizer/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core.af": "2.14.1",
          "Humanizer.Core.ar": "2.14.1",
          "Humanizer.Core.az": "2.14.1",
          "Humanizer.Core.bg": "2.14.1",
          "Humanizer.Core.bn-BD": "2.14.1",
          "Humanizer.Core.cs": "2.14.1",
          "Humanizer.Core.da": "2.14.1",
          "Humanizer.Core.de": "2.14.1",
          "Humanizer.Core.el": "2.14.1",
          "Humanizer.Core.es": "2.14.1",
          "Humanizer.Core.fa": "2.14.1",
          "Humanizer.Core.fi-FI": "2.14.1",
          "Humanizer.Core.fr": "2.14.1",
          "Humanizer.Core.fr-BE": "2.14.1",
          "Humanizer.Core.he": "2.14.1",
          "Humanizer.Core.hr": "2.14.1",
          "Humanizer.Core.hu": "2.14.1",
          "Humanizer.Core.hy": "2.14.1",
          "Humanizer.Core.id": "2.14.1",
          "Humanizer.Core.is": "2.14.1",
          "Humanizer.Core.it": "2.14.1",
          "Humanizer.Core.ja": "2.14.1",
          "Humanizer.Core.ko-KR": "2.14.1",
          "Humanizer.Core.ku": "2.14.1",
          "Humanizer.Core.lv": "2.14.1",
          "Humanizer.Core.ms-MY": "2.14.1",
          "Humanizer.Core.mt": "2.14.1",
          "Humanizer.Core.nb": "2.14.1",
          "Humanizer.Core.nb-NO": "2.14.1",
          "Humanizer.Core.nl": "2.14.1",
          "Humanizer.Core.pl": "2.14.1",
          "Humanizer.Core.pt": "2.14.1",
          "Humanizer.Core.ro": "2.14.1",
          "Humanizer.Core.ru": "2.14.1",
          "Humanizer.Core.sk": "2.14.1",
          "Humanizer.Core.sl": "2.14.1",
          "Humanizer.Core.sr": "2.14.1",
          "Humanizer.Core.sr-Latn": "2.14.1",
          "Humanizer.Core.sv": "2.14.1",
          "Humanizer.Core.th-TH": "2.14.1",
          "Humanizer.Core.tr": "2.14.1",
          "Humanizer.Core.uk": "2.14.1",
          "Humanizer.Core.uz-Cyrl-UZ": "2.14.1",
          "Humanizer.Core.uz-Latn-UZ": "2.14.1",
          "Humanizer.Core.vi": "2.14.1",
          "Humanizer.Core.zh-CN": "2.14.1",
          "Humanizer.Core.zh-Hans": "2.14.1",
          "Humanizer.Core.zh-Hant": "2.14.1"
        }
      },
      "Humanizer.Core/2.14.1": {
        "type": "package",
        "compile": {
          "lib/net6.0/Humanizer.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net6.0/Humanizer.dll": {
            "related": ".xml"
          }
        }
      },
      "Humanizer.Core.af/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/af/Humanizer.resources.dll": {
            "locale": "af"
          }
        }
      },
      "Humanizer.Core.ar/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/ar/Humanizer.resources.dll": {
            "locale": "ar"
          }
        }
      },
      "Humanizer.Core.az/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/az/Humanizer.resources.dll": {
            "locale": "az"
          }
        }
      },
      "Humanizer.Core.bg/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/bg/Humanizer.resources.dll": {
            "locale": "bg"
          }
        }
      },
      "Humanizer.Core.bn-BD/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/bn-BD/Humanizer.resources.dll": {
            "locale": "bn-BD"
          }
        }
      },
      "Humanizer.Core.cs/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/cs/Humanizer.resources.dll": {
            "locale": "cs"
          }
        }
      },
      "Humanizer.Core.da/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/da/Humanizer.resources.dll": {
            "locale": "da"
          }
        }
      },
      "Humanizer.Core.de/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/de/Humanizer.resources.dll": {
            "locale": "de"
          }
        }
      },
      "Humanizer.Core.el/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/el/Humanizer.resources.dll": {
            "locale": "el"
          }
        }
      },
      "Humanizer.Core.es/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/es/Humanizer.resources.dll": {
            "locale": "es"
          }
        }
      },
      "Humanizer.Core.fa/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/fa/Humanizer.resources.dll": {
            "locale": "fa"
          }
        }
      },
      "Humanizer.Core.fi-FI/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/fi-FI/Humanizer.resources.dll": {
            "locale": "fi-FI"
          }
        }
      },
      "Humanizer.Core.fr/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/fr/Humanizer.resources.dll": {
            "locale": "fr"
          }
        }
      },
      "Humanizer.Core.fr-BE/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/fr-BE/Humanizer.resources.dll": {
            "locale": "fr-BE"
          }
        }
      },
      "Humanizer.Core.he/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/he/Humanizer.resources.dll": {
            "locale": "he"
          }
        }
      },
      "Humanizer.Core.hr/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/hr/Humanizer.resources.dll": {
            "locale": "hr"
          }
        }
      },
      "Humanizer.Core.hu/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/hu/Humanizer.resources.dll": {
            "locale": "hu"
          }
        }
      },
      "Humanizer.Core.hy/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/hy/Humanizer.resources.dll": {
            "locale": "hy"
          }
        }
      },
      "Humanizer.Core.id/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/id/Humanizer.resources.dll": {
            "locale": "id"
          }
        }
      },
      "Humanizer.Core.is/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/is/Humanizer.resources.dll": {
            "locale": "is"
          }
        }
      },
      "Humanizer.Core.it/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/it/Humanizer.resources.dll": {
            "locale": "it"
          }
        }
      },
      "Humanizer.Core.ja/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/ja/Humanizer.resources.dll": {
            "locale": "ja"
          }
        }
      },
      "Humanizer.Core.ko-KR/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/netstandard2.0/ko-KR/Humanizer.resources.dll": {
            "locale": "ko-KR"
          }
        }
      },
      "Humanizer.Core.ku/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/ku/Humanizer.resources.dll": {
            "locale": "ku"
          }
        }
      },
      "Humanizer.Core.lv/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/lv/Humanizer.resources.dll": {
            "locale": "lv"
          }
        }
      },
      "Humanizer.Core.ms-MY/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/netstandard2.0/ms-MY/Humanizer.resources.dll": {
            "locale": "ms-MY"
          }
        }
      },
      "Humanizer.Core.mt/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/netstandard2.0/mt/Humanizer.resources.dll": {
            "locale": "mt"
          }
        }
      },
      "Humanizer.Core.nb/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/nb/Humanizer.resources.dll": {
            "locale": "nb"
          }
        }
      },
      "Humanizer.Core.nb-NO/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/nb-NO/Humanizer.resources.dll": {
            "locale": "nb-NO"
          }
        }
      },
      "Humanizer.Core.nl/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/nl/Humanizer.resources.dll": {
            "locale": "nl"
          }
        }
      },
      "Humanizer.Core.pl/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/pl/Humanizer.resources.dll": {
            "locale": "pl"
          }
        }
      },
      "Humanizer.Core.pt/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/pt/Humanizer.resources.dll": {
            "locale": "pt"
          }
        }
      },
      "Humanizer.Core.ro/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/ro/Humanizer.resources.dll": {
            "locale": "ro"
          }
        }
      },
      "Humanizer.Core.ru/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/ru/Humanizer.resources.dll": {
            "locale": "ru"
          }
        }
      },
      "Humanizer.Core.sk/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/sk/Humanizer.resources.dll": {
            "locale": "sk"
          }
        }
      },
      "Humanizer.Core.sl/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/sl/Humanizer.resources.dll": {
            "locale": "sl"
          }
        }
      },
      "Humanizer.Core.sr/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/sr/Humanizer.resources.dll": {
            "locale": "sr"
          }
        }
      },
      "Humanizer.Core.sr-Latn/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/sr-Latn/Humanizer.resources.dll": {
            "locale": "sr-Latn"
          }
        }
      },
      "Humanizer.Core.sv/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/sv/Humanizer.resources.dll": {
            "locale": "sv"
          }
        }
      },
      "Humanizer.Core.th-TH/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/netstandard2.0/th-TH/Humanizer.resources.dll": {
            "locale": "th-TH"
          }
        }
      },
      "Humanizer.Core.tr/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/tr/Humanizer.resources.dll": {
            "locale": "tr"
          }
        }
      },
      "Humanizer.Core.uk/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/uk/Humanizer.resources.dll": {
            "locale": "uk"
          }
        }
      },
      "Humanizer.Core.uz-Cyrl-UZ/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/uz-Cyrl-UZ/Humanizer.resources.dll": {
            "locale": "uz-Cyrl-UZ"
          }
        }
      },
      "Humanizer.Core.uz-Latn-UZ/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/uz-Latn-UZ/Humanizer.resources.dll": {
            "locale": "uz-Latn-UZ"
          }
        }
      },
      "Humanizer.Core.vi/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/vi/Humanizer.resources.dll": {
            "locale": "vi"
          }
        }
      },
      "Humanizer.Core.zh-CN/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/zh-CN/Humanizer.resources.dll": {
            "locale": "zh-CN"
          }
        }
      },
      "Humanizer.Core.zh-Hans/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/zh-Hans/Humanizer.resources.dll": {
            "locale": "zh-Hans"
          }
        }
      },
      "Humanizer.Core.zh-Hant/2.14.1": {
        "type": "package",
        "dependencies": {
          "Humanizer.Core": "[2.14.1]"
        },
        "resource": {
          "lib/net6.0/zh-Hant/Humanizer.resources.dll": {
            "locale": "zh-Hant"
          }
        }
      },
      "Ionic.Zip/1.9.1.8": {
        "type": "package",
        "compile": {
          "lib/Ionic.Zip.dll": {}
        },
        "runtime": {
          "lib/Ionic.Zip.dll": {}
        }
      },
      "MathNet.Numerics.Signed/5.0.0": {
        "type": "package",
        "compile": {
          "lib/net6.0/MathNet.Numerics.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net6.0/MathNet.Numerics.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.AspNet.WebApi/5.3.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.AspNet.WebApi.WebHost": "5.3.0"
        }
      },
      "Microsoft.AspNet.WebApi.Client/6.0.0": {
        "type": "package",
        "dependencies": {
          "Newtonsoft.Json": "13.0.1",
          "Newtonsoft.Json.Bson": "1.0.2",
          "System.Memory": "4.5.5",
          "System.Threading.Tasks.Extensions": "4.5.4"
        },
        "compile": {
          "lib/netstandard2.0/System.Net.Http.Formatting.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/System.Net.Http.Formatting.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.AspNet.WebApi.Core/5.3.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.AspNet.WebApi.Client": "6.0.0"
        },
        "compile": {
          "lib/net45/System.Web.Http.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net45/System.Web.Http.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.AspNet.WebApi.WebHost/5.3.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.AspNet.WebApi.Core": "5.3.0"
        },
        "compile": {
          "lib/net45/System.Web.Http.WebHost.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net45/System.Web.Http.WebHost.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.AspNetCore.Authentication.Abstractions/2.2.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.AspNetCore.Http.Abstractions": "2.2.0",
          "Microsoft.Extensions.Logging.Abstractions": "2.2.0",
          "Microsoft.Extensions.Options": "2.2.0"
        },
        "compile": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Authentication.Abstractions.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Authentication.Abstractions.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.AspNetCore.Authentication.Core/2.2.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.AspNetCore.Authentication.Abstractions": "2.2.0",
          "Microsoft.AspNetCore.Http": "2.2.0",
          "Microsoft.AspNetCore.Http.Extensions": "2.2.0"
        },
        "compile": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Authentication.Core.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Authentication.Core.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.AspNetCore.Authorization/2.2.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.Extensions.Logging.Abstractions": "2.2.0",
          "Microsoft.Extensions.Options": "2.2.0"
        },
        "compile": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Authorization.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Authorization.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.AspNetCore.Authorization.Policy/2.2.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.AspNetCore.Authentication.Abstractions": "2.2.0",
          "Microsoft.AspNetCore.Authorization": "2.2.0"
        },
        "compile": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Authorization.Policy.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Authorization.Policy.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.AspNetCore.Hosting.Abstractions/2.2.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.AspNetCore.Hosting.Server.Abstractions": "2.2.0",
          "Microsoft.AspNetCore.Http.Abstractions": "2.2.0",
          "Microsoft.Extensions.Hosting.Abstractions": "2.2.0"
        },
        "compile": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Hosting.Abstractions.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Hosting.Abstractions.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.AspNetCore.Hosting.Server.Abstractions/2.2.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.AspNetCore.Http.Features": "2.2.0",
          "Microsoft.Extensions.Configuration.Abstractions": "2.2.0"
        },
        "compile": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Hosting.Server.Abstractions.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Hosting.Server.Abstractions.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.AspNetCore.Http/2.2.2": {
        "type": "package",
        "dependencies": {
          "Microsoft.AspNetCore.Http.Abstractions": "2.2.0",
          "Microsoft.AspNetCore.WebUtilities": "2.2.0",
          "Microsoft.Extensions.ObjectPool": "2.2.0",
          "Microsoft.Extensions.Options": "2.2.0",
          "Microsoft.Net.Http.Headers": "2.2.0"
        },
        "compile": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Http.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Http.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.AspNetCore.Http.Abstractions/2.2.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.AspNetCore.Http.Features": "2.2.0",
          "System.Text.Encodings.Web": "4.5.0"
        },
        "compile": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Http.Abstractions.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Http.Abstractions.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.AspNetCore.Http.Extensions/2.2.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.AspNetCore.Http.Abstractions": "2.2.0",
          "Microsoft.Extensions.FileProviders.Abstractions": "2.2.0",
          "Microsoft.Net.Http.Headers": "2.2.0",
          "System.Buffers": "4.5.0"
        },
        "compile": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Http.Extensions.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/Microsoft.AspNetCore.Http.Extensions.dll": {
            "related": ".xml"
          }
        }
      },
      "Microsoft.AspNetCore.Http.Features/2.2.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.Extensions.Primitives": "2.2.0"
 