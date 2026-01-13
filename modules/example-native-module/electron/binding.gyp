{
  "targets": [
    {
      "target_name": "example-native-module",
      "sources": [ "src/addon.cc" ],
      "defines": [ "NAPI_CPP_EXCEPTIONS" ],
      "include_dirs": [
        "<!(node ./scripts/node-addon-include.js)"
      ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "cflags_cc": [ "-fexceptions" ],
      "xcode_settings": {
        "GCC_ENABLE_CPP_EXCEPTIONS": "YES"
      },
      "msvs_settings": {
        "VCCLCompilerTool": {
          "ExceptionHandling": 1
        }
      }
    }
  ]
}
