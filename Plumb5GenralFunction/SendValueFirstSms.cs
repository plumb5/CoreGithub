  "lib/netstandard2.0/System.IO.FileSystem.AccessControl.dll": {
            "related": ".xml"
          }
        },
        "runtimeTargets": {
          "runtimes/win/lib/netstandard2.0/System.IO.FileSystem.AccessControl.dll": {
            "assetType": "runtime",
            "rid": "win"
          }
        }
      },
      "System.IO.FileSystem.Primitives/4.0.1": {
        "type": "package",
        "dependencies": {
          "System.Runtime": "4.1.0"
        },
        "compile": {
          "ref/netstandard1.3/System.IO.FileSystem.Primitives.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard1.3/System.IO.FileSystem.Primitives.dll": {}
        }
      },
      "System.IO.Packaging/8.0.0": {
        "type": "package",
        "compile": {
          "lib/net8.0/System.IO.Packaging.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/System.IO.Packaging.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        }
      },
      "System.IO.Pipelines/7.0.0": {
        "type": "package",
        "compile": {
          "lib/net7.0/System.IO.Pipelines.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net7.0/System.IO.Pipelines.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        }
      },
      "System.Linq/4.1.0": {
        "type": "package",
        "dependencies": {
          "System.Collections": "4.0.11",
          "System.Diagnostics.Debug": "4.0.11",
          "System.Resources.ResourceManager": "4.0.1",
          "System.Runtime": "4.1.0",
          "System.Runtime.Extensions": "4.1.0"
        },
        "compile": {
          "ref/netstandard1.6/System.Linq.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard1.6/System.Linq.dll": {}
        }
      },
      "System.Linq.Expressions/4.1.0": {
        "type": "package",
        "dependencies": {
          "System.Collections": "4.0.11",
          "System.Diagnostics.Debug": "4.0.11",
          "System.Globalization": "4.0.11",
          "System.IO": "4.1.0",
          "System.Linq": "4.1.0",
          "System.ObjectModel": "4.0.12",
          "System.Reflection": "4.1.0",
          "System.Reflection.Emit": "4.0.1",
          "System.Reflection.Emit.ILGeneration": "4.0.1",
          "System.Reflection.Emit.Lightweight": "4.0.1",
          "System.Reflection.Extensions": "4.0.1",
          "System.Reflection.Primitives": "4.0.1",
          "System.Reflection.TypeExtensions": "4.1.0",
          "System.Resources.ResourceManager": "4.0.1",
          "System.Runtime": "4.1.0",
          "System.Runtime.Extensions": "4.1.0",
          "System.Threading": "4.0.11"
        },
        "compile": {
          "ref/netstandard1.6/System.Linq.Expressions.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard1.6/System.Linq.Expressions.dll": {}
        }
      },
      "System.Management/8.0.0": {
        "type": "package",
        "dependencies": {
          "System.CodeDom": "8.0.0"
        },
        "compile": {
          "lib/net8.0/System.Management.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/System.Management.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        },
        "runtimeTargets": {
          "runtimes/win/lib/net8.0/System.Management.dll": {
            "assetType": "runtime",
            "rid": "win"
          }
        }
      },
      "System.Memory/4.5.5": {
        "type": "package",
        "compile": {
          "ref/netcoreapp2.1/_._": {}
        },
        "runtime": {
          "lib/netcoreapp2.1/_._": {}
        }
      },
      "System.Memory.Data/1.0.2": {
        "type": "package",
        "dependencies": {
          "System.Text.Encodings.Web": "4.7.2",
          "System.Text.Json": "4.6.0"
        },
        "compile": {
          "lib/netstandard2.0/System.Memory.Data.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/System.Memory.Data.dll": {
            "related": ".xml"
          }
        }
      },
      "System.Net.Http/4.1.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "1.0.1",
          "System.Collections": "4.0.11",
          "System.Diagnostics.Debug": "4.0.11",
          "System.Diagnostics.DiagnosticSource": "4.0.0",
          "System.Diagnostics.Tracing": "4.1.0",
          "System.Globalization": "4.0.11",
          "System.Globalization.Extensions": "4.0.1",
          "System.IO": "4.1.0",
          "System.IO.FileSystem": "4.0.1",
          "System.Net.Primitives": "4.0.11",
          "System.Resources.ResourceManager": "4.0.1",
          "System.Runtime": "4.1.0",
          "System.Runtime.Extensions": "4.1.0",
          "System.Runtime.Handles": "4.0.1",
          "System.Runtime.InteropServices": "4.1.0",
          "System.Security.Cryptography.Algorithms": "4.2.0",
          "System.Security.Cryptography.Encoding": "4.0.0",
          "System.Security.Cryptography.OpenSsl": "4.0.0",
          "System.Security.Cryptography.Primitives": "4.0.0",
          "System.Security.Cryptography.X509Certificates": "4.1.0",
          "System.Text.Encoding": "4.0.11",
          "System.Threading": "4.0.11",
          "System.Threading.Tasks": "4.0.11",
          "runtime.native.System": "4.0.0",
          "runtime.native.System.Net.Http": "4.0.1",
          "runtime.native.System.Security.Cryptography": "4.0.0"
        },
        "compile": {
          "ref/netstandard1.3/System.Net.Http.dll": {
            "related": ".xml"
          }
        },
        "runtimeTargets": {
          "runtimes/unix/lib/netstandard1.6/System.Net.Http.dll": {
            "assetType": "runtime",
            "rid": "unix"
          },
          "runtimes/win/lib/netstandard1.3/System.Net.Http.dll": {
            "assetType": "runtime",
            "rid": "win"
          }
        }
      },
      "System.Net.Primitives/4.0.11": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "1.0.1",
          "Microsoft.NETCore.Targets": "1.0.1",
          "System.Runtime": "4.1.0",
          "System.Runtime.Handles": "4.0.1"
        },
        "compile": {
          "ref/netstandard1.3/System.Net.Primitives.dll": {
            "related": ".xml"
          }
        }
      },
      "System.Net.Sockets/4.1.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "1.0.1",
          "Microsoft.NETCore.Targets": "1.0.1",
          "System.IO": "4.1.0",
          "System.Net.Primitives": "4.0.11",
          "System.Runtime": "4.1.0",
          "System.Threading.Tasks": "4.0.11"
        },
        "compile": {
          "ref/netstandard1.3/System.Net.Sockets.dll": {
            "related": ".xml"
          }
        }
      },
      "System.Numerics.Vectors/4.5.0": {
        "type": "package",
        "compile": {
          "ref/netcoreapp2.0/_._": {}
        },
        "runtime": {
          "lib/netcoreapp2.0/_._": {}
        }
      },
      "System.ObjectModel/4.0.12": {
        "type": "package",
        "dependencies": {
          "System.Collections": "4.0.11",
          "System.Diagnostics.Debug": "4.0.11",
          "System.Resources.ResourceManager": "4.0.1",
          "System.Runtime": "4.1.0",
          "System.Threading": "4.0.11"
        },
        "compile": {
          "ref/netstandard1.3/System.ObjectModel.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard1.3/System.ObjectModel.dll": {}
        }
      },
      "System.Reflection/4.1.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "1.0.1",
          "Microsoft.NETCore.Targets": "1.0.1",
          "System.IO": "4.1.0",
          "System.Reflection.Primitives": "4.0.1",
          "System.Runtime": "4.1.0"
        },
        "compile": {
          "ref/netstandard1.5/System.Reflection.dll": {
            "related": ".xml"
          }
        }
      },
      "System.Reflection.Emit/4.0.1": {
        "type": "package",
        "dependencies": {
          "System.IO": "4.1.0",
          "System.Reflection": "4.1.0",
          "System.Reflection.Emit.ILGeneration": "4.0.1",
          "System.Reflection.Primitives": "4.0.1",
          "System.Runtime": "4.1.0"
        },
        "compile": {
          "ref/netstandard1.1/_._": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard1.3/System.Reflection.Emit.dll": {}
        }
      },
      "System.Reflection.Emit.ILGeneration/4.0.1": {
        "type": "package",
        "dependencies": {
          "System.Reflection": "4.1.0",
          "System.Reflection.Primitives": "4.0.1",
          "System.Runtime": "4.1.0"
        },
        "compile": {
          "ref/netstandard1.0/_._": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard1.3/System.Reflection.Emit.ILGeneration.dll": {}
        }
      },
      "System.Reflection.Emit.Lightweight/4.0.1": {
        "type": "package",
        "dependencies": {
          "System.Reflection": "4.1.0",
          "System.Reflection.Emit.ILGeneration": "4.0.1",
          "System.Reflection.Primitives": "4.0.1",
          "System.Runtime": "4.1.0"
        },
        "compile": {
          "ref/netstandard1.0/_._": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard1.3/System.Reflection.Emit.Lightweight.dll": {}
        }
      },
      "System.Reflection.Extensions/4.0.1": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "1.0.1",
          "Microsoft.NETCore.Targets": "1.0.1",
          "System.Reflection": "4.1.0",
          "System.Runtime": "4.1.0"
        },
        "compile": {
          "ref/netstandard1.0/System.Reflection.Extensions.dll": {
            "related": ".xml"
          }
        }
      },
      "System.Reflection.Metadata/7.0.0": {
        "type": "package",
        "dependencies": {
          "System.Collections.Immutable": "7.0.0"
        },
        "compile": {
          "lib/net7.0/System.Reflection.Metadata.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net7.0/System.Reflection.Metadata.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        }
      },
      "System.Reflection.MetadataLoadContext/7.0.0": {
        "type": "package",
        "dependencies": {
          "System.Collections.Immutable": "7.0.0",
          "System.Reflection.Metadata": "7.0.0"
        },
        "compile": {
          "lib/net7.0/System.Reflection.MetadataLoadContext.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net7.0/System.Reflection.MetadataLoadContext.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        }
      },
      "System.Reflection.Primitives/4.0.1": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "1.0.1",
          "Microsoft.NETCore.Targets": "1.0.1",
          "System.Runtime": "4.1.0"
        },
        "compile": {
          "ref/netstandard1.0/System.Reflection.Primitives.dll": {
            "related": ".xml"
          }
        }
      },
      "System.Reflection.TypeExtensions/4.4.0": {
        "type": "package",
        "compile": {
          "ref/netcoreapp2.0/_._": {}
        },
        "runtime": {
          "lib/netcoreapp2.0/_._": {}
        }
      },
      "System.Resources.ResourceManager/4.0.1": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "1.0.1",
          "Microsoft.NETCore.Targets": "1.0.1",
          "System.Globalization": "4.0.11",
          "System.Reflection": "4.1.0",
          "System.Runtime": "4.1.0"
        },
        "compile": {
          "ref/netstandard1.0/System.Resources.ResourceManager.dll": {
            "related": ".xml"
          }
        }
      },
      "System.Runtime/4.3.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "1.1.0",
          "Microsoft.NETCore.Targets": "1.1.0"
        },
        "compile": {
          "ref/netstandard1.5/System.Runtime.dll": {
            "related": ".xml"
          }
        }
      },
      "System.Runtime.Caching/8.0.0": {
        "type": "package",
        "dependencies": {
          "System.Configuration.ConfigurationManager": "8.0.0"
        },
        "compile": {
          "lib/net8.0/System.Runtime.Caching.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/System.Runtime.Caching.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        },
        "runtimeTargets": {
          "runtimes/win/lib/net8.0/System.Runtime.Caching.dll": {
            "assetType": "runtime",
            "rid": "win"
          }
        }
      },
      "System.Runtime.CompilerServices.Unsafe/6.0.0": {
        "type": "package",
        "compile": {
          "lib/net6.0/System.Runtime.CompilerServices.Unsafe.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net6.0/System.Runtime.CompilerServices.Unsafe.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/netcoreapp3.1/_._": {}
        }
      },
      "System.Runtime.Extensions/4.1.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "1.0.1",
          "Microsoft.NETCore.Targets": "1.0.1",
          "System.Runtime": "4.1.0"
        },
        "compile": {
          "ref/netstandard1.5/System.Runtime.Extensions.dll": {
            "related": ".xml"
          }
        }
      },
      "System.Runtime.Handles/4.0.1": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "1.0.1",
          "Microsoft.NETCore.Targets": "1.0.1",
          "System.Runtime": "4.1.0"
        },
        "compile": {
          "ref/netstandard1.3/System.Runtime.Handles.dll": {
            "related": ".xml"
          }
        }
      },
      "System.Runtime.InteropServices/4.1.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "1.0.1",
          "Microsoft.NETCore.Targets": "1.0.1",
          "System.Reflection": "4.1.0",
          "System.Reflection.Primitives": "4.0.1",
          "System.Runtime": "4.1.0",
          "System.Runtime.Handles": "4.0.1"
        },
        "compile": {
          "ref/netstandard1.5/System.Runtime.InteropServices.dll": {
            "related": ".xml"
          }
        }
      },
      "System.Runtime.InteropServices.RuntimeInformation/4.0.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "1.0.1",
          "System.Reflection": "4.1.0",
          "System.Resources.ResourceManager": "4.0.1",
          "System.Runtime": "4.1.0",
          "System.Runtime.InteropServices": "4.1.0",
          "System.Threading": "4.0.11",
          "runtime.native.System": "4.0.0"
        },
        "compile": {
          "ref/netstandard1.1/System.Runtime.InteropServices.RuntimeInformation.dll": {}
        },
        "runtimeTargets": {
          "runtimes/unix/lib/netstandard1.1/System.Runtime.InteropServices.RuntimeInformation.dll": {
            "assetType": "runtime",
            "rid": "unix"
          },
          "runtimes/win/lib/netstandard1.1/System.Runtime.InteropServices.RuntimeInformation.dll": {
            "assetType": "runtime",
            "rid": "win"
          }
        }
      },
      "System.Runtime.Numerics/4.0.1": {
        "type": "package",
        "dependencies": {
          "System.Globalization": "4.0.11",
          "System.Resources.ResourceManager": "4.0.1",
          "System.Runtime": "4.1.0",
          "System.Runtime.Extensions": "4.1.0"
        },
        "compile": {
          "ref/netstandard1.1/System.Runtime.Numerics.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard1.3/System.Runtime.Numerics.dll": {}
        }
      },
      "System.Security.AccessControl/6.0.0": {
        "type": "package",
        "compile": {
          "lib/net6.0/System.Security.AccessControl.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net6.0/System.Security.AccessControl.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/netcoreapp3.1/_._": {}
        },
        "runtimeTargets": {
          "runtimes/win/lib/net6.0/System.Security.AccessControl.dll": {
            "assetType": "runtime",
            "rid": "win"
          }
        }
      },
      "System.Security.Cryptography.Algorithms/4.2.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "1.0.1",
          "System.Collections": "4.0.11",
          "System.IO": "4.1.0",
          "System.Resources.ResourceManager": "4.0.1",
          "System.Runtime": "4.1.0",
          "System.Runtime.Extensions": "4.1.0",
          "System.Runtime.Handles": "4.0.1",
          "System.Runtime.InteropServices": "4.1.0",
          "System.Runtime.Numerics": "4.0.1",
          "System.Security.Cryptography.Encoding": "4.0.0",
          "System.Security.Cryptography.Primitives": "4.0.0",
          "System.Text.Encoding": "4.0.11",
          "runtime.native.System.Security.Cryptography": "4.0.0"
        },
        "compile": {
          "ref/netstandard1.6/System.Security.Cryptography.Algorithms.dll": {}
        },
        "runtimeTargets": {
          "runtimes/unix/lib/netstandard1.6/System.Security.Cryptography.Algorithms.dll": {
            "assetType": "runtime",
            "rid": "unix"
          },
          "runtimes/win/lib/netstandard1.6/System.Security.Cryptography.Algorithms.dll": {
            "assetType": "runtime",
            "rid": "win"
          }
        }
      },
      "System.Security.Cryptography.Cng/4.5.0": {
        "type": "package",
        "compile": {
          "ref/netcoreapp2.1/System.Security.Cryptography.Cng.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netcoreapp2.1/System.Security.Cryptography.Cng.dll": {}
        },
        "runtimeTargets": {
          "runtimes/win/lib/netcoreapp2.1/System.Security.Cryptography.Cng.dll": {
            "assetType": "runtime",
            "rid": "win"
          }
        }
      },
      "System.Security.Cryptography.Csp/4.0.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "1.0.1",
          "System.IO": "4.1.0",
          "System.Reflection": "4.1.0",
          "System.Resources.ResourceManager": "4.0.1",
          "System.Runtime": "4.1.0",
          "System.Runtime.Extensions": "4.1.0",
          "System.Runtime.Handles": "4.0.1",
          "System.Runtime.InteropServices": "4.1.0",
          "System.Security.Cryptography.Algorithms": "4.2.0",
          "System.Security.Cryptography.Encoding": "4.0.0",
          "System.Security.Cryptography.Primitives": "4.0.0",
          "System.Text.Encoding": "4.0.11",
          "System.Threading": "4.0.11"
        },
        "compile": {
          "ref/netstandard1.3/_._": {}
        },
        "runtimeTargets": {
          "runtimes/unix/lib/netstandard1.3/System.Security.Cryptography.Csp.dll": {
            "assetType": "runtime",
            "rid": "unix"
          },
          "runtimes/win/lib/netstandard1.3/System.Security.Cryptography.Csp.dll": {
            "assetType": "runtime",
            "rid": "win"
          }
        }
      },
      "System.Security.Cryptography.Encoding/4.0.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "1.0.1",
          "System.Collections": "4.0.11",
          "System.Collections.Concurrent": "4.0.12",
          "System.Linq": "4.1.0",
          "System.Resources.ResourceManager": "4.0.1",
          "System.Runtime": "4.1.0",
          "System.Runtime.Extensions": "4.1.0",
          "System.Runtime.Handles": "4.0.1",
          "System.Runtime.InteropServices": "4.1.0",
          "System.Security.Cryptography.Primitives": "4.0.0",
          "System.Text.Encoding": "4.0.11",
          "runtime.native.System.Security.Cryptography": "4.0.0"
        },
        "compile": {
          "ref/netstandard1.3/System.Security.Cryptography.Encoding.dll": {
            "related": ".xml"
          }
        },
        "runtimeTargets": {
          "runtimes/unix/lib/netstandard1.3/System.Security.Cryptography.Encoding.dll": {
            "assetType": "runtime",
            "rid": "unix"
          },
          "runtimes/win/lib/netstandard1.3/System.Security.Cryptography.Encoding.dll": {
            "assetType": "runtime",
            "rid": "win"
          }
        }
      },
      "System.Security.Cryptography.OpenSsl/4.0.0": {
        "type": "package",
        "dependencies": {
          "System.Collections": "4.0.11",
          "System.IO": "4.1.0",
          "System.Resources.ResourceManager": "4.0.1",
          "System.Runtime": "4.1.0",
          "System.Runtime.Extensions": "4.1.0",
          "System.Runtime.Handles": "4.0.1",
          "System.Runtime.InteropServices": "4.1.0",
          "System.Runtime.Numerics": "4.0.1",
          "System.Security.Cryptography.Algorithms": "4.2.0",
          "System.Security.Cryptography.Encoding": "4.0.0",
          "System.Security.Cryptography.Primitives": "4.0.0",
          "System.Text.Encoding": "4.0.11",
          "runtime.native.System.Security.Cryptography": "4.0.0"
        },
        "compile": {
          "ref/netstandard1.6/_._": {}
        },
        "runtime": {
          "lib/netstandard1.6/System.Security.Cryptography.OpenSsl.dll": {}
        },
        "runtimeTargets": {
          "runtimes/unix/lib/netstandard1.6/System.Security.Cryptography.OpenSsl.dll": {
            "assetType": "runtime",
            "rid": "unix"
          }
        }
      },
      "System.Security.Cryptography.Pkcs/6.0.4": {
        "type": "package",
        "dependencies": {
          "System.Formats.Asn1": "6.0.0"
        },
        "compile": {
          "lib/net6.0/System.Security.Cryptography.Pkcs.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net6.0/System.Security.Cryptography.Pkcs.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/netcoreapp3.1/_._": {}
        },
        "runtimeTargets": {
          "runtimes/win/lib/net6.0/System.Security.Cryptography.Pkcs.dll": {
            "assetType": "runtime",
            "rid": "win"
          }
        }
      },
      "System.Security.Cryptography.Primitives/4.0.0": {
        "type": "package",
        "dependencies": {
          "System.Diagnostics.Debug": "4.0.11",
          "System.Globalization": "4.0.11",
          "System.IO": "4.1.0",
          "System.Resources.ResourceManager": "4.0.1",
          "System.Runtime": "4.1.0",
          "System.Threading": "4.0.11",
          "System.Threading.Tasks": "4.0.11"
        },
        "compile": {
          "ref/netstandard1.3/System.Security.Cryptography.Primitives.dll": {}
        },
        "runtime": {
          "lib/netstandard1.3/System.Security.Cryptography.Primitives.dll": {}
        }
      },
      "System.Security.Cryptography.ProtectedData/8.0.0": {
        "type": "package",
        "compile": {
          "lib/net8.0/System.Security.Cryptography.ProtectedData.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/System.Security.Cryptography.ProtectedData.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        }
      },
      "System.Security.Cryptography.X509Certificates/4.1.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "1.0.1",
          "System.Collections": "4.0.11",
          "System.Diagnostics.Debug": "4.0.11",
          "System.Globalization": "4.0.11",
          "System.Globalization.Calendars": "4.0.1",
          "System.IO": "4.1.0",
          "System.IO.FileSystem": "4.0.1",
          "System.IO.FileSystem.Primitives": "4.0.1",
          "System.Resources.ResourceManager": "4.0.1",
          "System.Runtime": "4.1.0",
          "System.Runtime.Extensions": "4.1.0",
          "System.Runtime.Handles": "4.0.1",
          "System.Runtime.InteropServices": "4.1.0",
          "System.Runtime.Numerics": "4.0.1",
          "System.Security.Cryptography.Algorithms": "4.2.0",
          "System.Security.Cryptography.Cng": "4.2.0",
          "System.Security.Cryptography.Csp": "4.0.0",
          "System.Security.Cryptography.Encoding": "4.0.0",
          "System.Security.Cryptography.OpenSsl": "4.0.0",
          "System.Security.Cryptography.Primitives": "4.0.0",
          "System.Text.Encoding": "4.0.11",
          "System.Threading": "4.0.11",
          "runtime.native.System": "4.0.0",
          "runtime.native.System.Net.Http": "4.0.1",
          "runtime.native.System.Security.Cryptography": "4.0.0"
        },
        "compile": {
          "ref/netstandard1.4/System.Security.Cryptography.X509Certificates.dll": {
            "related": ".xml"
          }
        },
        "runtimeTargets": {
          "runtimes/unix/lib/netstandard1.6/System.Security.Cryptography.X509Certificates.dll": {
            "assetType": "runtime",
            "rid": "unix"
          },
          "runtimes/win/lib/netstandard1.6/System.Security.Cryptography.X509Certificates.dll": {
            "assetType": "runtime",
            "rid": "win"
          }
        }
      },
      "System.Security.Cryptography.Xml/6.0.1": {
        "type": "package",
        "dependencies": {
          "System.Security.AccessControl": "6.0.0",
          "System.Security.Cryptography.Pkcs": "6.0.1"
        },
        "compile": {
          "lib/net6.0/System.Security.Cryptography.Xml.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net6.0/System.Security.Cryptography.Xml.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/netcoreapp3.1/_._": {}
        }
      },
      "System.Security.Principal.Windows/5.0.0": {
        "type": "package",
        "compile": {
          "ref/netcoreapp3.0/System.Security.Principal.Windows.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/System.Security.Principal.Windows.dll": {
            "related": ".xml"
          }
        },
        "runtimeTargets": {
          "runtimes/unix/lib/netcoreapp2.1/System.Security.Principal.Windows.dll": {
            "assetType": "runtime",
            "rid": "unix"
          },
          "runtimes/win/lib/netcoreapp2.1/System.Security.Principal.Windows.dll": {
            "assetType": "runtime",
            "rid": "win"
          }
        }
      },
      "System.ServiceProcess.ServiceController/8.0.0": {
        "type": "package",
        "dependencies": {
          "System.Diagnostics.EventLog": "8.0.0"
        },
        "compile": {
          "lib/net8.0/System.ServiceProcess.ServiceController.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/System.ServiceProcess.ServiceController.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        },
        "runtimeTargets": {
          "runtimes/win/lib/net8.0/System.ServiceProcess.ServiceController.dll": {
            "assetType": "runtime",
            "rid": "win"
          }
        }
      },
      "System.Text.Encoding/4.3.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "1.1.0",
          "Microsoft.NETCore.Targets": "1.1.0",
          "System.Runtime": "4.3.0"
        },
        "compile": {
          "ref/netstandard1.3/System.Text.Encoding.dll": {
            "related": ".xml"
          }
        }
      },
      "System.Text.Encoding.CodePages/5.0.0": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "5.0.0"
        },
        "compile": {
          "lib/netstandard2.0/System.Text.Encoding.CodePages.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/netstandard2.0/System.Text.Encoding.CodePages.dll": {
            "related": ".xml"
          }
        },
        "runtimeTargets": {
          "runtimes/win/lib/netcoreapp2.0/System.Text.Encoding.CodePages.dll": {
            "assetType": "runtime",
            "rid": "win"
          }
        }
      },
      "System.Text.Encoding.Extensions/4.0.11": {
        "type": "package",
        "dependencies": {
          "Microsoft.NETCore.Platforms": "1.0.1",
          "Microsoft.NETCore.Targets": "1.0.1",
          "System.Runtime": "4.1.0",
          "System.Text.Encoding": "4.0.11"
        },
        "compile": {
          "ref/netstandard1.3/System.Text.Encoding.Extensions.dll": {
            "related": ".xml"
          }
        }
      },
      "System.Text.Encodings.Web/8.0.0": {
        "type": "package",
        "compile": {
          "lib/net8.0/System.Text.Encodings.Web.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/System.Text.Encodings.Web.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/_._": {}
        },
        "runtimeTargets": {
          "runtimes/browser/lib/net8.0/System.Text.Encodings.Web.dll": {
            "assetType": "runtime",
            "rid": "browser"
          }
        }
      },
      "System.Text.Json/8.0.0": {
        "type": "package",
        "dependencies": {
          "System.Text.Encodings.Web": "8.0.0"
        },
        "compile": {
          "lib/net8.0/System.Text.Json.dll": {
            "related": ".xml"
          }
        },
        "runtime": {
          "lib/net8.0/System.Text.Json.dll": {
            "related": ".xml"
          }
        },
        "build": {
          "buildTransitive/net6.0/System.Text.Json.targets": {}
        }
      },
      "System.Text.RegularExpressions/4.1.0": {
        "type": "package",
        "dependencies": {
          "System.Collections": "4