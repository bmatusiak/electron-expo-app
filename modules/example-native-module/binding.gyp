{
  "targets": [
    {
      "target_name": "example-native-module",
      "sources": [ "native/addon.cc" ],
      "include_dirs": [
        "<!(node ./scripts/node-addon-include.js)"
      ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "defines": [ "NAPI_CPP_EXCEPTIONS" ]
    }
  ]
}
