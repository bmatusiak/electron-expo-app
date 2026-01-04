{
  "targets": [
    {
      "target_name": "example-native-module",
      "sources": [ "native/addon.cc" ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ],
      "include_dirs": [
        "<!(node ./scripts/node-addon-include.js)"
      ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ]
    }
  ]
}
